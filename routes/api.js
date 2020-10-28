const router = require('koa-router')()
router.prefix("/api");

const dataService = require('../service/dataService')


router.get('/list', async (ctx, next) => {
    // let meetings = [
    //     {'roomid': 1},
    //     {'roomid': 2},
    //     {'roomid': 3},
    // ];
    // 来之不易的一个使用mongosee的模板啊
    // 抄别人的，而且还尝试了很多次，多次处于不成功的边缘。
    // 这种复制粘贴的东西，文档好像也没写这么用，那个博客作者是怎么知道要这么用的？
    // 花时间搞这种复粘贴的东西，如果不是为了做出啥有用的东西，毫无学习价值。
    let query = ctx.request.query
    console.log(query)
    let creatorId = ctx.request.query.creatorId
    let meetings = await dataService.getMeetingByHostPromise(creatorId).then(resultArr => {
        console.log(resultArr)
        if (resultArr.result != null) {
            return resultArr.result.map(obj => {
                return {roomid: obj._id, title: obj.title ? obj.title : '会议名称'};
            });
        }
    });

    // 容错怎么处理？
    // if (meetings == null) {
    //     meetings = [];
    // }

    ctx.body = {
        code: 0,
        msg: '获取会议列表数据成功',
        data: meetings
    }
})

// 创建会议
router.post("/create-meeting", async function (ctx, next) {

    let {title, account, creatorId} = ctx.request.body;
    let result = await dataService.createMeetingPromise({title, account, creatorId})
        .then(function (result) {
            return {
                _id: result.result._id,
                title: result.result.title
            }
        });
    // 又一个被坑死的地狱回调
    console.log(result)

    if (result) {
        let meeting = {
            roomid: result._id,
            title: result.title,
        }
        ctx.body = {
            msg: "创建会议成功",
            meeting,
            // result
        };
    } else {
        ctx.response.status = 401;
        ctx.body = {
            msg: "创建会议失败",
            meeting: null
        };
    }
});

module.exports = router;
