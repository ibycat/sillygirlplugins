/**
 * @title 千寻
 * @create_at 2022-11-22 14:46:39
 * @on_start true
 * @create_at 2022-11-22 14:21:00
 * @description 🐒千寻意外来到神灵世界后，为了救因惩罚而变成猪的家人，经历许多磨难。
 * @author 比比东
 * @version v2.2.1
 * @public false
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/01/21352718.jpeg
 * @disable true
 */

//🧧🧧🧧 自行将第十行 disable true 改为 false

const qianxun = new Sender("wx")
const server = require("express")
const wx = new Bucket("wx")
var addr = wx.get("qx_addr", "http://127.0.0.1:7777");//🧧 设置机器人访问地址，指令：set wx qx_addr ?
var sddr = wx.get("qx_sddr", "http://127.0.0.1:8080/bot/qianxun");//🧧 此处设置千寻事件通知地址，如果不设置会可能会无法处理来自QQ服务器的图片，指令：set wx qx_sddr ?
var wxid = wx.get("qx_wxid");//设置机器人wxid，自动设置
const suffix = "@chatroom"
const cq = require("CQ码")
const filepath = "C:\\Users\\Administrator\\Documents\\"//🧧实际设置文件地址
const prefix = "qx_"

//🧧 请在千寻配置事件通知地址 http://傻妞地址:端口/bot/qianxun
server.post("/bot/qianxun", function (req, res) {
    const params = req.json()
    if (!wxid && params.wxid != wxid) {
        wxid = params.wxid
        console.log("已默认设置千寻机器人%s", wxid)
        wx.set("qx_wxid", wxid)
    }
    if (params.data.data.msgType + "" == "3") {
        // console.log(JSON.stringify(params))
        let dot = parsePic(params.data.data.msg)
        params.data.data.msg = `[CQ:image,${prefix}pic=${dot.pic},${prefix}isDecrypt=${dot.isDecrypt}]`
    }
    if (["1", "49", "3", "2002"].indexOf("" + params.data.data.msgType) != -1) {//params.data.data.fromType == "1"
        var msg = {}
        var fromWxid = strings.replace(params.data.data.fromWxid, suffix, "")
        if (fromWxid == params.data.data.fromWxid) {
            msg["user_id"] = fromWxid
        } else {
            msg["user_id"] = params.data.data.finalFromWxid
            msg["chat_id"] = fromWxid
        }
        msg["content"] = cq.toJdLink(qx2nm(params.data.data.msg))
        if (msg["user_id"] != wxid) {
            // console.log(JSON.stringify(msg))
            qianxun.receive(msg)
        }
        res.json({ "code": 200, "msg": "ok", "timestamp": time.unix() })
    }
    req.continue()
})

server.get("/bot/qianxun", (_, res) => { res.send("你好，我是千寻。") })

qianxun.send(function (msg) {
    // console.log(msg)
    var wxid = msg.chat_id ? msg.chat_id + suffix : msg.user_id
    var items = cq.toItems(msg.content)
    for (var item of items) {
        if (item.type == "text") {
            sendMessage({
                "type": "Q0001",
                "data": {
                    "wxid": wxid,
                    "msg": nm2qx(item.value)
                }
            })
        }
        if (item.type == "image") {
            // console.log(item)
            let pic = prefix + "pic"
            if (item[pic]) {
                if (filepath) {
                    const [v1, v2] = item[pic].split("WeChat Files")
                    item[pic] = filepath + "WeChat Files" + v2
                }
                console.log("path", item[pic])
                sendMessage({
                    "type": "Q0010",
                    "data": {
                        "wxid": wxid,
                        "path": item[pic],
                    }
                })
                continue
            }
            if (sddr) {
                // if (strings.contains(item.value, "qpic.cn")) {
                item.value = fmt.sprintf("%s/relay?url=%s", sddr, encodeURIComponent(item.value))
                // }
            }
            sendMessage({
                "type": "Q0010",
                "data": {
                    "wxid": wxid,
                    "path": item.value,
                }
            })
        }
    }
})

//发送消息
function sendMessage(senddata) {
    var options = {
        url: fmt.sprintf("%s/DaenWxHook/httpapi/?wxid=%s", addr, wxid),
        method: 'post',
        body: senddata,
        // goroutine: true,
    };
    // console.log(JSON.stringify(options))
    var resp = request(options);
    // console.log(JSON.stringify(resp))
    // if (resp.error) {
    //     console.log(JSON.stringify(resp))
    // }
}

