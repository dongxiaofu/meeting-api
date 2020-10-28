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
    title: String,       // 会议名称
    creatorId: String,   // 会议创建者ID
    status: {type: Boolean, default: false},       // 会议状态：true：正常；false：已经注销
    host: String,        // 主持人
    users: [{account: String, sockId: String}],           // 参会者
    creatorP2PKey: [],      // 创建者P2P 的key
    otherUserP2PKey: [],    // 其他创建者的key
    paint: String,       // 画板内容
    msg: [{user: String, content: String, createTime: {type: Date, default: Date.now()}}], // 聊天记录
    createTime: {type: Date, default: Date.now},
});
// String最多能存储多少个字符？能存储下画板base64后的数据吗？
// 能增量更新msg而不是全量更新msg吗？

const Meeting = mongoose.model('Meeting', meetingSchema);

const dataService = {
    // 查询会议
    getMeetingByHostPromise: function (creatorId) {
        // await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();
        var promise = new Promise(function (resolve, reject) {
            Meeting.find({creatorId: creatorId}, function (err, result) {
                // console.log('会议错误：' + err)
                console.log('会议结果：' + result + ',  creatorId=' + creatorId)
                // resolve只能传递一个参数
                resolve({err: err, result: result});
                reject({err: err, result: result});
            }).limit(5).sort({'createTime': -1});
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
            meeting.title = host.title;
            meeting.host = host.account;
            meeting.creatorId = host.creatorId
            // meeting.users = [host];
            // 存储数据
            meeting.save(function (err, meeting) {
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

    // 查询会议
    getMeetingByRoomIdPromise: function (roomid) {
        var promise = new Promise(function (resolve) {
            Meeting.findById(roomid, function (err, meeting) {
                // console.log('会议错误：' + err)
                console.log('会议结果：' + meeting + ',  roomid=' + roomid)
                // resolve只能传递一个参数
                resolve({err: err, meeting: meeting});
            });
        });
        return promise;
    },

    // 增加创建者P2PKey
    addCreatorP2PKeyPromise: function ({_id, creatorP2PKey}) {
        console.log('addCreatorP2PKeyPromise--id=' + _id + ',creatorP2PKey=' + creatorP2PKey)
        var promise = new Promise(function (resolve) {
            Meeting.findOneAndUpdate({_id: _id}, {
                    $push: {
                        // user: {user: user, sockId: sockId}
                        creatorP2PKey: creatorP2PKey
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

    // 增加非创建者P2PKey
    // 赋值时，参数的key必须与此处定义一致
    addOtherUserP2PKeyPromise: function ({_id, otherUserP2PKey}) {
        // 注意这种写法，可以在直接使用对象参数的成员属性名，而不是必须使用obj.key
        console.log('addOtherUserP2PKeyPromise--id=' + _id + ',otherUserP2PKey=' + otherUserP2PKey)
        var promise = new Promise(function (resolve) {
            Meeting.findOneAndUpdate({_id: _id}, {
                    $push: {
                        otherUserP2PKey: otherUserP2PKey
                    },
                },
                function (err, res) {
                    resolve({err: err, result: res});
                }
            )
        });
        return promise;
    },

    // 清空创建者P2PKey
    clearCreatorP2PKeyPromise: function (id) {
        var promise = new Promise(function (resolve) {
            Meeting.findOneAndUpdate({_id: id}, {
                    $set: {
                        creatorP2PKey: new Array()
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

    // 清空非创建者P2PKey
    clearOtherUserP2PKeyPromise: function (id) {
        var promise = new Promise(function (resolve) {
            Meeting.findOneAndUpdate({_id: id}, {
                    $set: {
                        otherUserP2PKey: new Array()
                    },
                },
                function (err, res) {
                    resolve({err: err, result: res});
                }
            )
        });
        return promise;
    },


};

module.exports = dataService;
