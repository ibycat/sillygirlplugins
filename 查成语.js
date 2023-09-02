/**
 * @title 查成语
 * @rule 查成语 [成语]
 * @version v1.0.0
 * @create_at 2022-09-22 16:38:13
 * @description 🐶查成语工具，支持三万多成语。
 * @author 猫咪
 * @icon https://img.seadn.io/files/f7a77cb2bc52b4c05e099ae374592ecc.png
 * @public false
 */

const s = sender
const cydb = new Bucket("成语大全")

function main() {
    if (cydb.len() < 20000) {
        s.reply("正在下载词库，请耐心等待...")
        try {
            const { success, message } = require("成语大全").install()
            if (success) {
                s.reply("安装成功：" + message)
            } else {
                return "安装失败：" + message
            }
        } catch (e) {
            return "安装失败：" + message
        }
    }
    var cy = s.param("成语")
    var detail = cydb.get(cy)
    if (!detail) return "找不到这个成语~"
    const { spell, content, derivation, samples } = JSON.parse(detail)
    return (`【成语】${cy}\n【拼音】${spell}\n【释义】${content}${derivation ? `\n【出处】${derivation}` : ""}${samples ? `\n【例子】${samples}` : ""}`)
}

s.reply(main())