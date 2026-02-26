const { getListLimitPage, validationBody } = require("../commons");
const { createWalletPayment } = require("../commons/functionIndex");
const { messageTeleP2p } = require("../commons/functions/validateObj");
const { convertTime } = require("../commons/time");
const { success, error_500, error_400 } = require("../message");
const { getRowToTable, updateRowToTable, addRowToTable, getLimitPageToTable } = require("../query/funcQuery");

const crypto = require("crypto");
function returnNumberPayment(side, price, amount, rate, fee) {
    let paymentOneCoin = price * rate
    let payment = amount * paymentOneCoin
    if (side == 'buy') {
        return payment + fee
    } else {
        return payment - fee
    }
}
async function comfirmP2PtoCommanFunc(req, res, idP2p) {
    try {
        const io = req.io

        const p2p = await getRowToTable(`tb_history_p2p`, `id=${idP2p}`)
        if (p2p.length <= 0) return error_400(res, "p2p command does not exist")
        if (p2p[0].typeP2p != 2 && p2p[0].typeUser != 1) return error_400(res, "This p2p order cannot be canceled")
        ////////////////////////////////
        const company = await getRowToTable(`tb_p2p`, `id=${p2p[0].idP2p}`)
        if (p2p[0].side == "buy") {
            if (company[0].amount - company[0].amountSuccess < p2p[0].amount) return error_400(res, "Insufficient balance")
            await updateRowToTable(`tb_wallet_code`, `amount=amount+${p2p[0].amount}`, `userid=${p2p[0].userid} AND code='${p2p[0].symbol}'`)
        } else {
            // const walletUser = await getRowToTable(`tb_wallet_code`, `userid=${p2p[0].userid} AND code='${p2p[0].symbol}'`)
            // if (walletUser[0].amount < p2p[0].amount) return error_400(res, "Insufficient balance")
            await updateRowToTable(`tb_wallet_code`, `amount=amount+${p2p[0].amount}`, `userid=${p2p[0].useridAds} AND code='${p2p[0].symbol}'`)

        }
        await updateRowToTable(`tb_p2p`, `amountSuccess=amountSuccess+${p2p[0].amount}`, `id=${company[0].id}`)
        if (company[0].amount - company[0].amountSuccess < company[0].amountMinimum) await updateRowToTable(`tb_p2p`, `type=0`, `id=${company[0].id}`)
        await updateRowToTable(`tb_history_p2p`, `typeUser=1,typeP2p=1`, `id=${idP2p}`)
        io.to(`${p2p[0].userid}`).emit("operationP2p", `${idP2p}`);
        success(res, "Successfully canceled the purchase order")
    } catch (error) {
        console.log(error, "comfirmP2PtoCommanFunc");
    }
}
module.exports = {
    companyAddAds: async function (req, res, next) {
        try {
            const { amount, amountMinimum, symbol, side, addressWallet, bankName, ownerAccount, contact, numberBank } = req.body
            const userid = req.user
            const getCoin = await getRowToTable(`tb_coin`, `name='${symbol}'`)
            if (getCoin.length <= 0) return error_400(res, `Cryptocurrency does not exist in the system`)
            await createWalletPayment(userid, symbol)
            const walletSymbol = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='${symbol}'`)
            if (walletSymbol.length <= 0) return error_400(res, `wallet is not define`)
            if (amount > walletSymbol[0].amount && side == 'sell') return error_400(res, `Insufficient balance`)
            if (amountMinimum > amount) return error_400(res, `The minimum selling quantity cannot be more than the number you want to sell`)

            const user = await getRowToTable(`users`, `id=${userid}`)
            const objAds = {
                amount,
                amountMinimum,
                symbol,
                side,
                userName: user[0].username,
                email: user[0].email,
                type: 2,
                userid,
                contact,
            }
            if (side == "sell") {
                if (!bankName || !ownerAccount || !numberBank) return error_400(res, "Please add the receiving bank")
                objAds.bankName = bankName
                objAds.ownerAccount = ownerAccount
                objAds.numberBank = numberBank
                await updateRowToTable(`tb_wallet_code`, `amount=amount-${amount}`, `userid=${userid} AND code='${symbol}'`)
            } else {
                ///// transfer kh thông qua sàn
                // if (!addressWallet) return error_400(res, "Please add your wallet address to receive funds")
                // objAds.addressWallet = addressWallet
            }
            await addRowToTable(`tb_p2p`, objAds)
            success(res, "Added ads successfully!")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getAllAds: async function (req, res, next) {
        try {
            const { limit, page } = req.body
            const data = await getListLimitPage(`tb_p2p`, limit, page)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getConfig: async function (req, res, next) {
        try {
            const { name } = req.body
            const data = await getRowToTable(`tb_config`, `name='${name}' AND private=0`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getConfigAdmin: async function (req, res, next) {
        try {
            // const { name } = req.body
            const data = await getRowToTable(`tb_config`,`name!='privateKeyBNB'`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    updateConfigAdmin: async function (req, res, next) {
        try {
            const { name, note } = req.body
            const data = await updateRowToTable(`tb_config`, `note='${note}'`, `name='${name}'`)
            success(res, "success")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    sreachSellQuick: async function (req, res, next) {
        try {
            const { amount, symbol, limit, page } = req.body
            const data = await getListLimitPage(`tb_p2p`, limit, page, `amount-amountSuccess >= ${amount} AND amountMinimum<= ${amount} AND type=1 AND symbol='${symbol}' AND side='buy'`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    sreachBuyQuick: async function (req, res, next) {
        try {
            const { amount, symbol, limit, page } = req.body
            const data = await getListLimitPage(`tb_p2p`, limit, page, `amount-amountSuccess >= ${amount} AND amountMinimum<= ${amount} AND type=1 AND symbol='${symbol}' AND side='sell'`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    cancelP2p: async function (req, res, next) {
        try {
            const { idP2p } = req.body
            const userid = req.user
            const p2p = await getRowToTable(`tb_p2p`, `userid=${userid} AND id=${idP2p}`)
            if (p2p.length <= 0) return error_400(res, `p2p is not exits`)
            if (p2p[0].type == 0 || p2p[0].type == 3) return error_400(res, `This order cannot be cancelled`)
            if (p2p[0].side == 'sell') await updateRowToTable(`tb_wallet_code`, `amount=amount+${p2p[0].amount - p2p[0].amountSuccess}`, `userid=${userid} AND code='${p2p[0].symbol}'`)
            await updateRowToTable(`tb_p2p`, `type=3`, `id=${idP2p}`)
            success(res, `Order canceled successfully`)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    createP2p: async function (req, res, next) {
        try {
            const { amount, idP2p, idBankingUser } = req.body
            const flag = validationBody({
                amount, idP2p, idBankingUser
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            const userid = req.user
            const p2p = await getRowToTable(`tb_p2p`, `type=1 AND id=${idP2p}`)
            if (p2p.length <= 0) return error_400(res, "p2p is not define")
            if (p2p[0].userid == userid) return error_400(res, "You cannot buy your own advertising")
            if (p2p[0].amountMinimum > amount) return error_400(res, "The quantity is too small to create an order", p2p[0])
            if (p2p[0].amount - p2p[0].amountSuccess < amount) return error_400(res, "The quantity is too much and the order cannot be created", p2p[0])
            const checkP2p = await getRowToTable(`tb_history_p2p`, `userid=${userid} AND typeP2p=2`)
            ///////////// check nhiều giao dịch
            if (checkP2p.length > 0) return error_400(res, "You have a transaction order that has not yet been processed", checkP2p[0])

            await createWalletPayment(userid, p2p[0].symbol)

            if (p2p[0].side == 'buy') {
                const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='${p2p[0].symbol}'`)
                if (amount > wallet[0].amount) return error_400(res, `Your balance is insufficient`)
                await updateRowToTable(`tb_wallet_code`, `amount=amount-${amount}`, `userid=${userid} AND code='${p2p[0].symbol}'`)

            }
            const user = await getRowToTable(`users`, `id=${userid}`)
            const userP2P = await getRowToTable(`users`, `id=${p2p[0].userid}`)
            const priceCoin = await getRowToTable(`tb_coin`, `name='${p2p[0].symbol}'`)
            const bankingUser = await getRowToTable(`tb_banking_user`, `id=${idBankingUser} AND userid=${userid}`)
            if (bankingUser.length <= 0) return error_400(res, "Please choose a bank to transfer money")
            if (priceCoin.length <= 0) return error_400(res, "Coin is not exits")
            let price = priceCoin[0].flag == 1 ? priceCoin[0].set_price : priceCoin[0].price
            const id = crypto.randomBytes(6).toString("hex");
            const exhcange = await getRowToTable(`tb_exchange_rate`, `title='VND'`)
            const side = p2p[0].side == 'buy' ? "sell" : 'buy'
            const exchangeRateBuySell = side == "buy" ? await getRowToTable(`tb_config`, `name='exchangeRate'`) : await getRowToTable(`tb_config`, `name='exchangeRateSell'`)
            let percenrt = exchangeRateBuySell[0].value / 100
            if (side == "buy") {
                //// tăng tỉ giá mua
                price = price
            } else {
                price = price - (price * percenrt)
                //// giảm tỉ giá bán
            }
            const feeP2p = await getRowToTable(`tb_config`, `name='feeP2p'`)
            const pay = returnNumberPayment(side, price, amount, exhcange[0].rate, feeP2p[0].value)
            const typeUser = side == "sell" ? 1 : 2
            const obj = {
                userid,
                userName: user[0].username,
                email: user[0].email,
                useridAds: userP2P[0].id,
                userNameAds: userP2P[0].username,
                emailAds: userP2P[0].email,
                amount,
                symbol: p2p[0].symbol,
                typeP2p: 2,
                idP2p,
                numberBank: p2p[0].side == 'sell' ? p2p[0].numberBank : bankingUser[0].number_banking,
                ownerAccount: p2p[0].side == 'sell' ? p2p[0].ownerAccount : bankingUser[0].owner_banking,
                bankName: p2p[0].side == 'sell' ? p2p[0].bankName : bankingUser[0].name_banking,
                rate: price,
                typeUser: typeUser,
                side: side,
                code: id,
                pay: pay,
                contact: p2p[0].contact,
            }
            await addRowToTable(`tb_history_p2p`, obj)
            const io = req.io
            io.to(`${userP2P[0].id}`).emit("createP2p");
            io.to(`${userid}`).emit("createP2p");
            if (side == 'sell') await messageTeleP2p(` user ${user[0].username} confirms p2p command from user ${userP2P[0].username}(${amount} ${p2p[0].symbol})`)
            success(res, "Command created successfully")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    userConfirmP2pCommand: async function (req, res, next) {
        try {
            //// người dùng hủy lệnh giao dịch p2p
            const userid = req.user
            const { idP2p } = req.body
            const p2p = await getRowToTable(`tb_history_p2p`, `id=${idP2p} AND userid=${userid}`)
            if (p2p.length <= 0) return error_400(res, "p2p command does not exist")
            if (p2p[0].typeP2p != 2 || p2p[0].typeUser != 2) return error_400(res, "This p2p order cannot be Confirm")
            await updateRowToTable(`tb_history_p2p`, `typeUser=1`, `id=${idP2p}`)
            // if (p2p[0].side == 'sell') {
            //     /// user bán thì xác nhận 1 lần là xong 
            //     // await updateRowToTable(`tb_history_p2p`, `typeP2p=1`, `id=${idP2p}`)
            //     // await updateRowToTable(`tb_wallet_code`, `amount=amount+${p2p[0].amount}`, `userid=${p2p[0].useridAds} AND code='${p2p[0].symbol}'`)
            // }
            const io = req.io
            io.to(`${p2p[0].useridAds}`).emit("operationP2p", `${idP2p}`);
            await messageTeleP2p(` user ${p2p[0].userName} confirms p2p command from user ${p2p[0].userNameAds}(${p2p[0].amount} ${p2p[0].symbol})`)
            success(res, "Successfully canceled the purchase order")
        } catch (error) {
            console.log(error, "cancelP2pCommand");
        }
    },
    // comfirmP2PtoCommanFunc
    AdminConfirmP2pCommand: async function (req, res, next) {
        try {
            //// người dùng hủy lệnh giao dịch p2p
            const { idP2p } = req.body
            await comfirmP2PtoCommanFunc(req, res, idP2p)
        } catch (error) {
            console.log(error, "cancelP2pCommand");
        }
    },
    CompanyConfirmP2pCommand: async function (req, res, next) {
        try {
            //// người dùng hủy lệnh giao dịch p2p
            const userid = req.user
            const { idP2p } = req.body
            const io = req.io

            const p2p = await getRowToTable(`tb_history_p2p`, `id=${idP2p} AND useridAds=${userid}`)
            if (p2p.length <= 0) return error_400(res, "p2p command does not exist")
            if (p2p[0].typeP2p != 2 && p2p[0].typeUser != 1) return error_400(res, "This p2p order cannot be canceled")
            ////////////////////////////////
            const company = await getRowToTable(`tb_p2p`, `id=${p2p[0].idP2p}`)
            if (p2p[0].side == "buy") {
                if (company[0].amount - company[0].amountSuccess < p2p[0].amount) return error_400(res, "Insufficient balance")
                await updateRowToTable(`tb_wallet_code`, `amount=amount+${p2p[0].amount}`, `userid=${p2p[0].userid} AND code='${p2p[0].symbol}'`)
            } else {
                // const walletUser = await getRowToTable(`tb_wallet_code`, `userid=${p2p[0].userid} AND code='${p2p[0].symbol}'`)
                // if (walletUser[0].amount < p2p[0].amount) return error_400(res, "Insufficient balance")
                await updateRowToTable(`tb_wallet_code`, `amount=amount+${p2p[0].amount}`, `userid=${p2p[0].useridAds} AND code='${p2p[0].symbol}'`)

            }
            await updateRowToTable(`tb_p2p`, `amountSuccess=amountSuccess+${p2p[0].amount}`, `id=${company[0].id}`)
            if (company[0].amount - company[0].amountSuccess < company[0].amountMinimum) await updateRowToTable(`tb_p2p`, `type=0`, `id=${company[0].id}`)
            await updateRowToTable(`tb_history_p2p`, `typeUser=1,typeP2p=1`, `id=${idP2p}`)
            io.to(`${p2p[0].userid}`).emit("operationP2p", `${idP2p}`);
            success(res, "Successfully canceled the purchase order")
        } catch (error) {
            console.log(error, "cancelP2pCommand");
        }
    },
    CompanyCancelP2pCommand: async function (req, res, next) {
        try {
            //// người dùng hủy lệnh giao dịch p2p
            const userid = req.user
            const { idP2p } = req.body
            const p2p = await getRowToTable(`tb_history_p2p`, `id=${idP2p} AND useridAds=${userid}`)
            if (p2p.length <= 0) return error_400(res, "p2p command does not exist")
            if (p2p[0].typeP2p != 2 && p2p[0].typeUser != 1) return error_400(res, "This p2p order cannot be canceled")
            ////////////////////////////////

            await updateRowToTable(`tb_history_p2p`, `typeP2p=3`, `id=${idP2p}`)
            if (p2p[0].side == 'sell') {
                //// lệnh bán thì hoàn coin lại cho user 
                await updateRowToTable(`tb_wallet_code`, `amount=amount+${p2p[0].amount}`, `userid=${p2p[0].userid} AND code='${p2p[0].symbol}'`)
            }
            const io = req.io
            io.to(`${p2p[0].userid}`).emit("operationP2p", `${idP2p}`);
            success(res, "Successfully canceled the purchase order")
        } catch (error) {
            console.log(error, "cancelP2pCommand");
            error_500(res, error)
        }
    },
    userCancelP2pCommand: async function (req, res, next) {
        try {
            //// người dùng hủy lệnh giao dịch p2p
            const userid = req.user
            const { idP2p } = req.body
            const p2p = await getRowToTable(`tb_history_p2p`, `id=${idP2p} AND userid=${userid}`)
            if (p2p.length <= 0) return error_400(res, "p2p command does not exist")
            if (p2p[0].typeP2p != 2 || p2p[0].typeUser == 1) return error_400(res, "This p2p order cannot be canceled")
            await updateRowToTable(`tb_history_p2p`, `typeUser=3,typeP2p=3`, `id=${idP2p}`)
            // if (p2p[0].side == 'sell') {
            //     //// lệnh bán thì hoàn coin lại cho user 
            //     await updateRowToTable(`tb_wallet_code`, `amount=amount+${p2p[0].amount}`, `userid=${p2p[0].userid} AND code=${p2p[0].symbol}`)
            // }
            const io = req.io
            io.to(`${p2p[0].useridAds}`).emit("operationP2p", `${idP2p}`);
            success(res, "Successfully canceled the purchase order")
        } catch (error) {
            console.log(error, "cancelP2pCommand");
        }
    },
    getInfoP2p: async function (req, res, next) {
        try {
            const { idP2p } = req.body
            const userid = req.user
            const info = await getRowToTable(`tb_history_p2p`, `idP2p=${idP2p}  AND typeP2p=2  AND(userid=${userid} OR useridAds=${userid} )`)
            if (info.length <= 0) return error_400(res, "P2p trading order does not exist")
            const data = info.reverse()
            for (let item of data) {
                item.created_at = convertTime(item.created_at)
            }
            success(res, `get info success`, data)
        } catch (error) {
            console.log(error, 'getInfoP2p');
        }
    },
    updateConfig: async function (req, res, next) {
        try {
            const { name, value } = req.body
            const data = await updateRowToTable(`tb_config`, `value=${value}`, `name='${name}' AND private=0`)
            success(res, "success")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getListAdsBuyToUser: async function (req, res, next) {
        try {
            const { limit, page, symbol } = req.body
            const userid = req.user
            const data = await getListLimitPage(`tb_p2p`, limit, page, `side='buy' AND userid=${userid}`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getListAdsBuyPenddingToUser: async function (req, res, next) {
        try {
            const { limit, page, symbol } = req.body
            const userid = req.user
            const data = await getListLimitPage(`tb_p2p`, limit, page, `side='buy' AND type=2 AND userid=${userid}`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getListHistoryP2p: async function (req, res, next) {
        try {
            const { limit, page, symbol } = req.body
            const userid = req.user
            const data = await getListLimitPage(`tb_history_p2p`, limit, page, `userid=${userid} OR useridAds=${userid}`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getListHistoryP2pWhere: async function (req, res, next) {
        try {
            const { limit, page, where } = req.body
            const userid = req.user
            const data = await getListLimitPage(`tb_history_p2p`, limit, page, `${where} AND(userid=${userid} OR useridAds=${userid})`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getListHistoryP2pPendding: async function (req, res, next) {
        try {
            const { limit, page, symbol } = req.body
            const userid = req.user
            const data = await getListLimitPage(`tb_history_p2p`, limit, page, `typeP2p=2 AND(userid=${userid} OR useridAds=${userid})`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getListAdsSellPenddingToUser: async function (req, res, next) {
        try {
            const { limit, page, symbol } = req.body
            const userid = req.user
            const data = await getListLimitPage(`tb_p2p`, limit, page, `side='sell' AND type=2 AND userid=${userid}`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getListAdsSellToUser: async function (req, res, next) {
        try {
            const { limit, page, symbol } = req.body
            const userid = req.user
            const data = await getListLimitPage(`tb_p2p`, limit, page, `side='sell' AND userid=${userid}`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getListAdsBuy: async function (req, res, next) {
        try {
            const { limit, page, symbol } = req.body
            const data = await getListLimitPage(`tb_p2p`, limit, page, `side='buy' AND type=1 AND symbol='${symbol}'`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getListAdsSell: async function (req, res, next) {
        try {
            const { limit, page, symbol } = req.body
            const data = await getListLimitPage(`tb_p2p`, limit, page, `side='sell' AND type=1  AND symbol='${symbol}'`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getAdsToWhere: async function (req, res, next) {
        try {
            const { limit, page, where } = req.body
            const data = await getListLimitPage(`tb_p2p`, limit, page, where)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryToWhereAdmin: async function (req, res, next) {
        try {
            const { limit, page, where } = req.body
            const data = await getListLimitPage(`tb_history_p2p`, limit, page, where)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },

    getAllAdsPendding: async function (req, res, next) {
        try {
            const { limit, page } = req.body
            const data = await getListLimitPage(`tb_p2p`, limit, page, `type=2`)
            success(res, "success", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    confirmAds: async function (req, res, next) {
        try {
            const { id } = req.body
            const data = await getRowToTable(`tb_p2p`, `id=${id}`)
            if (data.length <= 0) return error_400(res, "data is not define")
            if (data[0].type != 2) return error_400(res, "p2p is not define")
            await updateRowToTable(`tb_p2p`, `type=1`, `id=${id}`)
            success(res, "Confirmed successfully")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    refuseAds: async function (req, res, next) {
        try {
            const { id } = req.body
            const data = await getRowToTable(`tb_p2p`, `id=${id}`)
            if (data.length <= 0) return error_400(res, "data is not define")
            if (data[0].type != 2) return error_400(res, "p2p is not define")
            await updateRowToTable(`tb_p2p`, `type=3`, `id=${id}`)
            await updateRowToTable(`tb_wallet_code`, `amount=amount+${data[0].amount}`, `userid=${data[0].userid} AND code='${data[0].symbol}'`)
            success(res, "Successful refusal")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
}