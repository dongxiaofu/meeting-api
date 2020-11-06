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

linux 安装 mongodb

yum install libcurl openssl

查看系统版本

[root@VM_0_9_centos www]# uname -a
Linux VM_0_9_centos 3.10.0-862.el7.x86_64 #1 SMP Fri Apr 20 16:44:24 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
[root@VM_0_9_centos www]# cat /etc/redhat-release
CentOS Linux release 7.5.1804 (Core)


不知道怎么用源码安装，菜鸟教程上的与我下载的软包不同。下面的方法行不通。

wget https://fastdl.mongodb.org/src/mongodb-src-r4.4.1.tar.gz

tar -xzvf mongodb-src-r4.4.1.tar.gz

mkdir -vp /data/mongodb/{logs,data}

启动方法在 /usr/lnmp/mongodb-src-r4.4.1/README

/usr/lnmp/mongodb-src-r4.4.1/src

mongo --dbpath /data/mongodb/data --logpath /data/mongodb/logs/mongod.log --fork

下面方法行得通

Create a /etc/yum.repos.d/mongodb-org-4.4.repo file so that you can install MongoDB directly using yum:

[mongodb-org-4.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc

sudo yum install -y mongodb-org

To use a data directory and/or log directory other than the default directories:

Create the new directory or directories.

Edit the configuration file /etc/mongod.conf and modify the following fields accordingly:

storage.dbPath to specify a new data directory path (e.g. /some/data/directory)
systemLog.path to specify a new log file path (e.g. /some/log/directory/mongod.log)
Ensure that the user running MongoDB has access to the directory or directories:

sudo chown -R mongod:mongod <directory>
If you change the user that runs the MongoDB process, you must give the new user access to these directories.


[root@VM_0_9_centos installer]# systemctl status mongod.service
● mongod.service - MongoDB Database Server
   Loaded: loaded (/usr/lib/systemd/system/mongod.service; enabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since 三 2020-10-28 23:11:01 CST; 17s ago
     Docs: https://docs.mongodb.org/manual
  Process: 31616 ExecStart=/usr/bin/mongod $OPTIONS (code=exited, status=1/FAILURE)
  Process: 31614 ExecStartPre=/usr/bin/chmod 0755 /var/run/mongodb (code=exited, status=0/SUCCESS)
  Process: 31612 ExecStartPre=/usr/bin/chown mongod:mongod /var/run/mongodb (code=exited, status=0/SUCCESS)
  Process: 31611 ExecStartPre=/usr/bin/mkdir -p /var/run/mongodb (code=exited, status=0/SUCCESS)

10月 28 23:11:01 VM_0_9_centos systemd[1]: Starting MongoDB Database Server...
10月 28 23:11:01 VM_0_9_centos mongod[31616]: about to fork child process, waiting until server ...ns.
10月 28 23:11:01 VM_0_9_centos mongod[31616]: forked process: 31619
10月 28 23:11:01 VM_0_9_centos systemd[1]: mongod.service: control process exited, code=exited s...s=1
10月 28 23:11:01 VM_0_9_centos systemd[1]: Failed to start MongoDB Database Server.
10月 28 23:11:01 VM_0_9_centos systemd[1]: Unit mongod.service entered failed state.
10月 28 23:11:01 VM_0_9_centos systemd[1]: mongod.service failed.
Hint: Some lines were ellipsized, use -l to show in full.

sudo chown -R mongod:mongod /data/mongodb

[root@VM_0_9_centos installer]# sudo chown -R mongod:mongod /data/mongodb
[root@VM_0_9_centos installer]# sudo systemctl start mongod
[root@VM_0_9_centos installer]# systemctl status mongod.service
● mongod.service - MongoDB Database Server
   Loaded: loaded (/usr/lib/systemd/system/mongod.service; enabled; vendor preset: disabled)
   Active: active (running) since 三 2020-10-28 23:14:06 CST; 4s ago
     Docs: https://docs.mongodb.org/manual
  Process: 32304 ExecStart=/usr/bin/mongod $OPTIONS (code=exited, status=0/SUCCESS)
  Process: 32302 ExecStartPre=/usr/bin/chmod 0755 /var/run/mongodb (code=exited, status=0/SUCCESS)
  Process: 32300 ExecStartPre=/usr/bin/chown mongod:mongod /var/run/mongodb (code=exited, status=0/SUCCESS)
  Process: 32299 ExecStartPre=/usr/bin/mkdir -p /var/run/mongodb (code=exited, status=0/SUCCESS)
 Main PID: 32307 (mongod)
   CGroup: /system.slice/mongod.service
           └─32307 /usr/bin/mongod -f /etc/mongod.conf

10月 28 23:14:04 VM_0_9_centos systemd[1]: Starting MongoDB Database Server...
10月 28 23:14:04 VM_0_9_centos mongod[32304]: about to fork child process, waiting until server ...ns.
10月 28 23:14:04 VM_0_9_centos mongod[32304]: forked process: 32307
10月 28 23:14:06 VM_0_9_centos systemd[1]: Started MongoDB Database Server.
Hint: Some lines were ellipsized, use -l to show in full.

线上部署问题
==================

使用cnpm install 出现error，删除 node_module后，使用npm install，正常。

npm start出现问题
====================================

线上出现下面的问题，本地无问题。

internal/modules/cjs/loader.js:883
  throw err;
  ^

Error: Cannot find module './routes/noAuth'
Require stack:
- /home/cg/meeting-api/app.js
- /home/cg/meeting-api/bin/www
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:880:15)
    at Function.Module._load (internal/modules/cjs/loader.js:725:27)
    at Module.require (internal/modules/cjs/loader.js:952:19)
    at require (internal/modules/cjs/helpers.js:88:18)
    at Object.<anonymous> (/home/cg/meeting-api/app.js:20:16)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Module.require (internal/modules/cjs/loader.js:952:19)
    at require (internal/modules/cjs/helpers.js:88:18)
    at Object.<anonymous> (/home/cg/meeting-api/bin/www:7:11)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '/home/cg/meeting-api/app.js', '/home/cg/meeting-api/bin/www' ]
}

jsonwebtoken 缺少
=====================
internal/modules/cjs/loader.js:883
  throw err;
  ^

Error: Cannot find module 'jsonwebtoken'
Require stack:
- /home/cg/meeting-api/routes/users.js
- /home/cg/meeting-api/routes/noauth.js
- /home/cg/meeting-api/app.js
- /home/cg/meeting-api/bin/www

npm install jsonwebtoken --save

Cannot find module '../model/user'
==========================================

internal/modules/cjs/loader.js:883
  throw err;
  ^

Error: Cannot find module '../model/user'
Require stack:
- /home/cg/meeting-api/routes/users.js
- /home/cg/meeting-api/routes/noauth.js
- /home/cg/meeting-api/app.js
- /home/cg/meeting-api/bin/www

将 ../model/user 改为 model/User

Cannot find module 'mongoose'
==========================================

internal/modules/cjs/loader.js:883
  throw err;
  ^

Error: Cannot find module 'mongoose'
Require stack:
- /home/cg/meeting-api/model/User.js
- /home/cg/meeting-api/routes/users.js
- /home/cg/meeting-api/routes/noauth.js
- /home/cg/meeting-api/app.js
- /home/cg/meeting-api/bin/www

解决：npm install mongoose --save

还有几个类似问题，使用npm install 安装缺少的模块。

