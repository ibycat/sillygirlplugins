/**
 * @title 成语大全
 * @module true
 * @create_at 2022-09-22 16:38:13
 * @description 👋安装3.0934万个成语到本地，会被成语接龙、猜成语和查成语自动调用。词典约占用硬盘8m空间，删除词库指令：empty 成语大全
 * @author 猫咪
 * @icon https://img.seadn.io/files/f7a77cb2bc52b4c05e099ae374592ecc.png
 * @version v1.0.0
 * @encrypt false
 * @public false
 */
var cydb = new Bucket("成语大全")

module.exports = {
    install: function () {
        const { body } = request("https://gitlab.com/cdle/cy/-/raw/main/README.md")
        if (!body) {
            return {
                success: false,
                message: "下载请求失败！"
            }
        }
        const lines = body.split("\n")
        if (lines.length != 31852) {
            return {
                success: false,
                message: "下载资源失败！"
            }
        }
        var i = 0
        for (var line of lines) {
            if (!line) continue
            try {
                var [name, spell, content, derivation, samples] = JSON.parse(line)
                cydb.set(name, JSON.stringify({
                    spell,
                    content,
                    derivation,
                    samples,
                }))
                i++
            } catch (e) { }
        }
        return {
            success: true,
            message: `已写入${i}条成语数据。`,
        }
    }
}