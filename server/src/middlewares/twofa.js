const {
    error_400, error_500
} = require("../message")
const otplib = require('otplib')

const {
    authenticator
} = otplib
const customerQuery = require("../sockets/queries/customerQuery")

module.exports = {
    check2fa: async (req, res, next) => {
        try {
            const {
                otp
            } = req.body
            const userid = req.user
            const profileUser = await customerQuery.getUserToId(userid)
            if (profileUser.length > 0) {
                if (profileUser[0].enabled_twofa != 1) {
                    error_400(res, "The user has not enabled 2FA", 25)
                } else {
                    if (otp) {
                        const secret = profileUser[0].twofa_id
                        var token = otp
                        let a = authenticator.verify({
                            token,
                            secret
                        })
                        if (a) {
                            console.log("succeesss");
                            next()
                        } else {
                            error_400(res, "Incorrect code! ", 11)
                        }
                    } else {
                        error_400(res, "Code Emty! ", 2)
                    }
                }
            } else {
                error_400(res, "User is not define", 1)
            }
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    authen2fa: async (req, res, next) => {
        try {
            const {
                code
            } = req.body
            const otp = code
            const userid = req.user

            const profileUser = await customerQuery.getUserToId(userid)
  
            if (profileUser.length > 0) {
                if (profileUser[0].enabled_twofa != 1) {
                    console.log("The user has not enabled 2FA authen2fa");
                    // error_400(res, "The user has not enabled 2FA", 25)
                } else {
                    if (otp) {
                        const secret = profileUser[0].twofa_id
                        var token = otp
                        let a = authenticator.verify({
                            token,
                            secret
                        })
                        if (a) {
                            console.log("succeesss");
                          return  true
                        } else {
                            console.log("Incorrect code!");

                            // error_400(res, "Incorrect code! ", 11)
                        }
                    } else {
                        console.log("Code Emty! ");

                        // error_400(res, "Code Emty! ", 2)
                    }
                }
            } else {
                console.log("User is not define");
                // error_400(res, "User is not define", 1)
            }
        } catch (error) {
            console.log(error);
            // error_500(res, error)
        }
    },
}