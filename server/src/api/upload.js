const {
    default: axios
} = require('axios');
const multer = require('multer');
const {
    messageTelegram
} = require('../commons/functions/validateObj');
const {
    success,
    error_500,
    error_400
} = require('../message');
const {
    getDepositVNDToId
} = require('../sockets/queries/customerQuery');
const customerQuery = require('../sockets/queries/customerQuery');
const multerConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/images')
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        callback(null, `image-${Date.now()}.${ext}`)
    }
})
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(new Error('Only Image is Allowed..'))
    }
}
const upload = multer({
    storage: multerConfig,
    fileFilter: isImage,
})
var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
exports.uploadImage = upload.array('photo', 3)
exports.uploadImageListing = upload.array('photo', 2)
exports.uploadSingleImg = upload.single('photo')
exports.upload = async (req, res) => {
    try {
        const {
            userid,
            phone,
            fullname,
            address,
            passport,
        } = req.body
        if (userid) {
            console.log("pokl");
            const flag = await customerQuery.getUserToId(userid)
            if (flag[0].verified == null || flag[0].verified == 3) {
                if (req.files[0] != undefined && req.files[1] != undefined) {
                    if (req.files[2] != undefined) {
                        var front = `images/${req.files[0].filename}`
                        var back = `images/${req.files[1].filename}`
                        var sefie = `images/${req.files[2].filename}`
                        var array = [front, back, sefie]
                        var string = JSON.stringify(array)
                        //// chưa biết để làm gì 
                        const type = 1
                        /////
                        await customerQuery.updateKycUser(string, 2, userid, phone, fullname, passport, address,type)
                        await customerQuery.addNotification(userid, flag[0].username, "KYC", `KYC is successful please wait for admin to approve your KYC`)
                        success(res, "Verify your KYC is successful!", {
                            ok: "yes"
                        })
                    } else {
                        error_400(res, "Images cannot be left blank", 3)

                    }
                } else {
                    error_400(res, "Images cannot be left blank", 2)

                }

                // error_400(res, "This ID Card is being used for verification", "error")
            } else
                // if (flag[0].verified == 2) {
                error_400(res, "users who have updated KYC please wait for admin to approve", 1)
        }
        // else if (flag[0].verified == 4) { }




    } catch (error) {
        console.log(error, "zxc");
        error_500(res, error)
    }
}
exports.uploadSingle = async (req, res) => {
    try {
        const {
            userid,
            idTransaction
        } = req.body
        if (userid) {
            //console.log(req.file);
            const flag = await customerQuery.getUserToId(userid)
            if (req.file != undefined) {
                const transaction = await customerQuery.getDepositVNDToId(idTransaction)
                if (transaction.length > 0) {
                    var front = `images/${req.file.filename}`
                    await customerQuery.updateImagesTransaction(front, idTransaction)
                    success(res, "Post proof of success!")
                } else {
                    error_400(res, "transaction is not define", 1)
                }

            } else {
                error_400(res, "Images cannot be left blank", 2)

            }
        } else {
            error_400(res, "userid is not define!", 1)
        }
        // else if (flag[0].verified == 4) { }




    } catch (error) {
        //console.log(error, "zxc");
        error_500(res, error)
    }
}
exports.addNews = async (req, res) => {
    try {
        const {
            content,
            title,
            description,

        } = req.body
        const idUser = req.user
        //console.log(idUser);
        if (idUser == 1) {
            //console.log(req.file);
            if (req.file != undefined) {
                var front = `images/${req.file.filename}`
                await customerQuery.addNews(title, description, front, content, 1)
                success(res, "Post success news!")
            } else {
                error_400(res, "Images cannot be left blank", 2)

            }
        } else {
            error_400(res, "userid is not define!", 1)
        }
        // else if (flag[0].verified == 4) { }




    } catch (error) {
        //console.log(error, "zxc");
        error_500(res, error)
    }
}
exports.updateNews = async (req, res) => {
    try {
        const {
            content,
            title,
            description,
            idNews

        } = req.body
        const idUser = req.user
        //console.log(idUser);
        if (idUser == 1) {
            //console.log(req.file);
            if (req.file != undefined) {
                var front = `images/${req.file.filename}`
                await customerQuery.updateNews(idNews, title, description, front, content)
                success(res, "Post success news!")
            } else {
                error_400(res, "Images cannot be left blank", 2)

            }
        } else {
            error_400(res, "userid is not define!", 1)
        }
        // else if (flag[0].verified == 4) { }




    } catch (error) {
        //console.log(error, "zxc");
        error_500(res, error)
    }
}
exports.uploadListing = async (req, res) => {
    try {
        const {
            email,
            fullname,
            company,
            position,
            project_name,
            token_fullname,
            token_website,
            // image_company,
            advertisement,
            token_application,
            token_jurisdiction,
            // image_laws,
            tokenRecaptcha
        } = req.body

        if (req.files[0] != undefined) {

            if (req.files[1] != undefined) {
                const secretKey = "6LdflhodAAAAAKkxRRWZXWffdP9EaXG4VyZU3jIm"
                const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${tokenRecaptcha}`
                const ress = await axios({
                    url,
                    methods: "POST"
                })
                const flag = ress.data.success
                if (true) {
                    var image_company = `images/${req.files[0].filename}`
                    var image_laws = `images/${req.files[1].filename}`
                    await customerQuery.addListing(email,
                        fullname,
                        company,
                        position,
                        project_name,
                        token_fullname,
                        token_website,
                        image_company,
                        advertisement,
                        token_application,
                        token_jurisdiction,
                        image_laws)
                    await messageTelegram(`[LISTING] Someone requested more ${token_fullname} tokens`)
                    //    await customerQuery.addNotification(userid, flag[0].username, "KYC", `KYC is successful please wait for admin to approve your KYC`)
                    success(res, "Verify your Listing is successful!", {
                        ok: "yes"
                    })
                } else {
                    error_400(res, "Robot verification failed", 1)
                }


            } else {
                error_400(res, "Images cannot be left blank", 3)

            }
        } else {
            error_400(res, "Images cannot be left blank", 2)

        }




    } catch (error) {
        //console.log(error, "zxc");
        error_500(res, error)
    }
}