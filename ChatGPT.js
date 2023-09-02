/**
 * @title ChatGPT
 * @create_at 2023-02-20 12:24:44
 * @rule ai ?
 * @description 感谢知了大佬的Python项目，只是简单的转换了一下。原项目地址：https://github.com/pengzhile/pandora
 * @author zhx47
 * @version v1.0.2
 * @public false
 */

/**
 * v1.0.2
 * 自定义API反代地址，相关反代地址寻找：https://github.com/transitive-bullshit/chatgpt-api#reverse-proxy
 * v1.0.1
 * 更新新的接口地址，修复接口404
 */

const s = sender
const ottoStorage = new Bucket('otto')
const chatGPTStorage = new Bucket('ChatGPT')

let apiPrefix = ottoStorage.get('ChatGPT_apiPrefix');
if(!apiPrefix){
    apiPrefix = 'https://ai.fakeopen.com';
}

// 请在ChatGPT官网登陆完成后，打开F12查看https://chat.openai.com/api/auth/session请求返回的accessToken，并使用命令'set otto ChatGPT_accessToken ?'设置accessToken
let platform = s.getPlatform();
let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36';
let baseHeaders;

function main() {
    // 校验accessToken
    let accessToken = ottoStorage.get('ChatGPT_accessToken');
    if(!accessToken){
        s.reply("请使用命令'set otto ChatGPT_accessToken ?,设置ChatGPT的accessToken");
        return;
    }
    baseHeaders = {
        'Authorization': 'Bearer ' + accessToken,
        'User-Agent': userAgent,
        'Content-Type': 'application/json'
    }

    // 初始化变量
    let userId = s.getUserId();
    let key = platform + '_' + userId;
    let conversationId, model, lastUserMessageId, prompt, lastParentMessageId;
    if (chatGPTStorage.get(key)) {
        // 加载旧的配置文件
        let userConfiguration = JSON.parse(chatGPTStorage.get(key));
        conversationId = userConfiguration['conversationId'];
        model = userConfiguration['model'];
        lastUserMessageId = userConfiguration['lastUserMessageId'];
        prompt = userConfiguration['prompt'];
        lastParentMessageId = userConfiguration['lastParentMessageId'];
    }
    let command = s.param(1);
    switch (command) {
        case "帮助":
            s.reply("输入'ai ?'进行与ChatGPT互动。脚本为每个用户创建单独的会话，可以保持上下文进行调教，参考：https://github.com/PlexPt/awesome-chatgpt-prompts-zh\n\n特殊指令：\n'ai 清空上下文'：抛弃已有会话，创建全新会话。\n'ai 重新生成回答'：对问题的回答不满意，可以重新获取一份新的回答。\n\n输入'ai 帮助'即可再次查看指南。");
            break;
        case "清空上下文":
            if (!conversationId) {
                s.reply('你再无中生有，暗度陈仓，凭空想象，凭空捏造。都没有创建过会话，你猴急个🔨，我要开始打人了！');
            } else {
                if (delConversation(conversationId)) {
                    // 如果删除掉会话，就清空本地配置，否则就算了吧
                    chatGPTStorage.delete(key);
                    s.reply('清空成功！');
                }
            }
            break;
        case "重新生成回答":
            if (!conversationId) {
                s.reply('你再无中生有，暗度陈仓，凭空想象，凭空捏造。都没有创建过会话，你猴急个🔨，我要开始打人了！');
            } else {
                let replyContent = regenerateReply(conversationId, model, lastUserMessageId, prompt, lastParentMessageId);
                if (replyContent['error']) {
                    s.reply(`嗨嗨嗨，接口报错了：${replyContent['error']}`);
                }
                if (!replyContent['message']) {
                    s.reply(`嗨嗨嗨，没有获取到接口返回的消息，等会再试试叭`);
                } else {
                    s.reply(replyContent['message']['content']['parts'][0]);
                    userConfiguration['lastParentMessageId'] = replyContent['message']['id'];
                    chatGPTStorage.set(key, JSON.stringify(userConfiguration))
                }
            }
            break;
        case "刷新token":
            auth();
            break;
        default:
            if (!chatGPTStorage.get(key)) {
                // 第一次，无配置文件，需要创建新会话
                s.reply("创建新会话，使用'ai 帮助'命令查看帮助");
                let models = listModels();
                if (!models) {
                    s.reply(`未获取到可用模型，886`);
                    return;
                }
                model = models[0]['slug'];
                s.reply(`使用模型：${model}`);
                lastParentMessageId = '';
            }
            let userMessageId = uuidv4();
            let replyContent = talk(conversationId, model, userMessageId, command, lastParentMessageId);
            if (replyContent['error']) {
                s.reply(`嗨嗨嗨，接口报错了：${replyContent['error']}`);
            }
            if (!replyContent['message']) {
                s.reply(`嗨嗨嗨，没有获取到接口返回的消息，等会再试试叭`);
            } else {
                s.reply(replyContent['message']['content']['parts'][0]);
                let userConfiguration = {
                    'conversationId': replyContent['conversation_id'], 
                    'model': replyContent['message']['metadata']['model_slug'],
                    'lastUserMessageId': userMessageId,
                    'prompt': command,
                    'lastParentMessageId': replyContent['message']['id']
                }
                chatGPTStorage.set(key, JSON.stringify(userConfiguration));
                if (!conversationId) {
                    console.log('第一次生成会话，将用户ID设置为会话ID防止删除');
                    setConversationTitle(replyContent['conversation_id'], key);
                }
            }
            break;
    }
}

