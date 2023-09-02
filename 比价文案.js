/**
 * @title 比价文案
 * @create_at 2022-09-14 10:59:23
 * @description 🐒比价文案自定义，可自由显示佣金、优惠券、历史价格和其他平台相同商品价格等信息。注意脚本名不可以更改，否则无法识别。
 * @author 猫咪
 * @version v1.0.2
 * @module true
 * @public false
 * @icon https://api.iowen.cn/favicon/usepanda.com.png
 */

const s = sender
const lines = []

const demo = (object) => {
    //商品标题
    if (object.title) {
        lines.push(`${object.platform}：${object.title}\n`)
    }

    //原始价格
    if (object.priceSticker) {
        lines.push(`原始价：${object.priceSticker}`)
    }

    //券后价格
    if (object.priceReal) {
        lines.push(`券后价：${object.priceReal}`)
    }

    //佣金数目，此处设定管理员私聊显示
    if (s.isAdmin() && s.getChatId() == 0) {
        lines.push(`返佣金：${object.brokerage}`)
    }

    //优惠链接
    if (object.link) {
        lines.push(`惠链接：${object.link.join(" ")}\n`)
    }

    // if (object.historyLowest != object.historyHighest) {

        //历史最低价
        if (object.historyLowest && object.historyLowest.length > 0) {
            const [price, date] = object.historyLowest
            lines.push(`最低价：${date ? date : ""}  ${price}`)
        }

        //历史最高价
        if (object.historyHighest && object.historyHighest.length > 0) {
            const [price, date] = object.historyHighest
            lines.push(`最高价：${date ? date : ""}  ${price}`)
        }

        //六一八
        if (object.history618 && object.history618.length > 0) {
            const [price, date] = object.history618
            lines.push(`六一八：${date}  ${price}`)
        }

        //双十一
        if (object.history1111 && object.history1111.length > 0) {
            const [price, date] = object.history1111
            lines.push(`双十一：${date}  ${price}`)
        }

        //历史评价
        if (object.historyView) {
            lines.push(`${object.historyView}\n`)
        }

    // }

    //其他平台商品
    if (object.otherStores) {
        for (var i in object.otherStores) {
            lines.push(`比价${+i + 1}：${object.otherStores[i].name}\n价格：${object.otherStores[i].price}\n链接：${object.otherStores[i].link.join(" ")}`)
        }
    }

    if (!(s.getPlatform() == "pgm" && object.platform == "拼多多")) {
        // 附加图片
        if (object.image) {
            lines.push(`${image(object.image)}`)
        }
        // console.log(object.image)
        // s.reply(image(object.image))
    }

    // 内容汇总回复
    s.reply(lines.join("\n"))
    return
}

module.exports = {
    demo: demo,
}