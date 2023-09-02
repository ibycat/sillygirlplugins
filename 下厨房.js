/**
 * @version v1.0.0
 * @create_at 2022-09-08 21:50:45
 * @title 下厨房
 * @rule 菜谱 ?
 * @rule ?怎么做
 * @description 🐔宫爆鸡丁怎么做，一学就废！
 * @author 猫咪
 * @priority 1
 * @icon https://static.meishichina.com/v6/img/zhen/r07.jpg
 * @public false
 */

var s = sender

var options = {
     'method': 'GET',
     'url': "https://www.xiachufang.com/search/?keyword=" + encodeURI(s.param(1)),
     'headers': {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
     },
};

var step = [];
var title = "";

request(options, (error, response, body) => {
     if (error || response.statusCode != 200) {
          return
     }
     var b = body.replace(/\n/g, '');
     var item = b.match(/<p class="name">(.*?)<\/p>/g)[0].match(/href="(.*?)"/)[1]
     var optionD = {
          'method': 'GET',
          'url': 'https://www.xiachufang.com' + item,
          'headers': {
               'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
          },
     }
     var bg = ""
     request(optionD, (error, response) => {
          if (error || response.statusCode != 200) {
               return
          }
          if (a = response.body.match(/url[(](.*?)[)]/)) {
               bg = image(a[1])
          }
          var d = response.body.replace(/\n/g, '');
          var name = d.match(/<h2 id="steps">(.*?)<\/h2>/g)
          title = name[0].split("          ")[1].split("        ")[0].replace("&nbsp;", " ")
          var steps = d.match(/<p class="text" style="">(.*?)<\/p>/g)

          for (i = 0; i < steps.length; i++) {
               step.push(`${i + 1}. ${steps[i].replace('<p class="text" style="">', '').replace('</p>', '')}`.replace("&nbsp;", " ").replace("<br>", "\n"))
          }
          s.reply(bg + title + "\n" + step.join("\n"))
     })
})