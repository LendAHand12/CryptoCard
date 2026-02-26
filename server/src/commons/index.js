const jwt = require('jsonwebtoken');
const customerQuery = require('../sockets/queries/customerQuery');
const {
    getPriceCoin
} = require('./functions/validateObj');
const apiTron = `https://api.trongrid.io`
// https://api.trongrid.io
// https: //api.shasta.trongrid.io
/// trong
// const TronWeb = require('tronweb');
const {
    updateBalanceWalletOrUserBonus,
    updateBalanceWalletOrUser
} = require('../sockets/functions');
const {
    createTrc20Wallet
} = require('../lib/createWallet');
const {
    error_400
} = require('../message');

// const HttpProvider = TronWeb.providers.HttpProvider;
// const fullNode = new HttpProvider(apiTron);
// const solidityNode = new HttpProvider(apiTron);
// const eventServer = new HttpProvider(apiTron);
const privateKey = "d60f68ae5fe9800848b499abc96761bdce1f2cb84f66361c8b6ebce9bdf2c994";
// const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

function replaceSymbol(symbol) {
    let symbolReturn
    symbolReturn = symbol.replace('.TRC20', '')
    symbolReturn = symbolReturn.replace('.ERC20', '')
    symbolReturn = symbolReturn.replace('.BEP20', '')
    symbolReturn = symbolReturn.replace('.BSC', '')
    return symbolReturn
}
function convertArrayCreated_at(array, flag) {
    for (item of array) {
        if (typeof (item.created_at) == 'number') {
            item.created_at = new Date(item.created_at*1000+25200000)
            let day = item.created_at.getDate();
            let month = item.created_at.getMonth() + 1;
            let year = item.created_at.getFullYear();
            var hours = item.created_at.getHours();
            var minutes = item.created_at.getMinutes();
            var seconds = item.created_at.getSeconds();
            item.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
        } else {
            if (flag) {
                item.createTime = new Date(new Date(item.createTime).getTime() + 25200000)
                let day = item.createTime.getDate();
                let month = item.createTime.getMonth() + 1;
                let year = item.createTime.getFullYear();
                var hours = item.createTime.getHours();
                var minutes = item.createTime.getMinutes();
                var seconds = item.createTime.getSeconds();
                item.createTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            } else if (flag == "int") {
                item.created_at = new Date(pack.created_at * 1000 + 25200000)
                let day = item.created_at.getDate();
                let month = item.created_at.getMonth() + 1;
                let year = item.created_at.getFullYear();
                var hours = item.created_at.getHours();
                var minutes = item.created_at.getMinutes();
                var seconds = item.created_at.getSeconds();
                item.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
            else {

                item.created_at = new Date(new Date(item.created_at).getTime() + 25200000)
                let day = item.created_at.getDate();
                let month = item.created_at.getMonth() + 1;
                let year = item.created_at.getFullYear();
                var hours = item.created_at.getHours();
                var minutes = item.created_at.getMinutes();
                var seconds = item.created_at.getSeconds();
                item.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
        }

    }
}
const crypto = require('crypto');
const password =`@@!83fhfe2qaso29!@da`
// Hàm mã hóa
function encryptPrivateKey(privateKey) {
    const iv = crypto.randomBytes(16); // Tạo vector khởi tạo ngẫu nhiên
    const key = crypto.scryptSync(password, 'salt', 32); // Tạo khóa từ mật khẩu

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Trả về iv và chuỗi mã hóa
    return iv.toString('hex') + ':' + encrypted;
}

// Hàm giải mã
function decryptPrivateKey(encryptedPrivateKey) {
    const parts = encryptedPrivateKey.split(':');
    const iv = Buffer.from(parts.shift(), 'hex'); // Lấy iv từ chuỗi
    const encryptedText = Buffer.from(parts.join(':'), 'hex');

    const key = crypto.scryptSync(password, 'salt', 32); // Tạo khóa từ mật khẩu
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
module.exports = {
    encryptPrivateKey,
    decryptPrivateKey,
    convertArrayWallet: (array) => {
        for (item of array) {
            delete item.privateKey
        }
    },
    convertArrayCreated_at
    ,
    convertTimeToString: (time) => {
        let day = time.getDate();
        let month = time.getMonth() + 1;
        let year = time.getFullYear();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    },
    checkAdmin: async (userid) => {
        const arrayAdmin = [1, 109, 111]
        let flag = false
        arrayAdmin.forEach(e => {
            if (userid == e) flag = true
        })
        return flag
    },
    getPriceCoin: async (symbol) => {
        const str = symbol.toUpperCase()
        const strToken = str.replace('_TRC20', '')
        const token = await customerQuery.getTokenToName(strToken)
        return token
    },
    getListLimitPage: async (table, limit, page, where, flag) => {
        const listQuery = await customerQuery.getLimitPageToTable(table, limit, page, where)
        const lengthQuery = await customerQuery.getCountToTable(table, where)
        const [list, length] = await Promise.all([listQuery, lengthQuery])
        if (list.length > 0) convertArrayCreated_at(list, flag)
        const obj = {
            array: list,
            total: length[0][`COUNT(*)`]
        }
        return obj
    },

    validationDepositCoin: async (symbol, amount) => {
        let symbolReplace = replaceSymbol(symbol)
        const price = await getPriceCoin(symbolReplace)
        const usdAmount = amount * price.lastPrice
        if (usdAmount < price.deposit) return false
        return true
    },
    bonusDeposit: async (symbol, symbolBonus, amountSymbol, userid) => {
        try {

            if (symbol != symbolBonus) {
                await createTrc20Wallet(userid, symbolBonus)
                const priceCoin = await getPriceCoin(symbol)
                const rate = priceCoin.lastPrice
                const USDTotal = parseFloat(amountSymbol) * parseFloat(rate)
                const priceSymbolBonus = await getPriceCoin(symbolBonus)
                const rateBonus = priceSymbolBonus.lastPrice
                const amountBonus = USDTotal / parseFloat(rateBonus)
                const walletUser = await customerQuery.getWalletToIdUser(userid, symbolBonus)
                let amountBefore = walletUser[0].amount
                let amountAfter = parseFloat(amountBefore) + parseFloat(amountBonus)
                await updateBalanceWalletOrUserBonus(userid, symbolBonus, amountBonus)
                await customerQuery.addTransacitonBonus(userid, userid, "bonus", symbolBonus.toLowerCase(), amountBonus, USDTotal, `Get bonus from deposit ${symbol}`, amountBefore, amountAfter)
            }
        } catch (error) {
            console.log(error);
        }
    },
    validationBody: (obj) => {
        const arrayKey = Object.keys(obj)
        let arrayError = []
        for (key of arrayKey)
            if (!obj[key]) arrayError.push(`${key} is not empty`)
        if (arrayError.length > 0) return arrayError
        return true
    },

    getToken: async (user) => {
        let cusObj = { id: user.id }
        let token = jwt.sign({
            cusObj
        }, `${process.env.KEYTOKEN}`, {
            expiresIn: 60 * 518400
        });

        return token
    },
    qrCodeGenerator: async (socket) => {
        socket.emit('QRlogin', socket.id)
        await customerQuery.addQrCode(socket.id)
        socket.on("disconnect", async () => {
            await customerQuery.deleteQrscan(socket.id)
        });
    }
}