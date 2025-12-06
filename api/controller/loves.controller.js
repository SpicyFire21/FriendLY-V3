import loveService from '../services/loves.service.js';

export const getLoves = async (req,res) =>{
    try {
        let data = await loveService.getLoves();
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des loves");
    }
}