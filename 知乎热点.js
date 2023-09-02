/**
 * @version v1.0.0
 * @rule 知乎热点
 * @create_at 2022-09-08 15:09:40
 * @title 知乎热点
 * @description 🐒这个人很懒什么都没有留下。
 * @author 猫咪
 * @icon https://static.zhihu.com/heifetz/assets/logo.804f083e.png
 * @public false
 */

request("https://www.zhihu.com/api/v4/creators/rank/hot?domain=0&period=hour", (error,response,body) => {
    let data = JSON.parse(body).data
    let hots = []

    for (let index = 0; index < data.length; index++) {
        let element = data[index];
                hots.push(`${index + 1}. ${element.question.title}\n${element.question.url}`)
    }
    sender.reply(hots.join("\n"))
})