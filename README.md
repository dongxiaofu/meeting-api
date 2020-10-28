##启动

DEBUG=meeting-api:* npm start

DEBUG=meeting-api:*  nodemon start

引入 jwt 库和配置

cnpm i jsonwebtoken

新建/config/index.js 文件

module.exports = {
  jwtsecret: "wodeJwtsecret_needchangenow", //密码
  expiresIn: 60 * 60 * 24 * 1 //token过期时间 1天
};

修改/routes/users.js，登录成功后制作 token 并返回

cnpm i koa-jwt

JWT的验证机制，在header中带上 authorization：Bearer token

JWT的详细教程，来自：

https://codingyang.com/article_tech/koa.html#%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E6%A8%A1%E5%9D%97

db.survey.update(
  { },
  { $pull: { results: { answers: { $elemMatch: { q: 2, a: { $gte: 8 } } } } } },
  { multi: true }
)


Promise { <pending> }


通过 shell 连接 MongoDB 服务：

mongo
