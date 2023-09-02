/**
 * @version v1.0.2
 * @web true
 * @author 猫咪
 * @create_at 2022-09-10 09:03:17
 * @title 短网址接口
 * @description 🌐短网址生成服务端，配合短网址指令使用。
 * @icon https://www.dwz.lc/favicon.ico
 * @public false
 */

const app = require("express")
const dwz = require("短网址模块")

//短网址重定向
app.get("^/([0-9a-zA-Z_]{5})$", (req, res) => {
    const short = req.param(1)
    const raw = dwz.parse(short)
    if(!raw){
        req.continue()
        return
    }
    res.redirect(raw)
});