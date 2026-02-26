const { default: axios } = require("axios")
const { getListLimitPage } = require("../commons")
const { createWalletPayment, createWalletAndCheckWallet } = require("../commons/functionIndex")
const { testPublicKey } = require("../commons/HyperFunc")
const { callApi, callApiCreateCard, callApiOperationCard, callApiBindingKYC } = require("../commons/HyperFunc/callData")
const { decryptByPrivateKey } = require("../commons/HyperFunc/decodeBase64")
const { error_400, success, error_500 } = require("../message")
const { getRowToTable, getLimitPageToTable, addRowToTable, updateRowToTable } = require("../query/funcQuery")
const { delRedis, existsRedis, setnxRedis, getRedis, incrbyRedis } = require("../model/model.redis")
const { createWalletBEP20 } = require("../lib/web3")

/// function 
async function commissionFeeDepositCard(userid, amount, mc_trade_no) {
    try {
        const user = await getRowToTable(`users`, `id=${userid}`)
        const userParent = await getRowToTable(`users`, `id=${user[0].inviter_id}`)
        console.log(user[0].inviter_id, userParent);

        const configValue = await getRowToTable(`tb_config`, `name='comission_fee_deposit'`)
        if (userParent.length > 0 && configValue[0].value > 0) {
            const percent = configValue[0].value
            const amountReceived = amount * percent
            await updateRowToTable(`tb_wallet_code`, `amount=amount+${amountReceived}`, `code='USDT' AND userid=${userParent[0].id}`)
            const obj = {
                userid: userParent[0].id,
                username: userParent[0].username,
                parent_id: userid,
                amount,
                userNameParent: user[0].username,
                note: `Comission Deposit Card`,
                amountReceived,
                mc_trade_no,
                percent
            }
            await addRowToTable(`tb_commission`, obj)
        }
    } catch (error) {
        console.log(error, "commissionFeeDepositCard");

    }
}
async function commissionFeeDepositCardToSymbol(userid, amount, mc_trade_no, symbol) {
    try {
        const user = await getRowToTable(`users`, `id=${userid}`)
        const userParent = await getRowToTable(`users`, `id=${user[0].inviter_id}`)
        await createWalletAndCheckWallet(user[0].inviter_id, symbol)
        const configValue = await getRowToTable(`tb_config`, `name='comission_fee_deposit'`)
        if (userParent.length > 0 && configValue[0].value > 0) {
            const percent = configValue[0].value
            const amountReceived = amount * percent
            await updateRowToTable(`tb_wallet_code`, `amount=amount+${amountReceived}`, `code='${symbol}' AND userid=${userParent[0].id}`)
            const obj = {
                userid: userParent[0].id,
                username: userParent[0].username,
                parent_id: userid,
                amount,
                userNameParent: user[0].username,
                note: `Comission Deposit Card`,
                amountReceived,
                mc_trade_no,
                percent,
                symbol
            }
            await addRowToTable(`tb_commission`, obj)
        }
    } catch (error) {
        console.log(error, "commissionFeeDepositCard");

    }
}
async function commissionFeeCreateCard(userid, amount, mc_trade_no) {
    try {
        const user = await getRowToTable(`users`, `id=${userid}`)
        const userParent = await getRowToTable(`users`, `id=${user[0].inviter_id}`)
        console.log(user[0].inviter_id, userParent);

        const configValue = await getRowToTable(`tb_config`, `name='comission_fee_card'`)
        if (userParent.length > 0 && configValue[0].value > 0) {
            const percent = configValue[0].value
            const amountReceived = amount * percent
            await updateRowToTable(`tb_wallet_code`, `amount=amount+${amountReceived}`, `code='USDT' AND userid=${userParent[0].id}`)
            const obj = {
                userid: userParent[0].id,
                username: userParent[0].username,
                parent_id: userid,
                amount,
                userNameParent: user[0].username,
                note: `Comission Deposit Card`,
                amountReceived,
                mc_trade_no,
                percent
            }
            await addRowToTable(`tb_commission`, obj)
        }
    } catch (error) {
        console.log(error, "commissionFeeCreateCard");

    }
}
///
async function getFee(recharge_fee, card_coin, apply_type, card_fee, min_first_recharge_amount,card_type_id) {
    try {
        const dataItem = await getRowToTable(`tb_config`, `name='EURTOUSD'`)
        const moneyUint = card_coin == 'eur' ? dataItem[0].value : 1
        recharge_fee = recharge_fee
        card_fee = card_fee / moneyUint
        let feeCreateCardQuery = await getRowToTable(`tb_config`, `name='card_type_id=${card_type_id}'`)
        let feeDepositCardQuery = await getRowToTable(`tb_config`, `name='fee_deposit_card_type_id=${card_type_id}'`)
        let feeCreateCard, feeDepositCard
        min_first_recharge_amount = min_first_recharge_amount / moneyUint
        if (feeCreateCardQuery.length <= 0) {
            feeCreateCard = 0
        } else {
            feeCreateCard = feeCreateCardQuery[0].value / moneyUint
            card_fee = parseFloat(card_fee) + feeCreateCard
        }
        if (feeDepositCardQuery.length <= 0) {
            feeDepositCard = 0
            recharge_fee = min_first_recharge_amount * parseFloat(recharge_fee)
        } else {

            feeDepositCard = feeDepositCardQuery[0].value + parseFloat(recharge_fee)
            recharge_fee = min_first_recharge_amount * parseFloat(feeDepositCard)
        }
        return {
            feeDepositCard,
            recharge_fee,
            card_fee,
            min_first_recharge_amount
        }
    } catch (error) {
        console.log(error, "getFee");

    }
}
///
async function createCardApplyType2(req, res, next) {
    try {
        const {
            card_type_id,
            first_name, ///Validation không dấu 
            last_name, ///Validation không dấu 
            mobile,
            mobile_code, /// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html

        } = req.body
        const userid = req.user
        const check = await getRowToTable(`tb_card_transaction`, `userid=${userid} AND card_type_id='${card_type_id}' AND typeTransaction='createVisaCard'`)
        if (check.length > 0) return error_400(res, "You have successfully submitted your card creation application, please wait for the censorship system")
        const data = await callApi(`v5/openapi/card/list`, `POST`, { card_type_id: card_type_id })
        let { recharge_fee, apply_type, min_first_recharge_amount, card_coin, card_fee } = data.data[0]
        recharge_fee = parseFloat(recharge_fee) >= 1 ? parseFloat(recharge_fee) / 100 : parseFloat(recharge_fee)
        if (apply_type != 2) return error_400(res, `Invalid registration method`)
        const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='USDT'`)
        if (wallet.length <= 0) return error_400(res, "Wallet is not exit")
        // if (wallet[0].amount < parseFloat(recharge_fee)) return error_400(res, `Insufficient balance`)
        const listCardDB = await getListLimitPage(`tb_card_transaction`, 1, 1)
        // const mc_trade_no = listCardDB.array[0].mc_trade_no + 1
        const mc_trade_no = listCardDB.array[0].mc_trade_no + 1

        const user = await getRowToTable(`users`, `id=${userid}`)


        /////////////// call API createcard hyper
        const base_info = {
            card_type_id,
            email: user[0].email,
            first_name,
            // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
            last_name,
            mobile,
            mobile_code,
            first_recharge_amount: parseInt(min_first_recharge_amount),
            pre_apply: false
            //    user_ip
        }
        const fee = await getFee(recharge_fee, card_coin, apply_type, card_fee, min_first_recharge_amount,card_type_id)
        recharge_fee = fee.recharge_fee
        min_first_recharge_amount = fee.min_first_recharge_amount
        card_fee = fee.card_fee
        if (wallet[0].amount < parseFloat(recharge_fee) + parseFloat(min_first_recharge_amount) + parseFloat(card_fee)) return error_400(res, `Initial deposit fee and card creation fee are not enough`)

        const dataResCreate = await callApiCreateCard(`v4/openapi/card/apply/quick`, `POST`, { base_info, mc_trade_no }, `base_info`)
        console.log(dataResCreate, "dataResCreate");
        if (dataResCreate.code == "00000") {
            await addRowToTable(`tb_card_transaction`, {
                email: user[0].email,
                userName: user[0].username,
                first_name,
                last_name,
                mobile,
                mobile_code,
                userid,
                recharge_fee,
                card_type_id,
                apply_type,
                mc_trade_no
            })
            await updateRowToTable(`tb_wallet_code`, `amount=amount-${recharge_fee}-${min_first_recharge_amount}-${card_fee}`, `userid=${userid} AND code='USDT'`)
            await commissionFeeCreateCard(userid, card_fee, mc_trade_no)
            await commissionFeeDepositCard(userid, min_first_recharge_amount, mc_trade_no)
            success(res, 'Card created successfully')
        } else {
            error_400(res, dataResCreate.msg)
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
}
async function reTestCreateCardApplyType2(req, res, next) {
    try {
        let {
            card_type_id,
            first_name, ///Validation không dấu 
            last_name, ///Validation không dấu 
            mobile,
            mobile_code, /// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html

        } = req.body
        const userid = 1653
        const check = await getRowToTable(`tb_card_transaction`, `userid=${userid} AND card_type_id='${card_type_id}' AND typeTransaction='faild'`)
        if (check.length <= 0) return error_400(res, "You have successfully submitted your card creation application, please wait for the censorship system")
        const data = await callApi(`v5/openapi/card/list`, `POST`, { card_type_id: card_type_id })
        let { recharge_fee, apply_type, min_first_recharge_amount, card_coin, card_fee } = data.data[0]
        if (apply_type != 2) return error_400(res, `Invalid registration method`)
        const mc_trade_no = check[0].mc_trade_no

        const user = await getRowToTable(`users`, `id=${userid}`)


        /////////////// call API createcard hyper
        const base_info = {
            card_type_id: parseInt(card_type_id),
            email: user[0].email,
            first_name,
            // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
            last_name,
            mobile,
            mobile_code,
            first_recharge_amount: parseInt(min_first_recharge_amount),
            pre_apply: false
            //    user_ip
        }
        console.log(typeof (base_info.card_type_id));

        const dataResCreate = await callApiCreateCard(`v4/openapi/card/apply/quick`, `POST`, { base_info, mc_trade_no }, `base_info`)
        console.log(dataResCreate, "dataResCreate");
        if (dataResCreate.code == "00000") {
            await updateRowToTable(`tb_card_transaction`, `email='${user[0].email}',userName='${user[0].username}'
                ,first_name='${first_name}'
                ,last_name='${last_name}'
                ,mobile='${mobile}'
                ,mobile_code='${mobile_code}'
                ,card_type_id='${card_type_id}'
                `, `mc_trade_no=${mc_trade_no}`)
            success(res, 'Card created successfully')
        } else {
            error_400(res, dataResCreate.msg)
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
}
async function createCardKycVirtualCard(req, res) {
    try {
        const {
            card_type_id,
            first_name, ///Validation không dấu 
            last_name, ///Validation không dấu 
            mobile,
            mobile_code, /// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            doc_no, /// ID Passport
            address, //// dia chỉ nhà 
            back_doc,//// base64 anh chup mat sau,
            birthday,///  yyyy-MM-dd
            city,//// Thành phố
            gender,//// 1 name 2 nữ 
            country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            emergency_contact,/// người liên hệ khẩn cấp ,
            front_doc,/// base64 ảnh chụp mặt trước,
            mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
            nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            sign_img,/// hình chữ ký  base64
            state, /// tỉnh/ tiểu bang
            zip_code,///mã bưu điện
        } = req.body
        const userid = req.user
        const check = await getRowToTable(`tb_card_transaction`, `userid=${userid} AND card_type_id='${card_type_id}' AND typeTransaction='createVisaCard'`)
        if (check.length > 0) return error_400(res, "You have successfully submitted your card creation application, please wait for the censorship system")
        const data = await callApi(`v5/openapi/card/list`, `POST`, { card_type_id: card_type_id })
        const user = await getRowToTable(`users`, `id=${userid}`)
        let { recharge_fee, apply_type, card_coin, min_first_recharge_amount, card_fee } = data.data[0]
        recharge_fee = parseFloat(recharge_fee) >= 1 ? parseFloat(recharge_fee) / 100 : parseFloat(recharge_fee)
        const base_info = {
            card_type_id,
            email: user[0].email,
            first_name,
            // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
            last_name,
            mobile,
            mobile_code,
            first_recharge_amount: parseInt(min_first_recharge_amount),
            pre_apply: true
            //    user_ip
        }
        //// fee
        const dataItem = await getRowToTable(`tb_config`, `name='EURTOUSD'`)
        const moneyUint = card_coin == 'eur' ? dataItem[0].value : 1
        recharge_fee = recharge_fee
        card_fee = card_fee / moneyUint
        let feeCreateCardQuery = await getRowToTable(`tb_config`, `name='card_type_id=${card_type_id}'`)
        let feeDepositCardQuery = await getRowToTable(`tb_config`, `name='fee_deposit_card_type_id=${card_type_id}'`)
        let feeCreateCard, feeDepositCard
        min_first_recharge_amount = min_first_recharge_amount / moneyUint
        if (feeCreateCardQuery.length <= 0) {
            feeCreateCard = 0
        } else {
            feeCreateCard = feeCreateCardQuery[0].value / moneyUint
            card_fee = parseFloat(card_fee) + feeCreateCard
        }
        if (feeDepositCardQuery.length <= 0) {
            feeDepositCard = 0
            recharge_fee = min_first_recharge_amount * parseFloat(recharge_fee)
        } else {

            feeDepositCard = feeDepositCardQuery[0].value + parseFloat(recharge_fee)
            recharge_fee = min_first_recharge_amount * parseFloat(feeDepositCard)
        }
        ///fee
        // if (apply_type != 2) return error_400(res, `Invalid registration method`)
        const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='USDT'`)
        if (wallet.length <= 0) return error_400(res, "Wallet is not exit")
        if (wallet[0].amount < parseFloat(recharge_fee) + parseFloat(min_first_recharge_amount) + parseFloat(card_fee)) return error_400(res, `Initial deposit fee and card creation fee are not enough`)
        const listCardDB = await getListLimitPage(`tb_card_transaction`, 1, 1)
        const mc_trade_no = listCardDB.array[0].mc_trade_no + 1
        // const mc_trade_no = 5





        /////////////// call API createcard hyper

        let kyc_info = {
            address: address,
            back_doc: back_doc, //// base64 anh chup mat sau,
            birthday: birthday, ///  yyyy-MM-dd
            city: city,//// hcm
            country_id: country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            doc_never_expire: 1,
            doc_no: doc_no,/// ID passport
            doc_type: 1, //
            emergency_contact: emergency_contact,/// người liên hệ khẩn cấp ,
            front_doc: front_doc,/// base64 ảnh chụp mặt trước,
            gender: gender,//// 1 name 2 nữ 
            mix_doc: mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
            nationality_id: nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            sign_img: sign_img,/// hình chữ ký 
            state: state, /// tỉnh/ tiểu bang
            zip_code: zip_code,///mã bưu điện

        }



        ////////////
        // await commissionFeeCreateCard(userid, card_fee, mc_trade_no)
        // await commissionFeeDepositCard(userid, min_first_recharge_amount, mc_trade_no)
        // return error_400(res, "resss")
        const dataResCreate = await callApiBindingKYC(`v4/openapi/card/apply`, `POST`, { base_info, mc_trade_no, kyc_info }, `base_info`)
        if (dataResCreate.code == "00000") {
            await addRowToTable(`tb_card_transaction`, {
                email: user[0].email,
                userName: user[0].username,
                first_name,
                last_name,
                mobile,
                mobile_code,
                userid,
                recharge_fee,
                card_type_id,
                apply_type,
                mc_trade_no,
                min_first_recharge_amount,
                card_coin,
                card_fee
            })
            await updateRowToTable(`tb_wallet_code`, `amount=amount-${recharge_fee}-${min_first_recharge_amount}-${card_fee}`, `userid=${userid} AND code='USDT'`)
            await commissionFeeCreateCard(userid, card_fee, mc_trade_no)
            await commissionFeeDepositCard(userid, min_first_recharge_amount, mc_trade_no)
            success(res, 'Card created successfully')
        } else {
            error_400(res, dataResCreate.msg)
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
}
async function reCardKycVirtualCard(req, res) {
    try {
        let {
            card_type_id,
            first_name, ///Validation không dấu 
            last_name, ///Validation không dấu 
            mobile,
            mobile_code, /// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            doc_no, /// ID Passport
            address, //// dia chỉ nhà 
            back_doc,//// base64 anh chup mat sau,
            birthday,///  yyyy-MM-dd
            city,//// Thành phố
            gender,//// 1 name 2 nữ 
            country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            emergency_contact,/// người liên hệ khẩn cấp ,
            front_doc,/// base64 ảnh chụp mặt trước,
            mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
            nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            sign_img,/// hình chữ ký  base64
            state, /// tỉnh/ tiểu bang
            zip_code,///mã bưu điện

        } = req.body
        const userid = req.user
        const check = await getRowToTable(`tb_card_transaction`, `userid=${userid} AND card_type_id='${card_type_id}' AND typeTransaction='faild'`)
        if (check.length <= 0) return error_400(res, "Your KYC order is not available yet")
        const data = await callApi(`v5/openapi/card/list`, `POST`, { card_type_id: card_type_id })
        const user = await getRowToTable(`users`, `id=${userid}`)

        let { recharge_fee, apply_type, card_coin, min_first_recharge_amount } = data.data[0]
        const base_info = {
            card_type_id,
            email: user[0].email,
            first_name,
            // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
            last_name,
            mobile,
            mobile_code,
            first_recharge_amount: parseInt(min_first_recharge_amount),
            pre_apply: true
            //    user_ip
        }
        // const dataItem = await getRowToTable(`tb_config`, `name='EURTOUSD'`)
        // const moneyUint = card_coin == 'eur' ? dataItem[0].value : 1
        // recharge_fee = recharge_fee * moneyUint
        // min_first_recharge_amount = min_first_recharge_amount * moneyUint
        // if (apply_type != 2) return error_400(res, `Invalid registration method`)
        // const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='USDT'`)
        // if (wallet.length <= 0) return error_400(res, "Wallet is not exit")
        // if (wallet[0].amount < parseFloat(recharge_fee) + parseFloat(min_first_recharge_amount)) return error_400(res, `Initial deposit fee and card creation fee are not enough`)
        const listCardDB = await getListLimitPage(`tb_card_transaction`, 1, 1)
        const mc_trade_no = check[0].mc_trade_no




        /////////////// call API createcard hyper

        let kyc_info = {
            address: address,
            back_doc: back_doc, //// base64 anh chup mat sau,
            birthday: birthday, ///  yyyy-MM-dd
            city: city,//// hcm
            country_id: country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            doc_never_expire: 1,
            doc_no: doc_no,/// ID passport
            doc_type: 1, //
            emergency_contact: emergency_contact,/// người liên hệ khẩn cấp ,
            front_doc: front_doc,/// base64 ảnh chụp mặt trước,
            gender: gender,//// 1 name 2 nữ 
            mix_doc: mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
            nationality_id: nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
            sign_img: sign_img,/// hình chữ ký 
            state: state, /// tỉnh/ tiểu bang
            zip_code: zip_code,///mã bưu điện

        }

        // kyc_info.back_doc ="abv"
        // kyc_info.front_doc ="abv"
        // kyc_info.mix_doc ="abv"
        // kyc_info.sign_img ="abv"

        ////////////
        ///// return 
        // return success(res, "ok")
        // return success(res, "ok",{ base_info, mc_trade_no, kyc_info })
        const dataResCreate = await callApiBindingKYC(`v4/openapi/card/apply`, `POST`, { base_info, mc_trade_no: `${mc_trade_no}`, kyc_info }, `base_info`)
        if (dataResCreate.code == "00000") {
            // await updateRowToTable(`tb_card_transaction`, {
            //     email: user[0].email,
            //     userName: user[0].username,
            //     first_name,
            //     last_name,
            //     mobile,
            //     mobile_code,
            //     userid,
            //     recharge_fee,
            //     card_type_id,
            //     apply_type,
            //     mc_trade_no,
            //     min_first_recharge_amount,
            //     card_coin
            // })
            await updateRowToTable(`tb_card_transaction`, `email='${user[0].email}',userName='${user[0].username}'
                ,first_name='${first_name}'
                ,last_name='${last_name}'
                ,mobile='${mobile}'
                ,mobile_code='${mobile_code}'
        
                ,card_type_id='${card_type_id}'
                `, `mc_trade_no=${mc_trade_no}`)
            // await updateRowToTable(`tb_wallet_code`, `amount=amount-${recharge_fee}-${min_first_recharge_amount}`, `userid=${userid} AND code='USDT'`)
            error_400(res, 'Updated kyc information successfully')
        } else {
            error_400(res, dataResCreate.msg)
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
}
module.exports = {
    reCardKycVirtualCard,
    createCardApplyType2,
    reTestCreateCardApplyType2,
    createCardKycVirtualCard,
    bindingVisa: async (req, res, next) => {
        try {
            const {
                card_no,
                card_type_id,
                envelope_no
            } = req.body
            const userid = req.user
            // 90000007
            const data = await callApi(`v5/openapi/card/list`, `POST`, { card_type_id: card_type_id })
            const { recharge_fee, apply_type } = data.data[0]
            if (apply_type != 3) return error_400(res, `Invalid registration method`)
            const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='USDT'`)
            if (wallet.length <= 0) return error_400(res, "Wallet is not exit")
            // if (wallet[0].amount < parseFloat(recharge_fee)) return error_400(res, `Insufficient balance`)
            const listCardDB = await getListLimitPage(`tb_card_transaction`, 1, 1)
            const mc_trade_no = listCardDB.array[0].mc_trade_no + 1
            // const mc_trade_no = 5

            const user = await getRowToTable(`users`, `id=${userid}`)


            /////////////// call API createcard hyper
            const objBinding = {
                card_no,
                mc_trade_no,
                envelope_no,
                user_identifier: user[0].email
            }

            const dataResCreate = await callApi(`openapi/card/binding`, `POST`, objBinding)
            if (dataResCreate.code == "00000") {
                await addRowToTable(`tb_card_transaction`, {
                    email: user[0].email,
                    userName: user[0].username,
                    // first_name,
                    // last_name,
                    // mobile,
                    // mobile_code,
                    userid,
                    recharge_fee,
                    card_type_id,
                    apply_type,
                    mc_trade_no,
                    typeTransaction: 'binding'
                })
                // await updateRowToTable(`tb_wallet_code`, `amount=amount-${recharge_fee}`, `userid=${userid} AND code='USDT'`)
                success(res, 'Card created successfully')
            } else {
                error_400(res, dataResCreate.msg)
            }

        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    bankDetailCard: async function (req, res, next) {

        try {

            const {
                card_id,
            } = req.body
            const userid = req.user
            const pub_key = testPublicKey
            const check = await getRowToTable(`tb_card_user`, `userid=${userid} AND card_id='${card_id}'`)
            // if (check.length <= 0) return error_400(res, "Card is not exit")
            const data = await callApi(`v2/openapi/card/bank/details`, `POST`, {
                card_id,
                pub_key
            })
            const dataEncode = data.data.encoded_card_detail
            const dataDetail = await decryptByPrivateKey(dataEncode)
            console.log(JSON.parse(dataDetail), "dataDetail");
            data.data.encoded_card_detail = JSON.parse(dataDetail)
            success(res, "get  detail success!", data)


        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    commissionUserAdmin: async function (req, res, next) {

        try {
            const { limit, page, where } = req.body

            const check = await getListLimitPage(`tb_commission`, limit, page, where)
            success(res, "Get successfully!", check)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    signUpCardBinding: async function (req, res, next) {

        try {
            const { fullName, address, phone, type } = req.body
            const userid = req.user
            let card_type_id = project == "dev2" ? "71000003" : "6000005"
            const data = await callApi(`v5/openapi/card/list`, `POST`, { card_type_id: card_type_id })
            let { recharge_fee, apply_type, min_first_recharge_amount, card_coin, card_fee } = data.data[0]
            let feeCreateCardQuery = await getRowToTable(`tb_config`, `name='card_type_id=${card_type_id}'`)

            const user = await getRowToTable(`users`, `id=${userid}`)
            const dataItem = await getRowToTable(`tb_config`, `name='EURTOUSD'`)
            const moneyUint = card_coin == 'eur' ? dataItem[0].value : 1
            let amountUsdt = feeCreateCardQuery[0].value / moneyUint
            let feeSignUp = type == 1 ? amountUsdt : amountUsdt * 0.95
            const coin = await getRowToTable(`tb_coin`, `name='AMC'`)
            let amountAmc = (amountUsdt / coin[0].price) * 0.95

            if (type == 1) {
                const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='USDT'`)
                if (wallet.length <= 0) return error_400(res, 'Insufficient balance')
                if (wallet[0].amount < amountUsdt) return error_400(res, 'Insufficient balance')

                await updateRowToTable(`tb_wallet_code`, `amount=amount-${amountUsdt}`, `userid=${userid} AND code='USDT'`)
                await commissionFeeCreateCard(userid, feeSignUp, 'signUpCardBinding')
                const objSignUp = {
                    fullName, address, phone, email: user[0].email,
                    userid,
                    paymentCoin: "USDT",
                    amountCoin: amountUsdt
                }
                await addRowToTable(`tb_signup_card`, objSignUp)
                success(res, "Card registration successful!")

            } else if (type == 2) {
                const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='AMC'`)
                if (wallet.length <= 0) return error_400(res, 'Insufficient balance')
                if (wallet[0].amount < amountAmc) return error_400(res, 'Insufficient balance')
                await commissionFeeCreateCard(userid, feeSignUp, 'signUpCardBinding')
                await updateRowToTable(`tb_wallet_code`, `amount=amount-${amountAmc}`, `userid=${userid} AND code='AMC'`)
                const objSignUp = {
                    fullName, address, phone, email: user[0].email,
                    paymentCoin: "AMC",
                    amountCoin: amountAmc,
                    userid,
                    rate: coin[0].price
                }
                await addRowToTable(`tb_signup_card`, objSignUp)

                success(res, "Card registration successful!")


            } else {
                return error_400(res, "Type is not exit")
            }
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    commissionUser: async function (req, res, next) {

        try {
            const { limit, page } = req.body
            const userid = req.user
            const check = await getListLimitPage(`tb_commission`, limit, page, `userid=${userid}`)
            success(res, "Get successfully!", check)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    historySignUpCardUser: async function (req, res, next) {

        try {
            const { limit, page } = req.body
            const userid = req.user
            const check = await getListLimitPage(`tb_signup_card`, limit, page, `userid=${userid}`)
            success(res, "Get successfully!", check)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },

    historySignUpCardUserToAdmin: async function (req, res, next) {

        try {
            const { limit, page, userid } = req.body
            const check = await getListLimitPage(`tb_signup_card`, limit, page, `userid=${userid}`)
            success(res, "Get successfully!", check)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    comfirmHeweDB: async function (req, res, next) {

        try {
            const { id } = req.body
            const check = await getRowToTable(`tb_hewe_db_signup`, `id=${id}`)
            if (check.length <= 0) return error_400(res, "id is not define")
            if (check[0].status != 2) return error_400(res, "This order has been confirmed")
            await updateRowToTable(`tb_hewe_db_signup`, `status=1`, `id=${id}`)
            await updateRowToTable(`tb_wallet_code`, `amount=amount+50`, `code='USDT' AND userid=${check[0].userid}`)
            success(res, "Confirmed successfully!", check)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    listUserHeweDB: async function (req, res, next) {

        try {
            const { limit, page } = req.body
            const check = await getListLimitPage(`tb_hewe_db_signup`, limit, page)
            success(res, "Get successfully!", check)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    walletConnect: async function (req, res, next) {

        try {
            const { address } = req.body
            const userid = req.user
            const result = await createWalletBEP20(req.user, `HEWE`)
            const check = await updateRowToTable(`users`, `walletConnect='${address}'`, `id=${userid}`)
            const obj = {
                userid,
                address
            }
            await addRowToTable(`tb_walletConnect`, obj)
            success(res, "Connect successfully!", result)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    historyWalletConnectToId: async function (req, res, next) {

        try {
            const { userid } = req.body
            const check = await getRowToTable(`tb_walletConnect`, `userid=${userid}`)
            success(res, "Connect successfully!", check)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    HistoryBonusUserHeweDB: async function (req, res, next) {

        try {
            const { limit, page } = req.body
            const userid = req.user
            const check = await getListLimitPage(`tb_hewe_db_signup`, limit, page, `userid=${userid}`)
            success(res, "Get successfully!", check)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    loadHeweDb: async function (req, res, next) {

        try {
            const check = await getRowToTable(`users`)
            for await (let user of check) {
                const flag = await axios({
                    url: `https://hewe.io/api/user/checkUserHeweDB`,
                    method: "POST",
                    data: {
                        email: user.email
                    }
                })
                    ;
                if (flag.data.data.isUserInHeweDB) {
                    const checkItem = await getRowToTable(`tb_hewe_db_signup`, `email='${user.email}'`)
                    const checkSignUpCard = await getRowToTable(`tb_signup_card`, `email='${user.email}'`)
                    if (checkItem.length <= 0 && checkSignUpCard.length > 0) {

                        const obj = {
                            email: user.email,
                            userid: user.id,
                            userName: user.username
                        }
                        await addRowToTable(`tb_hewe_db_signup`, obj)
                    }
                }

            }
            success(res, "Get successfully!")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getAllHistorySignUpCardUserToAdmin: async function (req, res, next) {

        try {
            const { limit, page } = req.body
            const check = await getListLimitPage(`tb_signup_card`, limit, page)
            success(res, "Get successfully!", check)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    comfirmSignUpCardUserToAdmin: async function (req, res, next) {

        try {
            const { id } = req.body
            await updateRowToTable(`tb_signup_card`, `status=1`, `id=${id}`)
            success(res, "Update successfully!")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    cardPayment: async function (req, res, next) {

        try {
            const { mc_trade_no } = req.body
            const userid = req.user
            const check = await getRowToTable(`tb_card_transaction`, `userid=${userid} AND mc_trade_no='${mc_trade_no}'`)
            if (check.length <= 0) return error_400(res, "mc_trade_no is not define")

            const data = await callApi(`v2/openapi/card/pay`, `POST`, {
                mc_trade_no
            })
            success(res, "Payment successfully!", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    attachmentUpload: async function (req, res, next) {

        try {
            const { mc_trade_no, attachment } = req.body
            const userid = req.user
            const check = await getRowToTable(`tb_card_transaction`, `userid=${userid} AND mc_trade_no='${mc_trade_no}'`)
            if (check.length <= 0) return error_400(res, "mc_trade_no is not define")

            const data = await callApi(`openapi/card/attachment/upload`, `POST`, {
                mc_trade_no,
                stage: 1,
                attachment_type: 1,
                attachment,
            })
            success(res, "Uploaded successfully!", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    transactionAuth: async function (req, res, next) {

        try {

            const {
                auth_id,
                card_id,
                auth_result
            } = req.body
            // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
            const userid = req.user
            const check = await getRowToTable(`tb_card_user`, `userid=${userid} AND card_id='${card_id}'`)
            if (check.length <= 0) return error_400(res, "Card id is not define")
            const data = await callApi(`openapi/card/3ds/transaction/auth`, `POST`, {
                card_id,
                auth_id,
                auth_result,
            })
            if (data.code = '00000') {
                success(res, 'Successful manipulation', data)
            } else {
                error_400(res, data.msg, data)
            }
            success(res, "get list historyTransfer success!", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    queryPinToCard: async function (req, res, next) {

        try {
            const { cardId } = req.body
            const userid = req.user
            const check = await getRowToTable(`tb_card_user`, `userid=${userid} AND card_id='${cardId}'`)
            if (check.length <= 0) return error_400(res, "Card id is not define")
            const data = await callApi(`openapi/card/pin/query`, `POST`, { card_id: cardId })
            if (data.code = '00000') {
                success(res, 'Successful query pin', data)
            } else {
                error_400(res, data.msg, data)
            }
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    // tb_card_transaction
    getTransactionCardToAdmin: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`tb_card_transaction`, limit, page, sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error, "getTransactionCardToAdmin");
            error_500(error)
        }
    },
    getAllHeweDB: async function (req, res, next) {
        try {

            const obj = await getRowToTable(`tb_hewe_db_signup`)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error, "getTransactionCardToAdmin");
            error_500(error)
        }
    },
    getAllSignUpCard: async function (req, res, next) {
        try {

            const obj = await getRowToTable(`tb_signup_card`)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error, "getTransactionCardToAdmin");
            error_500(error)
        }
    },
    getHeweDBToAdminSreach: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`tb_hewe_db_signup`, limit, page, sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error, "getTransactionCardToAdmin");
            error_500(error)
        }
    },
    getSignUpCardToAdminSreach: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`tb_signup_card`, limit, page, sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error, "getTransactionCardToAdmin");
            error_500(error)
        }
    },

    getCardUserToAdmin: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`tb_card_user`, limit, page, sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error, "getTransactionCardToAdmin");
            error_500(error)
        }
    },
    getTransactionOperationToAdmin: async function (req, res, next) {
        try {
            const { limit, page, query } = req.body
            let sql = query ? query : ""
            const obj = await getListLimitPage(`tb_transaction_operation`, limit, page, sql)
            success(res, "get list success!", obj)
        } catch (error) {
            console.log(error, "getTransactionCardToAdmin");
            error_500(error)
        }
    },
    transactionAuthStatus: async function (req, res, next) {

        try {

            const {
                auth_id,
                card_id
            } = req.body
            // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
            const userid = req.user
            const check = await getRowToTable(`tb_card_user`, `userid=${userid} AND card_id='${card_id}'`)
            if (check.length <= 0) return error_400(res, "Card id is not define")
            const data = await callApi(`openapi/card/3ds/transaction/auth/status`, `POST`, {
                card_id,
                auth_id,
            })
            if (data.code = '00000') {
                success(res, 'Successful status', data)
            } else {
                error_400(res, data.msg, data)
            }
            // success(res, "get list historyTransfer success!", data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    bindingKYCCardUser: async (req, res, next) => {
        try {
            const {
                first_name,
                last_name,
                mobile,
                mobile_code,
                doc_no, /// ID Passport
                address, //// dia chỉ nhà 
                back_doc,//// base64 anh chup mat sau,
                birthday,///  yyyy-MM-dd
                city,//// Thành phố
                gender,//// 1 name 2 nữ 
                country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
                emergency_contact,/// người liên hệ khẩn cấp ,
                front_doc,/// base64 ảnh chụp mặt trước,
                mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
                nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
                sign_img,/// hình chữ ký  base64
                state, /// tỉnh/ tiểu bang
                zip_code,///mã bưu điện
                card_type_id
            } = req.body
            const userid = req.user
            const transactionCardUser = await getRowToTable(`tb_card_transaction`, `userid=${userid} AND card_type_id='${card_type_id}' AND (typeTransaction='binding' OR typeTransaction='faild' )`)
            if (transactionCardUser.length < 0) return error_400(res, "The user has not linked a tag")

            const { mc_trade_no } = transactionCardUser[0]
            const user = await getRowToTable(`users`, `id=${userid}`)
            const { email } = user[0]
            // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
            const base_info = {
                email: email,
                first_name,
                // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
                last_name,
                mobile,
                mobile_code,
            }
            const kyc_info = {
                address,
                back_doc, //// base64 anh chup mat sau,
                birthday, ///  yyyy-MM-dd
                city,//// hcm
                country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
                doc_no,/// ID passport
                doc_type: 1, // 1 Passport
                emergency_contact,/// người liên hệ khẩn cấp ,
                front_doc,/// base64 ảnh chụp mặt trước,
                gender,//// 1 name 2 nữ 
                mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
                nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
                sign_img,/// hình chữ ký 
                state, /// tỉnh/ tiểu bang
                zip_code,///mã bưu điện

            }
            // const imagebase64 = `asd`
            // kyc_info.back_doc = imagebase64
            // kyc_info.front_doc = imagebase64
            // kyc_info.mix_doc = imagebase64
            console.log(mc_trade_no, "bodyy");

            const data = await callApiBindingKYC(`openapi/card/binding/kyc`, `POST`, { base_info, mc_trade_no, kyc_info }, `base_info`)

            if (data.code == "00000") {
                await updateRowToTable(`tb_card_transaction`, `first_name='${first_name}',last_name='${last_name}',typeTransaction='pendingBindingKYC'`, `typeTransaction='binding' AND userid=${userid} AND card_type_id='${card_type_id}'`)
                success(res, 'Card created successfully')
            } else {
                error_400(res, data.msg)
            }
        } catch (error) {
            console.log(error);
            error_500(res, "err")
        }
    },
    bindingKYCCardUserToAdmin: async (req, res, next) => {
        try {
            const {
                first_name,
                last_name,
                mobile,
                mobile_code,
                doc_no, /// ID Passport
                address, //// dia chỉ nhà 
                back_doc,//// base64 anh chup mat sau,
                birthday,///  yyyy-MM-dd
                city,//// Thành phố
                gender,//// 1 name 2 nữ 
                country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
                emergency_contact,/// người liên hệ khẩn cấp ,
                front_doc,/// base64 ảnh chụp mặt trước,
                mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
                nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
                sign_img,/// hình chữ ký  base64
                state, /// tỉnh/ tiểu bang
                zip_code,///mã bưu điện
                card_type_id,
                userid
            } = req.body
            // const userid = req.user
            const transactionCardUser = await getRowToTable(`tb_card_transaction`, `userid=${userid} AND card_type_id='${card_type_id}' AND (typeTransaction='binding' OR typeTransaction='faild' OR  typeTransaction='pendingBindingKYC')`)
            if (transactionCardUser.length < 0) return error_400(res, "The user has not linked a tag")

            const { mc_trade_no } = transactionCardUser[0]
            const user = await getRowToTable(`users`, `id=${userid}`)
            const { email } = user[0]
            // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
            const base_info = {
                email,
                first_name,
                // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
                last_name,
                mobile,
                mobile_code,
            }
            const kyc_info = {
                address,
                back_doc, //// base64 anh chup mat sau,
                birthday, ///  yyyy-MM-dd
                city,//// hcm
                country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
                doc_no,/// ID passport
                doc_type: 1, // 1 Passport
                emergency_contact,/// người liên hệ khẩn cấp ,
                front_doc,/// base64 ảnh chụp mặt trước,
                gender,//// 1 name 2 nữ 
                mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
                nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
                sign_img,/// hình chữ ký 
                state, /// tỉnh/ tiểu bang
                zip_code,///mã bưu điện

            }
            // const imagebase64 = `asd`
            // kyc_info.back_doc = imagebase64
            // kyc_info.front_doc = imagebase64
            // kyc_info.mix_doc = imagebase64
            // console.log(mc_trade_no, "bodyy");
            // return error_400(res, `success ${mc_trade_no}`)
            const data = await callApiBindingKYC(`openapi/card/binding/kyc`, `POST`, { base_info, mc_trade_no, kyc_info }, `base_info`)

            if (data.code == "00000") {
                await updateRowToTable(`tb_card_transaction`, `first_name='${first_name}',last_name='${last_name}',typeTransaction='pendingBindingKYC'`, `typeTransaction='binding' AND userid=${userid} AND card_type_id='${card_type_id}'`)
                success(res, 'Card created successfully')
            } else {
                error_400(res, data.msg)
            }
        } catch (error) {
            console.log(error);
            error_500(res, "err")
        }
    },

    //     try {
    //         const {
    //             first_name,
    //             last_name,
    //             mobile,
    //             mobile_code,
    //             doc_no, /// ID Passport
    //             address, //// dia chỉ nhà 
    //             back_doc,//// base64 anh chup mat sau,
    //             birthday,///  yyyy-MM-dd
    //             city,//// Thành phố
    //             gender,//// 1 name 2 nữ 
    //             country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
    //             emergency_contact,/// người liên hệ khẩn cấp ,
    //             front_doc,/// base64 ảnh chụp mặt trước,
    //             mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
    //             nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
    //             sign_img,/// hình chữ ký  base64
    //             state, /// tỉnh/ tiểu bang
    //             zip_code,///mã bưu điện
    //             card_type_id
    //         } = req.body
    //         const userid = req.user
    //         const transactionCardUser = await getRowToTable(`tb_card_transaction`, `typeTransaction='faild' AND userid=${userid} AND card_type_id='${card_type_id}'`)
    //         if (transactionCardUser.length < 0) return error_400(res, "The user has not linked a tag")

    //         const { mc_trade_no } = transactionCardUser[0]
    //         const user = await getRowToTable(`users`, `id=${userid}`)
    //         const { email } = user[0]
    //         // const { card_type_id, email, first_name, first_recharge_amount, last_name, mobile, mobile_code, pre_apply, user_ip } = base_info
    //         const base_info = {
    //             email: email,
    //             first_name,
    //             // first_recharge_amount : "" , //// số tiền gửi ban đầu pre_apply == true thì để trống
    //             last_name,
    //             mobile,
    //             mobile_code,
    //         }
    //         const kyc_info = {
    //             address,
    //             back_doc, //// base64 anh chup mat sau,
    //             birthday, ///  yyyy-MM-dd
    //             city,//// hcm
    //             country_id,// https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
    //             doc_no,/// ID passport
    //             doc_type: 1, // 1 Passport
    //             emergency_contact,/// người liên hệ khẩn cấp ,
    //             front_doc,/// base64 ảnh chụp mặt trước,
    //             gender,//// 1 name 2 nữ 
    //             mix_doc, /// base 64 ảnh chụp tay cầm hộ chiếu,
    //             nationality_id, // https://doc-api.hyperpay.io/en/3appendix/32_country_code.html
    //             sign_img,/// hình chữ ký 
    //             state, /// tỉnh/ tiểu bang
    //             zip_code,///mã bưu điện

    //         }
    //         // const imagebase64 = `asd`
    //         // kyc_info.back_doc = imagebase64
    //         // kyc_info.front_doc = imagebase64
    //         // kyc_info.mix_doc = imagebase64
    //         console.log(mc_trade_no, "bodyy");

    //         const data = await callApiBindingKYC(`openapi/card/binding/kyc`, `POST`, { base_info, mc_trade_no, kyc_info }, `base_info`)

    //         if (data.code == "00000") {
    //             await updateRowToTable(`tb_card_transaction`, `first_name='${first_name}',last_name='${last_name}',typeTransaction='pendingBindingKYC'`, `typeTransaction='binding' AND userid=${userid} AND card_type_id='${card_type_id}'`)
    //             success(res, 'Card created successfully')
    //         } else {
    //             error_400(res, data.msg)
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         error_500(res, "err")
    //     }
    // },
    operationCardUser: async (req, res, next) => {
        try {
            const {
                id,
                type
            } = req.body
            const userid = req.user
            const list = await getRowToTable(`tb_card_user`, `userid=${userid} AND id=${id}`)
            if (list.length <= 0) return error_400(res, "Your card does not exist")
            const { card_id, card_type_id, first_name, last_name, mobile, mobile_code } = list[0]
            const listCardDB = await getListLimitPage(`tb_transaction_operation`, 1, 1)
            const request_number = listCardDB.array.length > 0 ? listCardDB.array[0].request_number + 1 : 100
            const dataResCreate = await callApiOperationCard(`openapi/card/operation`, `POST`, {
                card_id,
                request_number,
                type: type,
                // sign_img,
                // address: null,
            })
            if (dataResCreate.code == "00000") {
                const user = await getRowToTable(`users`, `id=${userid}`)
                const obj = {
                    email: user[0].email,
                    userName: user[0].username,
                    userid,
                    request_number,
                    card_id,
                    type,
                    idCardData: id,

                }
                await addRowToTable(`tb_transaction_operation`, obj)
                // await updateRowToTable(`tb_wallet_code`, `amount=amount-${amount}`, `code='${symbol}' AND userid=${userid}`)
                console.log(dataResCreate, "dataResCreate");
                success(res, `Card operation successful`, dataResCreate)
            } else {
                error_400(res, dataResCreate.msg)
            }


        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryOperationCard: async (req, res, next) => {
        try {
            const { limit, page, id, } = req.body
            const listCardDB = await getListLimitPage(`tb_transaction_operation`, limit, page, `idCardData=${id}`)
            success(res, "get success", listCardDB)
        } catch (error) {
            console.log(error);
        }
    },
    queryRecordToCard: async (req, res, next) => {
        try {
            const {
                card_id,
                start_time,
                end_time,
            } = req.body
            const userid = req.user
            const list = await getRowToTable(`tb_card_user`, `card_id='${card_id}'`)
            if (list.length <= 0) return error_400(res, "card error")
            const data = await callApi(`v2/openapi/card/transaction/record`, `POST`, { card_id, start_time, end_time })
            success(res, 'get list successfully', data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getTransactionCreateCard: async (req, res, next) => {
        try {
            const {
                limit,
                page
            } = req.body
            const userid = req.user
            const list = await getListLimitPage(`tb_card_transaction`, limit, page, `userid=${userid} AND typeTransaction='createVisaCard'`)
            success(res, 'get list successfully', list)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getTransactionDepositCard: async (req, res, next) => {
        try {
            const {
                limit,
                page
            } = req.body
            const userid = req.user
            const list = await getListLimitPage(`tb_card_transaction`, limit, page, `userid=${userid} AND typeTransaction='cardDeposit'`)
            success(res, 'get list successfully', list)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryDepositToCard: async (req, res, next) => {
        try {
            const {
                limit,
                page,
                card_type_id,
                card_id
            } = req.body
            const userid = req.user
            const list = await getListLimitPage(`tb_card_transaction`, limit, page, ` typeTransaction='cardDeposit' AND card_type_id='${card_type_id}' AND card_id='${card_id}'`)
            success(res, 'get list successfully', list)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryDepositToCardToTime: async (req, res, next) => {
        try {
            const {
                limit,
                page,
                timeStart,
                timeEnd
            } = req.body
            const list = await getListLimitPage(`tb_card_transaction`, limit, page, ` typeTransaction='cardDeposit' AND UNIX_TIMESTAMP(created_at)>${timeStart} AND UNIX_TIMESTAMP(created_at)<${timeEnd}`)
            success(res, 'get list successfully', list)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryDepositToCardToTimeAll: async (req, res, next) => {
        try {
            const {
        
                timeStart,
                timeEnd
            } = req.body
            const list = await getRowToTable(`tb_card_transaction`, ` typeTransaction='cardDeposit' AND UNIX_TIMESTAMP(created_at)>${timeStart} AND UNIX_TIMESTAMP(created_at)<${timeEnd}`)
            success(res, 'get list successfully', list)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    getHistoryDepositToCardToKeyword: async (req, res, next) => {
        try {
            const {
                limit,
                page,
                keyword,
            } = req.body
            const list = await getListLimitPage(`tb_card_transaction`, limit, page, ` typeTransaction='cardDeposit' AND  POSITION('${keyword}' IN userName) OR POSITION('${keyword}' IN email)`)
            success(res, 'get list successfully', list)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    depositToCard: async (req, res, next) => {
        try {
            let {
                id,
                symbol,
                amount
            } = req.body
            const userid = req.user
            await createWalletPayment(userid, symbol)
            const list = await getRowToTable(`tb_card_user`, `userid=${userid} AND id=${id}`)
            if (list.length <= 0) return error_400(res, "Your card does not exist")
            const walletUser = await getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${userid}`)
            if (walletUser.length <= 0) return error_400(res, 'Your wallet does not exist')
            let amountCoinT = amount
            let amountCoinUser = amount
            ///REDIS ///
            const keyName = `${userid}depositcard`
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
            //// get Fee deposit
            // card_type_id
            const data = await callApi(`v5/openapi/card/list`, `POST`, { card_type_id: list[0].card_type_id })
            let { recharge_fee, apply_type, card_coin, min_first_recharge_amount, card_fee } = data.data[0]
            recharge_fee = parseFloat(recharge_fee) >= 1 ? parseFloat(recharge_fee) / 100 : parseFloat(recharge_fee)
            const dataItem = await getRowToTable(`tb_config`, `name='EURTOUSD'`)
            const moneyUint = card_coin == 'eur' ? dataItem[0].value : 1
            amount = amount * moneyUint
            recharge_fee = recharge_fee
            card_fee = card_fee
            let feeDepositCardQuery = await getRowToTable(`tb_config`, `name='fee_deposit_card_type_id=${list[0].card_type_id}'`)
            let feeDepositCard
            console.log("before", recharge_fee, feeDepositCardQuery[0].value);

            if (feeDepositCardQuery.length <= 0) {
                recharge_fee = recharge_fee
            } else {
                recharge_fee = feeDepositCardQuery[0].value + parseFloat(recharge_fee)
            }

            //// 


            if (amountCoinUser > walletUser[0].amount) {
                await delRedis(keyName)
                return error_400(res, "Your balance is insufficient")
            }

            const priceItem = await getRowToTable(`tb_coin`, `name='${symbol}'`)
            if (priceItem.length <= 0) {
                await delRedis(keyName)
                return error_400(res, "Symbol is not define")
            }
            const priceSymbolToUsd = priceItem[0].price
            const usdSwap = amountCoinT * priceSymbolToUsd * moneyUint
            const usd = usdSwap - usdSwap * recharge_fee
            const { card_id, card_type_id, first_name, last_name, mobile, mobile_code } = list[0]
            const listCardDB = await getListLimitPage(`tb_card_transaction`, 1, 1)
            const mc_trade_no = listCardDB.array[0].mc_trade_no + 1
            // console.log(amount - recharge_fee);
            // console.log("okcommssion");

            // return success(res, `Successfully loaded ${usdSwap}${usd} ${card_coin} onto the card`)
            const dataResCreate = await callApi(`openapi/card/recharge`, `POST`, {
                card_id, mc_trade_no: mc_trade_no,
                pay_coin: "usdt",
                recharge_amount: `${usd}`,
                // remark: "tete"
            })
            if (dataResCreate.code == "00000") {
                const user = await getRowToTable(`users`, `id=${userid}`)
                const obj = {
                    email: user[0].email,
                    userName: user[0].username,
                    card_type_id,
                    userid,
                    mc_trade_no,
                    card_id,
                    first_name,
                    last_name,
                    mobile,
                    mobile_code,
                    amountUsd: usd,
                    symbolDeposit: symbol,
                    amountCoin: amountCoinUser,
                    typeTransaction: `cardDeposit`,
                    statusDeposit: 1,
                    recharge_fee
                }
                await addRowToTable(`tb_card_transaction`, obj)
                await updateRowToTable(`tb_wallet_code`, `amount=amount-${amountCoinUser}`, `code='${symbol}' AND userid=${userid}`)
                console.log(dataResCreate, "dataResCreate");
                await commissionFeeDepositCardToSymbol(userid, amountCoinUser, `${mc_trade_no}`, symbol)
                success(res, `Successfully loaded ${usd} ${card_coin} onto the card`)
            } else {
                await delRedis(keyName)
                error_400(res, dataResCreate.msg)
            }
            console.log(dataResCreate.data);
            // success(res, 'get list successfully', data)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    listCardToUser: async (req, res, next) => {
        try {
            const {
                limit,
                page
            } = req.body
            const userid = req.user
            const list = await getListLimitPage(`tb_card_user`, limit, page, `userid=${userid}`)
            success(res, 'get list successfully', list)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    commissionFeeDepositCardToSymbol
    // operationCardUser: async (req, res, next) => {
    //     try {
    //         const {
    //             limit,
    //             page
    //         } = req.body
    //         const userid = req.user
    //         const list = await getListLimitPage(`tb_card_transaction`, limit, page, `userid=${userid}`)
    //         const data = await callApiOperationCard(`openapi/card/operation`, `POST`, {
    //             card_id,
    //             request_number: "1",
    //             type: 6,
    //             // sign_img : null,
    //             // address: null,
    //         })
    //         success(res, 'get list successfully', list)
    //     } catch (error) {
    //         console.log(error);
    //         error_500(res, error)
    //     }
    // },
}