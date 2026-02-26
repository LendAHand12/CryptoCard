const { validationBody, getPriceCoin, getListLimitPage } = require("../commons");
const { bonusUserReferral } = require("../commons/bonus");
const { createWalletPayment } = require("../commons/functionIndex");
const { flagOptionBuyCoin } = require("../commons/functions/flag");
const { messageTelegram } = require("../commons/functions/validateObj");
const { success, error_400, error_500 } = require("../message");
const { getRedis, incrbyRedis, setnxRedis, existsRedis, delRedis } = require("../model/model.redis");
const { flagAmountToSymBol, convertSymbol, convertSymbolWallet, updateBalanceWalletOrUser, updateBalanceWalletOrUserBonus } = require("../sockets/functions");
const customerQuery = require("../sockets/queries/customerQuery");
// require('dotenv').config()

module.exports = {
    swap: async (req, res, next) => {
        try {
            const {
                symbolForm,
                symbolTo,
                amountForm,
                type
            } = req.body
            const flagg = validationBody({
                symbolForm,
                symbolTo,
                amountForm,
            })
            if (flagg.length > 0) return error_400(res, 'Not be empty', flagg)
            const flag = validationBody({
                symbolForm,
                symbolTo,
                amountForm,
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            const idUser = req.user
            await Promise.all([createWalletPayment(idUser, symbolForm), createWalletPayment(idUser, symbolTo)])
            const walletTest1 = await customerQuery.getWalletToIdUser(idUser, symbolForm)
            const walletTest2 = await customerQuery.getWalletToIdUser(idUser, symbolTo)
            if (walletTest1.length > 0 && walletTest2.length > 0) {
                const user = await customerQuery.getUserToId(idUser)
                var flagLog = await flagAmountToSymBol(idUser, symbolForm, amountForm, true)
                var percentAdmin = await customerQuery.getExhange(`SWAP`)
                const percent = parseFloat(percentAdmin[0].raito) / 100
                ////redis///
           
                ///// end redis ///
                if (flagLog ) {
                    const objSymbol = await convertSymbol(symbolForm, symbolTo)
                    var symbolBonusTo = await convertSymbolWallet(symbolTo)
                    var symbolBonusForm = await convertSymbolWallet(symbolForm)
                    const flag = await flagAmountToSymBol(idUser, symbolForm, amountForm)
                    if (flag ) {
                        var prevDayForm, symbol, checkConvert
                        const priceX = await getPriceCoin(symbolForm.toUpperCase())
                        const priceY = await getPriceCoin(symbolTo.toUpperCase())
                        if (priceX.length > 0 && priceY.length > 0) {
                            // if (flagWallet > 1) return error_400(res, "Transactions are processed", 403)
                            var x, y

                            if (priceX[0].flag == 0) x = priceX[0].price
                            else if (priceX[0].flag == 1) x = priceX[0].set_price
                            if (priceY[0].flag == 0) y = priceY[0].price
                            else if (priceY[0].flag == 1) y = priceY[0].set_price
                            ////////////////////
                            var prevDayForm = parseFloat(x) / parseFloat(y)
                            var amountPriceTo, amountPercent, amountTo
                            amountPriceTo = parseFloat(amountForm) * parseFloat(prevDayForm)
                            amountPercent = parseFloat(amountPriceTo) * parseFloat(percent)
                            ///// bonus Rederral feee
                            // await bonusUserReferral(idUser,amountPercent,symbolTo,"SWAP")
                            ///// end bonus Rederral fee
                            amountTo = parseFloat(amountPriceTo) - parseFloat(amountPercent)
                            //////////////////////
                            // const optionSWB = symbolTo == 'SWB_TRC20' && type == 2 ? true : false
                            // if (optionSWB) {
                            //     const flagOption = await flagOptionBuyCoin(amountForm, symbolForm, idUser)
                            //     if (!flagOption.status) return error_400(res, flagOption.message, 15)

                            //     await updateBalanceWalletOrUser(idUser, flagOption.symbolBonus, flagOption.amountBonus)
                            //     await updateBalanceWalletOrUser(idUser, symbolForm, flagOption.amountSymbol)
                            // } else await updateBalanceWalletOrUser(idUser, symbolForm, amountForm)
                            // if(symbolForm=="STF_TRC20"){
                            //    let symbolBonus = "STF_BONUS"
                            //    await updateBalanceWalletOrUser(idUser, symbolBonus, amountForm)
                            // }
                            await updateBalanceWalletOrUser(idUser, symbolForm, amountForm)
                            await updateBalanceWalletOrUserBonus(idUser, symbolBonusTo, amountTo)
                            await customerQuery.addConvenrtCoin(idUser, amountForm, symbolForm.toUpperCase(), amountTo, symbolTo.toUpperCase(), prevDayForm,user[0].username,user[0].email)
                            await customerQuery.addNotification(idUser, user[0].username, "Swap", `Successful coin conversion from ${amountForm} ${symbolForm.toUpperCase()} to ${amountTo} ${symbolTo.toUpperCase()}`)
                            await messageTelegram(`User ${user[0].username} converts from ${amountForm} ${symbolForm.toUpperCase()} to ${amountTo} ${symbolTo.toUpperCase()} swap function`)
                            success(res, "Successful coin conversion! ")
                        } else {
                      
                            error_400(res, "Symbol is not coin!", 7)
                        }
                    } else {
                    
                        error_400(res, "Invalid balance", 4)
                    }
                } else {
           
                    error_400(res, "Insufficient balance", 6)
                }
            } else {
                error_400(res, `Users who have not created a ${symbolForm} wallet or ${symbolTo} wallet`, 5)
            }

        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    historyswapExchange: async function (req, res, next) {
        try {
            const {
                limit,
                page,
                symbolForm,
                symbolTo
            } = req.body
            const flag = validationBody({
                limit,
                page,
                symbolForm,
                symbolTo
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            const idUser = req.user
            //console.log(idUser);
            const package = await customerQuery.getHistorySwapExchange(limit, page, idUser, symbolForm, symbolTo)
            const allPackage = await customerQuery.getHistorySwapExchangePagination(idUser, symbolForm, symbolTo)
            if (package.length > 0) {
                for await (pack of package) {
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
                array: package,
                total: allPackage.length
            }
            success(res, "get list swap success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    historySwap :  async function (req, res, next) {

        try {
    
            const {
                limit,
                page,
                symbolForm,
                symbolTo
            } = req.body
            const flag = validationBody({
                limit,
                page,
                symbolForm,
                symbolTo
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            const idUser = req.user
            //console.log(idUser);
            const package = await customerQuery.getHistorySwap(limit, page, idUser, symbolForm, symbolTo)
            const allPackage = await customerQuery.getHistorySwapPagination(idUser, symbolForm, symbolTo)
            if (package.length > 0) {
                for await (pack of package) {
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
                array: package,
                total: allPackage.length
            }
            success(res, "get list swap success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    historySwapAdmin: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`convert_history`, limit, page,sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },

}