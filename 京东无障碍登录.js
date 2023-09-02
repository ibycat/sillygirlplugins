/**
 * @version v2.0.8
 * @author eSir
 * @create_at 2022-11-11 15:33:31
 * @title 京东无障碍登录
 * @description 🐶已失效，仅用作展示局部加密用法。
 * @public false
 * @on_start true
 * @disable true
 * @icon https://img10.360buyimg.com/img/jfs/t1/166380/2/31077/11459/6349238bE44ab127b/b941fb6f627e6059.jpg
 */

const crypto = require('CryptoJS');
const appid = 708;
const app_version = '14409378';
const country_code = '86';
const server = require("express")

const jd_cookie = Bucket("jd_cookie")
// const nolan_addr = fmt.sprintf("http://127.0.0.1:%v", Bucket("sillyGirl").get("port", "8080"))
// jd_cookie.set("nolan_addr", nolan_addr)
// jd_cookie.watch("nolan_addr", function () {
//   console.log("京东无障碍登录已阻止篡改ark地址")
//   return { now: nolan_addr }
// })

function getTimestamp() {
  return parseInt(new Date() / 1e3);
}
function hexMd5(str) {
  var hash = ""
  /** Here is hidden scripts 7kOBbPI0NYwgMPfnh6Zpgjk/Bz8SjSx8dHPoh2n1KjsLt+aS8C4iRwMBdMbEudeJSe+GW8+UeqlZjEVojR3G6A== */
  return hash;
}

var getSign = (function (mobile) {
  var sign = ""
  /** Here is hidden scripts dHxvTm5ClpQ+Duqu/OUwPtmbC/igxhj38WBs+NuxZqRHe/6a6KHRZ4j2vAZHt0aRTOln7MKB4pq86g0ktxyLBdqh6TFGLPgR24jlSu9O2VV4QtAbYlEkXz+RURyuG8B+1XCIcokmAB9Fq55adFElKD9J05kO9TpdIjjXl2Yr9XsOIe0LG4KcrGq/TUSIxqDjJjYU6M0Fz2pwvF/Cnt77G0VXTg0tBI1ueK2qaWdAcmc= */
  return sign;
}).bind()


var getGsign = undefined
/** Here is hidden scripts g2FhtC44m1a9/Ps4yJ7v1R7ZHfsAaPMb/Lti8GBMpESfX5U9KVt2XPq7lgfgfOPGH3lIWf5sdjHElkV4pFdOZlqFhE41yko7GeZBuV53240kdwmusl7tnpaZUOKMwSzKDzk/T/srlWutV88YBPsoeYD83qaMC3VPT/uZsWy7j8Gp+XEkYU8JyTVR+c8TF7iTx7mjfa0EJL3KY3PKSAyEdZfExNv8MdVEcsNnqKdiEcLBYH7+EPthrh3+CQ3JT3nt4ju1NXjXhfV6TQD/+Bb5wbxG7Z84AGrXuD4R1dVGpQTpu5EtomhGnRQRFJkkGyy9wO6ar86KpAYwQ7vaCuS6tx17ZKEbE4rtCCrRX9RTphgt4wbeSp/x8WMt5tBBI91WVOZuYKJeybHYooFK5v3qFDAJQnHwKRulkLBeBK6k1jkyiDkYn64Kn3D7Dm55igZbF5kTmZVZ5uGXEOCte1J5KA== */

function init() {
  const headers = {
    Cookie: 'guid=;lsid=;pt_key=;',
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 swan/2.55.0 swan-baiduboxapp/13.17.0.10 baiduboxapp/13.17.0.10 (Baidu; P2 15.5)',
    accept: '*/*',
    'x-turbonet-info': '3.0.1610.175',
    'x-from-h3-trnet': 'true',
    referer:
      'https://smartapps.cn/4VvF29wlVg61mjRYCp4tY5dqkBgOyoYN/2.1.13/page-frame.html',
  };
  const timestamp = getTimestamp();
  const gsign = getGsign(1, timestamp);
  const body = `app_version=14409378&client_ver=1.0.0&return_page=/pages/personal/personal&ts=${timestamp}&sub_cmd=1&sdk_ver=1.0.0&gsign=${gsign}&appid=708`;
  const options = {
    method: 'POST',
    url: 'https://minilogin.m.jd.com/cgi-bin/bdapp/bd',
    headers: headers,
    body: body,
    json: true,
  };
  const res = request(options);
  const { gsalt, guid, lsid } = res.body.data
  return { gsalt, guid, lsid };
}

