import mongoose from "mongoose";
import { donutSchema } from "./donut.js";

const donutMinimalSchema=new mongoose.Schema({
    fill:String,
    price:Number,
    cover:String,
    imgUrl:String
  
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product: donutMinimalSchema,
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }

}, { timestamps: true })

export const orderModel = mongoose.model('orders', orderSchema);