/**
 * @title CQ码2
 * @module true
 * @create_at 2021-11-22 16:12:01
 * @description 🐧存放CQ码相关方法。
 * @author onebot
 * @version v1.0.3
 * @public false
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/03/xiaojiascloud.png
 */

var reg = new RegExp("\\[CQ:([a-z]+),([^\\[\\]]*)\\]")

function CQ2Items(text) {
    var msgs = []
    var values = text.match(reg)
    if (!values) {
        text = text.trim()
        return [{ type: "text", value: text }]
    }
    var [item, type, value] = values
    var obj = { type }
    for (var kv of value.split(",")) {
        kv = kv.split("=")
        if (kv.length == 2) {
            obj[kv[0]] = kv[1]
        }
    }
    const [text1, text2] = strings.split(text, item, 2)
    msgs.push(obj)
    var items = CQ2Items(text1).concat(msgs).concat(CQ2Items(text2))
    var res = []
    for (var item_ of items) {
        if (item_.type == "text") {
            if (item_.value.match(/^\s+$/)) {
                continue
            }
        }
        res.push(item_)
    }
    return res
}

module.exports = {
    toItems: CQ2Items
}
