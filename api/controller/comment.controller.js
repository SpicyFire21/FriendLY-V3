import commentService from '../services/comment.service.js';

export const getComments = async (req,res) => {
    try {
        let data = await commentService.getComments();
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des commentaires");
    }
}
