/**
 * @title 数据拷贝
 * @rule 数据拷贝
 * @create_at 2022-09-21 20:48:05
 * @description 💊将本机傻妞数据拷贝到另一个傻妞，F12可以查看进度。
 * @author 猫咪
 * @version v1.0.4
 * @admin true
 * @public false
 * @encrypt false
 * @icon https://img.seadn.io/files/d9a7dac01480328ac5ec0916b9fc99e4.png?auto=format&fit=max&w=512
 */

var s = sender

function main() {
    s.reply("请输入目标web地址：")
    var address = s.listen().getContent().match(/https?:\/\/[\.\w]+:?\d*/g)
    if (!address) {
        return "地址错误！"
    }
    s.reply("请输入用户：")
    var username = s.listen().getContent()
    s.reply("请输入密码：")
    var password = s.listen().getContent()
    var resp = request({
        url: address + "/api/login/account",
        method: "post",
        body: {
            username: username,
            password: password,
        },
        json: true,
    })
    if (resp.status != 200) return "请求失败！"
    if (resp.body.status != "ok") return "登录失败！"
    s.reply("3！2！1！开始拷贝！(F12查看进度)")
    var cookie = resp.headers["Set-Cookie"][0].match(/[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+/g)
    const headers = { Cookie: "token=" + cookie }
    var buckets = new Bucket("sillyGirl").buckets()
    var body = {}
    var size = 0
    var copy = function () {
        var resp = request({
            url: address + "/api/storage",
            method: "put",
            body: body,
            json: true,
            headers: headers,
        })
        if (resp && resp.body) {
            console.log(`已完成${size}个字符拷贝。`)
            body = {}
            size = 0
            return true
        }
        time.sleep(1000)
        return false
    }

    for (var name of buckets) {
        if (name == "成语大全") {
            continue
        }
        var bucket = new Bucket(name)
        for (var key of bucket.keys()) {
            var value = bucket.get(key)
            size += value.length
            var bkey = `${name}.${key}`
            if (bkey == "sillyGirl.web_token") continue
            if (bkey == "sillyGirl.password") continue
            if (bkey == "sillyGirl.machineId") continue
            if (bkey == "sillyGirl.name") continue
            if (bkey == "sillyGirl.port") continue
            body[bkey] = value
            while (size > 25000) {
                if (copy()) {
                    break
                }
            }
        }
    }

    while (true) {
        if (copy()) {
            break
        }
    }

    s.reply("拷贝完成。")
}

s.reply(main())