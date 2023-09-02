/**
* @author 三藏
* @create_at 2022-09-24 11:30:06
* @description qb下载   使用方式 : /down   /speed  或直接发送磁力给傻妞示例: magnet:?xt=urn:btih:af76f37ff4d9bcc0b3a5e1dbbcd72fa9ea9b303d&dn=107STKO-005%20SOD%20%20.mp4
* @version v1.0.2
* @title qbittorrent
* @platform qq wx tg pgm web
* @rule /down
* @rule /speed
* @rule magnet?
* @priority 100
 * @public false
* @icon https://i.seadn.io/gcs/files/c94e4322ce56aeaf726d0946e33a11a6.gif?auto=format&w=256
* @admin true
*/

/******************账号密码*************************/
const baseURL = 'http://127.0.0.1:5088/api/v2/'    //只需要更换ip和端口
//账号
const username = "admin"
//密码
const passwd = "admin"
//保存路径
const path = '/nas/监听/'
/******************账号密码*************************/
let headers = {}
let data = {};
const s = sender
var msg = s.getContent()
const param = s.param(1)
//初始化
init()
if (msg == "/down") {
    s.reply("开始获取正在下载中的任务")
    down()
}
if (msg == "/speed") {
    s.reply("开始获取正在下载时的速度")
    speed()
}
if (msg.match(/magnet/) != null) {
    magnet()
    console.log("进入下载函数:")
}

function down() {
    const msg = downloading()
    s.reply(msg)
}

function speed() {
    const body = downspeed()
    s.reply(("下载速度: " + body.d_speed + ",上传速度: " + body.u_speed + ",一共" + body.d_count + "个下载任务\n" + "累计下载: " + body.dl_info + ",累计上传: " + body.up_info + ""))
}


function magnet() {
    const magnet = 'magnet' + param
    //任务名称
    const downName = magnet.split("&")[1]
    var json = { "msg": downName == null ? "磁力" : downName.split("dn=")[1] }
    console.log("下载名称:" + downName)
    data = { urls: magnet, autoTMM: false, savepath: path }
    var code = addMagnet(data)
    if (code == 200) {
        s.reply(json.msg + "开始下载!")
    } else[
        s.reply(json.msg + "添加失败!")
    ]
}



/**
* date:2022-06-02
* author: 三藏
*/
//磁力添加需要的依赖
//qbittorrent 端口

/**
 * 添加磁力
 */
function addMagnet(data) {
    var body = request({ url: baseURL + "torrents/add?urls="+data.urls+"&autoTMM=false&"+"savepath="+data.savepath, dataType: "text", headers: headers,method:"get" })
    let res = body//await instance.post("torrents/add", qs.stringify(data))
    console.log("添加磁力响应:" + JSON.stringify(res))
    if (res.status == 200&&res.body.match(/Ok/)) {
        var log = "磁力添加完成"
        return res.status;
    }else{
        res.status=500;
        return res
    }
}

/**
 * header设置cookie
 */
function init() {
    var body = request({ url: baseURL + 'auth/login?username=' + username + '&password=' + passwd, dataType: "json" })
    var ck = body.headers['Set-Cookie'][0].split(";")[0]
    const cookie = ck
    console.log("初始化生成COOKIE : " + cookie)
    headers = { 'Cookie': cookie };
}

/**
 * 下载中的任务
 */
function downloading() {
    var { body } = request({ url: baseURL + "torrents/info?filter=downloading", dataType: "json", headers: headers })
    var data = body
    let msg = []
    let ok = ""
    if (data) {
        for (let i = 0; i < data.length; i++) {
            var dto = {}
            dto["name"] = data[i].name;
            let progess = data[i].progress;
            dto["progess"] = "进度: " + (progess * 100).toString().substring(0, 4) + "%"
            msg.push(dto)
            ok += "" + dto.name + '\n' + dto.progess + '\n';
        }
        if (data.length == 0) {
            ok = "没有下载中的任务!"
        }
    }
    console.log(ok)
    return ok
}

/**
 * 瞬时下载速度
 */
function downspeed() {
    let { body } = request({ url: baseURL + "transfer/info", dataType: "json", headers: headers })
    var data = body
    //console.log("响应参数:"+JSON.stringify(data))
    let msg = {}
    let m = Math.pow(1024, 2)//MB
    let n = m * 1024 //GB
    if (data) {
        let d_speed = data.dl_info_speed / m
        let u_speed = data.up_info_speed / m
        let dl_info = data.dl_info_data / n
        let up_info = data.up_info_data / n
        let d_count = downloading();
        msg["d_speed"] = d_speed.toString().substring(0, 4) + "MB/s"
        msg["u_speed"] = u_speed.toString().substring(0, 4) + "MB/s"
        msg["dl_info"] = dl_info.toString().substring(0, 4) + "GB"
        msg["up_info"] = up_info.toString().substring(0, 4) + "GB"
        msg["d_count"] = d_count.split("%").length - 1;
    }
    return msg
}
