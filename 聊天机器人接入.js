/**
 * @title 聊天机器人接入
 * @on_start true
 * @create_at 2022-11-22 10:41:00
 * @description 🦐本插件暴露对接聊天机器人的接口，可用于接入飞书、丁丁等机器人客户端。
 * @author 猫咪
 * @version v1.0.0
 * @public false
 * @icon https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
 * @encrypt false
 */

var s0 = undefined

//创建一个test的机器人，微信可以命名为wx
const test = new Sender("test")
const server = require("express")

//消息格式 {"user_id":"1234", "chat_id": 10000, "content": "消息内容"}

//傻妞消息->机器人
test.send(function (msg) {
    console.log(msg,"<")
    time.sleep(10000)
    console.log(msg,">")
    // var reply = JSON.stringify(msg)
    // s0.reply(reply)
    // console.log("发送消息：%v", reply)
    //向机器人发起消息请求
    // request({
    //     url: "http://机器人消息发送地址",
    //     method: "post",
    //     body: msg,
    // })
})

//

//创建傻妞消息接收API
server.post("/bot/test", function (req, res) {
    const msg = req.json()
    console.log(JSON.stringify(msg))
    // test.receive(msg)
})

//测试命令
sender.listen(["test [命令]"], function (s) {
    s0 = s
    var cmd = s.param("命令")
    //机器人消息->傻妞
    console.log("接收消息：%v", cmd)
    test.receive({ content: cmd, user_id: "1234", user_name: "用户名", "chat_name": "群名" })
})
//
test.receive({ content: "time", user_id: "1234", user_name: "用户名", "chat_name": "群名" })
// console.log(test.sends(), "---")