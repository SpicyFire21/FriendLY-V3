import pool from '../database/db.js';
import { v4 as uuidv4 } from "uuid";


async function getComments(){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM comments');
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des commentaires' };
    } finally {
        db.release();
    }
}


async function addComment(newComment){
    const db = await pool.connect();
    let newid = uuidv4();
    const currentDate = new Date().toISOString();
    if(!newComment.comment){
        return { error: 1, status: 400, data: 'Please add a content to the comment' };
    }
    if(!newComment.iduser){
        return { error: 1, status: 400, data: 'Please add the id of the user' };
    }
    if(!newComment.idpost){
        return { error: 1, status: 400, data: 'Please add the id of the post' };
    }
    try {
        const res = await db.query('INSERT INTO comments (idcomment,iduser,idpost,comment,postedat) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [newid,newComment.iduser,newComment.idpost,newComment.comment,currentDate]);
        return { error: 0, status: 200, data: res.rows };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des commentaires' };
    } finally {
        db.release();
    }
}

export default {
    getComments,
    addComment
}