/*
    path: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate_fields');
const { validateJWT } = require('../middlewares/validate_jwt');

const router = Router();

router.post('/new',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio y debe tener al menos 4 caracteres').isLength({min: 4}),
    validateFields
], createUser);

router.post('/',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio y debe tener al menos 4 caracteres').isLength({min: 4}),
    validateFields
], login);

router.get('/renew',
    validateJWT,
    renewToken
);

module.exports = router;