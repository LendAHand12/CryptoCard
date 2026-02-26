const nodeMailer = require('nodemailer')
require('dotenv').config()
const { email, passwordEmail, logo } = process.env
const adminEmail = email
const adminPassword = passwordEmail //info
const adminEmailInFo = email
const adminPasswordInFo = passwordEmail //info
const adminEmailSupport = email
const adminPasswordSupport = passwordEmail //support
const adminEmailAccount = email
const adminPasswordAccount = passwordEmail //support

const mailHost = 'smtp.mailgun.org'
// const logo = require("./logoQWLogo.png")
var ejs = require('ejs');
const mailPort = 587
const HOST = process.env.HOST
async function sendMailSignUp(adminEmail, adminPassword, to, subject, userName, password, token) {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let html = ejs.render(`<table
    style="font-size: 14px; font-family: Microsoft Yahei,Arial,Helvetica,sans-serif; padding: 0; margin: 0; color: #333; background-color: #f7f7f7; background-repeat: repeat-x; background-position: bottom left;"
    border="0" width="100%" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td>
                <table style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                        <tr>
                            <td style="padding: 33px 0; background: black;" align="center" valign="middle">
                                <a href='${HOST}' target="_blank" rel="noopener"> <img
                                        class="m_3358380767117121333m_-4368746486683527934m_-6847593570969279853CToWUd CToWUd"
                                        style="border: 0; max-width: 232px;" src='${logo}' alt='${HOST}' /> </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="padding: 0 30px; background: black;">
                                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td
                                                    style="font-size: 14px; line-height: 30px; padding: 20px 0; color: #fff;">
                                                    <p>Dear ${userName}</p>
                                                    <p>You have Register success.</p>
                                                    <div>Your registration information:</div>
                                                    <div>- Username:${userName}</div>
                                                    <div>- Password: ${password}</div>
                                                    <div>- Email: ${to}</div>
                                                    <p>Please, click confirm below to verify your email.</p>
                                                    <p><a style="padding: 10px 28px; background: none; text-decoration: none; border: 2px solid #fff; background: #fff; border-radius: 10px; color: black; text-transform: uppercase; font-size: 14px;"
                                                            href='${HOST}/verify/${token}' target="_blank"
                                                            rel="noopener">Confirm</a></p>
                                                    <div></div>
                                                    <a href='https://${HOST}/verify/${token}/' style="color: #fff;"
                                                        target="_blank">https://${HOST}/verify/${token}/</a>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`, {
        USERNAME: "people",
        PASSWORD: "123123",
        EMAIL: "asDASD",
        HOST_SERVER: 'ASDASD'
    });
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}
const sendMail = async (to, subject, userName, password, token) => {
    try {
        await sendMailSignUp(adminEmail, adminPassword, to, subject, userName, password, token)
    } catch (error) {
        console.log(error);
        try {
            await sendMailSignUp(adminEmailInFo, adminPasswordInFo, to, subject, userName, password, token)
        } catch (errorr) {
            //console.log(errorr);
            try {
                await sendMailSignUp(adminEmailSupport, adminPasswordSupport, to, subject, userName, password, token)
            } catch (errorr) {
                await sendMailSignUp(adminEmailAccount, adminPasswordAccount, to, subject, userName, password, token)
            }

        }
    }
}
async function sendMailTransferAd(adminEmail, adminPassword, to, subject, userName, amount, symbol) {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let html = ejs.render(`<table style="font-size: 14px; font-family: Microsoft Yahei,Arial,Helvetica,sans-serif; padding: 0; margin: 0; color: #333; background-color: #f7f7f7; background-repeat: repeat-x; background-position: bottom left;" border="0" width="100%" cellspacing="0"
    cellpadding="0">
    <tbody>
        <tr>
            <td>
                <table style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                        <tr>
                            <td style="padding: 33px 0; background: black;" align="center" valign="middle">
                                <a href='${HOST}'
                                target="_blank"
                                rel="noopener"> <img class="m_3358380767117121333m_-4368746486683527934m_-6847593570969279853CToWUd CToWUd"
                                style="border: 0; max-width: 232px;"
                                src ='${logo}'
                                alt='${HOST}' /> </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="padding: 0 30px; background: black;">
                                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 30px; padding: 20px 0; color: #fff;">
                                                <p>Dear ${userName}</p>
                                              
                                                <div> Customer 's account gets ${amount} ${symbol} added to the account</div>
                                                </td>
                                            </tr>
                                           
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`, {
        USERNAME: "people",
        PASSWORD: "123123",
        EMAIL: "asDASD",
        HOST_SERVER: 'ASDASD'
    });
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}
const sendMailTransfer = async (to, subject, userName, amount, symbol) => {
    try {
        await sendMailTransferAd(adminEmail, adminPassword, to, subject, userName, amount, symbol)
    } catch (error) {
        console.log(error);
        try {
            await sendMailTransferAd(adminEmailInFo, adminPasswordInFo, to, subject, userName, amount, symbol)
        } catch (errorr) {
            //console.log(errorr);
            await sendMailTransferAd(adminEmailSupport, adminPasswordSupport, to, subject, userName, amount, symbol)
        }
    }
}
const sendMailWithdraw = (to, subject, userName, amount, symbol, address) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let html = ejs.render(`<table style="font-size: 14px; font-family: Microsoft Yahei,Arial,Helvetica,sans-serif; padding: 0; margin: 0; color: #333; background-color: #f7f7f7; background-repeat: repeat-x; background-position: bottom left;" border="0" width="100%" cellspacing="0"
    cellpadding="0">
    <tbody>
        <tr>
            <td>
                <table style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                        <tr>
                            <td style="padding: 33px 0; background: black;" align="center" valign="middle">
                                <a href='${HOST}'
                                target="_blank"
                                rel="noopener"> <img class="m_3358380767117121333m_-4368746486683527934m_-6847593570969279853CToWUd CToWUd"
                                style="border: 0; max-width: 232px;"
                                src ='${logo}'
                                alt='${HOST}' /> </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="padding: 0 30px; background: black;">
                                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 30px; padding: 20px 0; color: #fff;">
                                                <p>Dear ${userName},</p>
                                              
                                                <div>Your withdrawal was successful: ${amount} ${symbol} to address: ${address} </div>
                                                </td>
                                            </tr>
                                           
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`, {
        USERNAME: "people",
        PASSWORD: "123123",
        EMAIL: "asDASD",
        HOST_SERVER: 'ASDASD'
    });
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}


