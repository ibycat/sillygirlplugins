/**
 * @title CQ码
 * @module true
 * @create_at 2021-11-22 16:12:01
 * @description 🐧酷Q码解析模块。
 * @author onebot
 * @version v1.2.4
 * @public false
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/03/xiaojiascloud.png
 */

//[CQ:music,url=aaa,img=bbb,any=ccc] => { type: "music", url: "aaa", img: "bbb", any: "ccc" }
var reg = new RegExp("\\[CQ:([a-zA-Z0-9]+),([^\\[\\]]*)\\]")
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
        kv = strings.split(kv, "=", 2)
        if (kv.length == 2) {
            obj[kv[0]] = kv[1]
        }
    }
    if (type == "image" || type == "video") {
        obj["value"] = obj["url"] ? obj["url"] : obj["file"]
    }
    const [text1, text2] = strings.split(text, item, 2)
    msgs.push(obj)
    var items = CQ2Items(text1).concat(msgs).concat(CQ2Items(text2))
    var res = []
    for (var item_ of items) {
        if (item_.type == "text") {
            if (!item_.value || item_.value.match(/^\s+$/)) {
                continue
            }
        }
        res.push(item_)
    }
    return res
}

function curlToRequest(curlCommand) {
    // console.log("===",curlCommand)
    // 从Curl命令中提取URL
    const urlRegex = /curl[\s\S]+(http[s]?:[^\s'"]+)/;
    const urlMatch = curlCommand.match(urlRegex);
    if (!urlMatch) {
        throw new Error('Failed to extract URL from Curl command');
    }
    const url = urlMatch[1];

    const headers = {};
    // 从Curl命令中提取请求头
    const headersRegex = /-[hH][eaders]{0,5}\s+['"]([^'"]+)['"]/g;
    const headersMatches = curlCommand.matchAll(headersRegex);
    for (const match of headersMatches) {
        const header = match[1];
        const [name, value] = header.split(':');
        headers[name] = value.trim();
    }

    // 从Curl命令中提取请求体
    const requestBodyRegex = /--data(-binary)?\s+['"]([\s\S]+)['"]/;
    const requestBodyMatch = curlCommand.match(requestBodyRegex);
    //  console.log(requestBodyMatch)
    let body;
    if (requestBodyMatch) {
        body = requestBodyMatch[2];
    }

    // console.log(JSON.stringify(body))


    // 发送请求
    const options = {
        method: "post",
        url,
        headers,
        body,
        json: true,
    };

    // console.log(JSON.stringify(options))

    return request(options);
}

module.exports = {
    toItems: CQ2Items,
    toJdLink: function (text) {
        if (strings.contains(text, "<des>京东购物</des>")) {
            return fmt.sprintf("https://item.jd.com/%s.html", (new Regexp("sku=(\\d+)")).findSubmatch(text)[1])
        }
        return text
    },
    curlToRequest: curlToRequest
}