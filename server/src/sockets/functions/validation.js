const jwt = require('jsonwebtoken')
const {
    check,
    body
} = require('express-validator');
const funcQuery = require('../../query/funcQuery');
global.validationAc = `privatekey`
let validateRegisterUser = () => {
    return [
        body('userName', 'User Name does not Empty').not().isEmpty(),

        body('userName', 'UserName must be Alphanumeric').isAlphanumeric(),
        body('userName', 'UserName more than 3 degits').isLength({
            min: 3
        }),
        body('email', 'Invalid does not Empty').not().isEmpty(),
        body('email', 'Invalid email').isEmail(),
        body('password', 'password more than 6 degits').isLength({
            min: 6
        }),

        body('tokenRecaptcha', 'Robot verification failed').not().isEmpty(),



    ];
}
let validatePage = () => {
    return [
        body('limit', 'Limit is not number').not().isEmpty().isNumeric(),
        body('symbol', 'Symbol does not Empty').not().isEmpty(),
        body('page', 'Page is not number').not().isEmpty().isNumeric()
    ];
}
let validateLogin = () => {
    return [
        body('userName', 'UserName more than 3 degits').isLength({
            min: 3
        }),
        body('password', 'password more than 5 degits').isLength({
            min: 6
        })
    ];
}


module.exports = {
    // token_user_name
    // token_vinawallet
    validatePage,
    validateLogin,
    validateRegisterUser,
    tokenUserLogin: async (token) => {
        var decodeToken = jwt.verify(token, 'token_kan')
        const validationToken = await funcQuery.getRowToTable('tb_token', `token='${token}'`)
        if (validationToken.length <= 0) return false
        if (decodeToken.cusObj.idUser) {
            return decodeToken.cusObj.idUser
        } else {
            return false
        }
    },
    tokenUser: (token, flag) => {
        var decodeToken = jwt.verify(token, `${process.env.KEYTOKEN}`)
        if (flag) {
            return decodeToken.cusObj.id
        }
        if (decodeToken.cusObj.email) {
            return decodeToken.cusObj.email
        } else {
            return false
        }
    },
    tokenAdmin: (token) => {
        var decodeToken = jwt.verify(token, 'token_user_name')
        if (decodeToken.cusObj.type == "admin") {
            return true
        } else {
            return false
        }
    }
}