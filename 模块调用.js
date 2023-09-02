/**
 * @version v1.0.0
 * @rule 模块调用
 * @create_at 2022-09-09 13:38:45
 * @title 模块调用
 * @description 🌰调用模块功能测试，安装后发送指令模块调用即可体验。
 * @author 猫咪
 * @public false
 * @icon https://thirdqq.qlogo.cn/g?b=oidb&k=p7pXf5uN6oUatwWmQviccYQ&s=100&t=1629797831
 */

const s = sender

const utils = require("脚本模块")

s.reply(`${utils.name}，调用成功！！！`)
