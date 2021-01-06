const { response } = require('express');
const Message = require('../models/message');

const getMessages = async (req, res = response) => {

    const myID = req.uid;
    const otherID = req.params.id;

    const messages = await Message
        .find({
            $or:[{from: myID, to: otherID}, {from: otherID, to: myID}]
        })
        .sort({ createdAt: 'desc' })
        .limit(30);

    res.json({
        ok: true,
        messages
    })

}

module.exports = {
    getMessages
}