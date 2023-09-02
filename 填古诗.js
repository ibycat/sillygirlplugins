/**
 * @version v1.0.0
 * @rule 填古诗
 * @create_at 2022-09-08 11:02:45
 * @title 填古诗
 * @description 🐒这个人很懒什么都没有留下。
 * @public false
 * @author 猫咪
 * @icon https://image.gushimi.org/file/c1f0991e9fdb46a8d8d4a3092cb88d89.jpg
 */

var s = sender
var f = "https://xiaoapi.cn/API/game_tgs.php?msg=%s&id=%d"
var id = new Date().getTime()

function main() {
        console.log(id)
        var question = request(fmt.sprintf(f, "开始游戏", id)).body
        if (!strings.contains(question, "听题")) {
                return "游戏故障。"
        }
        s.reply(question)
        var times = 1
        var uid = s.getUserId()
        s.listen("group", function (s) {
                var ct = s.getContent()
                if (ct == "提示") {
                        return s.holdOn(request(fmt.sprintf(f, "提示", id)).body)
                }
                if (ct == "退出" && (uid == s.getUserId() || s.isAdmin())) {
                        return "游戏结束。"
                }
                if (!/^我答.*/.exec(ct)) {
                        s.continue()
                        return s.holdOn()
                }
                question = request(fmt.sprintf(f, ct, id)).body
                if (!strings.contains(question, "请听题")) {
                        s.recallMessage(s.reply(question))
                        s.recallMessage(s.getMessageId())
                }
                return s.holdOn(question)
        })
}

s.reply(main())