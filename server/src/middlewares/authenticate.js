const {
    getPriceCoin
} = require("../commons")
const {
    error_500,
    error_400
} = require("../message")
const { getRowToTable } = require("../query/funcQuery")
const customerQuery = require("../sockets/queries/customerQuery")
const {
    checkRecaptcha
} = require("./recaptcha")
const {
    check2fa,
    authen2fa
} = require("./twofa")

module.exports = {
    authenticateWallet: async (req, res, next) => {
        try {
            const userid = req.user
            const profileUser = await customerQuery.getUserToId(userid)
            if (profileUser.length > 0)
                profileUser[0].enabled_twofa == 1 ? check2fa(req, res, next) : next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateKyc: async (req, res, next) => {
        try {
            const userid = req.user
            console.log(userid);
            const profileUser = await customerQuery.getUserToId(userid)
            if (profileUser.length > 0)
                profileUser[0].verified == 1 ? next() : error_400(res, "User has not verified KYC", 21)
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateOtpSendEmail: async (req, res, next) => {
        try {

            const { codeEmail, email } = req.body
            if (!codeEmail) return error_400(res, "Email verification code is incorrect", 21)
            const codeEmailData = await getRowToTable(`tb_code_email`, `email='${email}'`)
            if (codeEmailData.length <= 0) {
                return error_400(res, "You must send an email to authenticate", 21)
            } else {
                if (codeEmail != codeEmailData[0].codeVerify) return error_400(res, "Email verification code is incorrect", 21)
                next()
            }
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    authenticateOtpPaymentWallet: async (req, res, next) => {
        try {

            const { code, wallet } = req.body
            if (!code) return error_400(res, "Email verification code is incorrect", 21)
            const walletUser = await getRowToTable(`tb_wallet_code`, `address='${wallet}'`)
            if (walletUser.length <= 0) return error_400(res, `The wallet address does not exist in the system`)
            const userC = await getRowToTable(`users`, `id=${walletUser[0].userid}`)
            const user = await getRowToTable(`users`, `id=${userC[0].parentUserIdWallet}`)
            if (user.length <= 0) return error_400(res, "User is not exit")
            const email = user[0].email
            const codeEmailData = await getRowToTable(`tb_code_email`, `email='${email}'`)
            let enabled_twofa = user[0].enabled_twofa
            if (enabled_twofa == 0) {
                if (codeEmailData.length <= 0) {
                    return error_400(res, "You must send an email to authenticate", 21)
                } else {
                    if (code != codeEmailData[0].codeVerify) return error_400(res, "Email verification code is incorrect", 21)
                    next()
                }
            } else {
                req.user = user[0].id
                let check2fa = await authen2fa(req, res, next)
                if (check2fa) return next()
                if (codeEmailData.length <= 0) {
                    return error_400(res, "Code Emty!", 22)
                } else {
                    if (code != codeEmailData[0].codeVerify) return error_400(res, "Code Emty!", 21)
                    next()
                }
                // return error_400(res, "Code Emty! ", 2)
            }

        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    authenticateAdmin: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            // if(user[0].user!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },

    ///// ADMIN 
    authenticateAdminUser: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].user!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminCommission: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].commission!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminRegisterCard: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].registerCard!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminCard: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].card!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditUpdateWallet: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editUpdateWallet!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminBuyToken: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].buyToken!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminUpdateWallet: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].updateWallet!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminHeweDB: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].heweDB!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditHeweDB: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editHeweDB!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminDepositCard: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].depositCard!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditDepositCard: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editDepositCard!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    
    authenticateAdminEditUser: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editUser!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminRate: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].rate!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditRate: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editRate!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminAds: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].ads!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditAds: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editAds!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminExchange: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].Exchange!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditExchange: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editExchange!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminWidthdraw: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].widthdraw!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditWidthdraw: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editWidthdraw!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditConfig: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editConfig!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminConfig: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].config!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminTransfer: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].transfer!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminSwap: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].swap!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminDeposit: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].deposit!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminP2p: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].p2p!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditP2p: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editAdmin!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminAdmin: async (req, res, next) => {
        try {
            const userid = req.user
            const user = await getRowToTable(`tb_admin`, `userid=${userid}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].admin!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
    authenticateAdminEditAdmin: async (req, res, next) => {
        try {
            const idUser = req.user
            const {userid} = req.body
            if(userid==1) return error_400(res,'This user cannot be changed or added')
            const user = await getRowToTable(`tb_admin`, `userid=${idUser}`)
            if (user.length <= 0) return error_400(res, "User does not have access", 21)
            if(user[0].editAdmin!=1)return error_400(res, "User does not have permission to use this function",11)
            next()
        } catch (error) {
            error_500(res, error)
        }
    },
}