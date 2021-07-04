const express = require('express');
const app = express();
const http = require('http').Server(app); //Servidor http a partir de la libreria express
const io = require('socket.io')(http); //para poder llamarlo desde nuestros html que vamos a crear luego

// Configuración para recepción de JSONs
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//Asignación de rutas
app.use(require('./routes/rutas'));

//Asignación de archivos estáticos
app.use(express.static(__dirname + "/public"));

//Envío de imágenes
io.on('connection', (socket) => {
    socket.on('stream', (image) => {
        socket.broadcast.emit('stream', image); //emitir el evento a todos los usuarios conectados
    })

    socket.on('user-connected', () => {
        console.log("New user connected")
    })

    socket.on("disconnect", () => {
        console.log('User disconnected')
    });
});

http.listen(3000, () => {
    console.log('Servidor en puerto 3000');
})