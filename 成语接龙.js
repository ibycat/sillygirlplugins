/**
 * @author 猫咪
 * @create_at 2022-10-13 07:40:07
 * @on_start true
 * @title 成语接龙
 * @description 🐔成语接龙游戏高级版，支持同音不同字。
 * @version v2.0.2
 * @public false
 * @icon https://img.seadn.io/files/f7a77cb2bc52b4c05e099ae374592ecc.png
 */


var s = sender
const cydb = new Bucket("成语大全")

function main() {
    if (cydb.len() < 20000) {
        console.log("正在下载词库，请耐心等待...")
        try {
            const { success, message } = require("成语大全").install()
            if (success) {
                console.log("安装成功：" + message)
            } else {
                console.log("安装失败：" + message)
                return
            }
        } catch (e) {
            console.log("安装失败：" + message)
            return
        }
    }
    var cydata = undefined
    var cys
    s.listen(["成语接龙"], function (s) {
        if (cydata == undefined) {
            cydata = cydb.getAll()
            cys = Object.keys(cydata)
        }
        var current = {}
        var solutions = []
        var game = (youcy) => {
            var data = { over: false, right: true, iscy: true, youwin: false }
            var mycy = ""
            if (youcy) {
                var detail = cydata[youcy]
                if (!detail) {
                    data.iscy = false
                    data.right = false
                    return data
                }
                if (solutions.indexOf(youcy) == -1) {
                    data.right = false
                    return data
                }
                const { spell, content, derivation } = JSON.parse(detail)
                data.youdetail = `【成语】${youcy}\n【拼音】${spell}\n【释义】${content}${derivation ? `\n【出处】${derivation}` : ""}`
                var ss = []
                var [_, _, back] = /"spell":"([^"\s]+) [^"]* ([^"\s]+)"/.exec(detail)
                for (var cy of cys) {
                    if (cydata[cy].indexOf(`"${back} `) != -1) {
                        ss.push(cy)
                    }
                }
                if (ss.length == 0) {
                    data.over = true
                    data.youwin = true
                    return data
                }
                var fword = /([一-龥])/.exec(youcy)[1]
                var temp = []
                for (var solution of ss) {
                    if (solution.indexOf(fword) != -1) {
                        temp.push(solution)
                    }
                }
                if (temp.length != 0) {
                    ss = temp
                }
                data.solution = shuffle(ss)[0]
                mycy = data.solution
            } else {
                mycy = shuffle(cys)[0]
            }
            var detail = cydata[mycy]
            const { spell, content, derivation } = JSON.parse(detail)
            data.mydetail = `【成语】${mycy}\n【拼音】${spell}\n【释义】${content}${derivation ? `【出处】${derivation}` : ""}`
            solutions = []
            var [_, _, back] = /"spell":"([^"\s]+) [^"]* ([^"\s]+)"/.exec(detail)
            for (var cy of cys) {
                if (cydata[cy].indexOf(`"${back} `) != -1) {
                    solutions.push(cy)
                }
            }
            var bword = /([一-龥])$/.exec(mycy)[1]
            current = { back, bword, mycy }
            if (solutions.length == 0) {
                data.over = true
                return data
            }
            return data
        }
        var { over, mydetail } = game()
        s.reply(`允许同音不同字。中途可“提示”、“跳过”和“退出”。\n我先来\n-------\n${mydetail}`)
        if (over) return s.holdOn("不好意思无解，我赢了！")
        var uid = s.getUserId()
        s.listen(function (s) {
            var ct = s.getContent()
            var master = s.getUserId() == uid
            switch (ct) {
                case "退出":
                    if (master || s.isAdmin()) {
                        return "已退出成语接龙，就这😒。"
                    } else {
                        s.continue()
                        return s.holdOn("你只有答对上一题或者这一题才可以退出哦~")
                    }
                case "成语接龙":
                    return s.holdOn(`现在是接成语【${current.mycy}】呢。`)
                case "提示":
                    return s.holdOn(shuffle(shuffle(solutions)[0].match(/[一-龥]/g)).join(""))
                case "跳过":
                    var { over, right, mydetail, youdetail, youwin } = game(shuffle(solutions)[0])
                    if (over) return youwin ? `${youdetail}\n-------\n呵呵，我自杀，你赢了😒。` : `${youdetail}\n-------\n不好意思绝杀，我赢了😄。`
                    return s.holdOn(`${youdetail}\n-------\n${mydetail}`)
            }
            var { over, right, mydetail, youdetail, iscy } = game(ct)
            if (!iscy) {
                if (master) {
                    return s.holdOn(`你这不是一个成语呀~`)
                } else {
                    s.continue()
                    return s.holdOn()
                }
            }
            if (!right) return s.holdOn(`现在是接首字发音是“${current.back}”的成语呢。`)
            if (over) return youwin ? `${youdetail}\n-------\n好吧，你赢了，我接不上了，嘤嘤嘤~。` : `${youdetail}\n-------\n不好意思绝杀，我赢了😄。`
            uid = s.getUserId()
            return s.holdOn(`${youdetail}\n-------\n${mydetail}`)
        })
        return
    })
}

function shuffle(array) {
    var j, x, i;
    for (i = array.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
    return array;
}

main()