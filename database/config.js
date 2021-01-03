const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('DB Connected');
        
    } catch (error) {
        console(error);
        throw new Error('Error en la base de datos - Hable con el admin');
    }
} 

module.exports = {
    dbConnection
}