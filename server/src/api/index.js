var express = require('express');
const { uploadImage, upload, uploadSingle, uploadSingleImg, addNews, updateNews, uploadListing, uploadImageListing } = require('./upload');
const passport = require('passport');
const passportConfig = require('../middlewares/passport');
const path = require('path')
const fs = require('fs')
var router = express.Router();
router.use('/user', require("./user"));
router.use('/p2pBank', require("./p2pBank"));
router.use('/p2p', require("./p2p"));
router.use('/v2', require("./pricecoin"));
router.use('/qrcode', require("./qrcode"));
router.use('/coin', require("./coin"));
router.use('/blockico', require("./blockico"));
router.use('/swap', require("./swap"));
router.use('/characters', require("./characters"));
router.use('/admin', require("./admin"));
router.use('/history', require("./history"));
router.use('/exchange', require("./exchange"));
router.use('/payment', require("./payment"));
router.use('/adminv2', require("./adminv2"));
router.use('/visacard', require("./visaCard"));

router.post('/uploadKyc', uploadImage, upload);
router.post('/uploadDepositVND', uploadSingleImg, uploadSingle);
router.post('/addNews', passport.authenticate('jwt', {
    session: false
}), uploadSingleImg, addNews);
router.post('/updateNews', passport.authenticate('jwt', {
    session: false
}), uploadSingleImg, updateNews);
const multiparty = require('connect-multiparty');
const { port } = require('../commons/functions/port');
const MultipartyMiddleware = multiparty({
    uploadDir: "./images"
})
// uploadListing
router.post('/uploadListing', uploadImageListing, uploadListing);
router.post('/uploadMulti', MultipartyMiddleware, (req, res) => {
    var TempFile = req.files.upload
  //console.log(TempFile.path);

    var TempPathfile = TempFile.path;
    const targetPathUrl = path.join(__dirname, "../images/" + TempFile.name)
    if (path.extname(TempFile.originalFilename).toLowerCase() == ".png" || ".jpg") {
        fs.rename(TempPathfile, targetPathUrl, err => {
          //console.log(`${TempFile.originalFilename}`);
            if (err) return console.log(err);
            res.status(200).json({
                uploaded: true,
                url: `${port}images/${TempFile.originalFilename}`
            })
            // ${port}
        })
    }

})
module.exports = router;