function getVeriCode(loginInfo) {
  const { gsalt, guid, lsid, mobile } = loginInfo;
  const headers = {
    Cookie: `guid=${guid};lsid=${lsid};pt_key=;`,
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 swan/2.55.0 swan-baiduboxapp/13.17.0.10 baiduboxapp/13.17.0.10 (Baidu; P2 15.5)',
    accept: '*/*',
    'x-turbonet-info': '3.0.1610.175',
    'x-from-h3-trnet': 'true',
    referer:
      'https://smartapps.cn/4VvF29wlVg61mjRYCp4tY5dqkBgOyoYN/2.1.13/page-frame.html',
    'accept-language': 'zh-CN,zh,zh-TW,en-US,en',
  };
  const sign = getSign(mobile);
  const timestamp = getTimestamp();
  const gsign = getGsign(2, timestamp, gsalt);
  const body = `sdk_ver=1.0.0&appid=708&mobile=${mobile}&app_version=14409378&client_ver=1.0.0&gsign=${gsign}&return_page=%2Fpages%2Fpersonal%2Fpersonal&sub_cmd=2&ts=${timestamp}&country_code=86&sign=${sign}`;
  const options = {
    method: 'POST',
    url: 'https://minilogin.m.jd.com/cgi-bin/bdapp/bd',
    headers: headers,
    body: body,
    json: true,
  };
  const res = request(options);
  return res.body
}

function doTelLogin(loginInfo) {
  const { gsalt, guid, lsid, mobile, smscode } = loginInfo;
  const headers = {
    Cookie: `guid=${guid};lsid=${lsid};pt_key=;`,
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 swan/2.55.0 swan-baiduboxapp/13.17.0.10 baiduboxapp/13.17.0.10 (Baidu; P2 15.5)',
    accept: '*/*',
    'x-turbonet-info': '3.0.1610.175',
    'x-from-h3-trnet': 'true',
    referer:
      'https://smartapps.cn/4VvF29wlVg61mjRYCp4tY5dqkBgOyoYN/2.1.13/page-frame.html',
    'accept-language': 'zh-CN,zh,zh-TW,en-US,en',
  };
  const timestamp = getTimestamp();
  const gsign = getGsign(3, timestamp, gsalt);
  const body = `sdk_ver=1.0.0&appid=708&mobile=${mobile}&app_version=14409378&client_ver=1.0.0&gsign=${gsign}&return_page=%2Fpages%2Fpersonal%2Fpersonal&sub_cmd=3&ts=${timestamp}&country_code=86&smscode=${smscode}`;
  const options = {
    method: 'POST',
    url: 'https://minilogin.m.jd.com/cgi-bin/bdapp/bd',
    headers: headers,
    body: body,
    json: true,
  };
  const res = request(options);
  return res.body
}

function is11Num(str) {
  let x = /^[0-9]{11}$/gim;
  if (x.test(str)) {
    return true;
  }
  return false;
}

function is6Num(str) {
  let x = /^[0-9]{6,6}$/gim;
  if (x.test(str)) {
    return true;
  }
  return false;
}

const s = sender

s.listen(["^京东无障碍登录$"], function (s) {
  var main = () => {
    var loginInfo = {}
    s.reply("请输入手机号：")
    s.listen(function (s) {
      var mobile = s.getContent()
      if (mobile == "q") {
        s.reply("已退出。")
        panic()
      }
      if (!is11Num(mobile)) return s.holdOn("请输入正确的手机号！")
      loginInfo = init()
      loginInfo["mobile"] = mobile
    })
    var { err_msg } = getVeriCode(loginInfo)
    if (err_msg) return err_msg + "。"
    s.reply("请输入收到的6位验证码：")
    {
      for (; ;) {
        var r = s.listen(120000, function (s) {
          var smscode = s.getContent()
          if (smscode == "q") {
            s.reply("已退出。")
            panic()
          }
          if (!is6Num(smscode)) return s.holdOn("请输入正确的验证码！")
          loginInfo["smscode"] = smscode
        })
        if (!r) {
          s.reply("超时已退出。")
          panic()
        }
        var { err_msg, data } = doTelLogin(loginInfo)
        if (err_msg) {
          if (err_msg == "验证码输入错误") {
            s.reply(err_msg + "。")
            continue
          }
          return err_msg + "。"
        }
        s.reply(fmt.sprintf("pt_key=%s;pt_pin=%s;", data.pt_key, encodeURI(data.pt_pin)))
        break
      }
    }
  }
  s.reply(main())
})

var Phones = {}

// 请求短信
server.post("/api/SendSMS", function (req, res) {
  const { Phone } = req.json()
  if (!Phone) res.json({ message: "请提供正确的手机号" })
  var loginInfo = init()
  loginInfo["mobile"] = Phone
  var { err_msg } = getVeriCode(loginInfo)
  if (err_msg) res.json({ message: err_msg })
  Phones[Phone] = loginInfo
  res.json({ success: true })
})

// 核对验证码
server.post("/api/VerifyCode", function (req, res) {
  const { Phone, Code } = req.json()
  var loginInfo = Phones[Phone]
  if (!loginInfo) res.json({ message: "请求失败" })
  loginInfo["smscode"] = Code
  var { err_msg, data } = doTelLogin(loginInfo)
  if (err_msg) res.json({ message: err_msg })
  res.json({ success: true, data: { ck: fmt.sprintf("pt_key=%s;pt_pin=%s;", data.pt_key, encodeURI(data.pt_pin)) } })
})