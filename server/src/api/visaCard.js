var express = require('express');
var router = express.Router();
const {
    error_400,
    error_500,
    success
} = require('../message');
const passport = require('passport');
const passportConfig = require('../middlewares/passport');
const customerQuery = require('../sockets/queries/customerQuery');
const { default: axios } = require('axios');
const { getSign, testPrivateKey, signRequest, generateNonce, testPublicKey } = require('../commons/HyperFunc');
const { callApi, callApiCreateCard, callApiOperationCard, callApiBindingKYC } = require('../commons/HyperFunc/callData');
const { createCardApplyType2, getTransactionCreateCard, listCardToUser, depositToCard, getTransactionDepositCard, bindingVisa, operationCardUser, bindingKYCCardUser, getHistoryDepositToCard, createCardKycVirtualCard, attachmentUpload, bankDetailCard, getHistoryOperationCard, queryRecordToCard, transactionAuth, transactionAuthStatus, queryPinToCard, reCardKycVirtualCard, getTransactionCardToAdmin, getCardUserToAdmin, getTransactionOperationToAdmin, cardPayment, commissionUser, commissionUserAdmin, reTestCreateCardApplyType2, signUpCardBinding, historySignUpCardUser, comfirmSignUpCardUserToAdmin, historySignUpCardUserToAdmin, getAllHistorySignUpCardUserToAdmin, loadHeweDb, listUserHeweDB, comfirmHeweDB, HistoryBonusUserHeweDB, walletConnect, historyWalletConnectToId, bindingKYCCardUserToAdmin, getSignUpCardToAdminSreach, getHeweDBToAdminSreach, getAllHeweDB, getAllSignUpCard, commissionFeeDepositCardToSymbol, getHistoryDepositToCardToTime, getHistoryDepositToCardToKeyword } = require('../controller/visaCard');
const { getRowToTable, deleteRowToTable } = require('../query/funcQuery');
const { decryptByPrivateKey, encryptByPublicKey } = require('../commons/HyperFunc/decodeBase64');
const { authenticateAdmin, authenticateAdminCard } = require('../middlewares/authenticate');

router.post('/historySignUpCardUser', passport.authenticate('jwt', {
    session: false
}), historySignUpCardUser);

router.post('/historyWalletConnectToId', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, historyWalletConnectToId);
router.post('/getSignUpCardToAdminSreach', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, getSignUpCardToAdminSreach);
router.post('/getHeweDBToAdminSreach', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, getHeweDBToAdminSreach);
router.post('/getAllHeweDB', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, getAllHeweDB);
router.post('/getAllSignUpCard', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, getAllSignUpCard);

router.post('/getapplicationIdRemoce',passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const body = {
            "mc_trade_no": "224"
        }
        const data = await callApi(`openapi/card/binding/remove`, `POST`,body)
        success(res,"get token success",data)
        
    } catch (error) {
        console.log(error);
        return error_500(error)

    }
})

router.post('/HistoryBonusUserHeweDB', passport.authenticate('jwt', {
    session: false
}), HistoryBonusUserHeweDB);
router.post('/walletConnect', passport.authenticate('jwt', {
    session: false
}), walletConnect);

router.post('/comfirmSignUpCardUserToAdmin', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, comfirmSignUpCardUserToAdmin);
router.post('/historySignUpCardUserToAdmin', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, historySignUpCardUserToAdmin);
router.post('/loadHeweDb', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, loadHeweDb);
router.post('/listUserHeweDB', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, listUserHeweDB);
router.post('/comfirmHeweDB', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, comfirmHeweDB);
router.post('/getAllHistorySignUpCardUserToAdmin', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, getAllHistorySignUpCardUserToAdmin);
router.post('/queryRecordToCard', passport.authenticate('jwt', {
    session: false
}), queryRecordToCard);
router.post('/getTransactionCardToAdmin', passport.authenticate('jwt', {
    session: false
}), authenticateAdminCard, getTransactionCardToAdmin);
router.post('/getCardUserToAdmin', passport.authenticate('jwt', {
    session: false
}), authenticateAdminCard, getCardUserToAdmin);
router.post('/getTransactionOperationToAdmin', passport.authenticate('jwt', {
    session: false
}), authenticateAdminCard, getTransactionOperationToAdmin);

