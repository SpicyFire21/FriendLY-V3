import pool from '../database/db.js';


async function getLoves(){
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

export default {
    getLoves
}