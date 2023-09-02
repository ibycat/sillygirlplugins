/**
* @author 猫咪
* @create_at 2022-09-18 15:46:13
* @rule 入群暗号
* @rule 暗号
* @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/01/86448703.jpeg
* @description 🐷获取暗号，配合发言限制。
* @title 获取暗号
* @version v1.0.0
* @platform sxg wxsv web
* @priority 999993
 * @public false
*/

const s = sender

const result = request({
	url: 'http://ovooa.com/API/rao/api.php',
	dataType: 'json'
})

// console.log(result)

// if (result.body.code == 1){
// 	var rqah = new Bucket("入群暗号")
// 	rqah.set(result.body.data.Msg, time.now())
// 	s.reply(result.body.data.Msg)
// } else {
s.reply(`暗号：“天王盖地虎”，请发群里或及时私聊给群主。`)
// }


