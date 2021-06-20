import { data } from "../../../public/resource/static-data"


export default function getModelData(req, res) {
    res.status(200).json(data)
}