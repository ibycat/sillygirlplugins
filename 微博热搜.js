/**
 * @version v1.0.0
 * @create_at 2022-09-08 21:57:52
 * @title 微博热搜
 * @rule 微博热搜
 * @description 🔥新浪微博实时热搜前十。
 * @icon https://weibo.com/favicon.ico
 * @author 猫咪
 * @priority 1
 * @public false
 */

const s = sender

function main() {
     var options = {
          'method': 'GET',
          'url': 'https://weibo.com/ajax/statuses/hot_band',
          'headers': {
               'authority': 'weibo.com',
               'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
          },
          "json": true,
     };
     request(options, function (error, response, body) {
          if (error || response.statusCode != 200) {
               return
          }
          var hots = [];
          if (!body.data || !body.data.band_list) return
          for (var key in body.data.band_list) {
               if (key == 10) {
                    break
               }
               const item = body.data.band_list[key]
               hots.push(`${+key + 1}. ${item.note}`)
          }
          s.reply(hots.join("\n"))
     });
}
main()