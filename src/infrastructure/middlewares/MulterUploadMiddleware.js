const multer = require("multer");
const path = require("path");

class MulterUploadMiddleware {
  constructor(uploadPath = "public/uploads", maxSize = 2 * 1024 * 1024) {
    this.uploadPath = uploadPath;
    this.maxSize = maxSize;
    this.storage = this._configureStorage();
  }

  _configureStorage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `IMG-${Date.now()}${ext}`);
      },
    });
  }

  _imageFileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("File format not supported."), false);
    }
    cb(null, true);
  }

  single(fieldName = "profilePicture") {
    return multer({
      storage: this.storage,
      fileFilter: this._imageFileFilter,
      limits: { fileSize: this.maxSize },
    }).single(fieldName);
  }

  multiple(fieldName = "images", maxCount = 10) {
    return multer({
      storage: this.storage,
      fileFilter: this._imageFileFilter,
      limits: { fileSize: this.maxSize },
    }).array(fieldName, maxCount);
  }
}

module.exports = MulterUploadMiddleware;
