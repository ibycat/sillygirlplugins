/**
 * @author YuanKK
 * @version v1.0.0
 * @create_at 2022-09-07 13:34:12
 * @platform pgm web
 * @title 买家秀
 * @rule ^买家秀$
 * @rule ^-?mjx$
 * @public false
 * @description 🔍买家秀，18🈲️
 * @icon https://p.qqan.com/up/2022-5/2022527947244091.jpg
 */

const s = sender

function main() {
    var { headers, status } = request({
        url: "https://api.uomg.com/api/rand.img3?format=images",
        method: "get",
        allowredirects: false,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
        }
    });
    if ([302, 304].indexOf(status) != -1) {
        var id = s.reply(image(headers.Location))
        sleep(10000)
        s.recallMessage(s.getMessageId(), id)
    }
}

main()