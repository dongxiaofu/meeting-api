const mongoose = require('mongoose');
// 连接mongodb
mongoose.connect('mongodb://localhost/test', {useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!");
});

// 数据库操作
const meetingSchema = new mongoose.Schema({
    status: Boolean,       // 会议状态：true：正常；false：已经注销
    host: String,        // 主持人
    users: [{account: String, sockId: String}],           // 参会者
    paint: String,       // 画板内容
    msg: [{user: String, content: String, createTime: {type: Date, default: Date.now()}}], // 聊天记录
    createTime: {type: Date, default: Date.now},
});
// String最多能存储多少个字符？能存储下画板base64后的数据吗？
// 能增量更新msg而不是全量更新msg吗？

const Meeting = mongoose.model('Meeting', meetingSchema);

const dataService = {
    // 查询会议
    getMeetingByHostPromise: function (host) {
        var promise = new Promise(function (resolve, reject) {
            Meeting.find(host, function (err, result) {
                // console.log('会议错误：' + err)
                // console.log('会议结果：' + result)
                // resolve只能传递一个参数
                resolve({err: err, result: result});
                reject({err: err, result: result});
            });
        });
        return promise;
    },
    // 根据ID查询会议
    getMeetingPromise: function (id) {
        var promise = new Promise(function (resolve, reject) {
            Meeting.findById(id, function (err, result) {
                // console.log('会议错误：' + err)
                // console.log('会议结果：' + result)
                // resolve只能传递一个参数
                resolve({err: err, result: result});
                reject({err: err, result: result});
            });
        });
        return promise;
    },
    // 主持人进入房间，创建会议
    createMeetingPromise: function (host) {
        var promise = new Promise(function (resolve) {
            const meeting = new Meeting();
            meeting.host = host.account;
            // meeting.users = [host];
            // 存储数据
            meeting.save(function (err, meeting) {
                console.log('创建会议：' + err);
                console.log(meeting)
                resolve({err: err, result: meeting});
            })
        });
        return promise;
    },

    saveUserMsgPromise: function (id, user, content) {
        var promise = new Promise(function (resolve) {
            Meeting.findOneAndUpdate({_id: id}, {
                $push: {            // 可重复插入
                    msg: {user: user, content: content}
                }
            }, {new: true}, function (err) {
                // console.log('保存聊天记录:' + err);
                resolve({err: err});
            });
        });
        return promise;
    },

    savePaintPromise: function (id, paintContent) {
        var promise = new Promise(function (resolve) {
            Meeting.findOneAndUpdate({_id: id}, {
                $set: {
                    paint: paintContent
                }
            }, {new: true}, function (err) {
                // console.log('保存聊天记录:' + err);
                resolve({err: err});
            });
        });
        return promise;
    },

    addUserPromise: function (id, user, sockId) {
        var promise = new Promise(function (resolve) {
            Meeting.findOneAndUpdate({_id: id}, {
                    $push: {
                        // user: {user: user, sockId: sockId}
                        users: {account: user, sockId: sockId}
                    },
                },
                function (err, res) {
                    // console.log('新增用户错误:' + err)
                    // console.log('新增用户结果:' + res)    // res可以是null
                    resolve({err: err, result: res});
                }
            )
        });
        return promise;
    },

    // addUserPromise: function (userCallback) {
    //     var promise = new Promise(function (resolve) {
    //         Meeting.findOneAndUpdate({_id: id}, {
    //                 $push: {
    //                     user: {user: user, sockId: sockId}
    //                 },
    //             },
    //             function (err, res) {
    //                 // console.log('新增用户错误:' + err)
    //                 // console.log('新增用户结果:' + res)    // res可以是null
    //                 resolve({err: err, result: res});
    //             }
    //         )
    //     });
    //     return promise;
    // },
};

module.exports = dataService;
