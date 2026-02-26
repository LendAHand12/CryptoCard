const queryVinawallet = require('../queries/queryVinawallet');
const customerQuery = require('../queries/customerQuery');
const jwt = require('jsonwebtoken');
// const TronWeb = require('tronweb');
const coinList = require('../../realtimes/models/coinList')
const sendMail = require('../functions/verifyEmail')
const axios = require('axios')
var Eth = require('web3-eth');

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');


// or using the web3 umbrella package

var {Web3} = require('web3');
// var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
// const HttpProvider = TronWeb.providers.HttpProvider;
const HttpProvider = 'TronWeb.providers.HttpProvider';
const otplib = require('otplib')
// const PublicClient = require("poloniex-node-api")
// const clientt = new PublicClient.PublicClient();
const bip39 = require('bip39')

const Accounts = require('web3-eth-accounts');
var accounts = new Accounts('http://localhost:8545/');
const {
    authenticator
} = otplib
// const fullNode = new HttpProvider("https://api.trongrid.io");
// const solidityNode = new HttpProvider("https://api.trongrid.io");
const connect = require('../../database/database');
const validation = require('../functions/validation');
// const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "2e485b5e6621b4f60c081e7202fa2fcf9e1a2fedf8ee46ffa99a35e97cdf9365";
// const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const Binance = require('node-binance-us-api');
const binance = new Binance({
    APIKEY: '<key>',
    APISECRET: '<secret>'
});
const func = require('../../realtimes/functions/getCoin')
const Coinpayments = require('coinpayments');
const options = {
    key: '69af7ae08eb0fa17f25a05dc3044f7725bedd34f1496a0c8599c2ad1ba19672c',
    secret: 'Cf3aB1c2eF98c57e6217Ced6b79Fd957914287fF89103E94c88BA0272c5534e4',
    // autoIpn: true
}
async function testa(user, contract) {
    let flag = true
    let result = await contract.balanceOf(user.address).call();
    console.log(result._hex);
    if (result._hex == "0x00") flag = false
    if (flag) {
        return {
            user,
            result,
        }
    } else {
        return ""
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const client = new Coinpayments(options);

module.exports = {
    convertVinaCoin: async (params, socketIO) => {

    },
    login12Characters: async (params, socketIO) => {
        try {
            const {
                characters
            } = params

            const string = bip39.mnemonicToEntropy(characters)

            const flag = await customerQuery.checkCharacters(string)
            if (flag.length > 0) {

                const user = await customerQuery.checkAllUserEmail(flag[0].email)
                if (user.length > 0) {
                    if (user[0].characters == 1) {
                        var email = flag[0].email
                        let cusObj = user[0]
                        let token = jwt.sign({
                            cusObj
                        }, "token_vinawallet", {
                            expiresIn: 60 * 518400
                        });
                        const wallet = await customerQuery.getWalletEmail(email)
                        const walletCode = await customerQuery.getWalletToId(user[0].idUser)
                        user[0].token = token
                        user[0].coin = await func.getCoinBinance(email)
                        delete wallet[0].phone
                        delete wallet[0].email
                        user[0].wallets = wallet[0]
                        user[0].infoWallets = walletCode
                        var testArray = []
                        var tokenAdd = JSON.parse(user[0].tokenAdd)
                        const prevDay = await binance.prevDay(false)
                        for (let obj of prevDay) {
                            user[0].coin.forEach(element => {
                                if (element.symbol == obj.symbol) {
                                    var str = element.symbol.replace('USDT', '');
                                    obj.image = `vinawalletCoin/${str}.png`
                                    obj.flag = element.flag
                                    testArray.push(obj)
                                }
                            })
                        }
                        var elem
                        var arrayPush = []
                        if (tokenAdd != null) {
                            tokenAdd.forEach((element) => {
                                var flag = false
                                testArray.forEach((ele) => {
                                    if (ele.symbol == `${element.symbol}USDT`) {
                                        elem = element
                                        flag = true
                                    }
                                })
                                if (!flag) {
                                    element.symbol = `${element.symbol}USDT`
                                    testArray.push(element)
                                }
                            })
                        }
                        user[0].listCoin = testArray
                        delete user[0].allWallets
                        delete user[0].tokenAdd
                        socketIO.join(`${user[0].idUser}`)
                        return {
                            status: 200,
                            message: "Đăng nhập thành công !",
                            data: user[0],
                        }
                    } else {
                        return {
                            status: 3,
                            message: "Người dùng chưa bật tính năng login 12 ký tự"
                        }
                    }
                } else {
                    return {
                        status: 2,
                        message: "Người dùng không tồn tại !"
                    }
                }
            } else {
                return {
                    status: 1,
                    message: "12 ký tự không tồn tại !"
                }
            }
        } catch (error) {
            return {
                message: "12 ký tự không hợp lệ",
                status: 7
            }
        }
    },
    getListToken: async (params) => {
        try {
            const {
                token
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                var testArray = []
                const user = await customerQuery.getProfileEmail(email)
                var tokenAdd = JSON.parse(user[0].tokenAdd)
                user[0].coin = await func.getCoinBinance(email)
                const prevDay = await binance.prevDay(false)
                for (let obj of prevDay) {
                    user[0].coin.forEach(element => {
                        if (element.symbol == obj.symbol) {
                            var str = element.symbol.replace('USDT', '');
                            obj.image = `vinawalletCoin/${str}.png`
                            obj.flag = element.flag
                            testArray.push(obj)
                        }
                    })
                }
                var elem
                var arrayPush = []
                if (tokenAdd != null) {
                    tokenAdd.forEach((element) => {
                        var flag = false
                        testArray.forEach((ele) => {
                            if (ele.symbol == `${element.symbol}USDT`) {
                                elem = element
                                flag = true
                            }
                        })
                        if (!flag) {
                            element.symbol = `${element.symbol}USDT`
                            testArray.push(element)
                        }
                    })
                }
                user[0].listCoin = testArray
                return {
                    stauts: 200,
                    data: user[0].listCoin
                }
            } else {
                return {
                    messages: "Vui lòng nhập token ! ",
                    status: 401

                }
            }
        } catch (error) {

        }
    },
    turnToken: async (params) => {
        const {
            token,
            symbol,
            flag
        } = params
        const email = validation.tokenUser(token)
        if (email) {
            //console.log("a");
            if (flag == "true" || flag == "false") {
                const profileUser = await customerQuery.getProfileEmail(email)
                const arrayListCoin = JSON.parse(profileUser[0].listCoin)
                var flagListCoin = false
                var flagTokenAdd = false
                arrayListCoin.forEach((element) => {
                    if (element.symbol == `${symbol}USDT`) {
                        element.flag = flag == "true" ? true : false
                        flagListCoin = true
                    }
                })
                if (flagListCoin) {
                    var str = JSON.stringify(arrayListCoin)
                    await customerQuery.updateListCoint(email, str)
                    return {
                        message: `${flag == "true" ? "Bật" : "Tắt"} ${symbol} thành công !`,
                        data: flag,
                        status: 200
                    }
                }
                const arrayTokenAdd = JSON.parse(profileUser[0].tokenAdd)
                if (arrayTokenAdd != null) {
                    arrayTokenAdd.forEach(element => {
                        if (element.symbol == `${symbol}USDT`) {
                            element.flag = flag == "true" ? true : false
                            flagTokenAdd = true
                        }
                    })
                }
                if (flagTokenAdd) {
                    var str = JSON.stringify(arrayTokenAdd)
                    await customerQuery.updateTokenAdd(email, str)
                    return {
                        message: `${flag ? "Bật" : "Tắt"} thành công !`,
                        data: flag,
                        status: 200
                    }
                }
            } else {
                return {
                    message: "Flag không hợp lệ !",
                    status: 5
                }
            }
        }
    },
    changePassword: async (params) => {
        const {
            token,
            password,
            newPassword
        } = params
        const email = validation.tokenUser(token)
        if (email) {
            const user = await customerQuery.checkAllUserEmailPassword(email, password)
            if (user.length < 0) {
                const addWalet = await customerQuery.updatePassword(email, password)
                return addWalet
            } else {
                return {
                    status: 1,
                    message: "Mật khẩu sai !"
                }
            }
        } else {
            return {
                status: 401,
                messsage: "Vui lòng nhập tokken !!!"
            }
        }
    },
    forgotPassword: async (params) => {
        const {
            email,
            codeEmail,
            password
        } = params
        if (codeEmail == "") {
            return {
                status: 6,
                message: "Vui lòng nhập mã code ! "
            }
        }
        if (validateEmail(email)) {
            const checkCodeEmail = await customerQuery.checkCodeEmailSend(codeEmail)
            if (checkCodeEmail.length > 0) {
                const addWalet = await customerQuery.updatePassword(email, password)
                return addWalet
            } else {
                return {
                    status: 1,
                    message: "Mã code không hợp lệ !"

                }
            }
        } else {
            return {
                status: 3,
                message: "Email không đúng định dạng ! ",
            }
        }
    },
    sendMailForgetPassword: async (params) => {
        const {
            email
        } = params
        if (validateEmail(email)) {
            const emailProfile = await customerQuery.checkAllUserEmail(email)
            if (emailProfile.length > 0) {
                return {
                    status: 2,
                    message: "Email đã tồn tại"
                }
            } else {
                const checkEmailSend = await customerQuery.checkEmailCode(email)
                if (checkEmailSend.length > 0) {
                    return {
                        message: "Email đã được gửi vui lòng đợi thêm 2 phút !",
                        status: 3
                    }
                } else {
                    // const emailCode = await customerQuery.checkEmailCode(email)
                    // console.log(emailCode, "emailCode");
                    setTimeout(async () => {
                        customerQuery.deleteCodeMail(email)
                    }, 120000)
                    const code = Math.floor(Math.random() * 999999) + 100000;
                    const addEmail = await customerQuery.addEmailCode(email, `${code}`)
                    // const updateStatus = await customerQuery.updateCodeMail(email, true)
                    const test = await sendMail.sendMail(email, "Forget Password : ", `<h3>${code}</h3>`)

                    return {
                        status: 200,
                        data: test
                    }
                }
            }
        } else {
            return {
                status: 4,
                message: "Email không đúng định dạng"
            }
        }
    },
    turnOn12Characters: async (params) => {
        try {
            const {
                token,
                characters
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                const code = bip39.mnemonicToEntropy(characters)
                const codeCharacters = await customerQuery.getCharactersEmail(code, email)
                if (codeCharacters.length > 0) {
                    const data = await customerQuery.turnCharacters(email, true)
                    return {
                        status: 200,
                        data: data
                    }
                } else {

                    return {
                        message: "12 ký tự không hợp lệ !",
                        status: 1
                    }
                }
            } else {
                return {
                    message: "Người dùng chưa truyền token !",
                    status: 401
                }
            }
        } catch (error) {
            console.log(error);
            return {
                message: "12 ký tự không hợp lệ !",
                status: 1
            }
        }
    },
    addTokenToUser: async (params) => {
        try {
            const {
                token,
                contract_address
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                const profileUser = await customerQuery.getProfileEmail(email)
                if (profileUser.length > 0) {
                    const data = await axios({
                        url: `https://apilist.tronscan.org/api/token_trc20?contract=${contract_address}&showAll=1&source=true`,
                        method: `GET`,
                    })
                    //console.log(data.data);
                    if (data.data.trc20_tokens.length > 0) {
                        var obj = false;
                        //console.log(data.data);
                        data.data.trc20_tokens.forEach(element => {
                            if (element.contract_address == contract_address) {
                                obj = element
                            }
                        })
                        if (obj) {
                            const strSymbol = obj.symbol
                            const dataSave = {
                                symbol: strSymbol,
                                image: obj.icon_url,
                                contract_address: obj.contract_address,
                                desc: obj.name,
                                flag: true
                            }

                            if (profileUser[0].tokenAdd == null) {
                                var arrayData = []
                                arrayData.push(dataSave)
                                const strData = JSON.stringify(arrayData)
                                await customerQuery.updateUserAddToken(email, strData)
                                return {
                                    status: 200,
                                    message: `Thêm ${obj.desc} thành công !`
                                }
                            } else {

                                var parseAddToken = JSON.parse(profileUser[0].tokenAdd)
                                var flag = true
                                parseAddToken.forEach(e => {
                                    if (e.contract_address == obj.contract_address) {
                                        flag = false
                                    }
                                })
                                if (flag) {
                                    parseAddToken.push(dataSave)
                                    const string = JSON.stringify(parseAddToken)
                                    await customerQuery.updateUserAddToken(email, string)
                                    return {
                                        status: 200,
                                        message: `Thêm ${strSymbol} thành công !`
                                    }
                                } else {
                                    return {
                                        message: "Token đã tồn tại trong danh sách của bạn !",
                                        status: 4
                                    }
                                }
                            }
                        } else {
                            return {
                                status: 7,
                                message: "Chỉ được thêm Token-TRC20"
                            }
                        }
                    } else {
                        return {
                            status: 2,
                            message: "Coin không tồn tại !"
                        }
                    }
                } else {
                    return {
                        status: 3,
                        message: "Người dùng không tồn tại"
                    }
                }
            } else {
                return {
                    status: 1,
                    message: "Vui lòng truyền token !"
                }
            }
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                message: "Lỗi hệ thống !",
            }
        }
    },
    sreachToken: async (params) => {
        const {
            limit,
            page
        } = params
        // const data = await axios({
        //     url: `https://apilist.tronscan.org/api/search-main?term=${keyword}`,
        //     method: `GET`,
        // })
        console.log(limit, page);
        const test = customerQuery.getUserToWallet(limit, page)
        const co = customerQuery.getUserToWalletCount()
        const [aray, cos] = await Promise.all([test, co])
        return {
            status: 200,
            // data: data.data,
            aray,
            cos
        }
    },
    get12Characters: async (params) => {
        try {
            const {
                token
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                const profileUser = await customerQuery.getProfileEmail(email)
                if (profileUser.length > 0) {
                    if (profileUser[0].characters != 1) {
                        const getCharacterUser = await customerQuery.getCharactersEmail(email)
                        if (getCharacterUser.length > 0) {
                            const str = makeid(15)
                            const hex = bip39.mnemonicToSeedSync(str).toString('hex')
                            const stringBip39 = hex.slice(0, 32)
                            await customerQuery.updateCharacters(email, stringBip39)
                            const mnemonic = bip39.entropyToMnemonic(stringBip39)
                            var res = mnemonic.split(" ");
                            return {
                                status: 200,
                                data: res
                            }
                        } else {
                            const str = makeid(15)
                            const hex = bip39.mnemonicToSeedSync(str).toString('hex')
                            const stringBip39 = hex.slice(0, 32)
                            await customerQuery.addCharacters(stringBip39, email)
                            const mnemonic = bip39.entropyToMnemonic(stringBip39)
                            var res = mnemonic.split(" ");
                            return {
                                status: 200,
                                data: res
                            }

                        }

                        // bb20916341efae23ee50fbc23c4577a88
                    } else {
                        return {
                            message: "Người dùng đã bật 12 ký tự !",
                            status: 5
                        }
                    }
                } else {
                    return {
                        status: 4,
                        message: "User không tồn tại !"
                    }
                }

            } else {
                return {
                    status: 1,
                    message: "Vui lòng truyền token !"
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    convertCoin: async (params) => {
        try {
            const {
                token,
                idTransaction
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                const data = await func.getListCoin(email)
                const transaction = await customerQuery.getTransaction(idTransaction)
                if (transaction.length > 0) {
                    var stringForm, stringTo
                    var flagForm = false
                    var flagTo = false
                    data.forEach(element => {
                        if (element.symbol == transaction[0].idForm) {
                            stringForm = element.symbol.replace('USDT', '');
                            flagForm = true
                        }
                    })
                    if (!flagForm) {
                        return {
                            status: 2,
                            message: "Id Form không hỗ trợ "
                        }
                    }
                    data.forEach(element => {
                        if (element.symbol == transaction[0].idTo) {
                            stringTo = element.symbol.replace('USDT', '');
                            flagTo = true
                        }
                    })
                    if (!flagTo) {
                        return {
                            status: 3,
                            message: "Id To không hỗ trợ "
                        }
                    }
                    const idUser = validation.tokenUser(token, true)
                    const getWallet = await customerQuery.getWalletToId(idUser)
                    if (getWallet.length > 0) {
                        var flagConvert = false
                        //console.log(getWallet);
                        getWallet.forEach(async element => {
                            if (element.symbol == stringForm) {
                                flagConvert = true
                                const hieu = parseFloat(element.amount) - parseFloat(transaction[0].amountForm)
                                await customerQuery.updateTransfer(element.wallet, hieu)
                            }
                            if (element.symbol == stringTo) {
                                flagConvert = true
                                const tong = parseFloat(element.amount) + parseFloat(transaction[0].amountTo)
                                await customerQuery.updateTransfer(element.wallet, tong)
                            }
                        })
                        if (flagConvert) {
                            customerQuery.deletePriceCoin(idTransaction)
                            return {
                                message: "Đổi coin thành công !",
                                status: 200
                            }
                        } else {
                            return {
                                message: "Đổi coin thất bại !",
                                status: 9
                            }
                        }
                    } else {
                        return {
                            status: 4,
                            message: "Người dùng chưa có địa chỉ ví !"
                        }
                    }
                } else {
                    return {
                        status: 1,
                        message: "Giao dịch không tồn tại ! "
                    }
                }
            } else {
                return {
                    message: "Token is not define !",
                    status: 401
                }
            }

        } catch (error) {
            return {
                status: 500,
                message: "Lỗi hệ thống",
                error,
            }
        }

    },
    getProfile: async (params) => {
        try {
            const {
                token
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                const profile = await customerQuery.getProfileEmail(email)
                return {
                    status: 200,
                    message: "Lấy thông tin thành công !",
                    data: profile[0]
                }
            } else {
                return {
                    status: 1,
                    message: "Vui lòng truyền token !"
                }
            }

        } catch (error) {
            return {
                message: "Không hỗ trợ !",
                status: false,
                err: error
            }
        }

    },
    getPriceConvert: async (params) => {
        try {
            const {
                symbolForm,
                symbolTo,
                amount,
                token
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                let idFormUSDT, price
                const data = await func.getListCoin(email)
                var priceIdForm
                data.forEach(element => {
                    if (element.symbol == symbolForm) {
                        idFormUSDT = element.askPrice * amount
                        priceIdForm = element.askPrice
                    }
                })
                data.forEach(element => {
                    if (element.symbol == symbolTo) {
                        price = idFormUSDT / element.askPrice
                    }
                })
                if (price) {
                    const dataId = await customerQuery.addPriceCoin(priceIdForm, symbolForm, symbolTo, amount, price)
                    setTimeout(async () => {
                        customerQuery.deletePriceCoin(dataId.rows.insertId)
                    }, 10000)
                    return {
                        message: "Lấy giá coin thành công !",
                        status: 200,
                        data: {
                            amount: price,
                            idTransaction: dataId.rows.insertId,
                            price: priceIdForm
                        }
                    }
                }
                return {
                    message: "Không hỗ trợ !",
                    status: 1,
                }
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Không hỗ trợ !",
                status: false,
                err: error
            }
        }

    },
    getAllToken: async (params) => {
        const data = await customerQuery.getTokenAll()
        return {
            data: data,
            status: 200,
            message: "Lấy token thành công !"
        }
    },
    test: async function (params) {
        try {
            /////
            // parseInt(result._hex)
            // const a = tronWeb.toUtf8("5d28560a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000046b69656e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046b616b6100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000374656f0000000000000000000000000000000000000000000000000000000000")
            //console.log(tronWeb.toUtf8("5d28560a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000e3078363136323633343134323433000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e3078363136323633343134323433000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e3078363136323633343134323433000000000000000000000000000000000000"));
            // console.log("A");
            // const a = await web3.eth.getCode("0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9")
            // console.log(a);
            // const data = await tronWeb.trx.getContract("TLk4SnKJ2svN3a3qi48ALy2cDMhQAgkQte")
            // console.log(data);
            // return {
            //     data: data
            // }
            // coinList.symbolBinance

            // const { a } = params
            // const b = await tronWeb.trx.getTokensIssuedByAddress("TF5Bn4cJCT6GVeUgyCN4rBhDg42KBrpAjg");
            // console.log(b);
            // bip39.wordlists.english
            // bip39.setDefaultWordlist('english')
            // const asd = makeid(32);
            // console.log(asd);
            // const data = bip39.entropyToMnemonic('TCRTXSP73h37X8og4meABADEG1NNK8Uo7v')

            // console.log(data);
            // console.log("a", a);
            // const data = await accounts.create();
            // console.log(data);
            // binance.prevDay("USDTVND", (error, prevDay, symbol) => {
            //   //console.log(symbol + " previous day:", prevDay);
            //   //console.log("BNB change since yesterday: " + prevDay.priceChangePercent + "%")
            // });
        } catch (error) {
            console.log(error);
        }

    },
    getBalance: async (params, socketIO, io) => {
        try {
            const {
                idUser,
                token,
                symbol
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                const wallet = await customerQuery.getWalletToId(idUser, symbol)
                if (wallet.length > 0) {
                    return {
                        status: 200,
                        data: wallet[0].amount,
                        message: `Lấy số dư ${symbol} thành công !`
                    }
                } else {
                    return {
                        status: 1,
                        message: `Người dùng chưa có ví ${symbol}`
                    }
                }
            } else {
                return {
                    status: 401,
                    message: "Jwt tokens !"
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    updateTokenApp: async (params, socketIO, io) => {
        try {
            const {
                tokenApp,
                token
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                const checkTokenUser = await customerQuery.chekTokenUser(tokenApp, email)
                if (checkTokenUser.length > 0) {
                    return {
                        status: 201,
                        message: "Token app đã thêm từ trước !"
                    }
                } else {
                    const sreachToken = await customerQuery.getTokenApp(tokenApp)
                    if (sreachToken.length > 0) {
                        const data = await customerQuery.updateTokenAppWallet(tokenApp, email)
                        return data
                    } else {
                        const flag = await customerQuery.addTokenAppEmail(tokenApp, email)
                        return flag
                    }
                }
            } else {
                return {
                    status: 401,
                    message: "jWT TOKEN !!!"
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    addTokenApp: async (params, socketIO, io) => {
        try {
            const {
                tokenApp
            } = params
            const flag = await customerQuery.addTokenApp(tokenApp)
            return flag
        } catch (error) {
            console.log(error);
        }
    },
    loginSave: async (params, socketIO, io) => {
        const {
            token
        } = params
        const idUser = validation.tokenUserLogin(token)
        if (idUser) {
            socketIO.join(`${idUser}`)
            return {
                status: 200,
            }
        } else
            return {
                stauts: 401,
                message: "jwt token"
            }
    },
    tranfer: async (params, socketIO, io) => {
        try {
            const {
                symbol,
                token,
                address,
                amount,
                otp
            } = params
            const email = validation.tokenUser(token)
            if (email) {
                const profileUser = await customerQuery.getProfileEmail(email)
                if (profileUser[0].twofa == 1) {
                    if (amount <= 0) {
                        return {
                            message: "Số tiền chuyển không thể thực thi !",
                            status: 4
                        }
                    }
                    const walletUser = await customerQuery.getWallet(profileUser[0].idUser, symbol)
                    let a = authenticator.verify({
                        token: otp,
                        secret: profileUser[0].secret
                    })
                    if (a) {
                        if (walletUser.length > 0) {
                            if (walletUser[0].amount < amount) {
                                return {
                                    message: "Số dư không đủ !",
                                    status: 10
                                }
                            }
                            const userTo = await customerQuery.getWalletToAddress(address, symbol)
                            if (userTo.length > 0) {
                                if (userTo[0].wallet == walletUser[0].wallet) {
                                    return {
                                        message: "Không thể tự chuyển vào ví của mình !",
                                        status: 13
                                    }
                                }
                                //console.log(parseFloat(walletUser[0].amount) - parseFloat(amount));
                                var tong = parseFloat(userTo[0].amount) + parseFloat(amount)
                                var hieu = parseFloat(walletUser[0].amount) - parseFloat(amount)
                                //console.log(hieu, "hieu");
                                const a = await customerQuery.updateTransfer(walletUser[0].wallet, hieu)
                                await customerQuery.updateTransfer(address, tong)
                                var data = await axios({
                                    url: `https://poloniex.com/public?command=returnTicker`,
                                    method: "GET"
                                })
                                await customerQuery.addHistory(profileUser[0].idUser, "Success !", "withDraw", amount, data.data[`USDT_${symbol}`].last)
                                await customerQuery.addHistory(userTo[0].idUser, "Success !", "deposit", amount, data.data[`USDT_${symbol}`].last)
                                const success = {
                                    status: 200,
                                    data: {
                                        title: email,
                                        detail: `Chuyển ${amount} ${symbol} đến bạn ! `
                                    }
                                }

                                io.to(`${userTo[0].idUser}`).emit('succesTranfer', success)
                                return {
                                    message: "Chuyển tiền thành công ! ",
                                    status: 200,
                                }
                            } else {
                                return {
                                    message: "Địa chỉ ví không tồn tại !",
                                    status: 6
                                }
                            }
                        } else {
                            return {
                                message: `Người dùng chưa có ví ${symbol} !`,
                                status: 5
                            }
                        }
                    } else {
                        return {
                            message: "Mã xác nhận không đúng !",
                            status: 11
                        }
                    }
                } else {
                    return {
                        status: 8,
                        message: "Người dùng chưa bật 2FA !"
                    }
                }

            } else {
                return {
                    message: "Lỗi hệ thống ! ",
                    status: 500
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    createWallet: async (params) => {
        const {
            symbol,
            token
        } = params
        const email = validation.tokenUser(token)
        if (email) {
            const allWallet = await customerQuery.getProfileEmail(email)
            // const wallet = JSON.parse(allWallet[0].allWallets)
            var flagSymbol = coinList.obj
            var flag = false
            flagSymbol.forEach(element => {
                if (element.symbol == symbol) {
                    flag = true
                }
            })
            if (flag) {
                const obj = {
                    currency: symbol,
                    label: allWallet[0].idUser + `_${Math.floor(Math.random() * 9999999999) + 100000}`
                }
                const checkUserWallet = await customerQuery.checkUserWallet(allWallet[0].idUser, symbol)

                if (checkUserWallet.length > 0) {
                    return {
                        status: 2,
                        message: "Ví đã tồn tại !",
                        data: checkUserWallet[0].wallet
                    }
                }
                const createWallet = await client.getCallbackAddress(obj)
                await customerQuery.createWallet(obj.label, symbol, allWallet[0].idUser, createWallet.address)
                return {
                    status: 200,
                    message: `Tạo ví ${symbol} thành công !`,
                    data: {
                        amount: 0,
                        lable: obj.label,
                        wallet: createWallet.address,
                        symbol: symbol,
                        idUser: allWallet[0].idUser,
                    }
                }
            } else {
                return {
                    status: 1,
                    message: `Không hỗ trợ ${symbol} !`
                }
            }
        } else {
            return {
                message: "Lỗi hệ thống ! ",
                status: 500
            }
        }
    },
    signUp: async (params) => {
        const {
            email,
            codeEmail,
            password
        } = params
        if (codeEmail == "") {
            return {
                status: 6,
                message: "Vui lòng nhập mã code ! "
            }
        }
        if (validateEmail(email)) {
            const user = await customerQuery.checkAllUserEmail(email)
            if (user.length > 0) {
                return {
                    status: 2,
                    message: "Email đã tồn tại !"
                }
            } else {
                const checkCodeEmail = await customerQuery.checkCodeEmailSend(codeEmail)
                if (checkCodeEmail.length > 0) {
                    const res = await tronWeb.createAccount()

                    let objWallet = {
                        hex: res.address.hex,
                        base58: res.address.base58,
                        email: email,
                        privateKey: res.privateKey,
                        publicKey: res.publicKey
                    }
                    const addWalet = await customerQuery.addWalletsEmail(objWallet)
                    const data = await customerQuery.addUserEmail(email, password)
                    return data
                } else {
                    return {
                        status: 1,
                        message: "Mã code không hợp lệ !"
                    }
                }
            }
        } else {
            return {
                status: 3,
                message: "Email không đúng định dạng ! ",
            }
        }

    },
    loginVina: async (params, socketIO, io) => {
        try {
            const {
                email,
                password
            } = params
            // email.toLowerCase()
            if (validateEmail(email)) {
                const user = await customerQuery.checkAllUserEmailPassword(email, password)
                if (user.length > 0) {
                    let cusObj = user[0]
                    let token = jwt.sign({
                        cusObj
                    }, "token_vinawallet", {
                        expiresIn: 60 * 518400
                    });
                    const wallet = await customerQuery.getWalletEmail(email)
                    const walletCode = await customerQuery.getWalletToId(user[0].idUser)
                    user[0].token = token
                    user[0].coin = await func.getCoinBinance(email)
                    delete wallet[0].phone
                    delete wallet[0].email
                    user[0].wallets = wallet[0]
                    user[0].infoWallets = walletCode
                    // const listCoin = JSON.parse(user[0].listCoin)
                    var testArray = []
                    var tokenAdd = JSON.parse(user[0].tokenAdd)

                    const prevDay = await binance.prevDay(false)

                    for (let obj of prevDay) {
                        user[0].coin.forEach(element => {
                            if (element.symbol == obj.symbol) {
                                var str = element.symbol.replace('USDT', '');
                                obj.image = `vinawalletCoin/${str}.png`
                                obj.flag = element.flag
                                testArray.push(obj)
                            }
                        })
                    }


                    var elem

                    var arrayPush = []
                    if (tokenAdd != null) {
                        tokenAdd.forEach((element) => {
                            var flag = false
                            testArray.forEach((ele) => {
                                if (ele.symbol == `${element.symbol}USDT`) {
                                    elem = element
                                    flag = true
                                }
                            })
                            if (!flag) {
                                element.symbol = `${element.symbol}USDT`
                                testArray.push(element)
                            }
                        })
                    }
                    user[0].listCoin = testArray
                    delete user[0].allWallets
                    delete user[0].tokenAdd
                    socketIO.join(`${user[0].idUser}`)
                    return {

                        status: 200,
                        message: "Đăng nhập thành công !",
                        data: user[0],
                    }
                } else {
                    return {
                        status: 2,
                        message: "Email hoặc mật khẩu không đúng ! ",
                    }
                }
            } else {
                return {
                    status: 1,
                    message: "Email không đúng định dạng ! ",
                }
            }
        } catch (error) {
            return {
                message: "error",
                error
            }
        }

    },
    sendMail: async (params) => {
        const {
            email
        } = params
        if (validateEmail(email)) {
            const emailProfile = await customerQuery.checkAllUserEmail(email)
            if (emailProfile.length > 0) {
                return {
                    status: 2,
                    message: "Email đã tồn tại"
                }
            } else {

                const checkEmailSend = await customerQuery.checkEmailCode(email)
                if (checkEmailSend.length > 0) {
                    return {
                        message: "Email đã được gửi vui lòng đợi thêm 2 phút !",
                        status: 3
                    }
                } else {
                    // const emailCode = await customerQuery.checkEmailCode(email)
                    // console.log(emailCode, "emailCode");
                    setTimeout(async () => {
                        customerQuery.deleteCodeMail(email)
                    }, 120000)
                    const code = Math.floor(Math.random() * 999999) + 100000;
                    const addEmail = await customerQuery.addEmailCode(email, `${code}`)
                    // const updateStatus = await customerQuery.updateCodeMail(email, true)
                    const test = await sendMail.sendMail(email, "Signup code : ", `<h3>${code}</h3>`)

                    return {
                        status: 200,
                        data: test
                    }
                }

            }
        } else {
            return {
                status: 4,
                message: "Email không đúng định dạng"
            }
        }
    },
    getHistory: async (params) => {
        const {
            token
        } = params
        const idUser = validation.tokenUser(token, true)
        if (idUser) {
            const history = await customerQuery.getHistoryToIdUser(idUser)
            return {
                message: "success history ! ",
                data: history,
                status: 200
            }
        } else {
            return {
                status: 401,
                message: "Token is not define !"
            }
        }

    },
}