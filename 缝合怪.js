/**
 * @title 缝合怪
 * @create_at 2023-01-06 22:46:43
 * @description 将各个平台机器人的功能缝合到傻妞。
 * @author 猫咪
 * @version v1.0.0
 * @on_start true
 * @public false
 */

var n = undefined;
var sl = new SillyGirl()
var bbk = s.listen("/jx ?", function (s) {
    n = s;
    sl.push({
        platform: "pgm",
        user_id: "1840021545",
        content: s.getContent(),
    })
});

s.listen("^/bbk$", function (s) {
    if (!s.isAdmin()) {
        s.continue()
        return
    }
    let n = sl.newSender({
        platform: "pgm",
        user_id: "1840021545",
    })
    n.recallMessage(n.reply("😊用户信息"), 1000)
    n.listen(["raw 用户信息"], 4000, function (p) {
        p.recallMessage(p.getMessageId())
        let [a] = p.getContent().split("token: ")
        s.reply(a.trim("\n"))
    })
});

s.listen("^/nark$", function (s) {
    if (!s.isAdmin()) {
        s.continue()
        return
    }
    let n = sl.newSender({
        platform: "pgm",
        user_id: "5303325071",
    })
    n.recallMessage(n.reply("/check"), 1000)
    n.listen(["raw 注册时间"], 4000, function (p) {
        p.recallMessage(p.getMessageId())
        let lines = p.getContent().split("\n\n")
        lines.shift()
        s.reply(lines.join("\n"))
    })
});

s.listen("^/ikun", function (s) {
    // if (!s.isAdmin()) {
    //     s.continue()
    //     return
    // }
    let n = sl.newSender({
        platform: "pgm",
        user_id: "5205151924",
    })
    n.recallMessage(n.reply("/ikun"), 1000)
    n.listen(4000, function (p) {
        var content = p.getContent()
        if(content=="未知消息"){
            content = "小黑子鸡脚漏了吧~"
        }
        p.recallMessage(p.getMessageId())
        s.reply(content)
    })
});

sl.newSender({
    platform: "pgm",
    user_id: "1840021545",
}).listen("persistent", ["raw 解析"], function (s) {
    var content = s.getContent()
    if (n) {
        let [a, b] = content.split("http")
        n.reply(strings.replace(a, "点我复制", "http" + b))
    }
})



