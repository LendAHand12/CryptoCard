const { validationBody } = require("../commons");
const { createCode } = require("../commons/addCode");
const { feeTransfer } = require("../commons/fee");
const { success, error_500, error_400 } = require("../message");
const { existsRedis, setnxRedis, getRedis, incrbyRedis, delRedis } = require("../model/model.redis");
const { getRowToTable, updateRowToTable, addRowToTable, deleteRowToTable } = require("../query/funcQuery");
const { updateBalanceWalletOrUser, updateBalanceWalletOrUserBonus } = require("../sockets/functions");
const customerQuery = require("../sockets/queries/customerQuery");

const nameProject = 'Serepay'
async function checkWalletAddressPayment(walletError, itemWallet, walletCode, totalAmount, useridTransfer) {
    try {

        const walletItem = await getRowToTable(`tb_wallet_code`, `address='${itemWallet.address}' AND code='${walletCode}'`)
        if (walletItem.length <= 0) {
            walletError = itemWallet.address
        }
        const walletAmount = await getRowToTable(`tb_wallet_code`, `userid=${walletItem[0].userid} AND code ='USDT'`)

        const percent = await feeTransfer(useridTransfer, walletItem[0].userid)
        const amountFee = itemWallet.amount * percent
        totalAmount += amountFee
        itemWallet.walletItem = walletItem[0]
        itemWallet.percent = percent
        itemWallet.beforeAmount = walletAmount[0].amount
    } catch (error) {
        console.log(error, "checkWalletAddressPayment");
    }
}
module.exports = {
    confirmWalletTransferArray: async function (req, res, next) {
        try {

            const { arrayWallet, wallet } = req.body
            const flag = validationBody({
                arrayWallet, wallet
            })
            ///REDIS ///
            const keyName = `${wallet}transferaddressSerepay`
            const getKey = await existsRedis(keyName)

            if (!getKey) {
                await setnxRedis(keyName, 0)
            }
            let flagWallet = await getRedis(keyName)
            flagWallet = await incrbyRedis(keyName, 1)
            console.log(flagWallet);
            if (flagWallet > 1) {
                return error_400(res, "You have pending transactions")
            }
            /// END ///
            if (flag.length > 0) {
                await delRedis(keyName)
                return error_400(res, 'Not be empty', flag)
            }
            const walletCode = 'USDT.BEP20'
            const walletUser = await getRowToTable(`tb_wallet_code`, `address='${wallet}' AND code='${walletCode}'`)
            if (walletUser.length <= 0) {
                await delRedis(keyName)
                return error_400(res, `The wallet address does not exist in the ${nameProject} system`)
            }
            //  if (arrayWallet.length != 12) return error_400(res, `There must be 12 wallet addresses to receive funds`)
            let totalAmount = 0
            let walletError = ''
            const arrayPromise = []
            const arrayPromiseAddTransfer = []
            const feeRaito = 0
            let strTotal = ``
            const arrayPromiseCheck = []
            for (let itemWallet of arrayWallet) {
                totalAmount += itemWallet.amount

                arrayPromiseCheck.push(checkWalletAddressPayment(walletError, itemWallet, walletCode, totalAmount, walletUser[0].userid))
            }
            await Promise.all(arrayPromiseCheck)
            for (let itemWallet of arrayWallet) {
                totalAmount += itemWallet.percent * itemWallet.amount
            }

            if (walletError != '') {
                await delRedis(keyName)
                return error_400(res, `${walletError} wallet address does not exist in the system`)
            }


            const walletUSDTUser = await getRowToTable(`tb_wallet_code`, `userid=${walletUser[0].userid} AND code='USDT'`)
            if (walletUSDTUser.length <= 0) {
                await delRedis(keyName)
                return error_400(res, `User is not define`)
            }
            if (walletUSDTUser[0].amount < totalAmount) {
                await delRedis(keyName)
                return error_400(res, "Insufficient balance")
            }
            for await (let itemWallet of arrayWallet) {
                const percent = itemWallet.percent


                await updateBalanceWalletOrUserBonus(itemWallet.walletItem.userid, `usdt`, parseFloat(itemWallet.amount))

                arrayPromiseAddTransfer.push(
                    customerQuery.addTransfer(walletUser[0].userid, `usdt`, itemWallet.amount, itemWallet.walletItem.userid, `Transfer USDT from ${wallet} to ${itemWallet.address}`, feeRaito, `LAH. Menber's Contributions`, percent, wallet, itemWallet.address, itemWallet.note, walletUSDTUser[0].amount, walletUSDTUser[0].amount - totalAmount, itemWallet.beforeAmount)

                )
            }
            arrayPromise.push(updateRowToTable(`tb_wallet_code`, `amount=amount-${totalAmount}`, `userid=${walletUser[0].userid} AND code='USDT'`))
            // await Promise.all(arrayPromise)
            // await Promise.all(arrayPromiseAddTransfer)

            const user = await getRowToTable(`users`, `id=${walletUser[0].userid}`)
            await deleteRowToTable(`tb_code_email`, `email='${user[0].email}'`)
            success(res, "Money transfer successful!",)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    sendCodeWalletTransferArray: async function (req, res, next) {
        try {
            const { arrayWallet, wallet } = req.body
            const flag = validationBody({
                arrayWallet, wallet
            })

            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            const walletCode = 'USDT.BEP20'
            const walletUser = await getRowToTable(`tb_wallet_code`, `address='${wallet}' AND code='${walletCode}'`)
            if (walletUser.length <= 0) return error_400(res, `The wallet address does not exist in the ${nameProject} system`)
            // if (arrayWallet.length != 12) return error_400(res, `There must be 12 wallet addresses to receive funds`)

            let totalAmount = 0
            let walletError = ''
            const arrayPromise = []
            const feeRaito = 0
            let totalFee = 0
            let strTotal = ``
            for await (let itemWallet of arrayWallet) {
                let note = ''
                const walletItem = await getRowToTable(`tb_wallet_code`, `address='${itemWallet.address}' AND code='${walletCode}'`)
                if (walletItem.length <= 0) {
                    walletError = itemWallet.address
                    break;
                }
                if (itemWallet.note != undefined) note = itemWallet.note
                const percenrt = await feeTransfer(walletUser[0].userid, walletItem[0].userid)
                totalAmount += itemWallet.amount

                const fee = itemWallet.amount * percenrt
                strTotal += `
                <div> Transfer ${itemWallet.amount} USDT to wallet ${itemWallet.address} with the message:"${itemWallet.note}"</div>
                `
                strTotal += `<div>Fee : ${fee}</div>`
                totalAmount += fee
                totalFee += fee

                // arrayPromise.push(
                //     customerQuery.addTransfer(walletUser[0].userid, `usdt`, itemWallet.amount, walletItem[0].userid, `Transfer ${symbol} from ${wallet} to ${itemWallet.address}`, feeRaito, `LAH. Menber's Contributions`, 1, wallet, itemWallet.address, note),
                //     updateBalanceWalletOrUser(walletUser[0].userid, `usdt`, parseFloat(itemWallet.amount)),
                //     updateBalanceWalletOrUserBonus(walletItem[0].userid, `usdt`, parseFloat(itemWallet.amount))
                // )
            }
            if (walletError != '') return error_400(res, `${walletError} wallet address does not exist in the system`)
            const walletUSDTUser = await getRowToTable(`tb_wallet_code`, `userid=${walletUser[0].userid} AND code='USDT'`)
            if (walletUSDTUser.length <= 0) return error_400(res, `User is not define`)
            if (walletUSDTUser[0].amount < totalAmount) return error_400(res, "Insufficient balance")
            strTotal += `<div>Total Fee : ${totalFee.toFixed(2)}</div>`
            // await Promise.all(arrayPromise)
            const check = await createCode(walletUser[0].userid, strTotal)
            if (!check.flag) return error_400(res, check.message)
            success(res, check.message, check.data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
}