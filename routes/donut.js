import express from 'express';


import {createDonut,deleteDonut,getDonutById,getDonuts,updateDonut}from "../controllers/donut.js";

const router = express.Router();
router.get('/', getDonuts);
router.get('/:id', getDonutById);
router.post('/', createDonut);
router.put('/:id', updateDonut);
router.delete('/:id', deleteDonut);
export default router;
