const router = require('koa-router')()
const jwt = require("jsonwebtoken");
const config = require("../config");

let User = require("../model/user");

router.prefix('/users')

router.get('/', function (ctx, next) {
    ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
})

// 留意这里的async。1.它可以在这里用。2.用了它，匿名函数内才能使用await。
router.post("/login", async function (ctx, next) {
    let {username, password} = ctx.request.body;
    let result = await User.findOne({username, password}, {username: 1, _id: 1});

    console.log('登录：' + result)

    if (result) {
        let token = jwt.sign(
            {
                username: result.username //payload部分可解密获取，不能放敏感信息
            },
            config.jwtsecret,
            {
                expiresIn: config.expiresIn // 授权时效1天
            }
        );
        ctx.body = {
            msg: "登录成功",
            token,
            userId: result._id,
            username,
        };
    } else {
        ctx.response.status = 401;
        ctx.body = {
            msg: "登录失败",
            token: null,
            userId: '',
            username: '',
        };
    }
});

router.put("/register", async function (ctx, next) {
    // ctx.body = "this is a users/bar response";

    let {username, password} = ctx.request.body;

    let user = await User.findOne({username, password}, {username: 1, _id: 1});
    console.log(user)
    if (user) {
        ctx.body = {
            msg: "该邮箱已经被注册，请更换邮箱",
            token: '',
            userId: '',
            username: '',
        }
        // 必须有return，否则会继续执行
        return
    }

    let result = await new User({username, password}).save();
    console.log('注册：' + result)
    // user.username = ctx.request.body.username;
    // user.password = ctx.request.body.password;
    if (result) {
        let token = jwt.sign(
            {
                username: result.username //payload部分可解密获取，不能放敏感信息
            },
            config.jwtsecret,
            {
                expiresIn: config.expiresIn // 授权时效1天
            }
        );
        ctx.body = {
            msg: "注册成功",
            token,
            userId: result._id,
            username,
        };
    } else {
        ctx.body = {
            msg: "注册失败",
            token: '',
            userId: '',
            username: '',
        };
    }
});


module.exports = router
