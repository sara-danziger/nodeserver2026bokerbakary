import express from "express";
import cors from "cors"
import dotenv from "dotenv";

import donutRouter from "./routes/donut.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import { connectToDB } from "./config/db.js";

dotenv.config();//.env השורה הזשאת אומרת במקום ללכת לחפש משתני סביבה במחשב קודם תחפש אותם בקובץ 

const app = express()


app.use(express.json())
app.use(cors())//זה מה שמאפשר לקליינט לגשת לשרת שלנו הזה

connectToDB()

app.use("/api/donuts", donutRouter)
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter)
let port=process.env.PORT
app.listen(port, () => {
    console.log("Server running on port " + port);
})