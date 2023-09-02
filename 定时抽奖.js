/**
 * @title 定时抽奖
 * @create_at 2022-09-19 22:53:36
 * @description 🐮定时在群组发起抽奖，与群友互动，注意改一下20-22行，否则有被禁言一天的风险。
 * @author 猫咪
 * @rule 抽奖
 * @admin true
 * @version v1.0.1
 * @cron 1 * * * *
 * @public false
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/01/43105322.jpeg
 */

var s = sender

if (s.getPlatform() != "cron") {
    s.recallMessage(s.getMessageId())
} else {
    s = (new SillyGirl).newSender({
        platform: "pgm",
        user_id: "1837585653",
        chat_id: -1001583071436,
        // platform: "wx",
        // chat_id: 23335724805,
        // user_id: "wxid_3z0ooor54knu11",
    })
}

var users = []
var num = 3
var ids = []

ids.push(s.reply(`💰整点抽奖时间到啦，限时100s，回复 **抽奖** 参与活动，参与达到${num}人后立即开奖！`))


s.listen(function (sn) {
    var user_id = sn.getUserId()
    var user_name = sn.getUserName()
    var user = `<a href=\"tg://user?id=${user_id}\">@${user_name ? user_name : user_id}</a>`
    users.push(user)
    if (num - users.length == 0) {
        ids.push(s.reply(`${user} 已参与抽奖，可以开奖啦~`))
    } else {
        ids.push(s.reply(`${user} 已参与抽奖，还差${num - users.length}个人就可以开奖啦~`))
    }
    sn.recallMessage(sn.getMessageId())
    if (users.length < num) {
        return s.holdOn()
    }
}, "group", "^抽奖$", 100000)

if (users.length < num) {
    ids.push(s.reply(`时间到，参与人数 **小于3人** ，已取消开奖。`))
} else {
    var lines = []
    for (var i in users) {
        if (num - 1 == i) {
            lines.push(`${+i + 1} ${users[i]} 抽中现金 **-1** 元，请私聊我领取奖励。`)
        } else {
            lines.push(`${+i + 1} ${users[i]} 抽中现金 **0** 元，再接再厉哦~`)
        }
    }
    ids.push(s.reply("激动人心的开奖时间要到了，开始倒计时~"))
    ids.push(s.reply("3"))
    time.sleep(1000)
    ids.push(s.reply("2"))
    time.sleep(1000)
    ids.push(s.reply("1"))
    time.sleep(1000)
    ids.push(s.reply("0.9"))
    time.sleep(1000)
    ids.push(s.reply("抽奖结果：\n" + lines.join("\n")))
}
time.sleep(5000)
s.recallMessage(ids)
