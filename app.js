const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// 跨域配置需要放在路由前面才生效。
const cors = require('koa2-cors');
app.use(cors({
    origin: '*', // 允许跨域的地址，我的理解类似白名单，*代表全部允许
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], // 暴露header列表
    maxAge: 5, // 每隔5秒发送预检请求，也就是发送两次请求
    credentials: true, // 允许请求携带cookie
    allowMethods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'], // 请求方式
    allowHeaders: ['Accept', 'Origin', 'Content-type', 'Authorization'],
}))

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
