import mongoose from "mongoose";

export function connectToDB() {

    mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })//השם בייקרי זה שם של הדאטאבייס שלנו
    //אם הוא עדיין לא קיים הוא אוטומטית ייווצר ברגע שנוסיף לו דאטה
        .then(() => {
            console.log("Connected to database");
        })
        .catch((err) => {
            console.log("Error connecting to database", err);
            process.exit(1);
        });
}