import multer = require('multer');
import fs = require('fs');
import path = require('path');

export const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // cb(null, './uploads');
    const backupFolder = path.join('./uploads', req.body.folderName);
    fs.mkdirSync(backupFolder, { recursive: true });
    cb(null, backupFolder);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

// export const storage = multer({ storage: multer.memoryStorage() });

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 //5Mo
  },
  fileFilter: fileFilter
});

const listen = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 115 //5Mo
    },
    fileFilter: fileFilter
});