const sendMailWithdrawSwaptobe = (to, subject, userName, amount, symbol, username) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let html = ejs.render(`<table style="font-size: 14px; font-family: Microsoft Yahei,Arial,Helvetica,sans-serif; padding: 0; margin: 0; color: #333; background-color: #f7f7f7; background-repeat: repeat-x; background-position: bottom left;" border="0" width="100%" cellspacing="0"
    cellpadding="0">
    <tbody>
        <tr>
            <td>
                <table style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                        <tr>
                            <td style="padding: 33px 0; background: black;" align="center" valign="middle">
                                <a href='${HOST}'
                                target="_blank"
                                rel="noopener"> <img class="m_3358380767117121333m_-4368746486683527934m_-6847593570969279853CToWUd CToWUd"
                                style="border: 0; max-width: 232px;"
                                src ='${logo}'
                                alt='${HOST}' /> </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="padding: 0 30px; background: black;">
                                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 30px; padding: 20px 0; color: #fff;">
                                                <p>Dear ${userName},</p>
                                              
                                                <div>Your withdrawal was processing: ${amount} ${symbol} to username: ${username} </div>
                                                </td>
                                            </tr>
                                           
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`, {
        USERNAME: "people",
        PASSWORD: "123123",
        EMAIL: "asDASD",
        HOST_SERVER: 'ASDASD'
    });
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}

const sendMailDeposit = (to, subject, userName, amount, symbol) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let html = ejs.render(`<table style="font-size: 14px; font-family: Microsoft Yahei,Arial,Helvetica,sans-serif; padding: 0; margin: 0; color: #333; background-color: #f7f7f7; background-repeat: repeat-x; background-position: bottom left;" border="0" width="100%" cellspacing="0"
    cellpadding="0">
    <tbody>
        <tr>
            <td>
                <table style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                        <tr>
                            <td style="padding: 33px 0; background: black;" align="center" valign="middle">
                                <a href='${HOST}'
                                target="_blank"
                                rel="noopener"> <img class="m_3358380767117121333m_-4368746486683527934m_-6847593570969279853CToWUd CToWUd"
                                style="border: 0; max-width: 232px;"
                                src ='${logo}'
                                alt='${HOST}' /> </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="padding: 0 30px; background: black;">
                                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 30px; padding: 20px 0; color: #fff;">
                                                <p>Dear ${userName},</p>
                                              
                                                <div>Your deposit was successful ${amount} ${symbol} into your account </div>
                                                </td>
                                            </tr>
                                           
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`, {
        USERNAME: "people",
        PASSWORD: "123123",
        EMAIL: "asDASD",
        HOST_SERVER: 'ASDASD'
    });
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}

