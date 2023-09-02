/**
 * @author 猫咪
 * @version v1.0.0
 * @create_at 2022-09-08 07:40:14
 * @title 天气
 * @public false
 * @rule ?天气
 * @rule 天气
 * @rule 天气 ?
 * @cron 0 6 * * *
 * @description 🐒这个人很懒什么都没有留下。
 * @icon https://bpic.51yuansu.com/pic3/cover/01/90/73/598262544f307_610.jpg
 */

s = sender

function main() {
    // 匹配规则第一个问号的值
    var address = s.param(1)
    // 是否定时任务
    var isCron = s.getPlatform() == "cron"
    // 当前定时任务时或未指定地点，给address赋予默认值桂林
    if (isCron || !address) {
        address = "桂林"
    }
    const { body } = request({
        "url": "http://hm.suol.cc/API/tq.php?msg=" + address + "&n=1",
        "method": "get",
    })
    if (!body) {
        data = "天气接口异常。"
    }
    if (!isCron) {
        s.reply(body)
    } else {
        // 群组推送
        (new SillyGirl).push({ platform: "tg", groupCode: -1001583071436, content: body })
    }
}

main()