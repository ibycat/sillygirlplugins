/**
 * @version v1.0.0
 * @rule 历史上的今天
 * @create_at 2022-09-08 21:16:17
 * @title 历史上的今天
 * @description 🐒这个人很懒什么都没有留下。
 * @public false
 * @icon http://img31.mtime.cn/mt/2014/02/23/010514.99915248_1280X720X2.jpg
 * @author 猫咪
 */

const s = sender
const{ body} = request("https://ovooa.com/API/lishi/api.php")
s.reply(strings.replace(body, "\\n" ,"\n"))