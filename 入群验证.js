/**
 * @title 入群验证
 * @create_at 2022-09-18 15:46:04
 * @description 🐶猫咪自用，入群验证工具，彻底杜绝广告。
 * @author 猫咪
 * @version v1.0.2
 * @chatId -1001583071436 -1001677461561 -1001574205729 -1001502207145 -1001522180197 -1001783516963 -1001415461569
 * @rule [banme:banme,/banme]
 * @rule raw [\s\S]+
 * @paltform pgm
 * @public false
 * @priority 1000000
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/01/86448703.jpeg
 * @disable false
 */

var s = sender
var hhxyq = new Bucket("好好学习群")
var uid = s.getUserId()
var ok = hhxyq.get(uid)
var cid = s.getChatId()
var contains = function (str, ws) {
    for (var w of ws) {
        if (strings.contains(str, w)) {
            return true
        }
    }
    return false
}

var excepts = [-1001783516963, -1001415461569]
var content = s.getContent()

function main() {
    if (ok && s.param("banme") || strings.contains(content, "奥特曼") || strings.contains(content, "autMan") || strings.contains(content, "退钱") || strings.contains(content, "分佣")) {
        // bid = s.reply("既然你那么想被口球的话, 那我就成全你吧!\n送你一份2分10秒禁言套餐哦, 谢谢惠顾~")
        // s.ban(uid, 130)
    } else {
        var mid = s.getMessageId()

        if (contains(content, ["已取消开奖", "整点抽奖时间到啦"])) {
            s.recallMessage(mid)
            // s.ban(uid, 86400000000)
            // s.kick(uid)
            return
        }
        var bids = []
        var wait = 900
        if (!ok) {
            // var rqah = new Bucket("入群暗号")
            // ok = rqah.get(content)
            ok = strings.contains(content, "天王盖地虎") || strings.contains(content, "宝塔镇河妖") || strings.contains(content, "小鸡炖蘑菇") || strings.contains(content, "玉帝日王母")
            if (ok) {
                var bid = s.reply("暗号正确，已解除发言限制！")
                bids.push(bid)
                hhxyq.set(uid, ok)
                // rqah.delete(content)
                time.sleep(5000)
                s.recallMessage(mid)
            } else {
                var user_name = s.getUserName()
                if (contains(user_name, ["赌博", "跑分", "社工", "资源", "幼女", "接洽", "广告", "代发", "免费", "vpn", "VPN", "梯子", "飞机", "中文", "翻墙", "询问", "征询", "找我", "电报"])) {
                    user_name = "贼🐔8 广告"
                    s.recallMessage(mid)
                    wait = 3
                    cid = 0
                }
                if (excepts.indexOf(cid) == -1) {
                    s.recallMessage(mid)
                    var bid = s.reply(`<a href=\"tg://user?id=${uid}\">@${user_name ? user_name : uid}</a> 本喵给你 **${wait}秒** 关注微信公众号 **送喜官** 并获取 **暗号**，否则移出群聊。`)
                    bids.push(bid)
                    // s.ban(uid, 60)
                    s.listen(wait * 1000, "private", function (s) {
                        var mid = s.getMessageId()
                        content = s.getContent()
                        // ok = rqah.get(content)
                        ok = strings.contains(content, "天王盖地虎") || strings.contains(content, "宝塔镇河妖") || strings.contains(content, "小鸡炖蘑菇") || strings.contains(content, "玉帝日王母")
                        if (ok) {
                            var bid = s.reply("暗号正确，已解除发言限制！")
                            hhxyq.set(uid, ok)
                            // rqah.delete(content)
                            time.sleep(5000)
                            s.recallMessage(mid, bid)
                            return
                        }
                        s.recallMessage(mid)
                        return s.holdOn()
                    })
                    if (!ok) {
                        s.kick(uid)
                        bid = s.reply(`本喵已将 <a href=\"tg://user?id=${uid}\">@${user_name ? user_name : uid}</a> 移出群聊，1分钟内无法加入群聊。`)
                        bids.push(bid)
                        time.sleep(20000)
                    }
                } else {
                    return
                }
            }
            s.recallMessage(bids)
        } else {
            if (excepts.indexOf(cid) == -1) {
                s.continue()
            }
        }
    }

}

main()