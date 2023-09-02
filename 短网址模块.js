/**
 * @version v1.0.0
 * @module true
 * @author 猫咪
 * @create_at 2022-09-10 09:03:17
 * @title 短网址模块
 * @description 🐒短网址指令、短网址接口依赖模块，无需手动安装。
 * @icon https://www.dwz.lc/favicon.ico
 * @public false
 */

const dwz = new Bucket("dwz")
const dwz_address = dwz.get("address", "http://127.0.0.1:8080")

function generate(raw) {
  var chars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_".split("")
  var shuffled = chars.slice(0), i = chars.length, min = i - 5, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  var short = shuffled.slice(min).join("")
  dwz.set(short, raw)
  return fmt.sprintf("%s/%s", dwz_address, short)
}

module.exports = {
  generate: generate,
  parse: dwz.get,
}