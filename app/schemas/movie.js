var mongoose = require("mongoose");
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var MovieSchema = new Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    pv:{
        type:Number,
        default:0
    },
    category:{
        type:ObjectId,
        ref:'Category'
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//每次存储数据之前调用save的方法
MovieSchema.pre('save', function (next) {
    if (this.isNew) {//如果是新的数据
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

//静态方法不会直接与数据库进行交互，只有通过model编译并且实例化之后才会具有这个方法
MovieSchema.statics = {
    //取出目前数据库的所有数据
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')//排序
            .exec(cb);//回调方法
    },
    //取出目前数据库的单条数据
    findById: function (id,cb) {
        return this
            .findOne({"_id":id})
            .exec(cb);//回调方法
    }
};

module.exports=MovieSchema;