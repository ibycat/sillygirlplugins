/**
 * @title 安全模式
 * @rule 安全模式
 * @rule safe mode
 * @create_at 2022-09-17 17:23:37
 * @description 🐒进入安全模式，可以屏蔽除了退出以外的所有指令，猫咪专用于演示命令。
 * @author 猫咪
 * @version v1.0.0
 * @admin true
 * @public false
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/01/21352718.jpeg
 */

var s = sender
var ids1 = []
ids1.push(s.getMessageId())
ids1.push(s.reply("已进入安全模式！"))
sender.listen(function (s) {
    var ids2 = []
    ids2.push(s.getMessageId())
    var content = s.getContent()
    if (content != "退出" && content != "q") {
        return s.holdOn()
    }
    ids2.push(s.reply("已退出安全模式！"))
    s.recallMessage(ids2)
})
s.recallMessage(ids1)