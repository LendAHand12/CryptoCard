require('dotenv').config();
const mysql = require('mysql2');

const connected = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 10
});
/////// test
// const connected = mysql.createPool({
//     host: 'localhost',
//     user: 'user_swaptobe',
//     password: 'X3i1y_5o',
//     database: "admin_swaptobe",
//     connectionLimit : 10
// });
//// main
// const connected = mysql.createPool({
//     host: 'localhost',
//     user: 'user_swaptobe',
//     password: 'X3i1y_5o!',
//     database: "admin_swaptobe",
//     connectionLimit : 10
// });
// const connected = mysql.createPool({
//     host: 'localhost',
//     user: 'user_swaptobe',
//     password: 'csx0N2*49',
//     database: "admin_swaptobe",
//     connectionLimit : 10
// });
// const connect = {
//     connect: connected
// }
// const connected = mysql.createPool({
//     host: '103.130.215.191',
//     port: 3306,
//     user: 'root_remiteno',
//     password: '89y16dgG!',
//     database: "db_remiteno",
//     connectionLimit: 10
// });
// const connect = mysql.createConnection({
//   host: '207.148.116.105:1112',
//   user: 'root',
//   password: 'JHkjasyd7fdfsbds',
//   database: "swaptobe_db",
// });
module.exports = {
    connect: connected,
}