/**
 * @author 猫咪
 * @version v1.0.0
 * @create_at 2022-09-08 07:28:17
 * @title 来个猫咪
 * @rule 来个猫咪
 * @public false
 * @description 🐒这个人很懒什么都没有留下。
 * @icon http://www.szcat.org/favicon.ico
 */

s = sender

s.recallMessage(s.getMessageId())

var num = s.param(1)
if (!num) {
     num = 1
}
var images = ""
if (num > 10) {
     num = 10
}
while (num != 0) {
     num--
     images += image(request({ url: "https://api.thecatapi.com/v1/images/search", dataType: "json", useProxy: true }).body[0].url)
}

var id = s.reply(images)