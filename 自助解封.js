/**
 * @title 自助解封
 * @rule raw .*解封.*
 * @rule raw .*忏悔.*
 * @rule raw .*我错了.*
 * @rule 自助解封
 * @create_at 2022-09-20 13:12:35
 * @description 🐱猫咪自用，帮助忏悔用户🧎‍♀️解除群组封禁。
 * @author 猫咪
 * @version v1.0.0
 * @platform pgm
 * @public false
 * @groupCode 0
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2021/12/688bb-www.freemactorrent.com.png
 */

var s1 = sender
var user_id = s1.getUserId()
var user_name = s1.getUserName()
var ids1 = [s1.getMessageId()]
var user = `<a href=\"tg://user?id=${user_id}\">@${user_name ? user_name : user_id}</a>`
var chat = `<a href=\"https://t.me/trialerr\">好好学习群</a>`
ids1.push(s1.reply("请先忏悔："))
var s3 = s1.listen(200000)
if (s3) {
    var ids3 = [s3.getMessageId()]
    ids3.push(s3.reply(`已解封 ${chat} ，下辈子注意点。`))
    var repent = s3.getContent()
    var s2 = (new SillyGirl).newSender({
        platform: "pgm",
        chat_id: -1001583071436,
        user_id: "123456",
    })
    var ids2 = [s2.getMessageId()]
    s2.unkick(user_id)
    ids2.push(s2.reply(`${user} 已忏悔 **${repent}** ，随时可以回来`))
    time.sleep(30000)
    s3.recallMessage(ids3)
    s1.recallMessage(ids1)
    s2.recallMessage(ids2)
} else {
    s.reply("死不悔改~")
}

