/**
 * @version v1.0.0
 * @create_at 2022-09-08 22:09:43
 * @title 疫情数据
 * @rule ^疫情(.*)$
 * @rule ?疫情
 * @cron 10 10 * * *
 * @description 🐒这个人很懒什么都没有留下。
 * @author 佩奇
 * @priority 1
 * @icon http://m.huanghelou.cc/zb_users/upload/2020/03/20200309211151_37765.jpg
 * @public false
 */

var s = sender
var strCode = s.param(1)
var isAdmin = s.isAdmin()
var tianapi_key = (new Bucket("tianapi")).get("key");

if (isAdmin && (strCode == "" || strCode == "推送")) {//定时或管理发起推送
    ncovNews(getTianData(), true)
} else if (/新闻/.test(strCode)) {//返回新闻
    ncovNews(getTianData(), false)
} else if (/风险区域/.test(strCode) || /区域/.test(strCode) || /地区/.test(strCode) || /城市/.test(strCode)) {//返回风险区域
    ncovAreaQuery(getTianData())
} else if (/数据/.test(strCode)) {//返回数据
    ncvoDetail(getTianData())
} else if (/^[\u4e00-\u9fa5]{2,}$/.test(strCode) && strCode != "推送") {//返回指定区域
    ncovSelectAreaQuery(strCode)
} else {
    s.reply("无推送权限，不要捣乱")
}

function getTianData() {
    var data = request({
        url: "http://api.tianapi.com/ncov/index?key=" + tianapi_key, 
        json: true
    }).body
    return data
}

function sendMessage(arrobj) {
    var str = ''
    for (i in arrobj) {
        str += arrobj[i]
    }
    s.reply(str)
}

/**
 * 回复、推送疫情新闻部分
 */

function ncovNews(obj, bool, type) {
    var newslist = ["疫情新闻："];
    var content = "";

    if (obj.code == 200) {
        for (i in obj.newslist) {
            for (j in obj.newslist[i].news) {
                newslist.push(obj.newslist[i].news[j].pubDateStr + "，" + obj.newslist[i].news[j].title)
            }
        }
        content = newslist.join("\n")
    } else {
        content = "疫情新闻数据获取失败Code：" + obj.code
    }
    if (bool) {
        var pushObj = eval('(' + get("ncov") + ')');
        for (i in pushObj) {
            message = pushObj[i]
            message["content"] = content
            push(message)
        }
        s.reply("推送疫情新闻完成。")
    } else {
        sendMessage(content)
    }
}

/**
 * 总数据部分
 */

function ncvoDetail(obj) {
    var newslist = ["当前疫情数据："];
    var content = "";

    if (obj && obj.newslist) {
        for (i in obj.newslist) {
            for (j in obj.newslist[i].desc) {
                newslist.push("现存确诊人数：" + obj.newslist[i].desc.currentConfirmedCount + "\n累计确诊人数：" + obj.newslist[i].desc.confirmedCount + "\n累计境外输入人数：" + obj.newslist[i].desc.suspectedCount + "\n累计治愈人数：" + obj.newslist[i].desc.curedCount + "\n累计死亡人数：" + obj.newslist[i].desc.deadCount + "\n现存无症状人数：" + obj.newslist[i].desc.seriousCount + "\n新增境外输入人数：" + obj.newslist[i].desc.suspectedIncr + "\n相比昨天现存确诊人数：" + obj.newslist[i].desc.currentConfirmedIncr + "\n相比昨天累计确诊人数：" + obj.newslist[i].desc.confirmedIncr + "\n相比昨天新增治愈人数：" + obj.newslist[i].desc.curedIncr + "\n相比昨天新增死亡人数：" + obj.newslist[i].desc.deadIncr + "\n相比昨天现存无症状人数：" + obj.newslist[i].desc.seriousIncr + "\n----疫情小贴士提醒----\n1. " + obj.newslist[i].desc.remark1 + "\n2. " + obj.newslist[i].desc.remark2 + "\n3. " + obj.newslist[i].desc.remark3 + "\n4. " + obj.newslist[i].desc.note1 + "\n5. " + obj.newslist[i].desc.note2 + "\n6. " + obj.newslist[i].desc.note3)
                break;
            }
        }
        content = newslist.join("\n")
    } else {
        content = "当前疫情数据：" + obj
    }
    sendMessage(content)
}

/**
 * 风险区域部分
 */

function ncovAreaQuery(obj) {
    console.log(obj)
    var newslist = ["当前风险区域如下："];
    var secondList = [];
    var content = "";
    var content1 = "";
    var midArr = [];
    var highArr = [];
    var arrNum = 0;

    if (obj && obj.newslist) {
        for (i in obj.newslist) {
            midArr = obj.newslist[i].riskarea.mid
            highArr = obj.newslist[i].riskarea.high
        }
    } else {
        return sendMessage("风险区域数据查询失败");
    }
    newslist.push("中风险区域：");
    if (midArr.length > 70) {
        arrNum = Math.floor(midArr.length / 2);
        for (i in midArr) {
            if ((Number(i) + 1) < arrNum) {
                newslist.push((Number(i) + 1) + ". " + midArr[i])
            } else {
                secondList.push((Number(i) + 1) + ". " + midArr[i])
            }
        }
        content = newslist.join("\n");
        content1 = secondList.join("\n");
        sendMessage(content);
        sleep(1500);
        sendMessage(content1);
    } else {
        for (i in midArr) {
            newslist.push((Number(i) + 1) + ". " + midArr[i])
        }
        content = newslist.join("\n");
        sendMessage(content);
    }
    sleep(1500);
    newslist = ["高风险区域："]
    content = ""

    for (i in highArr) {
        newslist.push((Number(i) + 1) + ". " + highArr[i])
    }
    content = newslist.join("\n");
    sendMessage(content);
}

/**
 * 指定区域查询
 */

function ncovSelectAreaQuery(area) {
    var content = request({
        url: "https://api.iyk0.com/yq/?msg=" + area,
        method: "get",
        json: true
    }, (err, resp) => {
        if (err || resp.statusCode != 200) {
            return
        }
        content = resp.body
        if (content.code == 200) {
            s.reply("查询地区：" + content.查询地区 + "\n目前确诊：" + content.目前确诊 + "\n死亡人数：" + content.死亡人数 + "\n治愈人数：" + content.治愈人数 + "\n新增确诊：" + content.新增确诊 + "\n现存确诊：" + content.现存确诊 + "\n现存无症状：" + content.现存无症状 + "\n更新时间：" + content.time)
        } else {
            s.reply("暂时无法查询到" + area + "的相关疫情数据，Code：" + content.code)
        }
    })
}