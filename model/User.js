const mongoose = require('mongoose');
// 连接mongodb
mongoose.connect('mongodb://localhost/test', {useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!");
});

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    createTime: {type: Date, default: Date.now},
    // username: {
    //     type: String
    // },
    // password: {
    //     type: String
    // }
});

module.exports = mongoose.model("User", UserSchema);
