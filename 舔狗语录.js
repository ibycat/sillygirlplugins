/**
 * @version v1.0.0
 * @title 舔狗语录
 * @rule 舔狗语录
 * @create_at 2022-09-08 09:30:55
 * @description 🐶舔狗语录，需要请前往 www.tianapi.com 申请apiKey，并开启对应的功能。
 * @author 猫咪
 * @public false
 * @icon http://n.sinaimg.cn/sinacn20117/572/w690h682/20190102/3def-hqzxptn6522646.jpg
 */

const s = sender
const tianapiKey = new Bucket("tianapi").get("key")
if (!tianapiKey) {
    s.reply("请前往 www.tianapi.com 申请apiKey。")
} else {
    const { body } = request({ url: "http://api.tianapi.com/tiangou/index?key=" + tianapiKey, json: true })
    const { newslist } = body
    const [result] = newslist
    s.reply(result ? result.content : "不想舔了，太渴了！")
}
