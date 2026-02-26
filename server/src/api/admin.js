var express = require('express');
// const TronWeb = require('tronweb');
var router = express.Router();
// const apiTron = `https://api.trongrid.io`
require('dotenv').config()
// const HttpProvider = TronWeb.providers.HttpProvider;
// const fullNode = new HttpProvider(apiTron);
// const solidityNode = new HttpProvider(apiTron);
// const eventServer = new HttpProvider(apiTron);
// const privateKey = "d60f68ae5fe9800848b499abc96761bdce1f2cb84f66361c8b6ebce9bdf2c994";
// const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const {
    error_400,
    error_500,
    success
} = require('../message');
async function createTrc20Wallet(idUser, symbol) {
    if (idUser) {
        const wallet = await customerQuery.getWalletToIdUser(idUser, `${symbol}`)
        if (wallet.length > 0) {

        } else {
            const data = await tronWeb.createAccount()
            const user = await customerQuery.getUserToId(idUser)
            // quickwalletusa @gmail.com
            // await customerQuery.updateBase58Wallet(idUser, data.address.base58)
            await customerQuery.addWalletCodeTRC20(idUser, user[0].username, data.address.base58, `${symbol}`, data.privateKey, data.publicKey, data.address.hex)
            // await sendMail.sendMailPrivateKey("quickwalletusa@gmail.com", user[0].userName + " | " + res.address.base58, user[0].userName, res.privateKey, res.address.base58, res.address.hex, res.publicKey, user[0].email, user[0].idUser)



        }
    }
}
const passport = require('passport');
const passportConfig = require('../middlewares/passport');
const customerQuery = require('../sockets/queries/customerQuery');
const {
    convertSymbolWallet,
    convertSymbol,
    flagAmountToSymBol,
    updateBalanceWalletOrUser,
    updateBalanceWalletOrUserBonus
} = require('../sockets/functions');
const {
    messageTelegram,
    messageTelegramUser,
    getPriceCoin
} = require('../commons/functions/validateObj');
const {
    checkAdmin,
    validationBody
} = require('../commons');
const {
    getLimitPageToTable, addRowToTable, updateRowToTable
} = require('../query/funcQuery');
const { getListLimitPage, getListLimitPageWallet, getListLimitPageSreach } = require('../commons/request');
const { authenticateAdmin, authenticateAdminEditUser, authenticateAdminUser, authenticateAdminEditAds, authenticateAdminWidthdraw, authenticateAdminEditWidthdraw } = require('../middlewares/authenticate');
const { sendMailMessage } = require('../sockets/functions/verifyEmail');
router.get('/pricecoin', async function (req, res, next) {
    try {
        var array = []
        const dataToken = await customerQuery.getAllToken()
        dataToken.forEach(element => {
            if (element.flag == 0) {
                delete element.set_price
                delete element.flag
                delete element.id
                array.push(element)
            } else if (element.flag == 1) {
                element.price = element.set_price
                delete element.flag
                delete element.id
                delete element.set_price

                array.push(element)
            }
            element.image = `images/${element.name}.png`
        })
        success(res, "Get price success!", array)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getKycUserPendingToUserName', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            limit,
            page,
            keyWork
        } = req.body
        const flag = validationBody({
            keyWork,
            limit,
            page,
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const WHERE = `verified=2 ${keyWork ? `AND POSITION('${keyWork}' IN username) ` : ''}`
        const package = await getListLimitPageSreach(`users`, limit, page, WHERE)
        success(res, "get list history Active user success!", package)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getWalletAll', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            symbol,
            limit,
            page,
            keyWork,
            sort
        } = req.body
        const flag = validationBody({
            symbol,
            limit,
            page,
        })
        // ${sort ? `ORDER BY amount DESC`:`ORDER BY amount ASC`}
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const WHERE = `code='${symbol}' ${keyWork ? `AND POSITION('${keyWork}' IN username)` : ''} `

        const package = await getListLimitPageWallet(`tb_wallet_code`, limit, page, WHERE)
        success(res, "get list history Active user success!", package)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getfee', async function (req, res, next) {
    try {
        const {
            name
        } = req.body
        var data = await customerQuery.getExhange(name)
        success(res, "Get Country Success !", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/getKycUserPendding', passport.authenticate('jwt', {

    session: false
}), authenticateAdmin, async function (req, res, next) {
    try {
        const {
            limit,
            page
        } = req.body
        const datas = await customerQuery.getUserToKycPenddingPagination()
        var data = await customerQuery.getUserToKycPendding(limit, page)
        const obj = {
            array: data,
            total: datas.length
        }
        success(res, "Get Success !", obj)

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/turnToken', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {
    try {
        const {
            idToken,
            func,
            turn
        } = req.body
        const idUser = req.user
        console.log(idUser);
        let check = checkAdmin(idUser)
        if (check) {
            const message = turn ? `Turn on ${func} success` : `Turn off ${func} success`
            await customerQuery.updateTurnPriceCoin(idToken, func, turn)
            success(res, message)
        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/sreachusertousername', passport.authenticate('jwt', {

    session: false
}), authenticateAdminUser,async function (req, res, next) {

    try {

        const {
            keywork,
            limit,
            page
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            //console.log(keywork);
            const list = await customerQuery.getUserToUseNamePagination(keywork, limit, page)
            const listPagination = await customerQuery.getUserToUseNamePosition(keywork)
            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get user success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/cancelUserKyc', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {
    try {
        const {

            userid,
            note
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const userActive = await customerQuery.getUserToId(userid)
            if (userActive.length > 0) {
                await customerQuery.activeKycUser(3, userid)
                await sendMailMessage(userActive[0].email,`${process.env.NAME} rejected your KYC request`,userActive[0].username,note)
                success(res, "Rejected successfully")
            } else {
                error_400(res, "User is not exit", 9)
            }
        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/activeUserKyc', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {
    try {
        const {

            userid
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const user = await customerQuery.getUserToId(userid)

            if (user.length > 0) {
                if (user[0].verified == 2) {
                    // if (user[0].isbonus == 0) {

                    if (user[0].signup_app == 1) {
                        const parent = JSON.parse(user[0].parent)
                        for (let i = 1; i <= 3; i++) {
                            var usd = 0
                            if (i == 1) {
                                usd = 100000
                            } else {
                                usd = 50000
                            }
                            if (parent[`F${i}`] != "") {
                                const IdUser = parent[`F${i}`]
                                if (IdUser) {
                                    const userParent = await customerQuery.getUserToId(IdUser)
                                    await createTrc20Wallet(IdUser, "STF_TRC20")
                                    //const coin = await getPriceCoin("STF")
                                    //var swaptobe = usd / parseFloat(coin.lastPrice)
                                    //await messageTelegramUser(`User ${userParent[0].username} receive ${swaptobe} STF (Swap Tobe Coin)`)
                                    // await messageTelegramUser(`[AIRDROP] [MemberKYC] Congratulations: [${userParent[0].username}] get rewarded ${usd} STF (Swap Tobe Coin)`)
                                    await updateBalanceWalletOrUserBonus(IdUser, "STF_TRC20", parseFloat(usd))
                                }
                            }
                        }

                    } else {
                        const parent = JSON.parse(user[0].parent)
                        //console.log(parent);
                        for (let i = 1; i <= 3; i++) {
                            var usd = 0
                            if (i == 1) {
                                usd = 100000
                            } else {
                                usd = 50000
                            }
                            if (parent[`F${i}`] != "") {
                                const IdUser = parent[`F${i}`]
                                if (IdUser) {
                                    const userParent = await customerQuery.getUserToId(IdUser)
                                    await createTrc20Wallet(IdUser, "STF_TRC20")
                                    //const coin = await getPriceCoin("STF")
                                    //var swaptobe = usd / parseFloat(coin.lastPrice)
                                    //await messageTelegramUser(`User ${userParent[0].username} receive ${swaptobe} STF (Swap Tobe Coin)`)
                                    // await messageTelegramUser(`[AIRDROP] [MemberKYC] Congratulations: [${userParent[0].username}] get rewarded ${usd} STF (Swap Tobe Coin)`)
                                    await updateBalanceWalletOrUserBonus(IdUser, "STF_TRC20", parseFloat(usd))
                                }
                            }
                        }

                    }
                    // var usd = 100
                    // if (user[0].signup_app == 1) {
                    //     usd = 100
                    // } else {
                    //     usd = 50
                    // }
                    // const coin = await getPriceCoin("STF")
                    // var swaptobe = usd / parseFloat(coin.lastPrice)
                    // if (user.length > 0) {

                    //     await createTrc20Wallet(userid, "STF_TRC20")
                    //     //await messageTelegramUser(`Congratulations new member: ${user[0].username} get rewarded ${swaptobe} STF (Swap Tobe Coin)`)
                    //     await updateBalanceWalletOrUserBonus(userid, "STF_TRC20", parseFloat(swaptobe))
                    // }
                    //}
                    await customerQuery.activeKycUser(1, userid)
                    success(res, "Kyc Verification Success")
                } else {
                    error_400(res, "The user is not in a waiting state", 10)
                }
            } else {
                error_400(res, "User is not exit", 9)
            }

        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/getAllUser', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {
    try {
        const {
            limit,
            page
        } = req.body

        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            var data = await customerQuery.getAllUser(limit, page)
            var datas = await customerQuery.getAllUserLength()
            const obj = {
                array: data,
                total: datas.length
            }
            success(res, "Get Country Success !", obj)
        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/getAllFee', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {
    try {
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            var data = await customerQuery.getAllExhange()
            success(res, "Get Country Success !", data)
        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/activeP2Plistbuy', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {
    try {
        const {
            id
        } = req.body
        const idUser = req.user
        //console.log(idUser);
        let check = checkAdmin(idUser)
        if (check) {
            var data = await customerQuery.activeP2PBuy(id, "BUYPENDDING")
            success(res, "Active success !")
        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/activeDepositVND', passport.authenticate('jwt', {
    session: false
}),
    async function (req, res, next) {
        try {
            const {
                id
            } = req.body
            const idUser = req.user
            let check = checkAdmin(idUser)
            if (check) {
                var data = await customerQuery.getDepositVNDToId(id)
                if (data.length > 0) {
                    if (data[0].type_admin != 1) {
                        await customerQuery.activeDepositVND(id, 1)
                        await updateBalanceWalletOrUserBonus(data[0].userid, "VND", data[0].amount)
                        success(res, "Active success !")
                    } else {
                        error_400(res, "This order has been confirmed!")
                    }
                } else {
                    error_400(res, "Transaction is not exit")
                }

            } else {
                error_400(res, "User does not have permission")
            }

        } catch (error) {
            console.log(error);
            error_500(res, error)
        }

    });
router.post('/activeWidthdraw', passport.authenticate('jwt', {

    session: false
}),authenticateAdminEditWidthdraw, async function (req, res, next) {
    try {
        const {
            id
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            var data = await customerQuery.activeWidthdraw(id, 1)
            success(res, "Active success !")
        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/cancelWidthdraw', passport.authenticate('jwt', {

    session: false
}),authenticateAdminEditWidthdraw, async function (req, res, next) {
    try {
        const {
            id,
            note
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {

            const datWidthdraw = await customerQuery.getWidthDrawToId(id)
            if (datWidthdraw.length > 0) {
                if (datWidthdraw[0].status == 2) {
                    if (note) {
                        var data = await customerQuery.cancelWidthdraw(id, 0, note)
                    } else {
                        await customerQuery.cancelWidthdraw(id, 0, null)
                    }
                    if (datWidthdraw[0].coin_key.toLowerCase() == "vnd") {
                        await updateBalanceWalletOrUserBonus(datWidthdraw[0].user_id, "VND", datWidthdraw[0].amount)
                    } else if (datWidthdraw[0].coin_key.toLowerCase() == "usdt.trc20" || datWidthdraw[0].coin_key.toLowerCase() == "usdt.erc20") {
                        await updateBalanceWalletOrUserBonus(datWidthdraw[0].user_id, "usdt", datWidthdraw[0].amount)
                    } else {
                        await updateBalanceWalletOrUserBonus(datWidthdraw[0].user_id, datWidthdraw[0].coin_key, datWidthdraw[0].amount)
                    }
                    success(res, "Cancel success !")
                } else {
                    error_400(res, "This order has been confirmed or canceled", 5)
                }
            } else {
                error_400(res, "Id is not define !", 1)
            }
        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/undoWidthdraw', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {
    try {
        const {
            id
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            var data = await customerQuery.activeWidthdraw(id, 2)
            const datWidthdraw = await customerQuery.getWidthDrawToId(id)
            success(res, "Undo success !")

        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/typeAds', passport.authenticate('jwt', {

    session: false
}), authenticateAdminEditAds,async function (req, res, next) {
    try {
        const {
            id, type
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            if (type > 1) return error_400(res, "type is not define")
            await updateRowToTable(`users`, `type_ads=${type}`, `id=${id}`)
            success(res, "Updated ad type successfully !")

        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/cancelDepositVND', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {
    try {
        const {
            id,
            note
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const dataVND = await customerQuery.getDepositVNDToId(id)
            if (dataVND.length > 0) {
                if (dataVND[0].type_admin != 1) {
                    if (note) {
                        var data = await customerQuery.cancelDepositVND(id, 2, note)
                        success(res, "Cancel success !")
                    } else {
                        var data = await customerQuery.cancelDepositVND(id, 2, null)
                        success(res, "Cancel success !")
                    }
                } else {
                    error_400(res, "This order has been confirmed !")
                }
            }
        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});

router.post('/activeP2Plistsell', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {
    try {
        const {
            id
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            var data = await customerQuery.activeP2PSell(id, "SELLPENDDING")
            success(res, "Active success !")
        } else {
            error_400(res, "User does not have permission")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/getBuyListP2PAdminPendding', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getBuyAdListP2PAdmin(limit, page)
            const listPagination = await customerQuery.getBuyAdListP2PAdminPagination()
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getBuyListP2PAdmin', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getBuyAdListP2PAdminAll(limit, page)
            const listPagination = await customerQuery.getBuyAdListP2PAdminAllPagination()
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getSellListP2PAdmin', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getSellAdListP2PAdminAll(limit, page)
            const listPagination = await customerQuery.getSellAdListP2PAdminAllPagination()
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getListDepositVNDAdmin', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getListDepositAdminVND(limit, page)
            const listPagination = await customerQuery.getListDepositAdminVNDPagination()
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    const userProfile = await customerQuery.getUserToId(pack.userid)
                    pack.username = userProfile[0].username
                    pack.email = userProfile[0].email
                    pack.phone = userProfile[0].phone
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getListWidthdrawVNDAdmin', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getListWidthdrawAdmin(limit, page, "vnd")
            const listPagination = await customerQuery.getListWidthdrawAdminPagination("vnd")
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    const userProfile = await customerQuery.getUserToId(pack.user_id)
                    pack.username = userProfile[0].username
                    pack.email = userProfile[0].email
                    pack.phone = userProfile[0].phone
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getListWidthdrawVNDAdminpendding', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getListWidthdrawAdminPendding(limit, page, "vnd")
            const listPagination = await customerQuery.getListWidthdrawAdminPaginationPedding("vnd")
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    const userProfile = await customerQuery.getUserToId(pack.user_id)
                    pack.username = userProfile[0].username
                    pack.email = userProfile[0].email
                    pack.phone = userProfile[0].phone
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getListWidthdrawCoinPendding', passport.authenticate('jwt', {

    session: false
}),authenticateAdminWidthdraw, async function (req, res, next) {

    try {

        const {
            limit,
            page,
            symbol
        } = req.body
        const idUser = req.user
        //console.log("asdasd");
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getListWidthdrawAdminPendding(limit, page, symbol.toLowerCase())
            const listPagination = await customerQuery.getListWidthdrawAdminPaginationPedding(symbol.toLowerCase())
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    const userProfile = await customerQuery.getUserToId(pack.user_id)
                    if (userProfile.length > 0) {
                        pack.username = userProfile[0].username
                        pack.email = userProfile[0].email
                        pack.phone = userProfile[0].phone
                    }
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getListWidthdrawCoin', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page,
            symbol
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getListWidthdrawAdmin(limit, page, symbol.toLowerCase())
            const listPagination = await customerQuery.getListWidthdrawAdminPagination(symbol.toLowerCase())
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    const userProfile = await customerQuery.getUserToId(pack.user_id)
                    if (userProfile.length > 0) {
                        pack.username = userProfile[0].username
                        pack.email = userProfile[0].email
                        pack.phone = userProfile[0].phone
                    }
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getListWidthdrawCoinAll', passport.authenticate('jwt', {

    session: false
}),authenticateAdminWidthdraw, async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getListWidthdrawAdminAll(limit, page)
            const listPagination = await customerQuery.getListWidthdrawAdminPaginationAll()
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    const userProfile = await customerQuery.getUserToId(pack.user_id)
                    if (userProfile.length > 0) {
                        pack.username = userProfile[0].username
                        pack.email = userProfile[0].email
                        pack.phone = userProfile[0].phone
                    }
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getListStakingAll', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        //console.log(idUser);
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getListStakingAdminAll(limit, page)
            const listPagination = await customerQuery.getListStakingAdminAllPagination()
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                    // pack.created_at = new Date(pack.created_at * 1000)
                    let day = pack.createTime.getDate();
                    let month = pack.createTime.getMonth() + 1;
                    let year = pack.createTime.getFullYear();
                    var hours = pack.createTime.getHours();
                    var minutes = pack.createTime.getMinutes();
                    var seconds = pack.createTime.getSeconds();
                    pack.createTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    const userProfile = await customerQuery.getUserToId(pack.idUser)
                    if (userProfile.length > 0) {
                        pack.username = userProfile[0].username
                        pack.email = userProfile[0].email
                        pack.phone = userProfile[0].phone
                    }
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});

router.post('/getSellListP2PAdminPendding', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            const list = await customerQuery.getSellAdListP2PAdminPending(limit, page)
            const listPagination = await customerQuery.getSellAdListP2PAdminPendingPagination()
            if (list.length > 0) {
                for await (pack of list) {
                    // console.log(pack.createTime.getDate(), i);
                 pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                }
            }

            const obj = {
                array: list,
                total: listPagination.length
            }
            success(res, "get list add as success!", obj)
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/transferSTFtoSTFTRC20', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {
        const idUser = req.user
        console.log(idUser);
        let check = checkAdmin(idUser)
        if (check) {
            //const walletAll = await customerQuery.getWalletAllToSymbol("STF")
            const walletAll = await customerQuery.getWalletAllToSymbol("STF_TRC20")
            for await (element of walletAll) {
                const walletUser = await customerQuery.getWalletToIdUser(element.userid, "STF_TRC20")
                if (walletUser.length > 0) {
                    await updateBalanceWalletOrUserBonus(element.userid, "STF_TRC20", element.amount)
                    await updateBalanceWalletOrUser(element.userid, "STF", element.amount)
                }
            }
            success(res, "Transfer success!")
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/deleteNews', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            idNews,
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            await customerQuery.deleteNews(idNews)
            success(res, "Delete new success")
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/updateFee', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            name,
            price
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            await customerQuery.updateFee(name, price)
            success(res, "Fee update successful")
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/activeuser', passport.authenticate('jwt', {

    session: false
}),authenticateAdminEditUser, async function (req, res, next) {

    try {
        const {
            userid,
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            await customerQuery.updateActiveUser(userid)
            success(res, "Active user successful")
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/turn2fa', passport.authenticate('jwt', {

    session: false
}),authenticateAdminEditUser, async function (req, res, next) {

    try {
        const {
            userid,
            flag
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            if (isNaN(flag)) return error_400(res, "flag is not defeine")
            if (flag >= 2) return error_400(res, "flag is not defeine")
            await customerQuery.update2FA(userid, flag)
            success(res, "Update 2fa successful")
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/updatePriceCoin', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            symbol,
            price
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            console.log(symbol,
                price, "priced");
            await customerQuery.updatePriceSymbolAdmin(symbol, price)
            success(res, "Coin price update successful")
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/resetPriceCoin', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            symbol
        } = req.body
        const idUser = req.user
        let check = checkAdmin(idUser)
        if (check) {
            await customerQuery.updateResetSymbolAdmin(symbol)
            success(res, "Coin price update successful")
        } else {
            error_400(res, "User does not have permission")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
module.exports = router