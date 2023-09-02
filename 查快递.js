/**
 * @version v2.0.0
 * @title 查快递
 * @rule 查快递 [快递单号?]
 * @create_at 2022-09-08 10:08:54
 * @description 🐍使用方法：查快递 73178612737798 ，需要前往 http://www.kuaidi.com/ 申请快递key。
 * @author 猫咪
 * @public false
 * @icon https://bpic.51yuansu.com/pic3/cover/03/52/43/5bc43a6810c8d_610.jpg
 */

const kuaidiKey = new Bucket("kuaidi").get("key")
const s = sender

function main() {
    if (!kuaidiKey) {
        return "请前往 http://www.kuaidi.com/ 申请快递key。"
    }
    var nu = s.param("快递单号")
    if (!nu) {
        s.reply("请输入快递单号：")
        var nu = s.listen(10000).getContent()
        if (nu == "") {
            return "操作超时，已退出查快递。"
        }
        if (nu == "q") {
            return "已取消查快递。"
        }
    }
    var fs = []
    var is = []
    var { body } = request("http://www.kuaidi.com/index-ajaxselectinfo-" + nu + ".html")
    var selects = Object.values(JSON.parse(body))
    for (var item of selects) {
        fs.push(item.name)
        is.push(item.exname)
    }
    if (fs.length == 0) {
        return "找不到相关的快递公司。"
    }
    // return
    var key = ""
    if (fs.length != 1) {
        var query = "找到以下快递公司，请在1~" + (fs.length) + "中选择一个："
        for (var i = 0; i < fs.length; i++) {
            fs[i] = (i + 1) + ". " + fs[i]
        }
        s.reply(query + "\n" + fs.join("\n"))
        var com = +s.listen().getContent()
        if (!com || com < 1 || com > fs.length) {
            return "已取消快递查询。"
        }
        key = is[com - 1]
    } else {
        key = is[0]
    }

    var data = request({
        url: "http://api.kuaidi.com/openapi.html?id=" + kuaidiKey + "&com=" + key + "&nu=" + nu,
        json: true
    }).body

    if (!data) {
        return data.reason ? data.reason : "查询失败，请稍后再试。"
    }
    if (!data.success) {
        return data.reason + "。"
    }
    var his = []
    for (var i = 0; i < data.data.length; i++) {
        his.push(data.data[i]["context"] + "\n" + data.data[i]["time"])
    }

    var rt = "快递状态：" + statuss[data.status]
    if (his.length != 0) {
        rt += "\n\n" + his.join("\n\n")
    }
    return strings.replace(rt, "\n\n", "\n")
}

var statuss = {
    0: "物流单号暂无结果",
    3: "在途",
    4: "揽件",
    5: "疑难",
    6: "签收",
    7: "退签",
    8: "派件",
    9: "退回",
}

var rt = main()

if (rt) {
    s.reply(rt)
}