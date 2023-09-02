/**
 * @author 猫咪
 * @version v1.0.1
 * @create_at 2022-09-07 21:26:55
 * @description 🐒这个人很懒什么都没有留下。
 * @title 京粉查询
 * @rule ^-?jingfen$
 * @priority 100
 * @public false
 * @admin true
 * @icon https://imgsa.baidu.com/forum/pic/item/cf1b9d16fdfaaf5165215b51875494eef11f7a1a.jpg
 */



s = sender
otto = new Bucket("otto")

function getNowFormatDate() {
     let date = new Date(),
          seperator1 = '-',
          year = date.getFullYear(),
          month = date.getMonth() + 1,
          strDate = date.getDate()
     if (month >= 1 && month <= 9) month = '0' + month
     if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate

     let currentdate = year + seperator1 + month + seperator1 + strDate
     return currentdate
}

function main() {
     var date = getNowFormatDate()
     var jd_pt_pin = otto.get("jd_pt_pin")
     var jd_pt_key = call("getJdPtKey")(jd_pt_pin)
     if (!jd_pt_key) {
          s.recallMessage(s.reply("找不到账号信息，无法进行查询京粉数据。"))
          otto.set("jd_pt_pin", "")
          return
     }
     // if (s.getPlatform() == "pgm") {
     //      s.recallMessage(s.reply("该我装逼啦！"))
     // }
     var cookie = `pt_key=${jd_pt_key};pt_pin=${jd_pt_pin};`
     var options = {
          'method': 'GET',
          'url': `https://api.m.jd.com/api?appid=unionpc&body={"funName":"querySpreadEffectData","param":{"startDate":"${date}","endDate":"${date}","mediaId":"","proCont":"","promotionId":"","sourceEmt":"","pageNo":1,"pageSize":20}}&functionId=union_report&loginType=2`,
          'headers': {
               'authority': 'api.m.jd.com',
               'origin': 'https://union.jd.com',
               'referer': 'https://union.jd.com/',
               'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
               'cookie': cookie,
          },
          "json": true,
     };
     s.recallMessage(s.getMessageId())
     request(options, function (error, response) {
          if (error) return
          sum = response.body.result.spreadReportInfoSum
          if (sum) {
               var id2 = 0
               id = s.reply(`京粉数据(今日)：预估收入：${sum.cosFee}元，有效订单金额：${sum.cosPrice}元，有效订单量：${sum.orderNum}，点击量：${sum.clickNum}。`)
               if (s.getPlatform() == "pgm") {
                    id2 = s.reply(`这群韭菜的消费能力真差！`)
               }

               sleep(25000)
               s.recallMessage(id)
               if (id2) {
                    s.recallMessage(id2)
               }
          }
     });
}

main()