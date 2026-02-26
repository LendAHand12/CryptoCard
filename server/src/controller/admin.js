const { getListLimitPage } = require("../commons");
const { createWalletPayment, createWalletAndCheckWallet } = require("../commons/functionIndex");
const { getListLimitPageSreach } = require("../commons/request");
const { success, error_500, error_400 } = require("../message");
const { getRowToTable, updateRowToTable, addRowToTable, deleteRowToTable } = require("../query/funcQuery");
const { getWallet } = require("../sockets/functions");



module.exports = {
    getWalletToUserAdmin: async function (req, res, next) {
        try {
            const { userid } = req.body
            const obj = await getWallet(userid)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },

    historytransferAdmin: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`transfer_log`, limit, page, sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },

    updateAmountWalletToId: async function (req, res, next) {
        try {
            const { userid, amount, symbol } = req.body
            const useridAdminUpdate = req.user
            await createWalletAndCheckWallet(userid, symbol)
            const user = await getRowToTable(`users`,`id=${userid}`)
            const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='${symbol}'`)
         
            const obj = {
                userid,
                userName : user[0].username,
                email : user[0].email,
                useridAdminUpdate,
                symbol,
                amountLast : wallet[0].amount,
                amount,
            }
            await addRowToTable(`tb_update_wallet`,obj)
            await updateRowToTable(`tb_wallet_code`, `amount=${amount}`, `userid=${userid} AND code='${symbol}'`)

            success(res, "Update success")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryDepositAdmin: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`blockchain_log`, limit, page, sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryBuyCoin: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`tb_swap_blockchain`, limit, page, sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryUpdateWallet: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`tb_update_wallet`, limit, page, sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    historytransferAdminAll: async function (req, res, next) {
        try {
            const obj = await getRowToTable(`transfer_log`)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryDepositAdminAll: async function (req, res, next) {
        try {
            const obj = await getRowToTable(`blockchain_log`)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getUserToId: async function (req, res, next) {
        try {
            const { userid } = req.body
            const obj = await getRowToTable(`users`, `id=${userid}`)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    sreachWalletToWithdraw: async function (req, res, next) {
        try {
            const { limit, page, keyWork } = req.body
            const obj = await getListLimitPage(`withdrawal`, limit, page, `POSITION('${keyWork}' IN form_address) OR POSITION('${keyWork}' IN to_address)`)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    sreachDepositToAdmin: async function (req, res, next) {
        try {
            const { limit, page, keyWork } = req.body
            const obj = await getListLimitPage(`blockchain_log`, limit, page, `POSITION('${keyWork}' IN hash) OR POSITION('${keyWork}' IN to_address) OR POSITION('${keyWork}' IN userName) OR POSITION('${keyWork}' IN email)`)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    sreachUserToAddressWallet: async function (req, res, next) {
        try {
            const { keyWork } = req.body
            const obj = await getRowToTable(`tb_wallet_code`, `address='${keyWork}'`)
            if(obj.length<=0) return error_400(res,"Người dùng không tồn tại")
            const user = await getRowToTable(`users`,`id=${obj[0].userid}`)
            success(res, "get list success!", user)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getWalletToWithdrawWhere: async function (req, res, next) {
        try {
            const { limit, page, where } = req.body
            const obj = await getListLimitPage(`withdrawal`, limit, page, where)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },

    getUserAll: async function (req, res, next) {
        try {
            const obj = await getRowToTable(`users`)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getAllUserWallet: async function (req, res, next) {
        try {
            const { userid } = req.body
            const user = await getRowToTable(`users`, `id=${userid}`)
            const obj = await getRowToTable(`users`, `parentUserIdWallet=${user[0].parentUserIdWallet} AND id!=${userid}`)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    /// add sub admin 
    addAdmin: async function (req, res, next) {
        try {
            const { userid } = req.body

            const user = await getRowToTable(`users`, `id=${userid}`)
            if (user.length <= 0) return error_400(res, `user is not exit`)
            const userAdmin = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (userAdmin.length > 0) return error_400(res, "The user is already an admin")
            const obj = {
                userid,
                userName: user[0].username,
                email: user[0].email
            }
            await addRowToTable(`tb_admin`, obj)
            success(res, "Add sub admin success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    editAdmin: async function (req, res, next) {
        try {
            const { userid, user, editUser, rate, editRate, ads, editAds, exchange
                , editExchange, widthdraw, editWidthdraw, config, editConfig, transfer, swap, deposit,
                p2p, editP2p, admin, editAdmin
            } = req.body
            console.log(`
            user=${user},editUser=${editUser},rate=${rate},editRate=${editRate},ad=${ads},editAds=${editAds},exchange=${exchange}
            ,editExchange=${editExchange},widthdraw=${widthdraw},editWidthdraw=${editWidthdraw},config=${config},editConfig=${editConfig},transfer=${transfer},swap=${swap},deposit${deposit},
            p2p=${p2p},editP2p${editP2p},admin${admin},editAdmin=${editAdmin}
            `);
            await updateRowToTable(`tb_admin`, `
            user=${user},editUser=${editUser},rate=${rate},editRate=${editRate},ads=${ads},editAds=${editAds},exchange=${exchange}
            ,editExchange=${editExchange},widthdraw=${widthdraw},editWidthdraw=${editWidthdraw},config=${config},editConfig=${editConfig},transfer=${transfer},swap=${swap},deposit=${deposit},
            p2p=${p2p},editP2p=${editP2p},admin=${admin},editAdmin=${editAdmin}
            `, `userid=${userid}`)
            success(res, "Edit sub admin success!")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    editFuncAdmin: async function (req, res, next) {
        try {
            const { userid, name,value
            } = req.body
  
            await updateRowToTable(`tb_admin`, `${name}=${value}`, `userid=${userid}`)
            success(res, "Edit sub admin success!")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getAdmim: async function (req, res, next) {
        try {
            const { limit, page, where } = req.body
            const obj = await getListLimitPage(`tb_admin`, limit, page, where)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    deleteAdmin: async function (req, res, next) {
        try {
            const { userid } = req.body
            await deleteRowToTable(`tb_admin`, `userid=${userid}`)
            success(res, "Delete success",)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    checkAdmin: async function (req, res, next) {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "The user is already an admin")
            success(res, "get success", user[0])
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
}