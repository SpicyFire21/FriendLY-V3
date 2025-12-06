import pool from '../database/db.js';
import { v4 as uuidv4 } from "uuid";

async function getPosts() {
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM posts ORDER BY posts.postedat DESC');
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des publications' };
    } finally {
        db.release();
    }
}

async function getPostById(id){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM posts WHERE posts.id = $1', [id]);
        if (res.rows.length === 0) {
            return { error: 1, status: 404, data: 'Publication not found or doesn\'t exist' };
        }
        return { error: 0, data: res.rows[0] };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Error retrieving publication by ID' };
    } finally {
        db.release();
    }
}

async function deletePostById(id) {
    const db = await pool.connect();
    try {
        await db.query('DELETE FROM posts WHERE posts.id = $1 ', [id]);

        return { error: 0,status: 200, data: `Post deleted with success ${id}` };
    }catch (error){
        console.error(error);
        return { error: 1, status: 500, data: 'Error deleting post by ID' };
    } finally {
        db.release();
    }
}

async function AddPost(newpost,img){
    const db = await pool.connect();
    let newid = uuidv4();
    const currentDate = new Date().toISOString();

    if(!img){
        return { error: 1, status: 400, data: 'Please add the image' };
    }
    if(!newpost.authorid){
        return { error: 1, status: 400, data: 'Please add the author id' };
    }

    try {
        const result = await db.query('INSERT INTO posts (id,description,image,authorid,postedat) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [newid,newpost.description,img,newpost.authorid,currentDate]);
        return { error: 0, status: 201, data: result.rows[0] };
    } catch(error){
        console.error(error);
        return { error: 1, status: 500, data: 'Error adding new post' };
    } finally {
        db.release();
    }
}

async function getLoves() {
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM loves');
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des loves' };
    } finally {
        db.release();
    }
}

async function getLovesByPostId(id){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM loves l WHERE l.idpost=$1',[id]);
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des loves du post' };
    } finally {
        db.release();
    }
}

async function getLovesByUserId(id){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM loves l WHERE l.iduser=$1',[id]);
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des loves du post' };
    } finally {
        db.release();
    }
}

async function getLovesByPostIdAndUserId(userid,postid){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM loves l WHERE l.iduser=$1 AND l.idpost=$2',[userid,postid]);
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des loves de lutilisateur sur le post' };
    } finally {
        db.release();
    }
}

async function getLikes(){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM likes');
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des likes' };
    } finally {
        db.release();
    }
}

async function getLikesByPostId(id){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM likes l WHERE l.idpost=$1',[id]);
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des likes du post' };
    } finally {
        db.release();
    }
}

async function getLikesByUserId(id){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM likes l WHERE l.iduser=$1',[id]);
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des likes du post' };
    } finally {
        db.release();
    }
}
async function getLikesByPostIdAndUserId(userid,postid){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM likes l WHERE l.iduser=$1 AND l.idpost=$2',[userid,postid]);
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: "Erreur lors de la récupération des likes de l'utilisateur sur le post" };
    } finally {
        db.release();
    }
}

async function addLove(data){
    const db = await pool.connect();

    if(!data.idpost){
        return { error: 1, status: 400, data: 'Please add the post id' };
    }

    if(!data.iduser){
        return { error: 1, status: 400, data: 'Please add the user id' };
    }

    try {
        const result = await db.query('INSERT INTO loves (idpost, iduser) VALUES ($1,$2) RETURNING *',
            [data.idpost,data.iduser]);
        return { error: 0, status: 201, data: result.rows[0] };
    } catch(error){
        console.error(error);
        return { error: 1, status: 500, data: 'Error adding the love, maybe the love already exist' };
    } finally {
        db.release();
    }
}

async function removeLove(postid,userid){
    const db = await pool.connect();
    try {
        const res = await db.query('DELETE FROM loves WHERE loves.iduser = $2 AND loves.idpost =$1 RETURNING *', [postid,userid]);
        if (res.rows.length === 0) {
            return { error: 1, status: 400, data: 'Love already deleted' };
        }
        return { error: 0,status: 200, data: res.rows[0] };
    }catch (error){
        console.error(error);
        return { error: 1, status: 500, data: 'Error deleting love by ID' };
    } finally {
        db.release();
    }
}

async function addLike(data){
    const db = await pool.connect();
    if(!data.idpost){return { error: 1, status: 400, data: 'Please add the post id' };}
    if(!data.iduser){return { error: 1, status: 400, data: 'Please add the user id' };}
    try {
        const result = await db.query('INSERT INTO likes (idpost, iduser) VALUES ($1,$2) RETURNING *',
            [data.idpost,data.iduser]);
        return { error: 0, status: 201, data: result.rows[0] };
    } catch(error){
        console.error(error);
        return { error: 1, status: 500, data: 'Error adding the like, maybe the like already exist' };
    } finally {
        db.release();
    }
}

async function removeLike(postid,userid){
    const db = await pool.connect();
    try {
        const res = await db.query('DELETE FROM likes WHERE likes.iduser = $2 AND likes.idpost =$1 RETURNING *', [postid,userid]);
        if (res.rows.length === 0) {
            return { error: 1, status: 400, data: `Like already deleted ${postid}  ${userid}`};
        }
        return { error: 0,status: 200, data: res.rows[0] };
    }catch (error){
        console.error(error);
        return { error: 1, status: 500, data: 'Error deleting like by ID' };
    } finally {
        db.release();
    }
}

export default {
    getPosts,
    getPostById,
    deletePostById,
    AddPost,
    getLoves,
    getLovesByPostId,
    getLovesByUserId,
    getLovesByPostIdAndUserId,
    getLikes,
    getLikesByPostId,
    getLikesByUserId,
    getLikesByPostIdAndUserId,
    addLove,
    removeLove,
    addLike,
    removeLike
}