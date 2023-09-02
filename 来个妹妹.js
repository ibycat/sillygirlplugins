/**
 * @version v1.0.0
 * @create_at 2022-09-08 09:27:18
 * @title 来个妹妹
 * @rule 来个妹妹
 * @description 🐒这个人很懒什么都没有留下。
 * @author 猫咪
 * @public false
 * @icon https://p.qqan.com/up/2022-6/16549158799370176.jpg
 */

const s = sender

console.log(22222)

s.recallMessage(s.getMessageId())

const num = s.param(1) ? s.param(1) : 1;

const { headers } = request({
    url: "https://api.btstu.cn/sjbz/api.php",
    method: "get",
    allowredirects: false, //禁止重定向
})

s.reply(image(headers.Location))
