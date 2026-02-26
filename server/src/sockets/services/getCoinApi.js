
// const CoinGecko = require('coingecko-api');

const axios = require('axios')
const Coinpayments = require('coinpayments');
const options = {
    key: '69af7ae08eb0fa17f25a05dc3044f7725bedd34f1496a0c8599c2ad1ba19672c',
    secret: 'Cf3aB1c2eF98c57e6217Ced6b79Fd957914287fF89103E94c88BA0272c5534e4',
    // autoIpn: true
}

// const subWallet = {
//     currency: 'BTC',
//     ipn_url: 'https://www.coinpayments.net/apidoc-get-deposit-address',
//     label: 'test user001'
// }
// 3MCZvxHiWqpAx3P7nebHdAEn75ohSKBJo4

const client = new Coinpayments(options);



getProfile = async function (params) {
    await client.getProfile({ pbntag: string })
}

coinpayment = async function (params) {
    await client.getBasicInfo(function (error, result) {
        if (error) { throw new Error(error) }
    });
}



module.exports = {
    getBalances: async function (params) {
        try {
            const b = params.a
          //console.log("test");
      

            return await clientt.getQuotes({ symbol: 'BTC,ETH' })
        } catch (error) {
          console.log(error);
        }
        // try {
        //     const { a } = params
        //   //console.log(a, "gau6");
        //     const obj = {
        //         currency: "BLF",
        //         // ipn_url: "string",
        //         // label: string
        //     }
        //     const te = await client.getCallbackAddress(obj)
        //     return te
        // } catch (error) {
        //     if (error) throw error;
        // }
        // try {
        //   //console.log(b, "asdsad");
        //     // let data = await CoinGeckoClient.exchanges.all();
        //     // console.log(data);
        //     const data = await axios({
        //         method: "GET",
        //         url: `https://api.coingecko.com/api/v3/coins/?developer_data=false&community_data=false&tickers=false`
        //     })
        //     return { data: data }

        // } catch (error) {
        //     if (error) throw error;

        // }
    },
    coinpayment,
    getProfile,
    getSubWallet: async function (params) {
        try {
            const { a } = params
          //console.log(a, "gau6");
          //console.log("Asdasdsa");
            const obj = {
                currency: "ETH",
                // ipn_url: "string",
                // label: string
            }
            const te = await client.getDepositAddress(obj)
          //console.log(te);
            return te
        } catch (error) {
            if (error) throw error;
        }
        // console.log("ok");
        // const af = {
        //     short: 0,
        //     accepted: 0
        // }
        // console.log(client);
        // const b = await client.rates(af);
        // // console.log(client.rates(),"asdads");
        // return await client.rates(af);
        // return await client.getProfile({ pbntag: string })
    }
}