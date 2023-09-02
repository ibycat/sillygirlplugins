/**
 * @title 定时任务
 * @on_start true
 * @create_at 2033-09-11 19:14:23
 * @description ⏰定时任务demo，可精确到秒，仅在启动服务中可用。
 * @author 猫咪
 * @version v1.0.1
 * @public false
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/01/%E4%B8%8B%E8%BD%BD-1.jpeg
 */

const cron = require("crontab")

function main() {//
    // console.log(cron.add("* * * * * *", function () {
    //     console.log("hello 1")
    // }))
    // console.log(cron.add("* * * * * *", function () {
    //     console.log("hello 2")
    // }))
    // console.log(cron.add("* * * * * *", function () {
    //     console.log("hello 3")
    // }))
    // console.log(cron.add("* * * * * *", function () {
    //     console.log("hello 4")
    // }))
    const { id } = cron.add("* * * * * *", function () {
        console.log("触发一次后移除定时器%d。", id)
        cron.remove(id)
    })
}

main()


time.sleep(10000)
console.log(running())//////