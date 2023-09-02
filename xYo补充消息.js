/**
* @author 哈尼
* @version v1.0.0
* @create_at 2022-09-08 15:21:15
* @description 直接请求xYo调用VLW的方法，以实现更加丰富的功能。
* @version v1.0.0
* @title xYo补充消息
* @module true
 * @public false
* @icon https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.soutu123.com%2Felement_origin_min_pic%2F16%2F07%2F29%2F14579afe1313036.jpg%21%2Ffw%2F700%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue&refer=http%3A%2F%2Fpic.soutu123.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665299150&t=2beaeaeb1d4ca9b81bcbdc658399eb24
*/

module.exports = {
    send_link: send_link,
    send_music: send_music
}
const s = sender
var username = s.getUsername()
var chatid = s.getChatId()
if (chatid == 0) {
    var userID = s.getUserId()
} else {
    var userID = chatid + "@chatroom"
}
var headers = {
    "Name": "Http",
    "Ver": "1.1.9",
    "Udid": "04354D56BA10C82728991556F8671AEC",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36(KHTML, like Gecko) Chrome / 50.0.2661.87 Safari / 537.36",
}
console.log(userID)
function send_link(title, content, open_url, logo_url) {
    /*
    发送链接
    :param robot_id: 机器人id
    :param to_id: 个人/群id
    :param title: 链接标题
    :param content: 内容简介
    :param open_url: 跳转的地址
    :param logo_url: logo 地址
    :return: 发送结果
    */
    console.log("微信模块的测试返回！")
    console.log(logo_url)
    var fs = {
        'event': 'SendLinkMsg',
        'robot_wxid': "wxid_jtpux2fmgch222",
        'to_wxid': userID,
        'msg': {
            'title': title,
            'text': content,
            'target_url': open_url,
            'pic_url': logo_url,
            'icon_url': logo_url,
        }
    }
    var fs = JSON.stringify(fs)
    return send(fs)
}
function send_music(name, type, singer, home, url) {
    /*
    发送自定义音乐
    :param robot_id: 机器人id
    :param to_id: 个人/群id
    :param music_name: 音乐名
    :param singer: 作者
    :param home: 来源
    :param url: 音乐地址
    :param type: 一个类型定义测试定义0/1/2/3/"qq"/"wyy"/"kg"都是没什么效果区别
    :return: 发送结果
    */
    console.log("微信模块的测试返回！")
    var fs = {
        'event': 'SendDiyMusicMsg',
        'robot_wxid': "wxid_jtpux2fmgch222",
        'to_wxid': userID,
        'msg': {
            'music_name': name,
            "singer": singer,
            "home": home,
            "url": url,
            'type': type,
        }
    }
    var fs = JSON.stringify(fs)
    return send(fs)
}
function send(fs) {
    //发送到可爱猫接口
    var data = request({
        url: "ihttp地址",
        body: fs,
        headers: headers,
        method: "post",
        dataType: "text",
    }).body
    console.log(data)
}