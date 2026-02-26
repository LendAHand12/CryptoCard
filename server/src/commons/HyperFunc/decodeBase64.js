// Chuyển đổi Uint8Array sang Base64
const crypto = require('crypto');
const fs = require('fs');
// Convert Buffer to Base64

//         const privateKeyPem = `MIICXAIBAAKBgQDQJIQTYfA2tEDC3Jt2Y+7Lkp90umHsPdb8k2BuFx+tmr9LpMDk
// xlD8eiVkYFeJVEOrtIbUKIsk2Tsm8MUe+D0a3HPWUty9ZrhvSf+dTZ0Ae7NN7W00
// X85EDRD+C0GsI1oo5tL/CTS4xCQS6nJXwGyBszRLenYXP8fyIT9eNvo+gwIDAQAB
// AoGAYb10BAIOojGc46RioIKm5ROSK2dGioAzj2HJe4kCSCyNvgC8z/FMoHLfUjZn
// hMZ8DIp2cfQj+wbDXzLa7gMV9clKxm0cAsVm0C08IkOfcKGYSfNt+rrGHlyUcJIU
// GRBukcf222Of/l1F01ZOHO4GWbpTkOLfgz4+io0H5UsSJ+kCQQDsYit8FoRRacW8
// JBhk0+nFvbkz+OqK8rm9zz2eSOm+kQff61gsW7XtebkaLBGsYla7FL+yyaWGSClW
// h4UTCf9lAkEA4Wpixvt2RS7wdconiW8F2Vi7cvkB/teN+wSEtAn18EwZ4IKOC3YH
// sb0BB58lYJmt/MMxY13VgZ4flwxxrQfrxwJAVNONw0PZS9XnLXLOhjA9rcY9ldb3
// Y9FisiiSdiC4MLie2M39oD1w9b0+nZO+69uGQDBb8m7GRX/TxcdwC7sEuQJAaoLx
// b6JsbR5T4uSFsAv00JF76US966QA46Zr6gJ24nejFpG5+rJnylVLgkVxzOZw7ulw
// kcpJ03ha5u2rXR5MCwJBAJHNT2Hj2weo0fhpqduL413IlMUBYUPRw3xeUeSAHs0+
// rfKAVHk7cbCRBZWZh6r4B/C6Nh7hkEuspHTRdpqOygs=`
// Convert Base64 to Buffer
function base64ToBuffer(base64) {
    return Buffer.from(base64, 'base64');
}

function decryptByPrivateKey(base64Data) {
    try {
        console.log("base64Data ", base64Data);
        const privateKeyPem = project=='dev'? fs.readFileSync('./src/data/privatekey.pem', 'utf8'): fs.readFileSync('./src/dataProduction/privatekey.pem', 'utf8');

        console.log(privateKeyPem);
        const privateKey = crypto.createPrivateKey({
            key: privateKeyPem,
            format: 'pem',
            type: 'pkcs8' // Ensure key is in PKCS#8 format
        });

        const dataBytes = base64ToBuffer(base64Data);

        const decryptedBytes = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
                oaepHash: 'sha256'
            },
            dataBytes
        );

        return decryptedBytes.toString('utf8');
    } catch (error) {
        console.error('Decryption error:', error);
    }
}
function encryptByPublicKey(data,publicKeyPem) {
    try {
        // Tạo đối tượng khóa công từ PEM
        data = JSON.stringify(data)
        // const publicKeyPem = fs.readFileSync('./src/data/publickey.pem', 'utf8');
        // const publicKeyPem = fs.readFileSync('./src/data/publickey.pem', 'utf8');
        console.log(publicKeyPem, "publicKeyPem");
        const publicKey = crypto.createPublicKey({
            key: publicKeyPem,
            format: 'pem',
            type: 'spki'  // Đảm bảo khóa là SPKI
        });

        // Chuyển đổi dữ liệu thành Buffer
        const dataBytes = Buffer.from(data, 'utf8');

        // Mã hóa dữ liệu
        const encryptedBytes = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
                oaepHash: 'sha256'
            },
            dataBytes
        );

        // Chuyển đổi Buffer thành Base64
        return encryptedBytes.toString('base64');
    }
    catch (error) {
        console.log(error);
    }
}
module.exports = {
    decryptByPrivateKey,
    encryptByPublicKey
}