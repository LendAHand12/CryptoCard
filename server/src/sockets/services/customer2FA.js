const qrcode = require('qrcode')
const otplib = require('otplib')
const { authenticator } = otplib
const customerQuery = require('../queries/customerQuery');
const validateToken = require('../functions/validation')
const serviceName = "Vina-wallet"

module.exports = {
    /** Gọi ra để sử dụng đối tượng "authenticator" của thằng otplib */
    /** Tạo secret key ứng với từng user để phục vụ việc tạo otp token.
      * Lưu ý: Secret phải được gen bằng lib otplib thì những app như
        Google Authenticator hoặc tương tự mới xử lý chính xác được.
      * Các bạn có thể thử để linh linh cái secret này thì đến bước quét mã QR sẽ thấy có lỗi ngay.
    */
    turnOff2FA: async (params) => {
        const { tokena, otp } = params
        if (otp == "") {
            return {
                message: "OTP không được bỏ rỗng ! ",
                status: 1
            }
        }
        var token = otp
        const phone = validateToken.tokenUser(tokena)
        const profileUser = await customerQuery.checkAllUserEmail(phone)
        if (profileUser.length > 0) {
            if (profileUser[0].twofa == 1) {
                const secret = profileUser[0].secret

                let a = authenticator.verify({ token, secret })
                if (a) {
                    const on2FA = await customerQuery.edit2fa(phone, false)
                    return on2FA
                } else {
                    return { message: "Mã xác nhận không đúng ! ", status: 2 }
                }
            } else {
                return {
                    status: 6,
                    message: "Người dùng chưa bật tính năng 2Fa"
                }
            }


        } else {
            return {
                message: "Người dùng không tồn tại ! ",
                status: 3
            }
        }

    },
    turnOn2FA: async (params) => {
        const { tokena, otp } = params
        if (otp == "") {
            return {
                message: "OTP không được bỏ rỗng ! ",
                status: 1
            }
        }
        var token = otp
        const phone = validateToken.tokenUser(tokena)
        const profileUser = await customerQuery.checkAllUserEmail(phone)
        if (profileUser.length > 0) {
            const secret = profileUser[0].secret
            let a = authenticator.verify({ token, secret })
            if (a) {
                if (profileUser[0].twofa == 1) {
                    return {
                        message: "2FA đã được bật !",
                        status: 8
                    }
                }
                const on2FA = await customerQuery.edit2fa(phone, true)
                return on2FA
            } else {
                return { message: "Mã xác nhận không đúng ! ", status: 2 }
            }

        } else {
            return {
                message: "Người dùng không tồn tại ! ",
                status: 3
            }
        }

    },

    /** Tạo mã OTP token */
    generateOTPToken: async (params) => {
        const { token } = params
        const phone = validateToken.tokenUser(token)
        const profileUser = await customerQuery.checkAllUserEmail(phone)
        if (profileUser.length > 0) {
            const secret = authenticator.generateSecret()
            const username = profileUser[0].email

            const flag = await customerQuery.editSecret(phone, secret)
            if (flag.status == true) {
                const otpAuth = authenticator.keyuri(username, serviceName, secret)

                return {
                    message: "Lấy OTP Auth thành công ! ",
                    data: {
                        otpAuth,
                        secret
                    },
                    status: 200
                }
            } else {
                return {
                    message: "Thêm mã secret thất bại ! ",
                    status: 1
                }
            }

        } else {
            return {
                message: "Lấy OTP Auth thất bại ! ",
                status: 2
            }
        }

    },
    /** Kiểm tra mã OTP token có hợp lệ hay không
     * Có 2 method "verify" hoặc "check", các bạn có thể thử dùng một trong 2 tùy thích.
    */
    generateUniqueSecret: () => {
        return {
            message: "Lấy Secret thành công ! ",
            data: authenticator.generateSecret()
        }
    },
    verifyOTPToken: (params) => {
        const { token, secret } = params
        let a = authenticator.verify({ token, secret })
        if (a) {
            return { message: "Mã xác nhận thành công !", status: true }
        } else {
            return { message: "Mã xác nhận không đúng !", status: false }
        }

        // return authenticator.check(token, secret)
    },
    /** Tạo QR code từ mã OTP để gửi về cho user sử dụng app quét mã */
    generateQRCode: async (params) => {
        const { otpAuth } = params
        try {
            const QRCodeImageUrl = await qrcode.toDataURL(otpAuth)
            return `<img src='${QRCodeImageUrl}' alt='qr-code-img-trungquandev' />`
        } catch (error) {
          //console.log('Could not generate QR code', error)
            return
        }
    }

}