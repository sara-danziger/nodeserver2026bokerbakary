/*
שליפת כל ההזמנות
הוספת הזמנה
ביטול הזמנה
עדכון סטטוס הזמנה
שליפת הזמנה לפי קוד
שליפת הזמנה לפי משתמש
*/
import { donutModel } from '../models/donut.js';
import  { orderModel } from '../models/order.js';
import { userModel } from '../models/user.js';

export async function getOrders(req, res) {
    try {
        let result = await orderModel.find()
        return res.json(result)
    }
    catch (x) {
        return res.status(500).json({ title: "Error retrieving orders", message: x.message })
    }

}

export async function addOrder(req, res) {

    let { userId, productId, quantity } = req.body
    if (!userId || !productId || !quantity)
        return res.status(400).json({ title: "missing data", message: "userId, productId, quantity are required" })
    if (quantity <= 0)
        return res.status(400).json({ title: "invalid quantity", message: "quantity must be greater than zero" })
    try {
        let user = await userModel.findById(userId)
        if (!user)
            return res.status(404).json({ title: "invalid user", message: "user not found" })
        let product = await donutModel.findById(productId)
        if (!product)
            return res.status(404).json({ title: "invalid product", message: "product not found" })
        let productMinimal = { _id:product._id,fill: product.fill, price: product.price, cover: product.cover, imgUrl: product.imgUrl }
        let newOrder = new orderModel({ userId, product: productMinimal, quantity })
        await newOrder.save()
        return res.status(201).json(newOrder)


    }
    catch (x) {
        return res.status(500).json({ title: "Error adding order", message: x })
    }

}
export async function cancelOrder(req, res) {
    let orderId = req.params.id
    try {
        let order = await orderModel.findById(orderId)
        if (!order)
            return res.status(404).json({ title: "invalid order", message: "order not found" })
        //mongoose אפשר לעדכן ב- 2 שיטות או לשנות כאן ואז לעשות שמירה
        //או להתשמש בfind and Update_ זהו עדכון ישיר במסד הנתנוים

        if (order.status !== 'pending')
            return res.status(400).json({ title: "cannot cancel order", message: "only pending orders can be cancelled" })
        order.status = 'cancelled'
        await order.save()
        return res.json(order)
    }
    catch (x) {
        return res.status(500).json({ title: "Error cancelling order", message: x })
    }
}

export async function updateOrderStatus(req, res) {

    let orderId = req.params.id
    let { status } = req.body;
    if (!status || !['shipped', 'delivered', 'cancelled'].includes(status))
        return res.status(400).json({ title: "invalid status", message: "status must be one of shipped, delivered, cancelled" })
    try {
        let order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ title: "invalid order", message: "order not found" })
        }
        if (status === 'cancelled' && order.status !== 'pending') {
            return res.status(400).json({ title: "cannot cancel order", message: "only pending orders can be cancelled" })
        }
        if (status === 'shipped' && order.status !== 'pending') {
            return res.status(400).json({ title: "cannot ship order", message: "only pending orders can be shipped" })
        }
        if (status === 'delivered' && order.status !== 'shipped') {
            return res.status(400).json({ title: "cannot deliver order", message: "only shipped orders can be delivered" })
        }
        order.status = status;
        await order.save();
        return res.json(order);
    }
    catch (x) {
        return res.status(500).json({ title: "Error updating order status", message: x })
    }

}
export async function getOrderById(req, res) {//בדכ כאשר שולפים הזמנה בודדת ורצים לראות יותר פרטים
    //ולכן כאן החלטנו לשלוך גם את פרטי המזמין
    let orderId = req.params.id
    try {
        let order = await orderModel.findById(orderId).populate('userId', '-password -status -__v -createdAt -updatedAt')//כאן אנחנו שולפים את כל פרטי המשתמש מלבד הסיסמא והסטטוס שלו
        if (!order)
            return res.status(404).json({ title: "invalid order", message: "order not found" })
        return res.json(order)
    }
    catch (x) {
        return res.status(500).json({ title: "Error retrieving order", message: x })
    }
}

export async function getOrdersByUser(req, res) {
    let userId = req.params.userId
    try {
        let orders = await orderModel.find({ userId :userId})
        return res.json(orders)
    }
    catch (x) {
        return res.status(500).json({ title: "Error retrieving orders", message: x })
    }
}
