const { default: axios } = require("axios");
const customerQuery = require("../sockets/queries/customerQuery");
const cron = require('node-cron');
const { updateRowToTable } = require("../query/funcQuery");

async function realtimeCoin(io) {
  cron.schedule('* * * * * *', async () => {
    try {
      var array = []
      const dataToken = await customerQuery.getAllToken()
      dataToken.forEach(element => {
        if (element.flag == 0) {
          delete element.set_price
          delete element.flag
          array.push(element)
        } else if (element.flag == 1) {
          element.price = element.set_price
          delete element.flag
          delete element.set_price
          array.push(element)

        }

        element.image = `images/${element.name}.png`
      })
      io.local.emit(`listCoin`, array)
    } catch (error) {
      console.log(error, "erz");
    }
  });
}
let lastStablePrice = 0;

const getPriceFromAPIHewe = async () => {
  try {
    let response = await axios.get("https://api.coinstore.com/api/v1/ticker/price");
    let heweItem = response?.data?.data?.find((item) => item.symbol == "HEWEUSDT");
    if (heweItem) return Number(heweItem.price);
  } catch (error) {
    console.log(error);
    return lastStablePrice;
  }
};
const getPriceFromAPI = async () => {
  try {
    let res = await axios.get("https://sapi.xt.com/v4/public/ticker/price?symbol=amc_usdt");
    if (res && res.data && res.data.result && res.data.result[0]) {
      let price = res.data.result[0].p;
      lastStablePrice = price;
      return price;
    } else {
      return lastStablePrice;
    }
  } catch (error) {
    console.log(error);
    return lastStablePrice;
  }
};
const getPriceSHeweIO = async () => {
  try {
    let res = await axios.get("https://hewe.io/api/user/v2/getPrices");
    return res.data.data
  } catch (error) {
    console.log(error);
    return lastStablePrice;
  }
};

async function getCoinAPI() {

  cron.schedule('* * * * * *', async () => {
    try {

      const data = await getPriceSHeweIO()
      const { priceAMC, priceHEWE } = data

      // const price = await getPriceFromAPI()
      await updateRowToTable(`tb_coin`, `price=${priceAMC}`, `name='AMC'`)
      // const hewe = await getPriceFromAPIHewe()
      // // console.log(hewe,"asdasd");

      await updateRowToTable(`tb_coin`, `price=${priceHEWE}`, `name='HEWE'`)
      // socketHewe.on((res)=>{
      //   console.log(res,"socketHewe");

      // })
    } catch (error) {
      console.log(error);
      return lastStablePrice;
    }
  });
}
module.exports = { realtimeCoin, getCoinAPI, getCoinAPI }