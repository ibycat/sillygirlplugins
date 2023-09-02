/**
 * @title 数据监听
 * @create_at 2033-09-10 19:14:23
 * @description 🐑数据变化监听demo，通过watch方法实现实时监听数据变化、拦截并修改，仅在启动服务中可用。
 * @author 猫咪
 * @version v1.0.0
 * @on_start true
 * @public false
 * @icon https://api.iowen.cn/favicon/jakearchibald.github.io.png
 */

const test = new Bucket("test")

test.watch("*", function (old, now, key) {
    console.log("旧值: %s 新值: %s 键值: %s", old, now, key)
})

test.watch("time", function () {
    var now = time.now()
    console.log("修正值: %s", now)
    return { now }
})

test.watch("name", function (old, now) {
    console.log(`姓名由 ${old} 变更为 ${now}`)
    return
})

test.set("unix", time.now().unix())
test.set("time", Math.floor(Math.random() * 24))
console.log(test.get("time"))