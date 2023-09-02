/**
 * 作者
 * @author 猫咪
 * 创建时间，自动生成。
 * @create_at 2034-09-12 19:14:23
 * 脚本描述。
 * @description 👑插件开发demo，基础操作演示，能懂多少看悟性。
 * 脚本版本。
 * @version v1.1.4
 * 脚本名称。
 * @title 插件开发
 * 脚本支持的平台，默认支持所有。
 * @platform qq wx tg pgm web cron
 * []里的作为参数，取值方法 sender.param("姓名")
 * @rule 你好 [姓名]
 * :后面,连接的几个参数是姓名的可选值
 * @rule 你好 [姓名:佩奇,乔治]
 * ?作为参数，取值方法 sender.param(1)
 * @rule 你好 ?
 * 带raw 代表使用正则匹配，子匹配即参数
 * @rule raw ^你好 (.*)$
 * ^开头或$结尾也会被认为是正则匹配
 * @rule ^你好 (.*)$
 * 脚本优先级，大的优先处理消息。
 * @priority 100
 * 定时任务，触发运行时 sender.getPlatform() == "cron"
 * @cron *\/2 20 8 8 *
 * 管理员可以操作的脚本
 * @admin true
 * 脚本设置为公开，订阅者可以获取该脚本。
 * @public false
 * 脚本图标。
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2021/12/favicon.ico
 * 是否加密脚本，加密后会导致别人无法抄袭你的脚本。
 * @encrypt false
 * 启用脚本
 * @disable false
 */

// 请在消息框输入并发送：你好 佩奇
// 建议同时打开浏览器控制台

// sender
const s = sender

// sender param 获取第1个参数
// const nickname = s.param(1)
const nickname = s.param("姓名")

console.log(`第1个参数：${nickname}`)

// sender reply 回复一个消息
s.reply(`你好，我是${nickname}。`)

// sender reply 回复一张图片
s.reply(`一张图片。${image("https://pic4.zhimg.com/80/v2-903e8b413d499f63bb7268e6898c1d1b_1440w.jpg")}`)

// sender reply 回复一段视频
// s.reply(`一段视频。${video(url)}`)

// sender getPlatform 获取消息平台，如果是定时触发的，则为 cron
console.log(`消息平台：${s.getPlatform()}`)

// sender getUserId 获取用户ID
console.log(`用户ID：${s.getUserId()}`)

// sender getChatId 获取群聊ID
console.log(`群聊ID：${s.getChatId()}`)

// sender getUserName 获取用户名称
console.log(`用户名称：${s.getUserName()}`)

// sender getChatName 获取群聊名称
console.log(`群聊名称：${s.getChatName()}`)

// sender kick 踢出群聊
// s.kick(s.getUserId())

// sender ban 群聊禁言
// s.ban(s.getUserId(), 86400)

// sender unban 群聊禁言解除
// s.unban(s.getUserId())

// sender isAdmin 判断用户是否管理员
// console.log(`你${s.isAdmin() ? "是" : "不是"}管理员！`)

// sender setContent 篡改消息文本，配合continue向下传递消息
// s.setContent("set silly name 傻蛋")

// sender continue 使消息继续被其他脚本匹配
// s.continue()

// sender createSender 创建新的sender，真实的替用户发送新消息
// s.createSender({content:"set silly name 傻蛋"})

// sender getMessageId 获取消息ID
// const messageId = s.getMessageId()
// console.log(`消息ID：${messageId}`)

// sender recallMessage 撤回一条消息
// s.recallMessage(messageId)

// sender getContent 获取消息内容
// console.log(`消息内容：${s.getContent()}`)

// sender listen 监听用户回复 可以接超时、group和private
// s.reply("请在2秒内发出任意回复：")
// var newS = s.listen(2000)//返回一个sender对象，超时后返回null
// if(newS==null){
//     s.reply("超时，2秒内未回复。")
// }else{
//     s.reply(`你回复了：${newS.getContent()}`)
// }

// let times = 0
// s.reply("请继续回复，我说停再停：")
// var handle = function (s) {
//     console.log(`用户回复：${s.getContent()}`)
//     times++
//     if (times <= 3) {
//         return s.holdOn("收到，请继续回复：")
//     }
//     s.reply("停！")
// }

// 返回一个sender对象
// s.listen(handle)
// 设置1秒超时，超时后返回null
// s.listen(handle, 1000)
// 设置group参数，将同时监听群组所有成员
// s.listen(handle, "group") 
// 设置private参数，将同时监听用户的私聊
// s.listen(handle, "private")  

// Bucket 存储器
const test = new Bucket("test")

// Bucket set 设置值
test.set("nickname", nickname)

// Bucket get 获取值or默认值
// console.log("记住名字：%s", test.get("nickname", "默认名"))

// Bucket delete 删除一个键值对
// console.log("删除名字：%s", test.delete("nickname"))

//Bucket keys 获取所有键名
// console.log("所有键名：%s", JSON.stringify(test.keys()))

// Bucket deleteAll 删除所有键值对
// test.deleteAll()

// sillyGirl
// const sillyGirl = new SillyGirl()

// sillyGirl session 模拟会话
// var func = sillyGirl.session("name")
// var { message, hasNext } = func()
// console.log(`会话返回消息：%s，是否还有消息：%t`, message, hasNext)

//sillyGirl push 推送消息
// sillyGirl.push({
//     platform: s.getPlatform(),
//     userId: s.getUserId(),
//     content: "滴滴，推送消息～",
// })

// sillyGirl newSender 创建sender，高阶调用
// var s = sillyGirl.newSender({
//     platform: "pgm",
//     user_id: "1837585653",
//     chat_id: -1001583071436,
// })

//request 网络请求
// var {body, headers, status} = request({
//     url:"https://vps.gamehook.top/api/face/my",
//     method:"get",
//     allowredirects: false, //不禁止重定向
// })

// console.log(body)
// console.log(headers)
// console.log(status)