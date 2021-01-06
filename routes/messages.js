/*
    path: /api/messages
*/
const { Router } = require('express');
const { getMessages } = require('../controllers/messages');
const { validateJWT } = require('../middlewares/validate_jwt');

const router = Router();

router.get('/:id',
    validateJWT,
    getMessages
);

module.exports = router;