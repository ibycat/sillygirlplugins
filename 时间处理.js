/**
 * @author cdle
 * @create_at 2022-09-12 17:36:36
 * @description ⏰插件中内置时间相关的方法，理解靠悟性。
 * @version v1.0.0
 * @title 时间处理
 * @rule 时间处理
 * @public false
 * @icon https://hi.kejiwanjia.com/wp-content/uploads/2022/03/1.png
 */

var now = time.now()

console.log(now.string())
console.log(now.unix())
console.log(now.before(time.now().add(time.day)))
console.log(now.after(time.now().add(time.second)))
console.log(now.unixMilli())
console.log(now.format("2006-01-02"))
console.log(now.format("2006-01-02 15:04:05"))

time.sleep(1000)

console.log(time.unix(1662979463))
console.log(time.unixMilli(1662979500379))
console.log(time.parse("2024/12/12", "2006/01/02"))
console.log(time.parse("2024/12/12 10:11:12", "2006/01/02 15:04:05"))
console.log(time.parse("2024/12/12 10:11:12", "2006/01/02 15:04:05", "America/Los_Angeles"))
console.log(time.parse("2024/12/12 10:11:12", "2006/01/02 15:04:05", "Asia/Shanghai"))