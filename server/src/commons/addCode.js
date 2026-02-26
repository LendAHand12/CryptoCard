const { error_400 } = require("../message");
const { getRowToTable, updateRowToTable, deleteRowToTable, addRowToTable } = require("../query/funcQuery");
const { sendMailMessage } = require("../sockets/functions/verifyEmail");



module.exports = {
    createCode: async (userid,message) => {

        const userC = await getRowToTable(`users`, `id=${userid}`)
        if (userC.length <= 0) return { flag: false, message: "User is not exits" }
        const user = await getRowToTable(`users`, `id=${userC[0].parentUserIdWallet}`)
        if (user.length <= 0) return { flag: false, message: "User is not exits" }
        const checkEmail = await getRowToTable(`tb_code_email`, `email='${user[0].email}'`)
        let codeVerify = Math.floor(100000 + Math.random() * 1000000);
        const email = user[0].email

        //// check spam gửi quá nhiều lần
        if (checkEmail.length > 0) {
            if (checkEmail[0].sendEmail == 1) return { flag: false, message: `Please wait a moment` }
            else if (checkEmail[0].sendEmail == 0) {
                await updateRowToTable(`tb_code_email`, `sendEmail=1,codeVerify=${codeVerify}`, `id=${checkEmail[0].id}`)
            }
        } else {
            await addRowToTable(`tb_code_email`, {
                email, codeVerify, sendEmail: 1
            })
        }


        ///// Send mail

        try {
            await sendMailMessage(email, `Send code from Serepay`, email,message +  `<div>Your code : ${codeVerify}</div>`)
        } catch (error) {
            console.log(error, "sendmail");
        }
        ///// sau 60s mới gửi email tiếp tục

        ///code verify có thời hạn 10p

        // 1000 * 60 * 10
        return {
            flag: true,
            message: "Please check your email",
            data: {
                // codeVerify,
                // email
            }
        }

    }
}