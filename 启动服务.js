/**
 * @title 启动服务
 * @on_start true
 * @create_at 2033-09-12 19:14:23
 * @description 🦢启动服务demo，启动时运行脚本，支持express、crontab和listen多任务监听，非常适合用于开发大型插件服务项目。
 * @author 猫咪
 * @version v1.0.1
 * @public false
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/03/barrier1.png
 */

const s = sender

const app = require("express")

function main() {
    app.get("/hello", function (req, res) {
        res.json({ "name": "傻蛋" })
    })

    //监听某东cookie
    // s.listen([
    //     `raw pt_key=([^;=\s]+);\s*pt_pin=([^;=\s]+)`,
    // ], s.routine, function (s) {
    //     return s.holdOn(fmt.sprintf("pt_key=%s;pt_pin=%s", s.get(1), s.get(2)))
    // })

    //监听环境变量
    // s.listen([
    //     `raw export\s+([^"]+)="([^"]+)"`,
    //     `raw task\s+env\s+edit\s+(\S+)\s+(\S+)`,
    //     "export [变量名]=[变量值]",
    // ], s.routine, function (s) {
    //     return s.holdOn(fmt.sprintf("export %s=%s", s.get(1), s.get(2)))
    // })
}

main()