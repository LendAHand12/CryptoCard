var express = require('express');
const { uploadImage, upload, uploadSingle, uploadSingleImg, addNews, updateNews, uploadListing, uploadImageListing } = require('./upload');
const passport = require('passport');
const passportConfig = require('../middlewares/passport');
const path = require('path')
const fs = require('fs');
const { addRowToTable, getRowToTable, updateRowToTable ,deleteRowToTable} = require('../query/funcQuery');
const { success, error_400, error_500 } = require('../message');
const { callApi } = require('../commons/HyperFunc/callData');
const { getListNotification, clickNotification, clickAllNotification } = require('../controller/notification');
var router = express.Router();

router.post('/common', async (req, res) => {
    try {
        const io = req.io

        console.log("okkkkk push", req.body);
        const content = JSON.stringify(req.body)
        const log = await addRowToTable(`tb_notification_card`, { content })
        console.log(log, "loggg");
        const idLog = log.resolve.insertId
        const { notify_type } = req.body
        if (notify_type == 'OPEN_CARD') {
            const { card_type_id, email, mc_trade_no, mobile, mobile_code, result } = req.body
            const itemCard = req.body.card_id
            const checkCardId = await getRowToTable(`tb_card_user`, `card_id='${itemCard}'`)
            if (checkCardId.length > 0) return success(res, 'nhận dc')
            const transaction = await getRowToTable(`tb_card_transaction`, `mc_trade_no='${mc_trade_no}'`)
            console.log(transaction, "transaction");
            if (transaction.length <= 0) return success(res, "error is not define")
            const { userid, first_name, last_name, userName, id ,recharge_fee,min_first_recharge_amount} = transaction[0]
            const data = await callApi(`v2/openapi/card/apply/result`, `POST`, { mc_trade_no })
            console.log(data, "daaataaaaa");
            const response = data.data.result
            const { card_id, card_number } = response
            let card_number_hiden = card_number

            /// "card_id": "21950145889900019151",
            const objNotification = {
                notify_type, result, userid, email, userName,
                title: `Open card`,
                detail: `${result == 1 ? `Card opened successfully` : `Card opening failed`}`,
                mc_trade_no
            }
            console.log(objNotification, "objNotification");
            await addRowToTable(`tb_notification_user_visa`, objNotification)
            if (result == 1) {
                const obj = {
                    userid, email, mobile, mobile_code, mc_trade_no, card_id, first_name, last_name, card_type_id, card_number_hiden, userName
                }
                console.log(obj, "obj");
                await addRowToTable(`tb_card_user`, obj)
                if (card_type_id == '90000007' || card_type_id == '6000005' || card_type_id == '90000007' || card_type_id =="71000003" || card_type_id =="72000002") {
                    await updateRowToTable(`tb_card_transaction`, `typeTransaction='BindingKYCSuccess'`, `id=${id}`)

                    await updateRowToTable(`tb_card_user`, `first_name='${first_name}', last_name='${last_name}'`, `card_id='${itemCard}'`)
                }
            }else{
                await updateRowToTable(`tb_card_transaction`, `typeTransaction='faild'`, `id=${id}`)
                // await updateRowToTable(`tb_wallet_code`, `amount=amount+${recharge_fee}+${min_first_recharge_amount}`, `userid=${userid} AND code='USDT'`)
          
            }
            await updateRowToTable(`tb_notification_card`, `type=1`, `id=${idLog}`)

            io.to(`${userid}`).emit("notification", objNotification);
        } else if (notify_type == 'RECHARGE') {
            const { card_id, notify_type, mc_trade_no, result } = req.body
            const transaction = await getRowToTable(`tb_card_transaction`, `mc_trade_no='${mc_trade_no}'`)
            console.log(transaction, "transaction");
            if (transaction.length <= 0) return error_400(res, "error is not define")
            const { userid, email, userName } = transaction[0]
            const objNotification = {
                notify_type, result, userid, email, userName,
                title: `Input money to card`,
                detail: `${result == 1 ? `Deposit money to card successfully` : `Deposit to card failed`}`,
                mc_trade_no,
                card_id
            }
            await updateRowToTable(`tb_card_transaction`, `statusDeposit=${result == 1 ? 1 : 0}`, `mc_trade_no='${mc_trade_no}'`)
            await addRowToTable(`tb_notification_user_visa`, objNotification)
            await updateRowToTable(`tb_notification_card`, `type=1`, `id=${idLog}`)
            io.to(`${userid}`).emit("notification", objNotification);
        } else if (notify_type == 'RECHARGE') {
            const { card_id, notify_type, mc_trade_no, result } = req.body
            const transaction = await getRowToTable(`tb_card_transaction`, `mc_trade_no='${mc_trade_no}'`)
            console.log(transaction, "transaction");
            if (transaction.length <= 0) return success(res, "error is not define")
            const { userid, email, userName } = transaction[0]
            const objNotification = {
                notify_type, result, userid, email, userName,
                title: `Input money to card`,
                detail: `${result == 1 ? `Deposit money to card successfully` : `Deposit to card failed`}`,
                mc_trade_no,
                card_id
            }
            await addRowToTable(`tb_notification_user_visa`, objNotification)
            await updateRowToTable(`tb_notification_card`, `type=1`, `id=${idLog}`)
            io.to(`${userid}`).emit("notification", objNotification);
        } else if (notify_type == "OPERATION") {
            const { card_id, notify_type, request_number, operate_status } = req.body
            const transaction = await getRowToTable(`tb_card_user`, `card_id='${card_id}'`)
            if (transaction.length <= 0) return success(res, "error is not define")
            const { userid, email, userName } = transaction[0]
            const objNotification = {
                notify_type, result: operate_status, userid, email, userName,
                title: `Card manipulation`,
                detail: `${operate_status == 1 ? `Card operation successful` : `Card operation failed`}`,
                request_number: request_number,
                card_id

            }
            await addRowToTable(`tb_notification_user_visa`, objNotification)
            await updateRowToTable(`tb_notification_card`, `type=1`, `id=${idLog}`)
            await updateRowToTable(`tb_transaction_operation`, `operate_status=${operate_status}`, `request_number=${request_number}`)
            io.to(`${userid}`).emit("notification", objNotification);
        } else if (notify_type == "CONSUME") {
            const { card_id } = req.body
            const transaction = await getRowToTable(`tb_card_user`, `card_id='${card_id}'`)
            if (transaction.length <= 0) return success(res, "error is not define")
            const { userid, email, userName } = transaction[0]
            const objNotification = {
                notify_type, userid, email, userName,
                title: `Balance fluctuations`,
                detail: `Card id ${card_id} has balance fluctuation`,
                card_id

            }
            await addRowToTable(`tb_notification_user_visa`, objNotification)
            await updateRowToTable(`tb_notification_card`, `type=1`, `id=${idLog}`)
            // await updateRowToTable(`tb_transaction_operation`, `operate_status=${operate_status}`, `request_number=${request_number}`)
            io.to(`${userid}`).emit("notification", objNotification);
        } else if (notify_type == "AUTH_3DS") {
            const { card_id, auth_id, card_no, txn_currency, txn_amount, card_acceptor_merchant_name, card_acceptor_location_country, auth_result, expired_time, created_Time, updated_Time } = req.body
            const transaction = await getRowToTable(`tb_card_user`, `card_id='${card_id}'`)
            if (transaction.length <= 0) return success(res, "error is not define")
            const { userid, email, userName } = transaction[0]
            const objNotification = {
                notify_type, userid, email, userName,
                title: `Balance fluctuations`,
                detail: `Card id ${card_id} has balance fluctuation`,
                card_id,
                auth_id, card_no, txn_currency, txn_amount, card_acceptor_merchant_name, card_acceptor_location_country, auth_result, expired_time, created_Time, updated_Time,

            }
            await addRowToTable(`tb_notification_user_visa`, objNotification)
            await updateRowToTable(`tb_notification_card`, `type=1`, `id=${idLog}`)
            // await updateRowToTable(`tb_transaction_operation`, `operate_status=${operate_status}`, `request_number=${request_number}`)
            io.to(`${userid}`).emit("notification", objNotification);
        }else if (notify_type=="CANCEL_CARD"){
             const { card_id, refund_amount } = req.body
            const transaction = await getRowToTable(`tb_card_user`, `card_id='${card_id}'`)
            if (transaction.length <= 0) return success(res, "error is not define")
            const { userid, email, userName ,id,card_type_id} = transaction[0]
            const objNotification = {
                notify_type, userid, email, userName,
                title: `Your card has been canceled.`,
                detail: `Card id ${card_id} has been canceled`,
                card_id,
            }
            await addRowToTable(`tb_notification_user_visa`, objNotification)
            await updateRowToTable(`tb_notification_card`, `type=1`, `id=${idLog}`)
            await deleteRowToTable(`tb_card_user`,`card_id='${card_id}'`)
			  await deleteRowToTable(`tb_card_transaction`,`card_type_id='${card_type_id}' AND userid=${userid} AND apply_type is not null`)
            // await updateRowToTable(`tb_transaction_operation`, `operate_status=${operate_status}`, `request_number=${request_number}`)
            io.to(`${userid}`).emit("notification", objNotification);
        }
        success(res, "success")
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getListNotification', passport.authenticate('jwt', {
    session: false
}), getListNotification)
router.post('/clickNotification', passport.authenticate('jwt', {
    session: false
}), clickNotification)
router.post('/clickAllNotification', passport.authenticate('jwt', {
    session: false
}), clickAllNotification)
module.exports = router;