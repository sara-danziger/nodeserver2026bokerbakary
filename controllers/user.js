import { userModel } from "../models/user.js";
import { hash, compare, hashSync, compareSync } from "bcryptjs"

export const getUsers = (req, res) => {
    userModel.find({ status: true }, { password: 0 }).then(users => {//כאשר נותנים שדה אחד בשלילה הוא מבין שכל היתר בחיוב
        return res.json(users)
    }).catch(err => {
        return res.status(500).json({ title: "Error retrieving users", message: err })
    })
}

export const addUser = (req, res) => {
    if (!req.body)
        return res.status(400).json({ title: "missing body", message: "no data" })
    let { username, password, email, profileImageUrl } = req.body
    if (!username || !password || !email)
        return res.status(400).json({ title: "missing data", message: "username, password, email are required" })
    //כאן המקום לבדוק שהסיסמא במבנה תקין וכן המייל

    userModel.findOne({ email }).then(already => {
        if (already)
            return res.status(409).json({ title: "duplicate user", message: "a user with the same email already exists" })

        let hashedPassword = hashSync(password, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10)
        console.log(hashedPassword);
        const newUser = new userModel({ username, password: hashedPassword, email, profileImageUrl })
        newUser.save()
            .then(user => {
                let { password, ...other } = user.toObject();

                return res.status(201).json(other)
            })
            .catch(err => {
                return res.status(500).json({ title: "Error creating user", message: err })
            })
    })
        .catch(err => {
            return res.status(500).json({ title: "Error creating user", message: err })
        })


}
export const login = (req, res) => {
    if (!req.body)
        return res.status(400).json({ title: "missing body", message: "no data" })

    let { email, password :pass} = req.body
    if (!email || !pass)
        return res.status(400).json({ title: "missing data", message: "email, password are required" })
    userModel.findOne({ email, status: true }).then(user => {
        if (!user)
            return res.status(404).json({ title: "invalid credentials", message: "email is incorrect" })

        let isMatch = compareSync(pass, user.password)//משווה את הסיסמא שהמתשמש מנסה להכנס איתה לבין הסיסמא המוצ]נת במסד הנתונים
        if (!isMatch)

            return res.status(404).json({ title: "invalid credentials", message: "password is incorrect" })

        let { password, ...other } = user.toObject();

        return res.json(other)
    }).catch(err => {
        return res.status(500).json({ title: "Error logging in", message: err })
    })
}


//כמובן שאפשר להוסיך פעולות עדכון סיסמא עדגכון כל הפרטים
//ועוד ועוד
//וכן בדיקה מה קורה כמוסיפים יוזר שכבר קיים אבל הוא בסטטוס לא פעיל
