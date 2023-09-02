/**
 * @author 三藏
 * @create_at 2022-09-08 14:41:33
 * @description 👮‍♀️将变量groups修改为自己的群聊，再将disable属性改为false即可食用。
 * @version v1.0.0
 * @title 群消息同步
 * @platform qq wx tg pgm web cron
 * @rule raw ([\s\S]*)
 * @priority 100
 * @admin false
 * @public false
 * @disable true
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/01/telegram-plane-icon.png
 */

//请在消息框输入并发送：你好 佩奇
//建议同时打开浏览器控制台

//sender
const s = sender

var message = s.param(1)
var chatID = s.getChatId()
var platform = s.getPlatform()
var userID = s.getUserId()
var username = s.getUsername()
var groups = [
    { platform: "qq", groupCode: xxxxxxx }, //QQ群      
    { platform: "tg", groupCode: -1001682417785 }, //TG群
    { platform: "wx", groupCode: xxxxxx }, //WX群
]
main()
function main() {
    if (["查询", "订阅", "京东", "v2ray", "翻墙", "vmess"].indexOf(message) != -1) { //跳过一些命令
        s.continue()
        return
    }
    if (chatID) {
        var go = false
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].platform == platform && chatID == groups[i].groupCode) {
                go = true
                break
            }
        }
        if (go) {
            var prefix = "来自" + getName(platform) + "[" + username + "]的消息:\n"
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].platform == platform && chatID == groups[i].groupCode) {
                    s.continue()
                }
                groups[i]["content"] = prefix + message
                console.log(JSON.stringify(groups[i]))
                const sillyGirl = new SillyGirl()
                //防止当前群同步
                if (platform != groups[i].platform) {
                    sillyGirl.push(groups[i])
                }
            }
        } else {
            s.continue()
        }
    } else {
        s.continue()
    }
}

function getName(type) {
    switch (type) {
        case "wx": return "微信"
            break;
        case "tg": return "电报"
            break;
        case "qq": return "QQ"
            break;
    }
}

