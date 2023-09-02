/**
 * @title 老版命令
 * @on_start true
 * @description  🌞指令如存储操作、重启、myuid和groupCode等，默认安装本插件。
 * @create_at 2033-09-12 19:14:24
 * @author 猫咪
 * @version v2.0.0
 * @public false
 * @icon https://cdn.heweather.com/img/plugin/190516/icon/c/100d.png
 * @disable true
 */

const s = sender
const nick = () => new Bucket("sillyGirl").get("name", "傻妞")
const sillyGirl = new SillyGirl()
const server = require("express")//

// 群回复操作
s.listen([
    `[群回复操作:reply] [删除:delete] [关键词]`,
    `[群回复操作:reply] [关键词] [回复语]`,
], function (s) {
    if (!s.isAdmin()) {
        return
    }
    var chatId = s.getChatId()
    if (chatId == 0) {
        s.reply("只能在群组中使用该功能哦~")
        return
    }
    let rt = s.param("回复语")
    if (rt == "nil") rt = ""
    if (s.param("删除")) {
        rt = ""
    }
    console.log(s.param("关键词"), rt)
    const reply = new Bucket(fmt.sprintf("reply%s%d", s.getPlatform(), chatId))
    reply.set(s.param("关键词"), rt)
    s.reply("设置成功！")
    return
})

// 存储管理
s.listen([
    `[存储操作:get,delete] [桶] [键]`,
    `[存储操作:set] [桶] [键] [值]`,
    `[存储操作:list,empty,lenof] [桶]`,
], function (s) {
    if (!s.isAdmin()) {
        return
    }
    var bucket = new Bucket(s.param("桶"))
    var key = s.param("键")
    var value = s.param("值")
    var stact = s.param("存储操作")
    switch (stact) {
        case "set":
            var old_value = bucket.get(key)
            bucket.set(key, value)
            s.reply("设置成功，你可以在60秒内“撤销”操作！")
            var ns = s.listen(60000, `^(撤销|撤回)$`)
            if (ns) {
                bucket.set(key, old_value)
                ns.reply("已撤销。")
                return
            }
            break
        case "delete":
            var old_value = bucket.get(key)
            bucket.set(key, "")
            s.reply("删除成功，你可以在60秒内“撤销”操作！")
            var ns = s.listen(60000, `^(撤销|撤回)$`)
            if (ns) {
                bucket.set(key, old_value)
                ns.reply("已撤销。，")
                return
            }
            break
        case "get":
            value = bucket.get(key, "<空>")
            s.reply(value)
            break
        case "list":
            var lines = []
            for (var key of bucket.keys()) {
                lines.push(fmt.sprintf("%s: %s", key, bucket.get(key)))
            }
            s.reply(lines.length == 0 ? "<空>" : lines.join("\n"))
            break
        case "empty":
            var name = bucket.name()
            s.reply(`确认请在20秒内回复“${name}”`)
            var ns = s.listen(20000, `^${name}$`)
            if (!ns) {
                s.reply("超时，取消操作！")
                return
            }
            bucket.deleteAll()
            ns.reply("清空成功！")
            break
        case "lenof":
            s.reply(bucket.keys().length)
            break
    }
})

//个人ID
s.listen([
    `myuid`,
], function (s) {
    s.reply(s.getUserId())
})

//群号
s.listen([
    `groupCode`,
], function (s) {
    s.reply(s.getChatId())
})

//昵称
s.listen([
    `name`,
], function (s) {
    s.reply(nick())
})

//时间
s.listen([
    `time`,
], function (s) {
    s.reply(time.now().format("2006-01-02 15:04:05"))
})

//机器码
s.listen([
    `machineId`,
], function (s) {
    if (s.isAdmin()) {
        s.reply(`${nick()}的机器码：${new Bucket("sillyGirl").get("machineId")}`)
    }
})

//回复内容
s.listen([
    `replies`,
], function (s) {
    if (s.isAdmin()) {
        const replies = new Bucket(fmt.sprintf("reply%s%d", s.getPlatform(), s.getChatId()))
        const lines = []
        for (var key of replies.keys()) {
            lines.push(fmt.sprintf("%s === %s\n", key, replies.get(key)))
        }
        s.reply(
            lines.join("\n"),
        )
    }
})

//模式查询
s.listen([
    `mode`,
], function (s) {
    s.reply(`主人，现在回复你的${nick()}是${(sillyGirl.isSlaveMode()) ? "分身" : "本体"}。`)
})

// 重启
s.listen([
    `重启`,
], function (s) {
    if (sillyGirl.isSlaveMode()) {
        s.reply("Sorry，分身无法通过命令重启哦～")
        return
    }
    if (!s.isAdmin()) {
        return
    }
    s.recallMessage(s.reply("即将重启！"))
    new Bucket("sillyGirl").set("reboot", fmt.sprintf("%v %v %v", s.getPlatform(), s.getChatId(), s.getUserId()))
})

// 启动时间
s.listen([
    `started_at`,
], function (s) {
    s.reply(new Bucket("sillyGirl").get("started_at"))
})

// 升级
s.listen([
    `升级`,
], function (s) {
    if (!s.isAdmin()) {
        return
    }
    s.reply("升级脚本：bash <(curl -sSL http://app.imdraw.com/install.sh)")
})


// 编译时间
s.listen([
    `compiled_at`,
], function (s) {
    var compiled_at = new Bucket("sillyGirl").get("compiled_at")
    if (compiled_at.indexOf(" ") == -1) {
        compiled_at = time.unixMilli(compiled_at).format("2006-01-02 15:04:05")
    }
    s.reply(compiled_at)
})

// 公开脚本接口
server.get("^/api/plugins/download/(.+)\.js$", function (req, res) {
    res.send(call("get_public_plugin")(req.param(1)))
})

// 首页自动跳转到管理员界面
server.get("/", function (req, res) {
    res.send("Hello world!")
    res.redirect("/admin")
})

// running() 判断服务是否退出