router.post('/getTransactionCreateCard', passport.authenticate('jwt', {
    session: false
}), getTransactionCreateCard);
router.post('/getTransactionDepositCard', passport.authenticate('jwt', {
    session: false
}), getTransactionDepositCard);
router.post('/depositToCard', passport.authenticate('jwt', {
    session: false
}), depositToCard);
router.post('/getHistoryDepositToCard', passport.authenticate('jwt', {
    session: false
}), getHistoryDepositToCard);

router.post('/listCardToUser', passport.authenticate('jwt', {
    session: false
}), listCardToUser);
router.post('/bindingVisa', passport.authenticate('jwt', {
    session: false
}), bindingVisa);
router.post('/createCardKycVirtualCard', passport.authenticate('jwt', {
    session: false
}), createCardKycVirtualCard);
router.post('/getHistoryOperationCard', passport.authenticate('jwt', {
    session: false
}), getHistoryOperationCard);
router.post('/reCardKycVirtualCard', passport.authenticate('jwt', {
    session: false
}), reCardKycVirtualCard);
router.post('/operationCardUser', passport.authenticate('jwt', {
    session: false
}), operationCardUser);
router.post('/getTokenCard',passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {card_id,operation_type} = req.body
        const userid = req.user 
        const dataCard = await getRowToTable(`tb_card_user`,`userid=${userid} AND card_id='${card_id}'`)
        if(dataCard.length<=0) return error_400(res,'Error card')
        const body = {
            "card_id": card_id,
            "operation_type": operation_type?operation_type:1,
             "auth_id": ""
        }
        const data = await callApi(`openapi/card/ck/access/token`, `POST`,body)
        success(res,"get token success",data)
        
    } catch (error) {
        console.log(error);
        return error_500(error)

    }
})
router.post('/getapplicationId',passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {card_id} = req.body
        const userid = req.user 
        const dataCard = await getRowToTable(`tb_card_user`,`userid=${userid} AND card_id='${card_id}'`)
        if(dataCard.length<=0) return error_400(res,'Error card')
        const body = {
            "card_id": card_id
        }
        const data = await callApi(`openapi/card/sdk/get/applicationId`, `POST`,body)
        success(res,"get token success",data)
        
    } catch (error) {
        console.log(error);
        return error_500(error)

    }
})
router.post('/getSDKTokenCard',passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {card_id,singleUse} = req.body
        const userid = req.user 
        const dataCard = await getRowToTable(`tb_card_user`,`userid=${userid} AND card_id='${card_id}'`)
        if(dataCard.length<=0) return error_400(res,'Error card')
        const body = {
            "card_id": card_id,
            "token_type": "SDK_CARD_ACCESS_TOKEN",
            "singleUse" : singleUse
        }
        const data = await callApi(`openapi/card/sdk/access/token`, `POST`,body)
        success(res,"get token success",data)
        
    } catch (error) {
        console.log(error);
        return error_500(error)

    }
})
router.post('/listCard', async function (req, res, next) {
    try {
        const data = await callApi(`v5/openapi/card/list`, `POST`)
        // if (data.code == '00000') {
        //     for await (let item of data.data) {
        //         if (item.card_type_id == '90000007') {

        //         }
        //     }
        // }
        // console.log(data);

        // return success(res,"sss",data)
        const dataItem = await getRowToTable(`tb_config`, `name='EURTOUSD'`)

        for await (let item of data.data) {
            item.recharge_fee = parseFloat(item.recharge_fee) >= 1 ? parseFloat(item.recharge_fee) / 100 : parseFloat(item.recharge_fee)
            const moneyUint = item.card_coin == 'eur' ? dataItem[0].value : 1
            let feeCreateCardQuery = await getRowToTable(`tb_config`, `name='card_type_id=${item.card_type_id}'`)
            let feeDepositCardQuery = await getRowToTable(`tb_config`, `name='fee_deposit_card_type_id=${item.card_type_id}'`)
            console.log(feeCreateCardQuery, feeDepositCardQuery, "feeDepositCardQuery");

            let feeCreateCard
            if (feeCreateCardQuery.length <= 0) {
                feeCreateCard = 0
            } else {
                feeCreateCard = feeCreateCardQuery[0].value
                item.card_fee = parseFloat(item.card_fee) + feeCreateCard

            }
            if (feeDepositCardQuery.length <= 0) {
                feeCreateCard = 0
            } else {
                feeCreateCard = feeDepositCardQuery[0].value
                item.recharge_fee = parseFloat(item.recharge_fee) + feeCreateCard

            }
            if (item.card_type_id == "52500001") item.annual_fee = 15
        }
        success(res, "get list success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/removeBinding', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, async function (req, res, next) {
    try {

        const { mc_trade_no } = req.body
        const data = await callApi(`openapi/card/binding/remove`, `POST`, { mc_trade_no })
        if (data.code == '00000') {
            await deleteRowToTable(`tb_card_transaction`, `mc_trade_no='${mc_trade_no}'`)
            return success(res, "Success", data)
        }
        success(res, "Error", data)
    } catch (error) {
        console.log(error);
        error_500(error)
    }
});

router.post('/listCardToType', async function (req, res, next) {
    try {
        const { card_type_id } = req.body
        const data = await callApi(`v5/openapi/card/list`, `POST`, { card_type_id })
        const dataItem = await getRowToTable(`tb_config`, `name='EURTOUSD'`)
        if (data.code == '00000') {
            for await (let item of data.data) {
                // if()
                item.recharge_fee = parseFloat(item.recharge_fee) >= 1 ? parseFloat(item.recharge_fee) / 100 : parseFloat(item.recharge_fee)
                const moneyUint = item.card_coin == 'eur' ? dataItem[0].value : 1
                let feeCreateCardQuery = await getRowToTable(`tb_config`, `name='card_type_id=${item.card_type_id}'`)
                let feeDepositCardQuery = await getRowToTable(`tb_config`, `name='fee_deposit_card_type_id=${item.card_type_id}'`)
                console.log(feeCreateCardQuery, feeDepositCardQuery, "feeDepositCardQuery");

                let feeCreateCard
                if (feeCreateCardQuery.length <= 0) {
                    feeCreateCard = 0
                } else {
                    feeCreateCard = feeCreateCardQuery[0].value
                    item.card_fee = parseFloat(item.card_fee) + feeCreateCard

                }
                if (feeDepositCardQuery.length <= 0) {
                    feeCreateCard = 0
                } else {
                    feeCreateCard = feeDepositCardQuery[0].value
                    item.recharge_fee = parseFloat(item.recharge_fee) + feeCreateCard

                }
                if (item.card_type_id == "52500001") item.annual_fee = 15
            }
        }
        success(res, "get list success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/listCardToken', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const userid = req.user
        const data = await callApi(`v5/openapi/card/list`, `POST`)
        const dataItem = await getRowToTable(`tb_config`, `name='EURTOUSD'`)

        if (data.code == '00000') {
            for await (let item of data.data) {
                // if()
                item.recharge_fee = parseFloat(item.recharge_fee) >= 1 ? parseFloat(item.recharge_fee) / 100 : parseFloat(item.recharge_fee)
                const transactionCardUser = await getRowToTable(`tb_card_transaction`, `card_type_id='${item.card_type_id}' AND apply_type='${item.apply_type}' AND userid=${userid}`)
                const cardUser = await getRowToTable(`tb_card_user`, `card_type_id='${item.card_type_id}' AND userid=${userid} `)
                item.cardUser = cardUser[0]
                item.transactionCardUser = transactionCardUser[0]
                ///// card_type_id == 88990001
                //// Nếu trong item.cardUser có trả data && card_type_id == 88990001 thì show thông tin thẻ
                //// else if(check item.transactionCardUser có data)  thì cho user xem trạng thái thẻ có được duyệt hay chưa trong giao diện Card introduction
                /////  else  cho user tạo thẻ như bình thường
                ///// card_type_id == 90000007
                ////if(item.transactionCardUser có trả data && card_type_id == 90000007) thì check    item.transactionCardUser.typeTransaction=='binding' ? thì hiển thị nút KYC và nhảy qua màn hình BindingKYC : Show thẻ của user item.cardUser
                //// else item.transactionCardUser không có data mà user muốn tạo thẻ thì nhảy qua màn hình binding call api binding
                const moneyUint = item.card_coin == 'eur' ? dataItem[0].value : 1
                let feeCreateCardQuery = await getRowToTable(`tb_config`, `name='card_type_id=${item.card_type_id}'`)
                let feeDepositCardQuery = await getRowToTable(`tb_config`, `name='fee_deposit_card_type_id=${item.card_type_id}'`)

                let feeCreateCard
                if (feeCreateCardQuery.length <= 0) {
                    feeCreateCard = 0
                } else {
                    feeCreateCard = feeCreateCardQuery[0].value
                    item.card_fee = parseFloat(item.card_fee) + feeCreateCard

                }
                if (feeDepositCardQuery.length <= 0) {
                    feeCreateCard = 0
                } else {
                    feeCreateCard = feeDepositCardQuery[0].value
                    item.recharge_fee = parseFloat(item.recharge_fee) + feeCreateCard

                }
                if (item.card_type_id == "52500001") item.annual_fee = 15
            }
        }
        success(res, "get list success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});

router.post('/bindingKYCCardUserToAdmin', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, bindingKYCCardUserToAdmin)
router.post('/listCardUserId', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, async function (req, res, next) {
    try {
        const { userid } = req.body
        const data = await callApi(`v5/openapi/card/list`, `POST`)
        const dataItem = await getRowToTable(`tb_config`, `name='EURTOUSD'`)

        if (data.code == '00000') {
            for await (let item of data.data) {
                // if()
                item.recharge_fee = parseFloat(item.recharge_fee) >= 1 ? parseFloat(item.recharge_fee) / 100 : parseFloat(item.recharge_fee)
                const transactionCardUser = await getRowToTable(`tb_card_transaction`, `card_type_id='${item.card_type_id}' AND userid=${userid}`)
                const cardUser = await getRowToTable(`tb_card_user`, `card_type_id='${item.card_type_id}' AND userid=${userid}`)
                item.cardUser = cardUser[0]
                item.transactionCardUser = transactionCardUser[0]
                ///// card_type_id == 88990001
                //// Nếu trong item.cardUser có trả data && card_type_id == 88990001 thì show thông tin thẻ
                //// else if(check item.transactionCardUser có data)  thì cho user xem trạng thái thẻ có được duyệt hay chưa trong giao diện Card introduction
                /////  else  cho user tạo thẻ như bình thường
                ///// card_type_id == 90000007
                ////if(item.transactionCardUser có trả data && card_type_id == 90000007) thì check    item.transactionCardUser.typeTransaction=='binding' ? thì hiển thị nút KYC và nhảy qua màn hình BindingKYC : Show thẻ của user item.cardUser
                //// else item.transactionCardUser không có data mà user muốn tạo thẻ thì nhảy qua màn hình binding call api binding
                const moneyUint = item.card_coin == 'eur' ? dataItem[0].value : 1
                let feeCreateCardQuery = await getRowToTable(`tb_config`, `name='apply_type=${item.apply_type}'`)
                let feeDepositCardQuery = await getRowToTable(`tb_config`, `name='fee_deposit_apply_type=${item.apply_type}'`)

                let feeCreateCard
                if (feeCreateCardQuery.length <= 0) {
                    feeCreateCard = 0
                } else {
                    feeCreateCard = feeCreateCardQuery[0].value
                    item.card_fee = parseFloat(item.card_fee) + feeCreateCard

                }
                if (feeDepositCardQuery.length <= 0) {
                    feeCreateCard = 0
                } else {
                    feeCreateCard = feeDepositCardQuery[0].value
                    item.recharge_fee = parseFloat(item.recharge_fee) + feeCreateCard

                }
                if (item.card_type_id == "52500001") item.annual_fee = 15
            }
        }
        success(res, "get list success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/createCardApplyType2', passport.authenticate('jwt', {

    session: false
}), createCardApplyType2);
router.post('/reTestCreateCardApplyType2', passport.authenticate('jwt', {
    session: false
}), reTestCreateCardApplyType2);

router.post('/cardApplicationResults', async function (req, res, next) {

    try {
        const { mc_trade_no } = req.body
        const data = await callApi(`v2/openapi/card/apply/result`, `POST`, { mc_trade_no })
        /// "card_id": "21950145889900019151",
        success(res, "get list success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getBalanceVisa', async function (req, res, next) {

    try {
        const { card_id } = req.body
        const data = await callApi(`openapi/card/balance`, `POST`, { card_id })
        success(res, "get list success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/bindingKYCCardUser', passport.authenticate('jwt', {

    session: false
}), bindingKYCCardUser)
/////////////////////////////////
router.post('/queryPinToCard', passport.authenticate('jwt', {
    session: false
}), queryPinToCard);

router.post('/depositCard', async function (req, res, next) {

    try {
        const data = await callApi(`openapi/card/recharge`, `POST`, {
            card_id: "3286732525000012810",
            mc_trade_no: "181",
            pay_coin: "usdt",
            recharge_amount: "50",
            remark: "tete"
        })
        success(res, "get list success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/attachmentUpload', passport.authenticate('jwt', {

    session: false
}), attachmentUpload);
router.post('/cardPayment', passport.authenticate('jwt', {

    session: false
}), cardPayment);
router.post('/createCard', async function (req, res, next) {

    try {

        const {
            card_type_id,
            mc_trade_no
        } = req.body
        // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
        const base_info = {
            card_type_id,
            email: "dvkien2803@gmail.com",
            first_name: "Kien",
            // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
            last_name: "Diep",
            mobile: "0766666407",
            mobile_code: "84",
            first_recharge_amount: 0,
            pre_apply: false
            //    user_ip
        }
        const data = await callApiCreateCard(`v4/openapi/card/apply/quick`, `POST`, { base_info, mc_trade_no }, `base_info`)
        success(res, "get list historyTransfer success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/bindingKYC', async function (req, res, next) {

    try {

        const {
            // card_type_id,
            mc_trade_no
        } = req.body
        // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
        const base_info = {
            email: "dvkien2803@gmail.com",
            first_name: "Kien",
            // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
            last_name: "Diep",
            mobile: "0766666407",
            mobile_code: "84",
        }
        const kyc_info = {
            address: "dia chi nha",
            back_doc: "", //// base64 anh chup mat sau,
            birthday: "1985-12-15", ///  yyyy-MM-dd
            city: "hcm",//// hcm
            country_id: 203,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            doc_no: "546789789",/// ID passport
            doc_type: 1, //
            emergency_contact: "test@gmail.com",/// người liên hệ khẩn cấp ,
            front_doc: "",/// base64 ảnh chụp mặt trước,
            gender: 1,//// 1 name 2 nữ 
            mix_doc: "", /// base 64 ảnh chụp tay cầm hộ chiếu,
            nationality_id: 203, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            sign_img: " ",/// hình chữ ký 
            state: "hcm", /// tỉnh/ tiểu bang
            zip_code: "700000",///mã bưu điện

        }
        const imagebase64 = `asd`
        kyc_info.back_doc = imagebase64
        kyc_info.front_doc = imagebase64
        kyc_info.mix_doc = imagebase64
        const data = await callApiBindingKYC(`openapi/card/binding/kyc`, `POST`, { base_info, mc_trade_no, kyc_info }, `base_info`)
        success(res, "get list historyTransfer success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/createdCardKyc', async function (req, res, next) {

    try {

        const {
            // card_type_id,
            mc_trade_no
        } = req.body
        // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
        const base_info = {
            card_type_id: "88990003",
            email: "dvkien2803@gmail.com",
            first_name: "Kien",
            // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
            last_name: "Diep",
            mobile: "0766666407",
            mobile_code: "84",
            first_recharge_amount: 0,
            pre_apply: false
        }
        const kyc_info = {
            address: "dia chi nha",
            back_doc: "", //// base64 anh chup mat sau,
            birthday: "1985-12-15", ///  yyyy-MM-dd
            city: "hcm",//// hcm
            country_id: 203,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            doc_never_expire: 1,
            doc_no: "546789789",/// ID passport
            doc_type: 1, //
            emergency_contact: "test123",/// người liên hệ khẩn cấp ,
            front_doc: "",/// base64 ảnh chụp mặt trước,
            gender: 1,//// 1 name 2 nữ 
            mix_doc: "", /// base 64 ảnh chụp tay cầm hộ chiếu,
            nationality_id: 203, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            sign_img: "",/// hình chữ ký 
            state: "hcm", /// tỉnh/ tiểu bang
            zip_code: "700000",///mã bưu điện

        }
        const imagebase64 = ``
        kyc_info.back_doc = imagebase64
        kyc_info.front_doc = imagebase64
        kyc_info.mix_doc = imagebase64
        kyc_info.sign_img = imagebase64
        const data = await callApiBindingKYC(`v4/openapi/card/apply`, `POST`, { base_info, mc_trade_no, kyc_info }, `base_info`)
        success(res, "get list historyTransfer success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/binding', async function (req, res, next) {

    try {
        const {
            card_no,
            mc_trade_no,
            envelope_no,
            user_identifier
        } = req.body
        // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
        const data = await callApi(`openapi/card/binding`, `POST`, { card_no, envelope_no, mc_trade_no, user_identifier })
        success(res, "get list historyTransfer success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/signUpCardBinding', passport.authenticate('jwt', {
    session: false
}), signUpCardBinding);
router.post('/commissionUser', passport.authenticate('jwt', {
    session: false
}), commissionUser);
router.post('/commissionUserAdmin', passport.authenticate('jwt', {
    session: false
}), authenticateAdmin, commissionUserAdmin);
router.post('/transactionAuth', passport.authenticate('jwt', {

    session: false
}), transactionAuth
);
router.post('/transactionAuthStatus', passport.authenticate('jwt', {

    session: false
}), transactionAuthStatus
);
router.post('/operationCard', async function (req, res, next) {

    try {

        const {
            card_id,
            request_number,
            // sign_img
        } = req.body
        // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
        console.log("ozzzz");
        const address = {
            country_code: "VNM",
            state: "state",
            city: "beijing",
            zip_code: "100000",
            address: "maizidianjie28hao",
            mobile_code: "84",
            mobile: "0766666407"
            //    user_ip
        }
        const data = await callApiOperationCard(`openapi/card/operation`, `POST`, {
            card_id,
            request_number,
            type: 6,
            // sign_img,
            // address: null,
        })
        success(res, "get list historyTransfer success!", data)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
}
);
router.post('/bankDetailCard', passport.authenticate('jwt', {

    session: false
}), bankDetailCard);
router.post('/addCommison', passport.authenticate('jwt', {

    session: false
}), authenticateAdmin, async (req, res, next) => {
    try {
        const { userid, amount, mc_trade_no, symbol } = req.body
        await commissionFeeDepositCardToSymbol(userid, amount, mc_trade_no, symbol)
        success(res, "success")
    } catch (error) {

    }
});
module.exports = router


