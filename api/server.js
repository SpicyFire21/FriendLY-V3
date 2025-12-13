import express from 'express'
import pool from './database/db.js'
const app = express();
import cors from 'cors'
import bodyParser from "body-parser";
import { Server } from "socket.io";


const PORT = 3000
const apiURL = `http://localhost:${PORT}`

import userRoute from './routes/user.router.js';
import postRoute from './routes/post.router.js';
import messageRoute from './routes/message.router.js';
import loveRoute from './routes/loves.router.js';
import saveRoute from './routes/save.router.js';
import commentRoute from './routes/comment.router.js'



import http from "http";
import axios from "axios";

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/messages',messageRoute);
app.use('/posts',postRoute);
app.use('/users', userRoute);
app.use('/loves', loveRoute);
app.use('/saves',saveRoute);
app.use('/comments',commentRoute);

//finir les sockets !!!
io.on("connection", (socket) => {
    console.log("✅ Un utilisateur est connecté 🧦 :", socket.id);

    socket.on("typing",(data)=>{
        socket.broadcast.emit('typing',data);
    });

    socket.on("disconnect", () => {
        console.log("❌ Utilisateur déconnecté :", socket.id);
    });

    // Exemple : réception d'un message
    socket.on("chat-message", (data) => {
        console.log("📨 Nouveau message :", data);

        try {
            axios.post(`${apiURL}/messages/send`,data)
                .then(() => console.log("💾 Message enregistré dans la BDD"))
        }catch (e){
            console.error(e)
        }

        io.emit("chat-message", data); // broadcast à tous
    });


    socket.on("post-comment", (data) => {
        console.log("📨 Nouveau commentaire :", data);

        try {
            axios.post(`${apiURL}/comments/send`,data)
                .then(() => console.log("💾 Commentaite enregistré dans la BDD"))
        }catch (e){
            console.error(e)
        }

        io.emit("post-comment", data); // broadcast à tous
    });

});




server.listen( PORT,() => {
    console.log(`API lancé sur ${apiURL}`);
    pool.connect((err) => {
        if (err) {
            console.error('Erreur de connexion à la base de données :', err);
        } else {
            console.log('Connexion à la base de données réussie 😏😏 ');
        }
    });
});

export default app