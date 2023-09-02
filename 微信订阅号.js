/**
 * @title 微信订阅号
 * @create_at 2022-11-28 22:41:56
 * @on_start true
 * @description 🐷使用本插件轻松接入微信订阅号，采取用户主动获取的方案解决订阅号只能被动发送消息的问题。
 * @author 猫咪
 * @version v1.0.4
 * @public false
 * @icon https://res.wx.qq.com/a/fed_upload/9300e7ac-cec5-4454-b75c-f92260dd5b47/logo-mp.ico
 * @encrypt false
 */

const wxmp = new Sender("wxmp")
const server = require("express")
let to = undefined
let messages = {}

//🧧 在订阅号后台配置消息加解密方式设置为明文，服务器地址 http(s)://傻妞地址/bot/wxmp 
//提示：Token和EncodingAESKey随便填
server.post("/bot/wxmp", function (req, res) {
    let xml = req.body()
    if (!to) {
        to = xget(xml, "ToUserName")
    }
    let content = xget(xml, "Content")
    let user_id = xget(xml, "FromUserName")
    let message_type = xget(xml, "MsgType")
    let pull = content == "pull"
    if (message_type == "text" && !pull) wxmp.receive({ content, user_id })
    let contents = []
    if (messages[user_id]) {
        let content = undefined
        do {
            content = messages[user_id].shift()
            if (content) {
                contents.push(content)
            }
        } while (content != undefined)
    }
    for (let v of wxmp.sends(3000)) {
        if (v.user_id == user_id) {
            contents.push(v.content)
        } else {
            if (!messages[user_id]) {
                messages[user_id] = []
            }
            messages[v.user_id].push(v.content)
        }
    }
    if (contents.length == 0) {
        if (!pull) {
            contents.push("处理中，发送“pull”获取最新消息")
        } else {
            contents.push("暂时没有消息")
        }
    }
    let body = `<xml>
  <ToUserName><![CDATA[${user_id}]]></ToUserName>
  <FromUserName><![CDATA[${to}]]></FromUserName>
  <CreateTime>${time.now().unix()}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${contents.join("\n-----消息分割线-----\n")}]]></Content>
</xml>`
    res.send(body)
})

server.get("/bot/wxmp", function (req, res) {
    res.send(req.query("echostr"))
})

function xget(text, field) {
    let res = new Regexp("<" + field + "><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></" + field + ">").findSubmatch(text)
    return res.length ? res[1] : ""
}