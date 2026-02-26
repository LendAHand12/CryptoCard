const Coinpayments = require('coinpayments')
const {
  verify
} = require('coinpayments-ipn');



// const autoIpn = false //default
// const ipnTime = true //default
// const options = {key,secret}

var client = new Coinpayments({
  key: "213c5971a2135f1d52680af122ded3e165b80d2003a027e5a61c2786995d6984",
  secret: 'Fa12185155d4Fb19479245A0AE7276F3b59d33b2bd591919970d844d6D78c1bc',
  autoIpn: true
});
const IPN_SECRET = "131197"

const createWallet = (wallet) => {
  // return 
  return client.getCallbackAddress({
    'currency': wallet,
  })
}
const verifyDeposit = (hmac, payload, cb) => {
  let isValid;

  try {
 console.log("DEPOSIT TEST DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
    isValid = verify(hmac, IPN_SECRET, payload);
 console.log("DEPOSIT TEST DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
  } catch (e) {
  //console.log(e)
    return
  }

  if (isValid) {
    cb(true)
  } else {
    cb(false)
  }
}

module.exports = {
  createWallet,
  verifyDeposit
}