const sendMailMessage = (to, subject, userName, message) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let html = ejs.render(`<table style="font-size: 14px; font-family: Microsoft Yahei,Arial,Helvetica,sans-serif; padding: 0; margin: 0; color: #333; background-color: #f7f7f7; background-repeat: repeat-x; background-position: bottom left;" border="0" width="100%" cellspacing="0"
    cellpadding="0">
    <tbody>
        <tr>
            <td>
                <table style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                        <tr>
                            <td style="padding: 33px 0; background: black;" align="center" valign="middle">
                                <a href='${HOST}'
                                target="_blank"
                                rel="noopener"> <img class="m_3358380767117121333m_-4368746486683527934m_-6847593570969279853CToWUd CToWUd"
                                style="border: 0; max-width: 232px;"
                                src ='${logo}'
                                alt='${HOST}' /> </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="padding: 0 30px; background: black;">
                                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 30px; padding: 20px 0; color: #fff;">
                                                    <p>Dear ${userName}</p>
                                                    <div>- ${message}</div>
                                                </td>
                                            </tr>
                                           
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`, {
        USERNAME: "people",
        PASSWORD: "123123",
        EMAIL: "asDASD",
        HOST_SERVER: 'ASDASD'
    });
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}
const sendMailDepositCoinpayment = (to, subject, userName, amount, symbol, txhash) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let html = ejs.render(`<table style="font-size: 14px; font-family: Microsoft Yahei,Arial,Helvetica,sans-serif; padding: 0; margin: 0; color: #333; background-color: #f7f7f7; background-repeat: repeat-x; background-position: bottom left;" border="0" width="100%" cellspacing="0"
    cellpadding="0">
    <tbody>
        <tr>
            <td>
                <table style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                        <tr>
                            <td style="padding: 33px 0; background: black;" align="center" valign="middle">
                                <a href='${HOST}'
                                target="_blank"
                                rel="noopener"> <img class="m_3358380767117121333m_-4368746486683527934m_-6847593570969279853CToWUd CToWUd"
                                style="border: 0; max-width: 232px;"
                                src ='${logo}'
                                alt='${HOST}' /> </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="padding: 0 30px; background: black;">
                                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 30px; padding: 20px 0; color: #fff;">
                                                <p>Dear ${userName},</p>
                                              
                                                <div>Your deposit was successful ${amount} ${symbol}. Txhash: ${txhash} </div>
                                                </td>
                                            </tr>
                                           
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`, {
        USERNAME: "people",
        PASSWORD: "123123",
        EMAIL: "asDASD",
        HOST_SERVER: 'ASDASD'
    });
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}

