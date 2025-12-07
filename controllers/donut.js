import { donutModel } from "../models/donut.js"

export const getDonuts = async (req, res) => {
    try {
        let donuts = await donutModel.find({})
        return res.json(donuts)
    } catch (err) {
        return res.status(500).json({ title: "Error retrieving donuts", message: err })
    }

}

export const getDonutById = async (req, res) => {
    try {
        const { id } = req.params
        let donut = await donutModel.findOne({ _id: id })
        if (!donut)//אפשרי גם לשלוף עי byId

            return res.status(404).json({ title: "no such donut", message: "Donut not found" })

        return res.json(donut)
    } catch (err) {
        return res.status(500).json({ title: "Error retrieving donut", message: err })
    }

}

export const createDonut = async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ title: "missing body", message: "no data" })
        let { fill, price, cover, imgUrl } = req.body
        if (!fill || !price || !cover || !imgUrl)
            return res.status(400).json({ title: "missing data", message: "fill, price, cover, imgUrl are required" })
        if (price <= 0)
            return res.status(400).json({ title: "invalid data", message: "price must be greater than 0" })

        let already = await donutModel.findOne({ fill: fill, cover })
        if (already)
            return res.status(409).json({ title: "duplicate donut", message: "a donut with the same fill and cover already exists" })
        const newDonut = new donutModel({ fill, price, cover, imgUrl })
        let donut = await newDonut.save()


        return res.status(201).json(donut)

    }
    catch (err) {
        return res.status(500).json({ title: "Error creating donut", message: err })
    }

}

export const updateDonut = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        let { fill, price, cover, imgUrl } = req.body

        let updateObject = {}
        if (fill !== undefined) updateObject.fill = fill
        if (price !== undefined) {
            if (price <= 0)
                return res.status(400).json({ title: "invalid data", message: "price must be greater than 0" })
            updateObject.price = price
        }
        if (cover !== undefined) updateObject.cover = cover
        if (imgUrl !== undefined) updateObject.imgUrl = imgUrl


        let donut = await donutModel.findByIdAndUpdate(id, updateObject, { new: true })//ניו טרו אומר שיחזיר את הואיביקט לאחר העדכון ולא לפני
        if (!donut)

            return res.status(404).json({ title: "error updating", message: "Donut not found" })

        return res.json(donut)
    }
    catch (err) {
        return res.status(500).json({ title: "Error updating donut", message: err })
    }
}

export const deleteDonut = async (req, res) => {
    try {


        const id = parseInt(req.params.id)

        let d = await donutModel.findByIdAndDelete(id)
        if (!d)
            return res.status(404).json({ title: "error deleting", message: "Donut not found" })

        return res.status(200).json(d)
    }
    catch (err) {
        return res.status(500).json({ title: "Error deleting donut", message: err })
    }
}