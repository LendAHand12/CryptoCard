var express = require('express');
var router = express.Router();
const {
    error_400,
    error_500,
    success
} = require('../message');
const passport = require('passport');
const bip39 = require('bip39')
const passportConfig = require('../middlewares/passport');
const customerQuery = require('../sockets/queries/customerQuery');
const { getToken } = require('../commons');
///////////////////////////////// Func ////////////////////////////////
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function convertArrayToString(array) {
    let str = ``
    array.forEach((item, index) => {
        if (index == 0) {
            str += `${item}`
        } else {
            str += ` ${item}`
        }
    })
    return str
}
async function isCheckCharacters(characters, userid) {
    const stringCharacters = convertArrayToString(characters)
    const code = bip39.mnemonicToEntropy(stringCharacters)
    if (userid) {
        const codeCharacters = await customerQuery.getUserToIdAndCharacters(userid, code)
        if (codeCharacters.length > 0) {
            return codeCharacters[0]
        } else {
            return false
        }
    } else {
        const user = await customerQuery.getUserToCharacters(code)
        if (user.length > 0) {
            return user[0]
        } else {
            return false
        }
    }
}
///////////////////////////////// END Func ////////////////////////////
router.post('/get12Characters', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const idUser = req.user
        const profileUser = await customerQuery.getUserToId(idUser)
        if (profileUser.length > 0) {
            if (profileUser[0].characters != 1) {
                const str = makeid(15)
                const hex = bip39.mnemonicToSeedSync(str).toString('hex')
                const stringBip39 = hex.slice(0, 32)
                const mnemonic = bip39.entropyToMnemonic(stringBip39)
                const response = mnemonic.split(" ");
                await customerQuery.updateCharactersToId(stringBip39, idUser)
                success(res, "Get 12 characters successfully", response)
            } else {
                error_400(res, `the user has enabled 12 characters`, 2)
            }
        } else {
            error_400(res, "User is not exit", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/turn12Characters', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            characters,
            operation
        } = req.body
        const idUser = req.user
        const profileUser = await customerQuery.getUserToId(idUser)
        if (profileUser.length > 0) {
            console.log(characters);

            const charactersUser = await isCheckCharacters(characters, idUser)
            if (charactersUser) {
                await customerQuery.turnCharacters(idUser, operation)
                success(res, `Turn ${operation?"on":"off"} 12 characters successfully`)
            } else {
                error_400(res, "Invalid 12 characters", 2)
            }
        } else {
            error_400(res, "User is not exit", 1)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/login12Characters', async function (req, res, next) {
    try {
        const {
            characters,
        } = req.body
        const charactersUser = await isCheckCharacters(characters)
        if (charactersUser) {
            if (charactersUser.characters == 1) {
                charactersUser.token = getToken(charactersUser)
                success(res, `Logged in successfully`, charactersUser)
            }
            else {
                error_400(res, "User has not enabled 12-character login", 3)
            }
        } else {
            error_400(res, "Invalid 12 characters", 2)
        }
    } catch (error) {
        console.log(error);
        error_400(res, "Invalid 12 characters", 2)
    }
});

module.exports = router