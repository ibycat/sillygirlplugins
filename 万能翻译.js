/**
 * @author 猫咪
 * @version v1.0.0
 * @rule 翻译 ?
 * @rule 翻译?
 * @create_at 2022-09-08 07:19:58
 * @title 万能翻译
 * @description 🐒这个人很懒什么都没有留下。
 * @public false
 */

const s = sender
const { body } = request("http://hm.suol.cc/API/fy.php?msg=" + encodeURI(s.param(1)))
console.log(body)
const id = s.reply(body + "\n(结果将在10秒后撤回。)")
sleep(10000)
s.recallMessage([id, s.getMessageId()])