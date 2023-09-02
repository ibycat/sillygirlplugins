/**
 * @author 烟雨
 * @create_at 2022-09-07 13:30:29
 * @description 🌲查询地区油价，支持省份查询，需要前往 https://www.tianapi.com/ 申请key
 * @title 油价查询
 * @rule ?油价
 * @rule -youjia ?
 * @priority 100
 * @public false
 * @version v1.0.1
 * @icon http://img.zwbk.org/baike/spic/2011/04/09/2011040910103662_1755.jpg
 */

const s = sender
const address = s.param(1)
const sillyGirl = new SillyGirl()
var key = (new Bucket("tianapi")).get("key");
var { body } = request({
    url: "http://api.tianapi.com/oilprice/index?key=" + key + "&prov=" + address, //请求链接
    method: "get",
    json: true,
});
if (body.code == 200) {
    var list = body.newslist[0];
    data =
        "查询地区：" +
        list.prov +
        "\n零号柴油：" +
        list.p0 +
        "\n89号汽油：" +
        list.p89 +
        "\n92号汽油：" +
        list.p92 +
        "\n95号汽油：" +
        list.p95 +
        "\n98号汽油：" +
        list.p98 +
        "\n更新时间：" +
        list.time;
} else {
    data = body.msg;
}

s.reply(data)