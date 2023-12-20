const multer = require("multer");
// Set the storage destination and filename for uploaded images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "backend/uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
// Create the multer instance
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 8 } });
module.exports = upload;