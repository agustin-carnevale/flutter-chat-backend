const { userConnected, userDisconnected, saveMessage } = require('../controllers/socket');
const { checkJWT } = require('../helpers/jwt');
const { io } = require('../index');

// Mensajes de Sockets
io.on('connection', client => {
    // console.log('Cliente conectado');
    const [valid, uid] = checkJWT(client.handshake.headers['x-token']);
    if(!valid) return client.disconnect();

    //valid client
    userConnected(uid);

    //Ingresar al usuario a una sala en particular
    client.join(uid); //uid  = nombre de sala

    //escuchar evento 'private-message'
    client.on('private-message', (payload)=>{
        saveMessage(payload);
        io.to(payload.to).emit('private-message', payload);
    })

    client.on('disconnect', () => {
        userDisconnected(uid);
        // console.log('Cliente desconectado');
    });
});
