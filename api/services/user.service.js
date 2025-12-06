import pool from '../database/db.js';
import { v4 as uuidv4 } from "uuid";
import bcrypt from 'bcrypt';


async function getUsers() {
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM users');

        const users = res.rows

        return { error: 0, status: 200, data:users };
    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: 'Erreur lors de la récupération des utilisateurs' };
    } finally {
        db.release();
    }
}


async function getUserById(id) {
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM users WHERE users.id = $1', [id]);
        if (res.rows.length === 0) {
            return {error: 1, status: 404, data: 'User not found or doesn\'t exist'};
        }

        const user = res.rows[0];

        if (user.avatar) {

            user.avatar = user.avatar.toString();
        }

        return {error: 0, data: user};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Error retrieving user by ID'};
    } finally {
        db.release();
    }
}

async function loginUser(data) {
    const db = await pool.connect();
    try {
        if (!data.login || !data.password) {
            return {error: 1, status: 404, data: 'aucun login et/ou mot de passe fourni'};
        }

        const result = await db.query('SELECT * FROM users WHERE pseudo = $1', [data.login]);

        if (result.rows.length === 0) {
            return {error: 1, status: 404, data: 'login et/ou mot de passe incorrect'};
        }

        let user = result.rows[0];
        let passwordMatch;

        if (user.password.startsWith('$2b$')) {
            passwordMatch = bcrypt.compareSync(data.password, user.password);
        } else {
            passwordMatch = data.password === user.password;
            const safePassword = await bcrypt.hash(data.password, 10);

            console.warn(`le mot de passe de l'utilisateur ${data.login} est en clair dans la bdd !!`)
            console.warn(`id → ${user.id}`)
            console.warn(`→ ${safePassword}`)
        }

        if (!passwordMatch) {
            return { error: 1, status: 404, data: 'login et/ou mot de passe incorrect' };
        }
        return {error: 0, status: 200, data: user};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Erreur lors de la connexion de l\'utilisateur'};
    } finally {
        db.release();
    }
}

async function deleteUserById(id) {
    const db = await pool.connect();
    try {
        await db.query('DELETE FROM users WHERE users.id = $1 ', [id]);

        return {error: 0, data: `User deleted with success ${id}`};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Error deleting user by ID'};
    } finally {
        db.release();
    }
}

async function updateUser(id, newuser, avatarBuffer) {
    const db = await pool.connect();
    const allowedFields = ["pseudo", "realname", "password", "bio", "avatar", "email"];

    const updates = [];
    const values = [];

    for (const key of allowedFields) {
        if (key === "avatar" && avatarBuffer) {

            updates.push(`avatar = $${updates.length + 1}`);
            values.push(avatarBuffer);
        } else if (newuser[key] !== undefined) {
            updates.push(`${key} = $${updates.length + 1}`);
            values.push(newuser[key]);
        }
    }

    if (updates.length === 0) {
        return { error: 1, status: 400, data: "Aucune donnée à mettre à jour" };
    }

    values.push(id);
    const query = `UPDATE users SET ${updates.join(", ")} WHERE users.id = $${values.length} RETURNING *`;

    try {
        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            return { error: 1, status: 404, data: "User not found" };
        }
        const user = result.rows[0];
        return { error: 0, status: 200, data: user };

    } catch (error) {
        console.error(error);
        return { error: 1, status: 500, data: "Error updating user" };
    } finally {
        db.release();
    }
}


