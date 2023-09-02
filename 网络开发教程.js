/**
 * @author 猫咪
 * @create_at 2022-09-10 07:35:00
 * @description 🐮网络开发demo，基础操作演示，能懂多少看悟性。
 * @version v1.0.1
 * @title 网络开发教程
 * @on_start true
 * @icon https://www.expressjs.com.cn/images/favicon.png
 * @public false
 */

const app = require("express")

//客户查询ip地址
app.get("/myip", (req, res) => {
    res.json({
        data: {
            ip: req.ip(),
        },
        success: true,
    })
});

