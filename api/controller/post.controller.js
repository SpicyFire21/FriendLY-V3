import postService from '../services/post.service.js';

export const getPosts = async (req,res) => {
    try {
        let data = await postService.getPosts();
        return res.status(200).json({ data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de la récupération des publications");
    }
}

export const getPostById = async (req,res) => {
    try {
        let data = await postService.getPostById(req.params.id);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({data: data});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Erreur lors de la récupération de la publication par id")
    }
}

export const deletePostById = async (req,res) => {
    try {
        let data = await postService.deletePostById(req.params.id);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({data: data});
    }catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la suppression de la publication par id")
    }
}

export const AddPost= async (req,res) => {
    try {
        const avatarBuffer = req.file ? req.file.buffer : null;




        let data = await postService.AddPost(req.body,avatarBuffer);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({data: data});
    } catch (error){
        console.log(error);
        return res.status(500).send("Erreur lors de la publication de la nouvelle publication")
    }
}

export const getLoves =async (req,res) => {
    try {
        let data = await postService.getLoves();
        return res.status(200).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la récupération des loves")
    }
}

export const getLovesByPostId =async (req,res) => {
    try {
        let data = await postService.getLovesByPostId(req.params.postid);
        return res.status(200).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la récupération des loves du post")
    }
}

export const getLovesByUserId =async (req,res) => {
    try {
        let data = await postService.getLovesByUserId(req.params.userid);
        return res.status(200).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la récupération des loves de l'utilisateur")
    }
}

export const getLovesByPostIdAndUserId =async (req,res) => {
    try {
        let data = await postService.getLovesByPostIdAndUserId(req.params.userid,req.params.postid);
        return res.status(200).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la récupération des loves de l'utilisateur sur le post")
    }
}

export const getLikes =async (req,res) => {
    try {
        let data = await postService.getLikes();
        return res.status(200).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la récupération des likes")
    }
}

export const getLikesByPostId =async (req,res) => {
    try {
        let data = await postService.getLikesByPostId(req.params.postid);
        return res.status(200).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la récupération des likes du post")
    }
}

export const getLikesByUserId =async (req,res) => {
    try {
        let data = await postService.getLikesByUserId(req.params.userid);
        return res.status(200).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la récupération des likes de l'utilisateur")
    }
}

export const getLikesByPostIdAndUserId =async (req,res) => {
    try {
        let data = await postService.getLikesByPostIdAndUserId(req.params.userid,req.params.postid);
        return res.status(200).json({ data: data });
    } catch(error){
        console.log(error);
        return res.status(500).send("Erreur lors de la récupération des likes de l'utilisateur sur le post")
    }
}

export const addLove = async (req,res) => {
    try {
        let data = await postService.addLove(req.body);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({data: data});
    } catch (error){
        console.log(error);
        return res.status(500).send("Erreur lors de l'ajout du love'")
    }
}

export const removeLove = async (req,res) => {
    try {
        let data = await postService.removeLove(req.params.postid,req.params.userid);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({data: data});
    } catch (error){
        console.log(error);
        return res.status(500).send("Erreur lors de la suppression du love'")
    }
}


export const addLike = async (req,res) => {
    try {
        let data = await postService.addLike(req.body);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({data: data});
    } catch (error){
        console.log(error);
        return res.status(500).send("Erreur lors de l'ajout du like'")
    }
}

export const removeLike = async (req,res) => {
    try {
        let data = await postService.removeLike(req.params.postid,req.params.userid);
        if (data.error) {
            return res.status(data.status).send(data.data);
        }
        return res.status(200).json({data: data});
    } catch (error){
        console.log(error);
        return res.status(500).send("Erreur lors de la suppression du like'")
    }
}