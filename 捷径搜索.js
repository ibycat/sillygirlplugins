/**
 * @version v1.0.0
 * @rule 捷径 ?
 * @create_at 2022-09-08 14:42:34
 * @title 捷径搜索
 * @description 🐒这个人很懒什么都没有留下。
 * @author 猫咪
 * @public false
 * @icon https://jiejingku.net/wp-content/uploads/2021/06/jiejingku2-350x350.png
 */

s = sender

function main() {
    var keyword = encodeURI(s.param(1))
    var data = request({
        url: "https://jiejinghe.com/api/shortcuts/search?kw=" + keyword,
        "dataType": "json"
    }).body
    var total = data.results.length
    if (!total) {
        return "抱歉，没有找到相关捷径。"
    }
    var rts = []
    for (var i = 0; i < total; i++) {
        var result = data.results[i]
        rts.push("名称：" + result.shortcut.title + "\n简介：" + result.shortcut.summary + "\n作者： " + result.creator.name + "\n地址：https://jiejinghe.com/shortcuts/" + result.shortcut.uid)
        if ((i + 1) % 5 == 0) {
            s.reply(rts.join("\n\n") + "\n\n查看更多结果请按n，输入其他任意字符退出。更多访问https://jiejinghe.com/search?query=" + keyword)
            rts = []
            var uin = s.listen().getContent(60000)
            if (uin != "n") {
                if (uin.indexOf("捷径")) {
                    Continue()
                }
                return
            }
        }
    }
    if (rts.length != 0) {
        s.reply(rts.join("\n\n"))
    }
    sleep(500)
    s.reply("结果展示完毕。")
}

s.reply(main())