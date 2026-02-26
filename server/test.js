const crypto = require('crypto');
const base64url = require('base64url');

const KEY_ALGORITHM = 'RSA';

class RSACoder {
  /
   * 私钥解密
   * @param {Buffer} data 待解密数据
   * @param {Buffer} key 私钥
   * @returns {Buffer} 解密数据
   */
  static decryptByPrivateKey(data, key) {
    const privateKey = crypto.createPrivateKey({
      key: key,
      format: 'der',
      type: 'pkcs8'
    });
    const decryptedData = crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, data);
    return decryptedData;
  }

  /
   * 私钥解密
   * @param {string} base64Data BASE64格式的待解密数据
   * @param {string} base64PrivateKey BASE64格式的私钥
   * @returns {string} 解密数据
   */
  static decryptByPrivateKeyFromBase64(base64Data, base64PrivateKey) {
    const data = base64url.toBuffer(base64Data);
    const key = base64url.toBuffer(base64PrivateKey);
    const decryptedData = RSACoder.decryptByPrivateKey(data, key);
    return decryptedData.toString();
  }

  /
   * 公钥加密
   * @param {Buffer} data 待加密数据
   * @param {Buffer} key 公钥
   * @returns {Buffer} 加密数据
   */
  static encryptByPublicKey(data, key) {
    const publicKey = crypto.createPublicKey({
      key: key,
      format: 'der',
      type: 'spki'
    });
    const encryptedData = crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, data);
    return encryptedData;
  }

  /
   * 公钥加密
   * @param {string} data 待加密数据
   * @param {string} base64Key BASE64格式的公钥
   * @returns {string} BASE64格式的加密数据
   */
  static encryptByPublicKeyToBase64(data, base64Key) {
    const key = base64url.toBuffer(base64Key);
    const encryptedData = RSACoder.encryptByPublicKey(Buffer.from(data), key);
    return base64url.fromBase64(encryptedData.toString('base64'));
  }
}

module.exports = RSACoder;