async function addUser(newuser){
    const db = await pool.connect();
    let newid = uuidv4();
    const currentDate = new Date().toISOString();

    if(!newuser.pseudo){
        return { error: 1, status: 400, data: 'Please add the pseudo' };
    }
    if(!newuser.password){
        return { error: 1, status: 400, data: 'Please add the password' };
    }
    if(!newuser.email){
        return { error: 1, status: 400, data: 'Please add the email' };
    }

    try {
        const pseudoExist = await db.query('SELECT * FROM users WHERE users.pseudo=$1',[newuser.pseudo]);
        if (pseudoExist.rows.length > 0) {return { error: 1, status: 400, data: 'Pseudo already used' };}

        const emailExist = await db.query('SELECT * FROM users WHERE users.email=$1',[newuser.email]);
        if (emailExist.rows.length > 0) {return { error: 1, status: 400, data: 'Email already used' };}

        const hashedpassword = await bcrypt.hash(newuser.password, 10);

        const result = await db.query('INSERT INTO users (id,pseudo,realname,password,bio,avatar,createdat,email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [newid,newuser.pseudo,newuser.realname,hashedpassword,newuser.bio,newuser.avatar,currentDate,newuser.email])

        return { error: 0, status: 200, data: result.rows[0] };
    } catch (error){
        console.error(error);
        return { error: 1, status: 500, data: "Error creating the new user" };
    } finally {
        db.release();
    }
}

async function addFollower(data){
    const db = await pool.connect();
    if(!data.iduser){
        return { error: 1, status: 400, data: 'Please add the user id' };
    }
    if(!data.usertarget){
        return { error: 1, status: 400, data: 'Please add the user id who want to follow \n "usertarget":"..."' };
    }

    try {
        const followExist = await db.query('SELECT * FROM follower f WHERE f.iduser=$1 AND f.iduser_1=$2',[data.iduser,data.usertarget]);
        if (followExist.rows.length > 0) {
            return { error: 1, status: 400, data: 'user already follow' };
        }
        const result = await db.query('INSERT INTO follower (iduser, iduser_1) VALUES ($1,$2) RETURNING *',[data.iduser,data.usertarget])
        return { error: 0, status: 200, data: result.rows[0] };
    } catch(error){
        console.error(error);
        return { error: 1, status: 500, data: "Error adding the new follower" };
    } finally {
        db.release();
    }

}

async function removeFollower(userid,targetid){
    const db = await pool.connect();
    try {
        await db.query('DELETE FROM follower f WHERE f.iduser = $1 AND f.iduser_1=$2', [userid,targetid]);
        return {error: 0, data: `Follower deleted with success ${userid} ${targetid}`};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Error deleting Follower by IDs'};
    } finally {
        db.release();
    }
}

async function getFollowers() {
    const db = await pool.connect();
    try {
        const res = await db.query('SELECT * FROM users JOIN public.follower f on users.id = f.iduser');
        return {error: 0, status: 200, data: res.rows};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Erreur lors de la récupération des followers'};
    } finally {
        db.release();
    }
}







async function getFollowersByUserId(id){
    const db = await pool.connect();
    try {
        const userExist = await db.query('SELECT * FROM users WHERE users.id = $1',[id])
        if (userExist.rows.length === 0) {
            return {error: 1, status: 404, data: `User not found or doesn't exist ${id}`};
        }

        const res = await db.query('SELECT * FROM follower where iduser= $1', [id]);
        return {error: 0,status:200, data: res.rows};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Error retrieving user by ID'};
    } finally {
        db.release();
    }
}

async function getSubscribersByUserId(id){
    const db = await pool.connect();
    try {
        const userExist = await db.query('SELECT * FROM users WHERE users.id = $1',[id])
        if (userExist.rows.length === 0) {
            return {error: 1, status: 404, data: `User not found or doesn't exist ${id}`};
        }
        const res = await db.query('SELECT * FROM follower WHERE iduser_1 = $1', [id]);
        return {error: 0,status:200, data: res.rows};
    } catch (error) {
        console.error(error);
        return {error: 1, status: 500, data: 'Error retrieving user by ID'};
    } finally {
        db.release();
    }
}

export default {
    getUsers,
    getUserById,
    loginUser,
    deleteUserById,
    updateUser,
    addUser,
    addFollower,
    removeFollower,
    getFollowers,
    getFollowersByUserId,
    getSubscribersByUserId
}