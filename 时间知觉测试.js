/**
 * @version v1.0.0
 * @rule 时间知觉测试 [秒数?]
 * @create_at 2022-09-08 14:54:50
 * @title 时间知觉测试
 * @description 🐒这个人很懒什么都没有留下。
 * @author 猫咪
 * @public false
 * @icon http://pic.imeitou.com/uploads/allimg/171117/3-1G11G10321.jpg
 */

const s = sender

function main() {
    var sec = s.param("秒数");
    var i = 0;
    while (sec == "" || sec == "0" || isNaN(sec)) {
        s.reply("请输入你要测试的秒数：")
        i++
        if (i > 2) {
            s.reply("输入错误次数过多，您不需要测试。")
            return
        }
        sec = s.listen().getContent()
    }
    if (sec > 100) {
        s.reply("不支持超过100秒的测试。")
        return
    }
    s.reply("请在收到”开始测试“后第" + sec + "秒时发送任意消息，超过规定10秒后自动结束测试。")
    sleep(2000)
    s.reply("开始测试！")
    var begin = Date.now()
    s.listen(sec * 1000 + 10000).getContent()
    var end = Date.now()
    var cost = end - begin
    var ex = cost - sec * 1000
    if (ex > 0) {
        s.reply("总耗时：" + cost + "毫秒,你慢了" + ex + "毫秒。")
    } else {
        s.reply("总耗时：" + cost + "毫秒,你快了" + -ex + "毫秒。")
    }
    sleep(1000)
    if (Math.abs(ex) < 1000) {
        s.reply("阁下的时间知觉达到了深不可测的境界，佩服！佩服！")
    }
}

main()