import express from 'express';

import * as userController from "../controllers/user.js";

const router = express.Router();
router.get('/', userController.getUsers);
//קודם רושמים את היותר ספציפיים
router.post('/login', userController.login);// קודם מוסיפים את הלוגין כדי שלא יתפוס את הפוסט של הוספת משתמש חדש
router.post('/', userController.addUser);


export default router;