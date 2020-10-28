const router = require('koa-router')()
const users = require("./users");
router.prefix("/noauth");

const dataService = require('../service/dataService')


router.use(users.routes(), users.allowedMethods());

router.get('/meeting', async (ctx, next) => {
    let query = ctx.request.query
    console.log(query)
    let roomid = ctx.request.query.roomid
    let meeting = await dataService.getMeetingByRoomIdPromise(roomid).then(result => {
        let meeting = result.meeting
        console.log('meeting1 start')
        console.log(meeting)
        console.log('meeting1 end')

        let roomid = ''
        let host = ''
        let title = ''
        let status = 0
        let users = []
        let creatorId = ''
        if (meeting != null) {
            roomid = meeting._id
            host = meeting.host
            title = meeting.title
            status = meeting.status
            users = meeting.users
            creatorId = meeting.creatorId
        }

        return {roomid: roomid, host: host, title: title, status: status, users: users,creatorId:creatorId};
    });
    console.log('meeting start')
    console.log(meeting)
    console.log('meeting end')

    ctx.body = {
        code: 0,
        msg: '获取会议数据成功',
        data: meeting
    }
})

// 创建会议
router.post("/creator-p2p-key", async function (ctx, next) {

    let {_id, creatorP2PKey} = ctx.request.body;
    let result = await dataService.addCreatorP2PKeyPromise({_id, creatorP2PKey});

    if (result) {
        ctx.body = {
            msg: "新增成功",
        };
    } else {
        ctx.response.status = 401;
        ctx.body = {
            msg: "新增失败",
        };
    }
});

// 创建会议
router.post("/other-user-p2p-key", async function (ctx, next) {

    let {_id, otherUserP2PKey} = ctx.request.body;
    let result = await dataService.addOtherUserP2PKeyPromise({_id, otherUserP2PKey});

    if (result) {
        ctx.body = {
            msg: "新增成功",
            result
        };
    } else {
        ctx.response.status = 401;
        ctx.body = {
            msg: "新增失败",
        };
    }
});


//
// router.get('/list', async (ctx, next) => {
//     // let meetings = [
//     //     {'roomid': 1},
//     //     {'roomid': 2},
//     //     {'roomid': 3},
//     // ];
//     // 来之不易的一个使用mongosee的模板啊
//     // 抄别人的，而且还尝试了很多次，多次处于不成功的边缘。
//     // 这种复制粘贴的东西，文档好像也没写这么用，那个博客作者是怎么知道要这么用的？
//     // 花时间搞这种复粘贴的东西，如果不是为了做出啥有用的东西，毫无学习价值。
//     let meetings = await dataService.getMeetingByHostPromise('cg').then(resultArr => {
//         console.log(resultArr)
//         if (resultArr.result != null) {
//             return resultArr.result.map(obj => {
//                 return {roomid: obj._id, title: obj.title ? obj.title : '会议名称'};
//             });
//         }
//     });
//
//     // 容错怎么处理？
//     // if (meetings == null) {
//     //     meetings = [];
//     // }
//
//     ctx.body = {
//         code: 0,
//         msg: '获取会议数据成功',
//         data: meetings
//     }
//
//
// })

module.exports = router;
