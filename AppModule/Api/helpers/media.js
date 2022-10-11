const multer = require("multer");
const crypto = require('crypto');
const path  = require("path");
let pathForUploads = path.join(__dirname,'../','../','../','uploads/')
console.log(pathForUploads, 'path to upload ')
storage = multer.diskStorage({

    destination: function (req, file, cb) {
        console.log("file........", file);
        if(file.fieldname == "logo") cb(null, pathForUploads);
        else if(file.fieldname == "category_img") cb(null,pathForUploads);
        else if(file.fieldname == "product_img") cb(null,pathForUploads);
        else cb(null,'Error uploading image')
        // file.fieldname == "accountImage" && cb(null, 'uploads/account_images');
    },
    filename: function (req, file, cb) {
        let ext = '';
        if (file.originalname.split('.').length > 1) {
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        }
        let fileName = `${crypto.randomBytes(64).toString()}-${Date.now()}${ext}`
        cb(null, file.fieldname + 'AB' + Date.now() + ext)
    }
});

const createUploadMiddleware = (options) => {
    console.log('files');
    const { fieldName, fileSize, diskStoragePath, max } = options;
    const multerStorage = diskStoragePath ? multer.diskStorage({ destination: diskStoragePath }) : multer.memoryStorage();
    let upload = multer({
        storage: storage,
        fileFilter: filterAttachments,
        limits: { fileSize },
    });
    return upload
}
const filterAttachments = (req, file,cb) => {
    if (!file.mimetype.match(/^(application\/pdf|image\/(jpeg|jpg|png|heic|heif))/)) {
        const uploadError = new Error();
        uploadError.name = 'invalidFileType';
        uploadError.message = 'Invalid file type';
        req.field = file.fieldname
        req.file_error = `${uploadError.message} at ${req.field}`;
        return cb(null, false);
    }
    let ext = ''
    if (file.originalname.split('.').length > 1) {
        ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    }
    return cb(null, true);
};
exports.upload = createUploadMiddleware({ max: 6, fileSize: 2 * 100000 * 100000 })
