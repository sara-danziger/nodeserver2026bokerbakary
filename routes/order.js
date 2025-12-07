import express from 'express';
import * as x from "../controllers/order.js";

const router = express.Router();
router.get('/', x.getOrders);
router.post('/', x.addOrder);
router.delete('/:id', x.cancelOrder);
router.put('/:id/status', x.updateOrderStatus); //http://localhost:3000/api/order/123456fsdgh/status -הסטטוס כאן הוא מילה קבוע הלעומת האי די שהוא פרמטר
//bodyאת הסטטוס שאליו רוצים לעדכן נשלח ב
//router.put('/:id', x.updateOrderStatus); //http://localhost:3000/api/order/123456fsdgh
router.get("/:id", x.getOrderById);
router.get("/user/:userId", x.getOrdersByUser);
export default router;
