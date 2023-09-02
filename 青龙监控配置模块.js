/**
 * @title 青龙监控配置模块
 * @module true
 * @create_at 2022-12-13 14:45:28
 * @description 🐉自动生成，也可由用户任意修改，开发中。
 * @author 无耻老贼
 * @version v1.0.0
 * @public false
 * @icon https://sns-avatar-qc.xhscdn.com/avatar/62c4fd7b5b51e3cae4a5859c.jpg?imageView2/1/w/540/format/jpg
 */

//青龙监控任务
const tasks = () => {
    return [
        {
            "UUID": "9f75e98b-bb03-11ec-bb72-52540066b468",//自动生成，但自动生成后请不要再修改
            "Name": "吃瓜", //任务名称
            "Keyword": "jd_opencard_pll.js",//脚本关键词，只运行包含此关键词的唯一脚本
            "Envs": ["jd_wxCollectionActivity_activityUrl"],//监控的变量名称，可以指定多个
            "Disable": false,//禁用状态
            "Clients": ["ss1P-S8KocAT"],//客户端，默认全部
            "Interval": 10,//限制该任务间隔运行时间，单位秒
            "MaxRuntime": 600,//限制该任务最大运行时间，单位秒
            "Mode": false,//模式 false 先进后出 true 先进先出
        },
    ]
}

module.exports = {
    tasks: tasks,
}