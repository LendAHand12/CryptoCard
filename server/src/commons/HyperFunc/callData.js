const { default: axios } = require("axios");
const { generateNonce, signRequest, createSortedParams, createSortedParamsBody } = require(".");


const domain = project=='dev'?`https://sandbox.hyperpay.io/`:`https://api.hyperpay.io/`
const apiKey =  project=='dev'?`80ddb5ee-d4ed-425b-bb26-f350872b58b9`:`66b348f6-8550-49ce-8a09-48523936fe39`

async function callApi(url, method, dataBody) { 
    try {
        const nonce = generateNonce(10)
        const timestamp = parseInt(new Date().getTime() / 1000)
        const signRequestData = signRequest({
            'version': '1',
            'api-key': apiKey,
            'nonce': nonce,
            'timestamp': timestamp
            // 'signature': signature
        }
            , dataBody
        )
        console.log(`${domain}${url}`);
        
        const data = await axios({
            url: `${domain}${url}`,
            method,
            headers: {
                'version': '1',
                'api-key': apiKey,
                'nonce': nonce,
                'timestamp': timestamp,
                'signature': signRequestData.signature,
                'Content-Type': 'application/json'
            },
            data: dataBody
        })
        return data.data
    } catch (error) {
        console.log(error);
    }
}
async function callApiCreateCard(url, method, dataBody,stringObj) {
    try {
        const nonce = generateNonce(10)
        const timestamp = parseInt(new Date().getTime() / 1000)
        const dataString = createSortedParamsBody({},dataBody[`${stringObj}`])
        const signRequestData = signRequest({
            'version': '1',
            'api-key': apiKey,
            'nonce': nonce,
            'timestamp': timestamp
            // 'signature': signature
        }
            , {
                base_info : `{${dataString}}`,
                mc_trade_no: dataBody.mc_trade_no
            }
        )
 
        const data = await axios({
            url: `${domain}${url}`,
            method,
            headers: {
                'version': '1',
                'api-key': apiKey,
                'nonce': nonce,
                'timestamp': timestamp,
                'signature': signRequestData.signature,
                'Content-Type': 'application/json'
            },
            data: dataBody
        })
        return data.data
    } catch (error) {
        console.log(error);
    }
}
async function callApiBindingKYC(url, method, dataBody) {
    try {
        const nonce = generateNonce(10)
        const timestamp = parseInt(new Date().getTime() / 1000)
        const dataString = createSortedParamsBody({},dataBody[`base_info`])
        const dataStringNext = createSortedParamsBody({},dataBody[`kyc_info`])

        const signRequestData = signRequest({
            'version': '1',
            'api-key': apiKey,
            'nonce': nonce,
            'timestamp': timestamp
            // 'signature': signature
        }
            , {
                mc_trade_no: dataBody.mc_trade_no,
                base_info : `{${dataString}}`,
                kyc_info : `{${dataStringNext}}`
            }
        )
        // console.log(signRequestData,"signRequestData");
        // console.log(dataBody,"dataBody");
        // return 
     
        const data = await axios({
            url: `${domain}${url}`,
            method,
            headers: {
                'version': '1',
                'api-key': apiKey,
                'nonce': nonce,
                'timestamp': timestamp,
                'signature': signRequestData.signature,
                'Content-Type': 'application/json'
            },
            data: dataBody
        })
        return data.data
    } catch (error) {
        console.log(error,"callApiBindingKYC");
    }
}
async function callApiOperationCard(url, method, dataBody) {
    try {
        const nonce = generateNonce(10)
        const timestamp = parseInt(new Date().getTime() / 1000)
        const dataString = createSortedParamsBody({},dataBody.address)
        const {card_id,request_number,type} = dataBody
        const signRequestData = signRequest({
            'version': '1',
            'api-key': apiKey,
            'nonce': nonce,
            'timestamp': timestamp
            // 'signature': signature
        }
            , {
                card_id,request_number,type
                // address : `{${dataString}}`
            }
        )
        console.log(dataBody,"dataBody");
        const data = await axios({
            url: `${domain}${url}`,
            method,
            headers: {
                'version': '1',
                'api-key': apiKey,
                'nonce': nonce,
                'timestamp': timestamp,
                'signature': signRequestData.signature,
                'Content-Type': 'application/json'
            },
            data: dataBody
        })
        return data.data
    } catch (error) {
        console.log(error);
    }
}
module.exports = { callApi ,callApiCreateCard,callApiOperationCard,callApiBindingKYC}




