import pool from '../database/db.js';
// const { v4: uuidv4 } = require('uuid');

async function getSaves(){
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM saves');

        const saves = res.rows

        return { error: 0, status: 200, data:saves };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des publications enregistrées' };
    } finally {
        db.release();
    }
}
async function getSavesByPostId(){

}
async function getSavesByUserId(){

}
async function getSavesByPostIdAndUserId(){

}



export default {
    getSaves,
    getSavesByPostId,
    getSavesByUserId,
    getSavesByPostIdAndUserId
}