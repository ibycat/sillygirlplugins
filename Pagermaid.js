/**
 * @title Pagermaid
 * @on_start true
 * @create_at 2022-12-04 11:03:12
 * @description 🍈 仅作学术探讨，开发中。不写了，python真是我最差劲的语言，
 * @author 摆烂王
 * @on_start true
 * @version v0.0.0
 * @public false
 * @icon https://gitlab.com/uploads/-/system/group/avatar/16354746/IMG_20201001_155456_211.jpg
 */

var pgm = new Bucket("pgm")
const pagermaid = new Sender("pagermaid")
const server = require("express")
var token = pgm.get("token");// 设置鉴权

server.post("/bot/pgm", function (req, res) {
    var qtoken = req.query("token")
    if (!qtoken) {
        console.log("未设置Pagermaid的token，否则会有被入侵的风险。")
    } else if (qtoken != token) {
        console.log("监测到Pagermaid非法访问，错误的token %s", qtoken)
        time.sleep(1000)
    }
    req.body().map(pagermaid.receive)
    res.json(pagermaid.sends())
})

pgm.watch("token", function (old, now) {
    token = now
})