import mongoose from "mongoose";

export const donutSchema = new mongoose.Schema({
    fill:String,
    price:Number,
    cover:String,
    imgUrl:String,
    prodDate:{type:Date, default:Date.now},
    expiryDate:{type:Date, default:()=> Date.now() + 7*24*60*60*1000},
    ingredients:[String],

});

export const donutModel = mongoose.model('donuts', donutSchema);//כאן אנחנו מייצאים את הקולקשן של הסופגניות
//הגדרנו כאן גם שמבנה הסופגניה בקולקשן הזה  יהיה לפי הסכמה שהגדרנו למעלה