var _ = (s) => {
    if (s) {
        var v = s.match("http[s]?://[\\w.]+:?\\d*")
        if (v) {
            return v[0]
        }
    }
    return ""
}

sddr = _(sddr)

wx.watch("qx_sddr", function (old, now) {
    sddr = _(now)
})

wx.watch("qx_wxid", function (old, now) {
    wxid = now
})

wx.watch("qx_addr", function (old, now) {
    addr = now
})

var emojis = `🙈🙉🙊🐵🐒🐶🐕🐩🐺🐱😺😸😹😻😼😽🙀😿😾🐈🐯🐅🐆🐴🐎🐮🐂🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🐘🐭🐁🐀🐹🐰🐇🐻🐨🐼🐾🐔🐓🐣🐤🐥🐦🐧🐸🐊🐢🐍🐲🐉🐳🐋🐬🐟🐠🐡🐙🐚🐌🐛🐜🐝🐞🦋💐🌸💮🌹🌺🌻🌼🌷🌱🌲🌳🌴🌵🌾🌿🍀🍁🍂🍃🌍🌎🌏🌐🌑🌒🌓🌔🌕🌖🌗🌘🌙🌚🌛🌜☀🌝🌞⭐🌟🌠☁⛅☔⚡❄🔥💧🌊💩🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑🍒🍓🍅🍆🌽🍄🌰🍞🍖🍗🍔🍟🍕🍳🍲🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥🍡🍦🍧🍨🍩🍪🎂🍰🍫🍬🍭🍮🍯🍼☕🍵🍶🍷🍸🍹🍺🍻🍴😀😁😂😃😄😅😆😉😊😋😎😍😘😗😙😚☺😇😐😑😶😏😣😥😮😯😪😫😴😌😛😜😝😒😓😔😕😲😷😖😞😟😤😢😭😦😧😨😬😰😱😳😵😡😠😈👿👹👺💀👻👽👦👧👨👩👴👵👶👱👮👲👳👷👸💂🎅👰👼💆💇🙍🙎🙅🙆💁🙋🙇🙌🙏👤👥🚶🏃👯💃👫👬👭💏💑👪💪👈👉☝👆👇✌✋👌👍👎✊👊👋👏👐✍👣👀👂👃👅👄💋👓👔👕👖👗👘👙👚👛👜👝🎒💼👞👟👠👡👢👑👒🎩🎓💄💅💍🌂🎪🎭🎨🎰🚣🛀🎫🏆⚽⚾🏀🏈🏉🎾🎱🎳⛳🎣🎽🎿🏂🏄🏇🏊🚴🚵🎯🎮🎲🎷🎸🎺🎻🎬👾🌋🗻🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽⛪⛲🌁🌃🌆🌇🌉🌌🎠🎡🎢🚂🚃🚄🚅🚆🚇🚈🚉🚊🚝🚞🚋🚌🚍🚎🚏🚐🚑🚒🚓🚔🚕🚖🚗🚘🚚🚛🚜🚲⛽🚨🚥🚦🚧⚓⛵🚤🚢✈💺🚁🚟🚠🚡🚀🎑🗿🛂🛃🛄🛅💌💎🔪💈🚪🚽🚿🛁⌛⏳⌚⏰🎈🎉🎊🎎🎏🎐🎀🎁📯📻📱📲☎📞📟📠🔋🔌💻💽💾💿📀🎥📺📷📹📼🔍🔎🔬🔭📡💡🔦🏮📔📕📖📗📘📙📚📓📃📜📄📰📑🔖💰💴💵💶💷💸💳✉📧📨📩📤📥📦📫📪📬📭📮✏✒📝📁📂📅📆📇📈📉📊📋📌📍📎📏📐✂🔒🔓🔏🔐🔑🔨🔫🔧🔩🔗💉💊🚬🔮🚩🎌💦💨💣☠♠♥♦♣🀄🎴🔇🔈🔉🔊📢📣💤💢💬💭♨🌀🔔🔕✡✝🔯📛🔰🔱⭕✅☑✔✖❌❎➕➖➗➰➿〽✳✴❇‼⁉❓❔❕❗©®™🎦🔅🔆💯🔠🔡🔢🔣🔤🅰🆎🅱🆑🆒🆓ℹ🆔Ⓜ🆕🆖🅾🆗🅿🆘🆙🆚🈁🈂🈷🈶🈯🉐🈹🈚🈲🉑🈸🈴🈳㊗㊙🈺🈵▪▫◻◼◽◾⬛⬜🔶🔷🔸🔹🔺🔻💠🔲🔳⚪⚫🔴🔵♈♉♊♋♌♍♎♏♐♑♒♓⛎💘❤💓💔💕💖💗💙💚💛💜💝💞💟❣🌿🚧💒☎📟💽⬆↗➡↘⬇↙⬅↖↕↔↩↪⤴⤵🔃🔄🔙🔚🔛🔜🔝🔀🔁🔂▶⏩◀⏪🔼⏫🔽⏬📱📶📳📴♻🏧🚮🚰♿🚹🚺🚻🚼🚾⚠🚸⛔🚫🚳🚭🚯🚱🚷🔞🍇🍈🍉🍊🍋🍌🍍🥭🍎🍏🍐🍑🍒🍓🫐🥝🍅🫒🥥🥑🍆🥔🥕🌽🌶️🫑🥒🥬🥦🧄🧅🍄🥜🌰🍞🥐🥖🫓🥨🥯🥞🧇🧀🍖🍗🥩🥓🍔🍟🍕🌭🥪🌮🌯🫔🥙🧆🥚🍳🥘🍲🫕🥣🥗🍿🧈🧂🥫🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥🥮🍡🥟🥠🥡🦪🍦🍧🍨🍩🍪🎂🍰🧁🥧🍫🍬🍭🍮🍯🍼🥛☕🫖🍵🍶🍾🍷🍸🍹🍺🍻🥂🥃🥤🧋🧃🧉🧊🥢🍽️🍴🥄🚣🗾🏔️⛰️🌋🗻🏕️🏖️🏜️🏝️🏞️🏟️🏛️🏗️🛖🏘️🏚️🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽⛪🕌🛕🕍⛩️🕋⛲⛺🌁🌃🏙️🌄🌅🌆🌇🌉🎠🎡🎢🚂🚃🚄🚅🚆🚇🚈🚉🚊🚝🚞🚋🚌🚍🚎🚐🚑🚒🚓🚔🚕🚖🚗🚘🚙🛻🚚🚛🚜🏎️🏍️🛵🛺🚲🛴🚏🛣️🛤️⛽🚨🚥🚦🚧⚓⛵🚤🛳️⛴️🛥️🚢✈️🛩️🛫🛬🪂💺🚁🚟🚠🚡🛰️🚀🛸🪐🌠🌌⛱️🎆🎇🎑💴💵💶💷🗿🛂🛃🛄🛅🙈🙉🙊💥💫💦💨🐵🐒🦍🦧🐶🐕🦮🐕‍🦺🐩🐺🦊🦝🐱🐈🐈‍⬛🦁🐯🐅🐆🐴🐎🦄🦓🦌🦬🐮🐂🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🦙🦒🐘🦣🦏🦛🐭🐁🐀🐹🐰🐇🐿️🦫🦔🦇🐻🐻‍❄️🐨🐼🦥🦦🦨🦘🦡🐾🦃🐔🐓🐣🐤🐥🐦🐧🕊️🦅🦆🦢🦉🦤🪶🦩🦚🦜🐸🐊🐢🦎🐍🐲🐉🦕🦖🐳🐋🐬🦭🐟🐠🐡🦈🐙🐚🐌🦋🐛🐜🐝🪲🐞🦗🪳🕷️🕸️🦂🦟🪰🪱🦠💐🌸💮🏵️🌹🥀🌺🌻🌼🌷🌱🪴🌲🌳🌴🌵🌾🌿☘️🍀🍁🍂🍃🍄🌰🦀🦞🦐🦑🌍🌎🌏🌐🪨🌑🌒🌓🌔🌕🌖🌗🌘🌙🌚🌛🌜☀️🌝🌞⭐🌟🌠☁️⛅⛈️🌤️🌥️🌦️🌧️🌨️🌩️🌪️🌫️🌬️🌈☂️☔⚡❄️☃️⛄☄️🔥💧🌊🎄✨🎋🎍😀😃😄😁😆😅🤣😂🙂🙃😉😊😇🥰😍🤩😘😗☺️😚😙🥲😋😛😜🤪😝🤑🤗🤭🤫🤔🤐🤨😐😑😶😏😒🙄😬🤥😌😔😪🤤😴😷🤒🤕🤢🤮🤧🥵🥶🥴😵🤯🤠🥳🥸😎🤓🧐😕😟🙁☹️😮😯😲😳🥺😦😧😨😰😥😢😭😱😖😣😞😓😩😫🥱😤😡😠🤬😈👿💀☠️💩🤡👹👺👻👽👾🤖😺😸😹😻😼😽🙀😿😾💋👋🤚🖐️✋🖖👌🤌🤏✌️🤞🤟🤘🤙👈👉👆🖕👇☝️👍👎✊👊🤛🤜👏🙌👐🤲🤝🙏✍️💅🤳💪🦾🦿🦵🦶👂🦻👃🧠🫀🫁🦷🦴👀👁️👅👄👶🧒👦👧🧑👱👨🧔👨‍🦰👨‍🦱👨‍🦳👨‍🦲👩👩‍🦰🧑‍🦰👩‍🦱🧑‍🦱👩‍🦳🧑‍🦳👩‍🦲🧑‍🦲👱‍♀️👱‍♂️🧓👴👵🙍🙍‍♂️🙍‍♀️🙎🙎‍♂️🙎‍♀️🙅🙅‍♂️🙅‍♀️🙆🙆‍♂️🙆‍♀️💁💁‍♂️💁‍♀️🙋🙋‍♂️🙋‍♀️🧏🧏‍♂️🧏‍♀️🙇🙇‍♂️🙇‍♀️🤦🤦‍♂️🤦‍♀️🤷🤷‍♂️🤷‍♀️🧑‍⚕️👨‍⚕️👩‍⚕️🧑‍🎓👨‍🎓👩‍🎓🧑‍🏫👨‍🏫👩‍🏫🧑‍⚖️👨‍⚖️👩‍⚖️🧑‍🌾👨‍🌾👩‍🌾🧑‍🍳👨‍🍳👩‍🍳🧑‍🔧👨‍🔧👩‍🔧🧑‍🏭👨‍🏭👩‍🏭🧑‍💼👨‍💼👩‍💼🧑‍🔬👨‍🔬👩‍🔬🧑‍💻👨‍💻👩‍💻🧑‍🎤👨‍🎤👩‍🎤🧑‍🎨👨‍🎨👩‍🎨🧑‍✈️👨‍✈️👩‍✈️🧑‍🚀👨‍🚀👩‍🚀🧑‍🚒👨‍🚒👩‍🚒👮👮‍♂️👮‍♀️🕵️🕵️‍♂️🕵️‍♀️💂💂‍♂️💂‍♀️🥷👷👷‍♂️👷‍♀️🤴👸👳👳‍♂️👳‍♀️👲🧕🤵🤵‍♂️🤵‍♀️👰👰‍♂️👰‍♀️🤰🤱👩‍🍼👨‍🍼🧑‍🍼👼🎅🤶🧑‍🎄🦸🦸‍♂️🦸‍♀️🦹🦹‍♂️🦹‍♀️🧙🧙‍♂️🧙‍♀️🧚🧚‍♂️🧚‍♀️🧛🧛‍♂️🧛‍♀️🧜🧜‍♂️🧜‍♀️🧝🧝‍♂️🧝‍♀️🧞🧞‍♂️🧞‍♀️🧟🧟‍♂️🧟‍♀️💆💆‍♂️💆‍♀️💇💇‍♂️💇‍♀️🚶🚶‍♂️🚶‍♀️🧍🧍‍♂️🧍‍♀️🧎🧎‍♂️🧎‍♀️🧑‍🦯👨‍🦯👩‍🦯🧑‍🦼👨‍🦼👩‍🦼🧑‍🦽👨‍🦽👩‍🦽🏃🏃‍♂️🏃‍♀️💃🕺🕴️👯👯‍♂️👯‍♀️🧖🧖‍♂️🧖‍♀️🧘🧑‍🤝‍🧑👭👫👬💏👩‍❤️‍💋‍👨👨‍❤️‍💋‍👨👩‍❤️‍💋‍👩💑👩‍❤️‍👨👨‍❤️‍👨👩‍❤️‍👩👪👨‍👩‍👦👨‍👩‍👧👨‍👩‍👧‍👦👨‍👩‍👦‍👦👨‍👩‍👧‍👧👨‍👨‍👦👨‍👨‍👧👨‍👨‍👧‍👦👨‍👨‍👦‍👦👨‍👨‍👧‍👧👩‍👩‍👦👩‍👩‍👧👩‍👩‍👧‍👦👩‍👩‍👦‍👦👩‍👩‍👧‍👧👨‍👦👨‍👦‍👦👨‍👧👨‍👧‍👦👨‍👧‍👧👩‍👦👩‍👦‍👦👩‍👧👩‍👧‍👦👩‍👧‍👧🗣️👤👥🫂👣🧳🌂☂️🎃🧵🧶👓🕶️🥽🥼🦺👔👕👖🧣🧤🧥🧦👗👘🥻🩱🩲🩳👙👚👛👜👝🎒🩴👞👟🥾🥿👠👡🩰👢👑👒🎩🎓🧢🪖⛑️💄💍💼🩸💌🕳️💣🛀🛌🔪🏺🗺️🧭🧱💈🦽🦼🛢️🛎️🧳⌛⏳⌚⏰⏱️⏲️🕰️🌡️⛱️🧨🎈🎉🎊🎎🎏🎐🧧🎀🎁🤿🪀🪁🔮🪄🧿🕹️🧸🪅🪆🖼️🧵🪡🧶🪢🛍️📿💎📯🎙️🎚️🎛️📻🪕📱📲☎️📞📟📠🔋🔌💻🖥️🖨️⌨️🖱️🖲️💽💾💿📀🧮🎥🎞️📽️📺📷📸📹📼🔍🔎🕯️💡🔦🏮🪔📔📕📖📗📘📙📚📓📒📃📜📄📰🗞️📑🔖🏷️💰🪙💴💵💶💷💸💳🧾✉️📧📨📩📤📥📦📫📪📬📭📮🗳️✏️✒️🖋️🖊️🖌️🖍️📝📁📂🗂️📅📆🗒️🗓️📇📈📉📊📋📌📍📎🖇️📏📐✂️🗃️🗄️🗑️🔒🔓🔏🔐🔑🗝️🔨🪓⛏️⚒️🛠️🗡️⚔️🔫🪃🛡️🪚🔧🪛🔩⚙️🗜️⚖️🦯🔗⛓️🪝🧰🧲🪜⚗️🧪🧫🧬🔬🔭📡💉🩸💊🩹🩺🚪🪞🪟🛏️🛋️🪑🚽🪠🚿🛁🪤🪒🧴🧷🧹🧺🧻🪣🧼🪥🧽🧯🛒🚬⚰️🪦⚱️🗿🪧🚰🕴️🧗🧗‍♂️🧗‍♀️🤺🏇⛷️🏂🏌️🏌️‍♂️🏌️‍♀️🏄🏄‍♂️🏄‍♀️🚣🚣‍♂️🚣‍♀️🏊🏊‍♂️🏊‍♀️⛹️⛹️‍♂️⛹️‍♀️🏋️🏋️‍♂️🏋️‍♀️🚴🚴‍♂️🚴‍♀️🚵🚵‍♂️🚵‍♀️🤸🤸‍♂️🤸‍♀️🤼🤼‍♂️🤼‍♀️🤽🤽‍♂️🤽‍♀️🤾🤾‍♂️🤾‍♀️🤹🤹‍♂️🤹‍♀️🧘🧘‍♂️🧘‍♀️🎪🛹🛼🛶🎗️🎟️🎫🎖️🏆🏅🥇🥈🥉⚽⚾🥎🏀🏐🏈🏉🎾🥏🎳🏏🏑🏒🥍🏓🏸🥊🥋🥅⛳⛸️🎣🎽🎿🛷🥌🎯🎱🎮🎰🎲🧩♟️🎭🎨🧵🧶🎼🎤🎧🎷🪗🎸🎹🎺🎻🥁🪘🎬🏹💘💝💖💗💓💞💕💟❣️💔❤️🧡💛💚💙💜🤎🖤🤍💯💢💬👁️‍🗨️🗨️🗯️💭💤💮♨️💈🛑🕛🕧🕐🕜🕑🕝🕒🕞🕓🕟🕔🕠🕕🕡🕖🕢🕗🕣🕘🕤🕙🕥🕚🕦🌀♠️♥️♦️♣️🃏🀄🎴🔇🔈🔉🔊📢📣📯🔔🔕🎵🎶💹🛗🏧🚮🚰♿🚹🚺🚻🚼🚾⚠️🚸⛔🚫🚳🚭🚯🚱🚷📵🔞☢️☣️⬆️↗️➡️↘️⬇️↙️⬅️↖️↕️↔️↩️↪️⤴️⤵️🔃🔄🔙🔚🔛🔜🔝🛐⚛️🕉️✡️☸️☯️✝️☦️☪️☮️🕎🔯♈♉♊♋♌♍♎♏♐♑♒♓⛎🔀🔁🔂▶️⏩⏭️⏯️◀️⏪⏮️🔼⏫🔽⏬⏸️⏹️⏺️⏏️🎦🔅🔆📶📳📴♀️♂️✖️➕➖➗♾️‼️⁉️❓❔❕❗〰️💱💲⚕️♻️⚜️🔱📛🔰⭕✅☑️✔️❌❎➰➿ 〽️✳️✴️❇️©️®️™️#️⃣*️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🔠🔡🔢🔣🔤🅰️🆎🅱️🆑🆒🆓ℹ️🆔Ⓜ️🆕🆖🅾️🆗🅿️🆘🆙🆚🈁🈂️🈷️🈶🈯🉐🈹🈚🈲🉑🈸🈴🈳㊗️㊙️🈺🈵🔴🟠🟡🟢🔵🟣🟤⚫⚪🟥🟧🟨🟩🟦🟪🟫⬛⬜◼️◻️◾◽▪️▫️🔶🔷🔸🔹🔺🔻💠🔘🔳🔲🏁🚩🎌🏴🏳️🏳️‍🌈🏳️‍⚧️🏴‍☠️🇦🇨🇦🇩🇦🇪🇦🇫🇦🇬🇦🇮🇦🇱🇦🇲🇦🇴🇦🇶🇦🇷🇦🇸🇦🇹🇦🇺🇦🇼🇦🇽🇦🇿🇧🇦🇧🇧🇧🇩🇧🇪🇧🇫🇧🇬🇧🇭🇧🇮🇧🇯🇧🇱🇧🇲🇧🇳🇧🇴🇧🇶🇧🇷🇧🇸🇧🇹🇧🇻🇧🇼🇧🇾🇧🇿🇨🇦🇨🇨🇨🇩🇨🇫🇨🇬🇨🇭🇨🇮🇨🇰🇨🇱🇨🇲🇨🇳🇨🇴🇨🇵🇨🇷🇨🇺🇨🇻🇨🇼🇨🇽🇨🇾🇨🇿🇩🇪🇩🇬🇩🇯🇩🇰🇩🇲🇩🇴🇩🇿🇪🇦🇪🇨🇪🇪🇪🇬🇪🇭🇪🇷🇪🇸🇪🇹🇪🇺🇫🇮🇫🇯🇫🇰🇫🇲🇫🇴🇫🇷🇬🇦🇬🇧🇬🇩🇬🇪🇬🇫🇬🇬🇬🇭🇬🇮🇬🇱🇬🇲🇬🇳🇬🇵🇬🇶🇬🇷🇬🇸🇬🇹🇬🇺🇬🇼🇬🇾🇭🇰🇭🇲🇭🇳🇭🇷🇭🇹🇭🇺🇮🇨🇮🇩🇮🇪🇮🇱🇮🇲🇮🇳🇮🇴🇮🇶🇮🇷🇮🇸🇮🇹🇯🇪🇯🇲🇯🇴🇯🇵🇰🇪🇰🇬🇰🇭🇰🇮🇰🇲🇰🇳🇰🇵🇰🇷🇰🇼🇰🇾🇰🇿🇱🇦🇱🇧🇱🇨🇱🇮🇱🇰🇱🇷🇱🇸🇱🇹🇱🇺🇱🇻🇱🇾🇲🇦🇲🇨🇲🇩🇲🇪🇲🇫🇲🇬🇲🇭🇲🇰🇲🇱🇲🇲🇲🇳🇲🇴🇲🇵🇲🇶🇲🇷🇲🇸🇲🇹🇲🇺🇲🇻🇲🇼🇲🇽🇲🇾🇲🇿🇳🇦🇳🇨🇳🇪🇳🇫🇳🇬🇳🇮🇳🇱🇳🇴🇳🇵🇳🇷🇳🇺🇳🇿🇴🇲🇵🇦🇵🇪🇵🇫🇵🇬🇵🇭🇵🇰🇵🇱🇵🇲🇵🇳🇵🇷🇵🇸🇵🇹🇵🇼🇵🇾🇶🇦🇷🇪🇷🇴🇷🇸🇷🇺🇷🇼🇸🇦🇸🇧🇸🇨🇸🇩🇸🇪🇸🇬🇸🇭🇸🇮🇸🇯🇸🇰🇸🇱🇸🇲🇸🇳🇸🇴🇸🇷🇸🇸🇸🇹🇸🇻🇸🇽🇸🇾🇸🇿🇹🇦🇹🇨🇹🇩🇹🇫🇹🇬🇹🇭🇹🇯🇹🇰🇹🇱🇹🇲🇹🇳🇹🇴🇹🇷🇹🇹🇹🇻🇹🇼🇹🇿🇺🇦🇺🇬🇺🇲🇺🇳🇺🇸🇺🇾🇺🇿🇻🇦🇻🇨🇻🇪🇻🇬🇻🇮🇻🇳🇻🇺🇼🇫🇼🇸🇽🇰🇾🇪🇾🇹🇿🇦🇿🇲🇿🇼🏴󠁧󠁢󠁥󠁮󠁧󠁿🏴󠁧󠁢󠁳󠁣󠁴󠁿🏴󠁧󠁢󠁷󠁬󠁳󠁿🏴󠁵󠁳󠁴󠁸󠁿󠁵󠁳󠁴󠁸󠁿`

