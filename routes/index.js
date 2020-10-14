// import dataService from './service/dataService'

// import dataService from "../service/dataService";
const router = require('koa-router')()
const dataService = require('../service/dataService')
router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    })
})

router.get('/string', async (ctx, next) => {
    ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})


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
    let meetings = await dataService.getMeetingByHostPromise({}).then(resultArr => {
        console.log(resultArr)
        if(resultArr.result != null){
            return resultArr.result.map(obj => {
                return {roomid: obj._id};
            });
        }
    });

    ctx.body = {
        code: 0,
        msg: '获取会议数据成功',
        data: meetings
    }



})


module.exports = router
