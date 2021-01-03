const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {    
        const emailAlreadyInUse =  await User.findOne({email})

        if(emailAlreadyInUse){
            return res.status(400).json({
                ok: false,
                msg: "El email ya esta registrado, prueba con otro."
            });
        }

        const user = new User(req.body);

        //password encryption
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //save to DB
        await user.save();

        //generate JWT
        const token = await generateJWT(user._id)

        res.status(201).json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Algo salio mal."
        });
    }
}

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {    
        //user exists 
        const user =  await User.findOne({email})
        if(!user){
            return res.status(400).json({
                ok: false,
                msg: "Credenciales incorrectas"
            });
        }

        //validate password 
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: "Credenciales incorrectas"
            });
        }

        //generate JWT
        const token = await generateJWT(user._id)

        res.status(200).json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Algo salio mal."
        });
    }
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    try {
        //generate new token for uid
        const token = await generateJWT(uid);
    
        //get user from DB
        const user = await User.findById(uid);

        res.status(200).json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Algo salio mal."
        });
    }
}

module.exports = {
    createUser,
    login,
    renewToken
}