var map = {
    "0️⃣": "0[emoji=FE0F][emoji=20E3]",
    "1️⃣": "1[emoji=FE0F][emoji=20E3]",
    "2️⃣": "2[emoji=FE0F][emoji=20E3]",
    "3️⃣": "3[emoji=FE0F][emoji=20E3]",
    "4️⃣": "4[emoji=FE0F][emoji=20E3]",
    "5️⃣": "5[emoji=FE0F][emoji=20E3]",
    "6️⃣": "6[emoji=FE0F][emoji=20E3]",
    "7️⃣": "7[emoji=FE0F][emoji=20E3]",
    "8️⃣": "8[emoji=FE0F][emoji=20E3]",
    "9️⃣": "9[emoji=FE0F][emoji=20E3]",
    "🔟": "10[emoji=FE0F][emoji=20E3]",
}

for (var emoji of emojis) {
    var vs = unicode(emoji)
    if (vs == "[emoji=FE0F]") {
        continue
    }
    if (vs.length != 12 && vs.length != 24) {//
        continue
    }
    map[emoji] = vs
}

function unicode(str) {
    var value = "";
    for (var i = 0; i < str.length; i++)
        value += `[emoji=${str.charCodeAt(i).toString(16).toUpperCase()}]`
    return value;
}

function qx2nm(str) {
    for (var key in map) {
        str = strings.replace(str, map[key], key)
    }
    str = strings.replace(str, '\n\r', '\n')
    str = strings.replace(str, '\r\n', '\n')
    str = strings.replace(str, '\r', '\n')
    return str
}

function nm2qx(str) {
    for (var key in map) {
        str = strings.replace(str, key, map[key])
    }
    str = strings.replace(str, '\n', '\r')
    return str
}

// while(running()){

// }


function parsePic(text) {
    var obj = {}
    text = text.trim().replace(/^\[|\]$/g, '')
    for (var kv of text.split(",")) {
        kv = strings.split(kv, "=", 2)
        if (kv.length == 2) {
            const [key, value] = kv
            // console.log(key, value)
            obj[key] = value
        }
    }
    return obj
}

// sender.listen(["raw pic="], function (s) {
//     // console.log("xxx")
//     if (s.getChatID()) {
//         return
//     }
//     console.log(s.getContent())
//     s.reply(s.getContent())
// })