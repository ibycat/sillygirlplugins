/**
 * @title 南方电网
 * @rule 南方电网
 * @create_at 2022-11-09 13:53:35
 * @description ⚡️自用，需要设置param：set nfdw param ?
 * @author 猫咪
 * @version v1.0.0
 * @icon https://95598.csg.cn/favicon.ico
 * @admin true
 * @public false
 * @encrypt false
 */

const s = sender
const nfdw = new Bucket("nfdw")

function main() {
  var token = nfdw.get("token")
  var bindingId = nfdw.get("bindingId")
  var areaCode = nfdw.get("areaCode")
  var lines = []
  // if (!token || !bindingId || !areaCode) {
  var options = {
    'method': 'POST',
    'url': 'https://95598.csg.cn/ucs/ma/wt/center/login',
    'headers': {
      'Content-Type': 'application/json',
      'Origin': 'https://95598.csg.cn',
      'Referer': 'https://95598.csg.cn/',
      'need-crypto': 'true',
    },
    body: JSON.stringify({
      "param": nfdw.get("param")
    })
  };
  const { headers } = request(options)
  if (!headers["X-Auth-Token"]) {
    return JSON.stringify(body)
  }
  token = headers["X-Auth-Token"][0]
  nfdw.set("token", token)
  // }

  // if (!bindingId || !areaCode) {//请确认绑定id是否正确 您的账户已在别处登录，请重新登录并确认账户是否安全
  var { body } = request({
    'method': 'POST',
    'url': 'https://95598.csg.cn/ucs/ma/wt/eleCustNumber/queryBindEleUsers',
    'headers': {
      'Origin': 'https://95598.csg.cn',
      'Referer': 'https://95598.csg.cn/',
      'x-auth-token': token
    },
    'json': true,
  });
  if (body.sta != "00") {
    return JSON.stringify(body)
  }
  bindingId = body.data[0].bindingId
  areaCode = body.data[0].areaCode
  nfdw.set("bindingId", bindingId)
  nfdw.set("areaCode", areaCode)
  // }

  var year = time.now().format("2006")
  var month = time.now().format("01")
  var { body } = request({
    'method': 'POST',
    'url': 'https://95598.csg.cn/ucs/ma/wt/charge/queryDayElectricByMPoint',
    'headers': {
      'Content-Type': 'application/json',
      'Cookie': 'Hm_lvt_be2ce6a3305f3147c54404c72613747d=1667694352; 10=10; token=1ff6dca2-a9a6-4c89-ab97-0fafd689d98d; is-login=true; AlteonP=B77OAD6lWgrUOL0I2z3/Dg$$; AlteonP=AiMIJT6lWgpre2xbljXsVw$$',
      'Origin': 'https://95598.csg.cn',
      'Referer': 'https://95598.csg.cn/',
      'x-auth-token': token,
    },
    body: JSON.stringify({
      "areaCode": areaCode,
      "eleCustId": bindingId,
      "yearMonth": year + month,
      "meteringPointId": ""
    }),
    'json': true,
  })
  if (body.sta == "00") {
    lines.push(fmt.sprintf("本月用电：%v千瓦时", body.data.totalPower))
    if (body.data.result.length) {
      lines.push(fmt.sprintf("昨日用电：%v千瓦时", body.data.result[body.data.result.length - 1].power))
    }
  } else {
    s.reply(JSON.stringify(body))
  }
  if (month == "01") {
    year = +year - 1
    month = "12"
  } else {
    month = +month - 1
    if (month < 10) {
      month = "0" + month
    }
  }
  var { body } = request({
    'method': 'POST',
    'url': 'https://95598.csg.cn/ucs/ma/wt/charge/queryDayElectricByMPoint',
    'headers': {
      'Content-Type': 'application/json',
      'Cookie': 'Hm_lvt_be2ce6a3305f3147c54404c72613747d=1667694352; 10=10; token=1ff6dca2-a9a6-4c89-ab97-0fafd689d98d; is-login=true; AlteonP=B77OAD6lWgrUOL0I2z3/Dg$$; AlteonP=AiMIJT6lWgpre2xbljXsVw$$',
      'Origin': 'https://95598.csg.cn',
      'Referer': 'https://95598.csg.cn/',
      'x-auth-token': token,
    },
    body: JSON.stringify({
      "areaCode": areaCode,
      "eleCustId": bindingId,
      "yearMonth": year + month,
      "meteringPointId": ""
    }),
    'json': true,
  })
  if (body.sta == "00") {
    lines.push(fmt.sprintf("上月用电：%v千瓦时", body.data.totalPower))
  } else {
    s.reply(JSON.stringify(body))
  }
  body = request({
    'method': 'POST',
    'url': 'https://95598.csg.cn/ucs/ma/wt/charge/queryUserAccountNumberSurplus',
    'headers': {
      'Content-Type': 'application/json',
      'Origin': 'https://95598.csg.cn',
      'Referer': 'https://95598.csg.cn/',
      'x-auth-token': token,
      'Cookie': 'AlteonP=AiMIJT6lWgpre2xbljXsVw$$'
    },
    body: {
      "areaCode": areaCode,
      "eleCustId": bindingId
    },
    'json': true,
  }).body
  if (body.sta == "00") {
    lines.push(fmt.sprintf("电费余额：%s元", body.data[0].balance))
  } else {
    s.reply(JSON.stringify(body))
  }
  s.reply(lines.join("\n"))
}

s.reply(main())