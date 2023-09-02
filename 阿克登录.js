/**
 * @title 阿克登录
 * @rule ^登录$
 * @create_at 2022-12-13 17:52:42
 * @description 🐒这个人很懒什么都没有留下。
 * @author 无耻老贼
 * @version v1.0.5
 * @public false
 * @icon https://sns-avatar-qc.xhscdn.com/avatar/62c4fd7b5b51e3cae4a5859c.jpg?imageView2/1/w/540/format/jpg
 */

function main() {
    const jd = new Bucket("jd_cookie")
    if (jd.get("disable_ark") == "true") {
        s.continue()
        return
    }
    let url = jd.get("nolan_addr")
    try {
        if (!url) return "请先配置阿克🦀️地址！"
        s.reply("请输入手机号🐼：")
        let Phone = ""
        let body = {}
        let i = 0
        do {
            if (Phone && Phone.length != "11") {
                i++
                s.reply(`手机号长度错误🙅 +${i}，请重新输入！`)
                if (i == 10) return "遇见傻🐶，已退出交互！"
            }
            try {
                Phone = s.listen(["^\\d+$", "^q$"], 120000).getContent()
            } catch (_) {
                return "长时间没有输入手机号🐸，已退出交互！"
            }
            if (Phone == "q") return "已退出！"
        } while (Phone.length != "11")
        let resp = request({
            url: `${url}/api/SendSMS`,
            method: "post",
            body: { Phone },
            json: true,
        })
        body = resp.body
        if (!body) return "阿克接口异常🐷，已退出会话。"
        if (!body.success) return `阿克错误🔍：${body.message}，已退出会话。`
        s.reply("请输入短信验证码🫘：")
        let Code = ""
        do {//
            if (Code) s.reply(body.message)
            do {
                if (Code && Code.length != "6") s.reply(`短信验证码长度错误🙅，请重新输入！`)
                try {
                    Code = s.listen(["^\\d+$", "^q$"], 60000).getContent()
                } catch (_) {
                    return "长时间没有输入短信验证码🐸，已退出交互！"
                }
                if (Code == "q") return "已退出！"
            } while (Code.length != "6")
            let resp = request({
                url: `${url}/api/VerifyCode`,
                method: "post",
                body: { Phone, Code },
            })
            let data = resp.body
            try {
                body = JSON.parse(resp.body)
            } catch (_) {
                return `阿克接口错误🐷：${data}，已退出会话。`
            }
            if (body.success) break
        } while (strings.contains(body.message, "输入错误"))
        let cookie = ""
        if (body.success) {
            cookie = body.data.ck
        } else {
            try {
                Code = ""
                if (strings.contains(data, "USER_ID")) {
                    s.reply("请输入你的身份证前2位与后4位: ")
                    do {
                        if (Code && Code.length != "6") s.reply("身份证信息长度错误🙅，请重新输入！")
                        try {
                            Code = s.listen(["^\\d+X?$", "^q$"], 180000).getContent()
                        } catch (_) {
                            return "长时间没有输入身份证信息🐸，已退出交互！"
                        }
                    } while (Code.length != "6")
                } else if (strings.contains(data, "HISTORY_DEVICE")) {
                    s.reply(`新设备登录需要验证, 前往京东APP-我的-设置-账户与安全-新设备登录确认中确认，好了对我说:“已确认”`)
                    try {
                        s.listen(["^已确认$", "^q$"], 180000).getContent()
                    } catch (_) {
                        return "长时间没有输入“已确认”🐸，已退出交互！"
                    }

                } else if (strings.contains(data, "DANGEROUS_UP")) {
                    s.reply(`需要短信验证身份!\n编辑短信内容：${body.data.datauplink_tocontent}\n用${body.data.uplink_phone}手机号发送到：${body.data.uplink_tophone}\n好了对我说“已发送”`)
                    try {
                        s.listen(["^已发送$", "^q$"], 180000).getContent()
                    } catch (_) {
                        return "长时间没有输入“已发送”🐸，已退出交互！"
                    }
                } else {
                    return JSON.stringify(body)
                }
                if (Code == "q") return "已退出！"
                if (!Code) Code = "123456"
                let { body, status } = request({
                    url: `${url}/api/VerifyCardCode`,
                    method: "post",
                    body: { Phone, Code },
                    json: true,
                })
                if (status != 200 || !body) return "阿克接口异常🐷，已退出会话。"
                if (body.success) {
                    cookie = body.data.ck
                } else {
                    return body.message
                }
            } catch (_) {
                return body.message
            }
        }
        s.setContent(cookie)
        s.continue()
    } catch (e) {
        s.reply("反馈给老贼：" + e)
    }
}
s.reply(main())

