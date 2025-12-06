import SaveService from '../services/save.service.js';

export const getSaves = async (req,res) => {
    try {
        let data = await SaveService.getSaves();
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des publications enregistrées");
    }
}

export const getSavesByPostId = async (req,res) => {
    try {
        let data = await SaveService.getSavesByPostId(req.params.idpost);
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération de la publication enregistrée");
    }
}

export const getSavesByUserId = async (req,res) => {
    try {
        let data = await SaveService.getSavesByUserId(req.params.iduser);
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des publications enregistrées par l'utilisateur");
    }
}

export const getSavesByPostIdAndUserId = async (req,res) => {
    try {
        let data = await SaveService.getSavesByPostIdAndUserId(req.params.idpost,req.params.iduser);
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération de la publication enregistrée par l'utilisateur");
    }
}