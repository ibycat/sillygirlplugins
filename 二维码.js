/**
 * @author 猫咪
 * @version v1.0.0
 * @create_at 2022-09-08 07:31:42
 * @title 二维码
 * @rule 二维码 ?
 * @description 🐒这个人很懒什么都没有留下。
 * @public false
 * @icon https://bpic.51yuansu.com/pic3/cover/02/70/77/5a1878243d237_610.jpg
 */

const s = sender 
const url = image(`https://api.pwmqr.com/qrcode/create/?url=${encodeURI(s.param(1))}`)
s.reply(url)