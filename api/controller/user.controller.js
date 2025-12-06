import userService from "../services/user.service.js";
import * as webhook from "../webhooks/webhooks.js";

export const getUsers = async (req,res) => {
    try {
        let data = await userService.getUsers();

        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des utilisateurs");
    }
}

export const getUserById = async (req,res) => {
    try {
        let data = await userService.getUserById(req.params.id);

        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération de l'utilisateur par ID");
    }
}

export const loginUser = async (req,res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ error: 1, status: 404, data: `aucun login et/ou mot de passe fourni ${login}|${password}` });
        }
        let data = await userService.loginUser({login, password});
        if (data) {
            return res.status(200).json({ data: data });
        } else {
            return res.status(404).send("Login et/ou mot de passe incorrect");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la connexion de l'utilisateur");
    }
}

export const deleteUserById = async (req,res) => {
    try {
        let data = await userService.deleteUserById(req.params.id);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({data: data});
    }catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la suppression de l'utilisateur par id");
    }
}

export const updateUser = async (req, res) => {
    try {

        // console.log('req.file:', req.file);
        // console.log('req.body:', req.body);

        const avatarBuffer = req.file ? req.file.buffer : null;
        const data = await userService.updateUser(req.params.id, req.body, avatarBuffer);

        const name = data.data.realname || data.data.pseudo;
        if(data.error ===0){
            await webhook.discord(`**${data.data.pseudo}** a modifié son profil !\nPseudo : ${data.data.pseudo}\nNom : ${name}\nBio : ${data.data.bio}`);
        }
        return res.status(data.status).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
    }
}



export const addUser = async (req,res) => {
    try{
        console.log(req.body)
        let data = await userService.addUser(req.body);
        await webhook.discord(`**${data.data.pseudo}** est arrivé(e) sur FriendLY`)
        return res.status(200).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la création de l'utilisateur");
    }
}

export const addFollower = async (req,res) => {
    try {
        let data = await userService.addFollower(req.body);
        return res.status(data.status).json({ data: data });
    } catch(error) {
        console.error(error);
        return res.status(500).send("Erreur lors de l'ajout du follower")
    }
}

export const removeFollower = async (req,res) => {
    try {
        let data = await userService.removeFollower(req.params.userid,req.params.targetid);
        if (data.error) {
            return res.status(data.status).json({ data: data });
        }
        return res.status(200).json({data: data});
    } catch(error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la suppression du follower")
    }
}

export const getFollowers = async (req,res) => {
    try {
        let data = await userService.getFollowers();
        return res.status(200).json({ data: data });
    } catch(error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des followers")
    }
}







export const getFollowersByUserId = async (req,res) => {
    try {
        let data = await userService.getFollowersByUserId(req.params.id);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({ data: data });
    } catch (error){
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des followers par id d'utilisateur")
    }
}

export const getSubscribersByUserId = async (req,res) => {
    try {
        let data = await userService.getSubscribersByUserId(req.params.id);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({ data: data });
    } catch (error){
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des subscribers par id d'utilisateur")
    }
}


