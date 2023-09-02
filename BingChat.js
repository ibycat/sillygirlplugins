/**
 * @title BingChat
 * @create_at 2023-04-15 12:00:00
 * @rule bing ?
 * @description 本插件由ChatGpt插件修改而成，需自建API Server，详情请见：https://github.com/waylaidwanderer/node-chatgpt-api#api-server
 * @author Masato
 * @version v1.0.1
 * @public false
 */

//必应Token获取方法：
//使用最新版本的 Microsoft Edge打开bing.com/chat并确认能看到聊天功能
//方法一：按F12或直接打开开发者模式，点击Application/存储，点击左侧Storage下的Cookies，
//展开找到https://www.bing.com 项，在右侧列表Name项下找到"_U"，_U的value/值即为必应Token（有效期目前是14天）。
//方法二：按F12或直接打开开发者模式，点击Console/控制台，运行如下代码，执行后即在您的剪切板存储了必应Token
//copy(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("_U=")).split("=")[1]);


//自建API Server部署方法：
//API Server Docker部署命令docker run -d --name bingchatapi -p 3000:3000 -e USER_TOKEN=你的必应Token --restart unless-stopped jackytj/node-chatgpt-api
//部署后按需修改第120行的自建API接口地址

const s = sender
const BingChatStorage = new Bucket('BingChat')

let platform = s.getPlatform();

function main() {

    // 初始化变量
    let suggestion = {};
    let userId = s.getUserId();
    let key = platform + '_' + userId;
    let jailbreakConversationId, parentMessageId;
    if (BingChatStorage.get(key)) {
        // 加载旧的配置文件
        let userConfiguration = JSON.parse(BingChatStorage.get(key));
        jailbreakConversationId = userConfiguration['jailbreakConversationId'];
        parentMessageId = userConfiguration['parentMessageId'];
        suggestion = userConfiguration['suggestion'];
    }
    let command = s.param(1);
    switch (command) {
        case "帮助":
            s.reply("输入'bing ?'进行与BingChat互动。脚本为每个用户创建单独的会话，可以保持上下文\n\n特殊指令：\n'bing 清空上下文'：抛弃已有会话，创建全新会话。\n\n输入'bing 帮助'即可再次查看指南。");
            break;
        case "清空上下文":
            if (!jailbreakConversationId) { 
                s.reply('你再无中生有，暗度陈仓，凭空想象，凭空捏造。都没有创建过会话，你猴急个🔨，我要开始打人了！');
            } else {
                BingChatStorage.delete(key);
                s.reply('清空成功！');
            }
            break;
        default:
            if (command === '1' || command === '2' || command === '3') {
		        if (Object.keys(suggestion).length > 0) {
			        command = suggestion[command];
		        } else {
			        return s.reply('建议问题不存在！');
		        }
	        }
            if (!BingChatStorage.get(key)) {
                // 第一次，无配置文件，需要创建新会话
                s.reply("创建新会话，使用'bing 帮助'命令查看帮助");
                jailbreakConversationId = true;
            }
            let replyContent = talk(jailbreakConversationId, command, parentMessageId);
            if (replyContent['error']) {
                s.reply(`嗨嗨嗨，接口报错了：${replyContent['error']}`);
            }
            if (!replyContent['response']) {
                s.reply(`嗨嗨嗨，没有获取到接口返回的消息，等会再试试叭`);
            } else {
                let reference = replyContent.details.adaptiveCards[0].body[0].text;
                if (reference.includes("[1]:")) {
                    reference = "\n\n相关信息:\n" + reference.split('\n\n', 1);
                } else {
                    reference = "";
                }
                let suggestedResponses = replyContent.details.suggestedResponses;
                let str = ``;
			    for (let i = 0; i < suggestedResponses.length; i++) {
				    let item = suggestedResponses[i];
				    let index = i + 1;
				    str += `\n>${index}、${item.text}\n`;
				    suggestion[index] = item.text;
			    }
                s.reply(replyContent['response'] + reference + '\n\n***\n你可以通过输入序号快速追问我以下建议问题：\n' + str + '***');
                let userConfiguration = {
                    'jailbreakConversationId': replyContent['jailbreakConversationId'], 
                    'parentMessageId': replyContent['messageId'],
                    suggestion
                }
                BingChatStorage.set(key, JSON.stringify(userConfiguration));
            }
            break;
    }
}



function talk(jailbreakConversationId, command, parentMessageId) {
    let data = {
    "message": command,
    "jailbreakConversationId": jailbreakConversationId,
    "parentMessageId": parentMessageId
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
        url: "http://172.17.0.1:3000/conversation", //自建API接口地址
        method: "post", 
        body: data, 
        headers: { "Content-Type": "application/json" },
        dataType: "json"
    })
    if (status != 200) {
        s.reply(`发送消息请求出错，返回状态码：${status}`);
        return;
    }
    return body;
}


main()