/**
 * 列取ChatGPT可用模型
 */
function listModels() {
    var {body, status} = request({
        url: `${apiPrefix}/api/models`, 
        method: 'get', 
        headers: baseHeaders,
        dataType: "json"
    })
    console.log(JSON.stringify(body));
    // {"models":[{"slug":"text-davinci-002-render-sha","max_tokens":4097,"title":"Turbo (Default for free users)","description":"The standard ChatGPT model","tags":[]}]}
    if (status != 200) {
        s.reply(`获取可用模型出错，返回状态码：${status}`);
        return;
    }
    return body['models'];
}

/**
 * 分页获取会话列表
 *
 * @param {int} offset 页码
 * @param {int} limit  页大小
 */
function listConversations(offset, limit) {
    let result = request({
        url: `${apiPrefix}/api/conversations?offset=${offset}&limit=${limit}`,
        method: 'get',
        headers: baseHeaders
    })
    console.log("result", result.body);
}

/**
 * 加载会话历史内容
 *
 * @param {string} conversationId 会话ID
 */
function loadConversation(conversationId) {
    let result = request({
        url: `${apiPrefix}/api/conversation/${conversationId}`, method: 'get', headers: baseHeaders
    });
    result = JSON.parse(result.body);
    let currentNodeId = result['current_node'];
    let nodes = [];
    while (true) {
        let node = result['mapping'][currentNodeId];
        if (!node['parent']) break;
        nodes.unshift(node);
        currentNodeId = node['parent']
    }
    for (let node of nodes) {
        let message = node['message'];
        if (message['metadata']['model_slug']) {
            let modelSlug = message['metadata']['model_slug'];
            // console.log(`model_slug:${model_slug}`);
        }
        if ('user' === message['role']) {
            console.log('You:');
            console.log(message['content']['parts'][0]);
        } else {
            console.log('ChatGPT:');
            console.log(message['content']['parts'][0]);
        }
        console.log(node['id']);
    }
}

/**
 * 发送消息
 *
 * @param {string} conversationId 会话ID，新建会话时传入null
 * @param {string} model 模型
 * @param {string} messageId 消息ID
 * @param {string} prompt 消息内容
 * @param {string} parentMessageId 父消息ID，新建会话时传入空串
 * @returns
 */
function talk(conversationId, model, messageId, prompt, parentMessageId) {
    let data = {
        'action': 'next', 'messages': [{
            'id': messageId, 'role': 'user', 'content': {
                'content_type': 'text', 'parts': [prompt],
            },
        }], 'model': model, 'parent_message_id': parentMessageId,
    }
    if (conversationId) {
        data['conversation_id'] = conversationId;
    }
    return requestConversationContent(data)
}

/**
 * 重新生成回答
 *
 * @param {string} conversationId 会话ID
 * @param {string} model 模型
 * @param {string} lastUserMessageId 用户上一个消息ID
 * @param {string} prompt 消息内容
 * @param {string} lastParentMessageId 父消息ID
 * @returns
 */
function regenerateReply(conversationId, model, lastUserMessageId, prompt, lastParentMessageId) {
    let data = {
        'action': 'variant', 'messages': [{
            'id': lastUserMessageId, 'role': 'user', 'content': {
                'content_type': 'text', 'parts': [prompt],
            },
        }], 'model': model, 'conversation_id': conversationId, 'parent_message_id': lastParentMessageId,
    }
    return requestConversationContent(data)
}

/**
 * 发送会话请求
 *
 * @param {object} data 请求内容
 */
function requestConversationContent(data) {
    let {body, status} = request({
        url: `${apiPrefix}/api/conversation`, 
        method: 'post', 
        body: data, 
        headers: baseHeaders
    })
    if (status != 200) {
        s.reply(`发送消息请求出错，返回状态码：${status}`);
        return;
    }
    let reply = {};
    for (let line of body.split('\n')) {
        if ('data: {' === line.slice(0, 7)) {
            reply = JSON.parse(line.slice(6));
        }
        if ('data: [DONE]' === line.slice(0, 12)) {
            break;
        }
    }
    return reply;
}

/**
 * 构建删除会话请求
 *
 * @param {string} conversationId 会话ID
 */
function delConversation(conversationId) {
    let data = {
        'is_visible': false,
    }
    return updateConversation(conversationId, data)
}

/**
 * 设置会话标题
 *
 * @param {string} conversationId 会话ID
 * @param {string} title 标题名称
 */
function setConversationTitle(conversationId, title) {
    let data = {
        'title': title,
    }
    return updateConversation(conversationId, data)
}

/**
 * 更新会话
 *
 * @param {string} conversationId 会话ID
 * @param {object} data 更新内容
 */
function updateConversation(conversationId, data) {
    let {body, status} = request({
        url: `${apiPrefix}/api/conversation/${conversationId}`,
        method: 'patch',
        body: data,
        headers: baseHeaders,
        dataType: "json"
    })
    if (status != 200) {
        s.reply(`更新会话请求出错，返回状态码：${status}`);
        return;
    }
    if (!body.success) {
        s.reply(`更新会话请求出错，返回原因：${body.text}`);
    }
    return body.success;

    /**
     * 傻妞暂时不支持patch请求，patch请求实际上变成了get请求
     * 等猫咪增加了patch请求，方法换成上面的就可以了
     */
    // return true;
}

/**
 * 获取UUID V4字符串
 * 
 * @returns uuidv4字符串
 */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

main()
