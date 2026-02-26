const { readFileSync } = require('fs');
const jsrsasign = require('jsrsasign');
const testPublicKey = project=='dev'?`MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQJIQTYfA2tEDC3Jt2Y+7Lkp90umHsPdb8k2BuFx+tmr9LpMDkxlD8eiVkYFeJVEOrtIbUKIsk2Tsm8MUe+D0a3HPWUty9ZrhvSf+dTZ0Ae7NN7W00X85EDRD+C0GsI1oo5tL/CTS4xCQS6nJXwGyBszRLenYXP8fyIT9eNvo+gwIDAQAB`:`MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDk69/5vqFjsvxHeBmfJH3xgtwg
lnoghADvuVdJHIJKzsnpoIFFyu7sUdzgzFH8VZCECv6JGT4XWu4ytYHTD8o03Vrd
dV6aqNyrXQEDxceNNUGUf9LFCGl+Zk3uQl3F3Gv34zMARI8Wb+nctYnscBsROzpy
8g7nE1MKlsKZOIvFxQIDAQAB`
const testPrivateKey = project=='dev'? readFileSync('./src/data/privatekey.pem', 'utf8'): readFileSync('./src/dataProduction/privatekey.pem', 'utf8');
const crypto = require('crypto');
function getSign(srcData, privateKeyString) {
    try {
        console.log(`要签名的串: ${srcData}`);
        // let srcData = `api-key=80ddb5ee-d4ed-425b-bb26-f350872b58b9&base_info={"card_type_id":88990001,"email":"dvkien2803@gmail.com","first_name":"Kiên","last_name":"Diệp","mobile":"0766666407","mobile_code":"123123","pre_apply":true}&mc_trade_no=48d2741747a4493223feb22&nonce=oPJYxbcxJo&timestamp=1720597974&version=1`
        // Convert private key string to RSAKey object
        let privateKey = jsrsasign.KEYUTIL.getKey(privateKeyString);

        // Create a new RSA signature instance
        let rsaSign = new jsrsasign.Signature({ alg: 'SHA256withRSA' });

        // Initialize the signature instance for signing
        rsaSign.init(privateKey);

        // Update the signature with the data to be signed
        rsaSign.updateString(srcData);

        // Perform the signing and encode as Base64
        let signatureBytes = rsaSign.sign();
        let signatureBase64 = jsrsasign.hextob64(signatureBytes);

        return signatureBase64;
    } catch (e) {
        console.error(e);
        return null;
    }
}
function createSortedParams(requestHeader, requestBody) {
    // Combine request header and request body
    const allParams = { ...requestHeader, ...requestBody };

    // Exclude signature field and fields with empty values
    const filteredParams = {};
    for (let key in allParams) {
        if (key !== 'signature' && allParams[key] !== '') {
            filteredParams[key] = allParams[key];
        }
    }

    // Sort parameters by parameter name in ASCII code ordering (ascending)
    const sortedKeys = Object.keys(filteredParams).sort();

    // Construct the sorted parameter string
    const sortedParams = sortedKeys.map(key => `${key}=${filteredParams[key]}`).join('&');

    return sortedParams;
}
function createSortedParamsBody(requestHeader, requestBody) {
    // Combine request header and request body
    const allParams = { ...requestHeader, ...requestBody };
    
    // Exclude signature field and fields with empty values
    const filteredParams = {};
    for (let key in allParams) {
        if (key !== 'signature' && allParams[key] !== '') {
            filteredParams[key] = allParams[key];
        }
    }

    // Sort parameters by parameter name in ASCII code ordering (ascending)
    console.log(filteredParams);
    
    const sortedKeys = Object.keys(filteredParams);
    // Construct the sorted parameter string
    // const sortedParams= sortedKeys.map(key => typeof(key) == 'string' || key == 'first_recharge_amount' || key == 'pre_apply' || key == 'country_id' || key == 'doc_type' || key == 'gender' || key == 'nationality_id' || key=='doc_never_expire' ?`"${key}":${filteredParams[key]}`:`"${key}":"${filteredParams[key]}"`).join(',');
    
    const sortedParams = sortedKeys.map(key => 
 
        
        typeof(key) != 'string' || key == 'first_recharge_amount' || key
         == 'pre_apply' || key == 'country_id' || key == 'doc_type' || key
          == 'gender' || key == 'nationality_id' || key=='doc_never_expire' 
          || key == 'card_type_id' && filteredParams[`card_type_id`] == 52500001
          ? `"${key}":${filteredParams[key]}` : `"${key}":"${filteredParams[key]}"`
        ).join(',');
    // console.log(sortedParams, "sortedParams");
    return sortedParams;
}
function signRequest(requestHeader, requestBody) {
    // Step 1: Get sorted parameters string
    let privateKey = testPrivateKey
    const sortedParamsString = createSortedParams(requestHeader, requestBody);
    // console.log(sortedParamsString, "sortedParamsString")
    // Step 2: Generate RSA-SHA256 signature
    const signature = getSign(sortedParamsString, privateKey);

    // Step 3: Encode signature to base64 and append to requestHeader
    requestHeader.signature = signature;

    return requestHeader;
}
function generateNonce(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
module.exports = {
    getSign, testPublicKey, testPrivateKey, signRequest, generateNonce, createSortedParams, createSortedParamsBody
}