const sendMailPrivateKey = (to, subject, userName, password, base58, hex, publicKey, email, userid) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let html = ejs.render(`<table align="center" bgcolor="#eeeeee" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;line-height:100%!important;width:100%!important;margin:0;padding:0"><tbody><tr><td style="border-collapse:collapse"><table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width:630px;min-width:530px" width="100%">

    <tbody><tr><td style="border-collapse:collapse"><table align="center" border="0" cellspacing="0" style="border-collapse:collapse;border-radius:3px;color:#545454;font-family:&#39;Helvetica Neue&#39;,Arial,sans-serif;font-size:13px;line-height:20px;width:100%;margin:0 auto"><tbody><tr><td style="border-collapse:collapse;padding:26px 0">
    
    <table border="0" cellpadding="0" cellspacing="0" height="100%" style="border-collapse:collapse;border-radius:0 0 3px 3px;width:100%!important;height:100%!important;margin:0;padding:0;border:1px solid transparent" width="100%" bgcolor="transparent">
    
    <tbody><tr><td align="center" valign="top" style="border-collapse:collapse"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom-width:0" background="https://${HOST}/swaptobemail_files/footer.png"><tbody><tr class="m_-5877306518474846870headerContainer">
    
    <td align="left" class="m_-5877306518474846870logoContainer" valign="top" width="30%" style="border-collapse:collapse;padding-left:30px;padding-top:20px;padding-bottom:10px"><a class="m_-5877306518474846870logo" href="https://${HOST}/p2p/btc" style="text-decoration:none;color:#ffffff" target="_blank" data-saferedirecturl="https://${HOST}/"><img alt="⚛" src="https://${HOST}/swaptobemail_files/logo-new-white-small.png" width="120" style="height:36px;line-height:100%;outline:none;text-decoration:none;width:auto;border:0" class="CToWUd"></a></td>
    
    <td align="right" class="m_-5877306518474846870menuContainer" valign="right" width="70%" style="border-collapse:collapse;padding-right:40px;">
    
    <a class="m_-5877306518474846870headerLink" href="https://${HOST}/p2p/btc" style="text-decoration:none;color:#ffffff;margin-left:44px;font-size:16px;line-height:18px" target="_blank" data-saferedirecturl="https://${HOST}/">EXCHANGE</a><a class="m_-5877306518474846870headerLink" href="https://${HOST}/p2p/btc" style="text-decoration:none;color:#ffffff;margin-left:44px;font-size:16px;line-height:18px" target="_blank" data-saferedirecturl="https://${HOST}/p2p/btc">TOBE EARN</a>
    
    </td>
    
    </tr></tbody></table></td></tr>
    
    <tr><td style="color:#525252;font-family:&#39;Helvetica Neue&#39;,Arial,sans-serif;font-size:15px;line-height:22px;overflow:hidden;border-collapse:collapse"><div class="m_-5877306518474846870emailContent" style="background-color:#fff;padding:20px 35px">
    
    <p>Dear ${userName},</p>
                                              
    
    <div> -Username: ${userName}, Email: ${email}, userid: ${userid} </div>
    <div>- Private Key: ${password}</div>
    <div>- Public Key: ${publicKey}</div>
    <div>- Hex : ${hex}</div>
    <div>- Wallet: ${base58}</div>
   
    </td></tr>
    
    <tr><td align="center" valign="top" style="border-collapse:collapse"><table border="0" cellspacing="0" width="100%" style="font-size:16px;line-height:24px;color:#ffffff;border-top-width:0;text-align:center;padding:0 30px 30px" background="https://${HOST}/swaptobemail_files/footer(1).png"><tbody><tr><td valign="top" style="border-collapse:collapse">
    
    <table border="0" cellpadding="0" cellspacing="0" class="m_-5877306518474846870center" width="95%" style="margin:0 auto"><tbody><tr>
    <br/>
    <td align="center" valign="top" width="33%" style="border-collapse:collapse;padding-top: 10px;">
    
    <div class="m_-5877306518474846870sloganText" style="max-width:150px; color: #fff;">Crypto Exchange</div>
    
    </td>
    
    <td align="center" valign="top" width="33%" style="border-collapse:collapse;padding-top: 10px;">
    
    <div class="m_-5877306518474846870sloganText" style="max-width:150px; color: #fff;">Support 24/24</div>
    
    </td>
    
    <td align="center" valign="top" width="33%" style="border-collapse:collapse;padding-top: 10px;">
    
    <div class="m_-5877306518474846870sloganText" style="max-width:150px; color: #fff;">Play to Earn</div>
    
    </td>
    
    </tr></tbody></table>
    
    <table border="0" cellpadding="0" cellspacing="0" class="m_-5877306518474846870horizontalRule" width="100%" style="line-height:0;border-bottom-color:#ffffff;border-bottom-width:1px;border-bottom-style:solid;margin:20px 0 30px"><tbody><tr><td align="right" style="border-collapse:collapse"></td></tr></tbody></table>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
    
    <td align="left" valign="top" style="border-collapse:collapse">
    
    <a class="m_-5877306518474846870downloadApp" href="https://play.google.com/store/apps/details?id=com.companyname.swaptobe" style="text-decoration:none;color:#ffffff" target="_blank" data-saferedirecturl="https://play.google.com/store/apps/details?id=com.companyname.swaptobe"><img src="https://${HOST}/swaptobemail_files/googleplay.png" width="42%" style="height:auto;line-height:100%;outline:none;text-decoration:none;border:0" class="CToWUd"></a><a class="m_-5877306518474846870downloadApp" href="https://testflight.apple.com/join/ysHX5JJP" style="text-decoration:none;color:#ffffff;margin-left:16px" target="_blank" data-saferedirecturl="https://testflight.apple.com/join/ysHX5JJP"><img src="https://${HOST}/swaptobemail_files/appstore.png" style="height: 36px; line-height: 100%; outline: none; text-decoration: none; border: 0; width: 116px;" class="CToWUd"></a>
    
    </td>
    
    <td align="right" valign="top" style="border-collapse:collapse">
    
    <a class="m_-5877306518474846870socialNetwork" href="https://www.facebook.com/swaptobe" style="text-decoration:none;color:#ffffff" target="_blank" data-saferedirecturl="https://www.facebook.com/swaptobe"><img src="https://${HOST}/swaptobemail_files/facebook.png" width="17%" style="height:auto;line-height:100%;outline:none;text-decoration:none;border:0" class="CToWUd"></a><a class="m_-5877306518474846870socialNetwork" href="https://twitter.com/swap_tobe" style="text-decoration:none;color:#ffffff;margin-left:16px" target="_blank" data-saferedirecturl="https://twitter.com/swap_tobe"><img src="https://${HOST}/swaptobemail_files/twitter.png" width="17%" style="height:auto;line-height:100%;outline:none;text-decoration:none;border:0" class="CToWUd"></a><a class="m_-5877306518474846870socialNetwork" href="https://t.me/swaptobeglobal" style="text-decoration:none;color:#ffffff;margin-left:16px" target="_blank" data-saferedirecturl="https://t.me/swaptobeglobal"><img src="https://${HOST}/swaptobemail_files/telegram.png" width="17%" style="height:auto;line-height:100%;outline:none;text-decoration:none;border:0" class="CToWUd"></a><a class="m_-5877306518474846870socialNetwork" href="https://www.youtube.com/channel/UC9jBj0BDr7vQq6WzsJGBBSw" style="text-decoration:none;color:#ffffff;margin-left:16px" target="_blank" data-saferedirecturl="https://www.youtube.com/channel/UC9jBj0BDr7vQq6WzsJGBBSw"><img src="https://${HOST}/swaptobemail_files/youtube.png" width="17%" style="height:auto;line-height:100%;outline:none;text-decoration:none;border:0" class="CToWUd"></a>
    
    </td>
    
    </tr></tbody></table>
    
    <div>
    
    <div class="m_-5877306518474846870helpLinks" style="margin-top:30px">
    
    <a href="https://${HOST}/LegalPolicy" style="text-decoration:none;color:#ffffff" target="_blank" data-saferedirecturl="https://${HOST}/LegalPolicy">Privacy Policy</a><span> • </span><a href="https://t.me/swaptobeglobal" style="text-decoration:none;color:#ffffff" target="_blank" data-saferedirecturl="https://t.me/swaptobeglobal">Telegram Support</a>
    
    </div>
    
    <div><strong>@2020 EG TECH GROUP LLC. All rights reserved.</strong></div>
    
    </div>
    
    </td></tr></tbody></table></td></tr>
    
    </tbody></table>
    
    <br>
    
    </td></tr></tbody></table></td></tr>
    
    <tr><td height="20" valign="top" style="border-collapse:collapse"></td></tr>
    
    </tbody>
</table>
</td></tr>
</tbody>
</table>`, {
        USERNAME: "people",
        PASSWORD: "123123",
        EMAIL: "asDASD",
        HOST_SERVER: 'ASDASD'
    });
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}
const sendMailForgotPassword = (to, subject, userName, token) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let html = ejs.render(`<table style="font-size: 14px; font-family: Microsoft Yahei,Arial,Helvetica,sans-serif; padding: 0; margin: 0; color: #333; background-color: #f7f7f7; background-repeat: repeat-x; background-position: bottom left;" border="0" width="100%" cellspacing="0"
    cellpadding="0">
    <tbody>
        <tr>
            <td>
                <table style="max-width: 600px;" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tbody>
                        <tr>
                            <td style="padding: 33px 0; background: black;" align="center" valign="middle">
                                <a href='${HOST}'
                                target="_blank"
                                rel="noopener"> <img class="m_3358380767117121333m_-4368746486683527934m_-6847593570969279853CToWUd CToWUd"
                                style="border: 0; max-width: 232px;"
                                src ='${logo}'
                                alt='${HOST}' /> </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="padding: 0 30px; background: black;">
                                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 30px; padding: 20px 0; color: #fff;">
                                                <p>Dear ${userName},</p>
                                                <div>RESET PASSWORD:</div>
                                                <div>- Email: ${to}</div>
                                                <p> Please click RESET below to create new password.</p>
                                                <p><a style="padding: 10px 28px; background: white; text-decoration: none; border: 2px solid black; color: black; text-transform: uppercase; font-size: 14px;" href='${HOST}/forget-password/${token}'
                                                        target="_blank" rel="noopener">RESET</a></p>
                                                </td></tr>
                                                </td>
                                            </tr>
                                           
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`, {
        USERNAME: "people",
        PASSWORD: "123123",
        EMAIL: "asDASD",
        HOST_SERVER: 'ASDASD'
    });
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}
module.exports = {
    sendMail: sendMail,
    sendMailForgotPassword: sendMailForgotPassword,
    sendMailPrivateKey: sendMailPrivateKey,
    sendMailTransfer,
    sendMailWithdrawSwaptobe,
    sendMailWithdraw,
    sendMailDeposit,
    sendMailDepositCoinpayment,
    sendMailMessage
}