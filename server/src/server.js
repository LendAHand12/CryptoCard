const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000
app.use(function (req, res, next) {
  req.io = io;
  req.flag = 0
  next();
});
const router = require('express').Router()
var path = require('path');
const socketModule = require('./sockets/socket');
const realtimeModule = require('./realtimes/realtime');
const user = require('./api/user')
const notification = require('./notification/notification');
const data = require('./database/database')

const moment = require('moment')

global.project = `dev2`
const cron = require('node-cron')
// const TronWeb = require('tronweb');
// const HttpProvider = TronWeb.providers.HttpProvider;
// const fullNode = new HttpProvider("https://api.trongrid.io");
// const solidityNode = new HttpProvider("https://api.trongrid.io");
// const eventServer = new HttpProvider("https://api.trongrid.io");
// const privateKey = "2e485b5e6621b4f60c081e7202fa2fcf9e1a2fedf8ee46ffa99a35e97cdf9365";
// const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const customerQuery = require('./sockets/queries/customerQuery.js')
//Support json encoded bodies
const apiRouter = require('./api/index');
const apiRouterNotification = require('./api/notificationCard');

const cors = require('cors');
const {
  getCoin
} = require('./commons/functions/validateObj');
const WebSocket = require('ws');
const client = require('./database/redis');
const { realtimeCoin, getCoinAPI } = require('./cronjob/realtime.js');
const { deleteRowToTable, updateRowToTable, getRowToTable, addRowToTable } = require('./query/funcQuery.js');
const { getEventContract } = require('./listenBlockchain/listen.js');
const { error_500, error_400 } = require('./message/index.js');
const { test } = require('./listenBlockchain/test.js');
const { delRedisAll } = require('./model/model.redis.js');
const { getEventContractAMC } = require('./listenBlockchain/listenAMC.js');
const { default: axios } = require('axios');

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json());
app.get('/images/:images', function (req, res) {

  res.sendFile(path.join(__dirname, 'images', `${req.params.images}`));
});
app.use('/api', apiRouter);
app.use('/hc_sync', apiRouterNotification);
app.use(express.static(path.join(__dirname, 'public/build')))

// app.get('/src/*', function (req, res) {
//   error_400(res, "404 not found")

// });
app.get('/*', function (req, res) {
  // error_500(res,"error")
  res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
});


init = async function () {
  ///// redis

  server.listen(port);
  await client.connect();
  //// end redis
  // data.connect.connect(function (err) {
  //   if (err) {
  //     throw err;
  //   }

  //   //console.log("Connected!");
  // });
  getCoin()
  realtimeCoin(io)
  getCoinAPI()
  // * * 59 * * *
  // notification.notification(io)
  realtimeModule.realtime(io);
  socketModule.socket(io)

  test()
  console.log(`running on port: ${port}`);
  // cron.schedule('* * * * *', async () => {
  //   try {
  //     const minute9 = 9 * 60
  //     await updateRowToTable(`tb_code_email`, `sendEmail=0`, `UNIX_TIMESTAMP(created_at)+60 < UNIX_TIMESTAMP(current_timestamp())`)
  //     await deleteRowToTable(`tb_code_email`, `UNIX_TIMESTAMP(created_at)+${minute9} < UNIX_TIMESTAMP(current_timestamp())`)

  //   } catch (error) {
  //     console.log(error);
  //   }
  // })
  // cron.schedule('0 0 * * *', async function () {
  //   try {

  //     const LASTBURNED = await getRowToTable(`tb_config`,`name='MIDNIGHTFLAME'`)
  //     await updateRowToTable(`tb_config`,`value=${LASTBURNED[0].value}`,`name='LASTBURNED'`)
  //     await updateRowToTable(`tb_config`,`value=0`,`name='MIDNIGHTFLAME'`)
  //     const check = await getRowToTable(`users`)
  //     for await (let user of check) {
  //       const flag = await axios({
  //         url: `https://hewe.io/api/user/checkUserHeweDB`,
  //         method: "POST",
  //         data: {
  //           email: user.email
  //         }
  //       })
  //       console.log(flag.data, "flag.data");
  //       console.log(flag.data.data);
  //       if (flag.data.data.isUserInHeweDB) {
  //         const checkItem = await getRowToTable(`tb_hewe_db_signup`, `email='${user.email}'`)
  //         const checkSignUpCard = await getRowToTable(`tb_signup_card`, `email='${user.email}'`)
  //         if (checkItem.length <= 0 && checkSignUpCard.length > 0) {

  //           const obj = {
  //             email: user.email,
  //             userid: user.id,
  //             userName: user.username
  //           }
  //           await addRowToTable(`tb_hewe_db_signup`, obj)
  //         }
  //       }

  //     }
  //   } catch (error) {
  //     console.log(error);

  //   }
  // })
  // cron.schedule("*/7 * * * * *", async function () {
  //   try {
  //     // console.log("ok");
  //     getEventContract()

  //   } catch (error) {
  //     console.log(error, "getPastEvent");
  //   }
  // });
  // cron.schedule("*/7 * * * * *", async function () {
  //   try {
  //     // console.log("ok");
  //      getEventContractAMC()

  //   } catch (error) {
  //     console.log(error, "getEventContractAMC");
  //   }
  // });

  // cron.schedule("*/59 * * * * *", async function () {
  //   try {
  //     // console.log("ok");
  //     await delRedisAll()
  //   } catch (error) {
  //     console.log(error, "getPastEvent");
  //   }
  // });
}

init();