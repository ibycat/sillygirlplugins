/**
 * @version v1.0.0
 * @rule dwz ?
 * @author 猫咪
 * @create_at 2022-09-10 09:03:17
 * @title 短网址指令
 * @description 🐒短网址生成指令，第一次使用设置短网址地址 set dwz address [傻妞地址]，然后就可以使用 dwz [长链接] 生成短链接了。
 * @icon https://www.dwz.lc/favicon.ico
 * @public false
 */

const dwz = require("短网址模块")
const s = sender

const raw = s.param(1)
const short = dwz.generate(raw)

s.reply(short)