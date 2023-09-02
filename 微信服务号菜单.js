/**
 * @author 猫咪
 * @create_at 2022-09-07 13:32:56
 * @description 🐶微信服务号自动生成菜单，每次修改执行 init wxsv
 * @version v1.0.2
 * @title 微信服务号菜单
 * @platform wxsv sxg
 * @rule wxsv ?
 * @admin true
 * @public false
 * @priority 9999991
 * @icon https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
 */

var s = sender
var key = s.param(1)
var sillyGirl = new SillyGirl()

function main() {
     if (key == "init") {
          s.reply(request({
               url: `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${call("GetWxmpAccessToken")()}`,
               body: JSON.stringify(menu),
               method: "post",
               headers: {
                    "Content-Type": `application/json; encoding=utf-8`,
               },
          }).body)
          return
     } else if (key == "subscribe") {
          // s.reply("Hello，我是送喜官大喵。")
          // s.reply("我可以比价查券、陪聊、玩游戏等等，喵呜喵呜～")
          // s.reply("Hello，我是地表最强AI机器人！\n与我对话需要使用“请”开头、或者“？”结尾，暂不支持上下文模式。")
          s.reply("Hello，我可以全网最优惠寄快递、充话费！")
     } else {
          for (var bt of menu.button) {
               if (bt.key == key) {
                    if (bt.handle) {
                         bt.handle(key)
                    }
                    break
               }
               if (bt.sub_button) {
                    for (var bt2 of bt.sub_button) {
                         if (bt2.key == key) {
                              if (bt2.handle) {
                                   bt2.handle(key)
                              }
                              break
                         }
                    }
               }
          }
     }
}

var menu = {
     button: [
          // {
          //      name: "生活优惠",
          //      sub_button: [
          //           {
          //                name: "话费充值",
          //                type: "view",
          //                url: "http://hf.isourl.cn/#/?vi=5176&appid=16",
          //           },
          //           // {
          //           //      name: "话费95折快充，8小时到账",
          //           //      key: "xxxx",
          //           //      handle: function () {
          //           //           s.reply("请加微信：ufuckee")
          //           //      },
          //           // },
          //      ]
          // },
          {
                         name: "话费充值",
                         type: "view",
                         url: "http://hf.isourl.cn/#/?vi=5176&appid=16",
                    },
          {
               name: "寄快递",
               type: "view",
               url: "https://songxiguan.pyjkd.com/pro/html/mailExpress.html",//
          },
          {
               name: "购物功能",
               sub_button: [

                    {
                         name: "比价查券",
                         key: "bjcq",
                         handle: function () {
                              s.reply("将购物链接或口令发来，我可以比价和查券。\n🐱🐱举个京东链接的🌰子，https://item.m.jd.com/product/10036827134469.html")
                              sleep(1500)
                              s.reply(`
商品名：格力（GREE）折叠踢脚线取暖器家用大面积电暖器智能遥控电暖气片IPX4级防水移动地暖浴室干衣暖风机 NJE-X6020B

最高价：529  
最低价：293  2021-09-10
六一八：356  2021-06-04
双十一：373  2021-11-01
比价结果仅供参考

当前价：529
券后价：459
(低于历史中82.6%的时间段)

去领券：https://u.jd.com/YtEoHod

其他店铺：
399 - 京东第三方格力清力专卖店 https://u.jd.com/YwE94Kq
429 - 京东商城京东智选家电京东自营专区 https://u.jd.com/YIEXiZe`)
                              sleep(1000)
                              s.reply("以上显示的商品历史价格、优惠券和其他平台店铺的价格仅供参考，此外，不是所有商品都有数据。")
                         },
                    },
                    // {
                    //      name: "京东优惠",
                    //      type: "view",
                    //      url: "https://u.jd.com/Yt5Xj31",
                    // },
                    // {
                    //      name: "京东订单",
                    //      type: "view",
                    //      url: "https://wqs.jd.com/order/orderlist_merge.shtml?sceneval=2&jxsid=16371993657104842429&orderType=all&ptag=7155.1.11",
                    // },
                    // {
                    //      name: "话费充值",
                    //      type: "view",
                    //      url: "http://hf.isourl.cn/#/?vi=5176&appid=16",
                    // },
               ],
          },
          // {

          // name: "好玩功能",
          // sub_button: [
          //      {
          //           name: "Chatgpt",
          //           key: "xatx",
          //           handle: function () {
          //                s.reply("提问需要使用“请”开头、或者“？”结尾。")
          //           },
          //      },
          //      {
          //           name: "成语接龙",
          //           key: "cyjl",
          //           handle: function () {
          //                // sillyGirl.newSender({
          //                //      platform: s.getPlatform(),
          //                //      user_id: s.getUserID(),
          //                //      content: "成语接龙",
          //                // })
          //                s.reply("暂不支持")
          //           },
          //      },
          //      {
          //           name: "微博热搜",
          //           key: "wbrs",
          //           handle: function () {
          //                // sillyGirl.newSender({
          //                //      platform: s.getPlatform(),
          //                //      user_id: s.getUserID(),
          //                //      content: "微博热搜",
          //                // })
          //                s.reply("暂不支持")
          //           },
          //      },
          // ],
          // },
          // {
          //      name: "打个招呼",
          //      sub_button: [
          //           {
          //                name: "你好",
          //                key: "hhzt",
          //                handle: function () {
          //                     s.reply("你好，我很好")
          //                },
          //           },
          //      ],
          // },
     ]
}


menu.button.map((v, i) => {
     if (!v.type) {
          v.type = "click"
     }
     if (v.sub_button) {
          v.sub_button.map((k, j) => {
               if (!k.type) {
                    k.type = "click"
               }
               if (k.type == "click" && !k.key) {
                    k.key = `${i}${j}`
               }
               return k
          })
     } else {
          if (!v.key) {
               v.key = `${i}`
          }
     }
     return v
})

main()