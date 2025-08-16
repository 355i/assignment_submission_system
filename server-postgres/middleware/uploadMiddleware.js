import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subDir = 'others';
    if (file.fieldname === 'faq') subDir = 'faq_files';
    else if (file.fieldname === 'detail') subDir = 'assignment_files';
    else if (file.fieldname === 'submission') subDir = 'submission_files';

    const dir = path.join('uploads', subDir);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const smartUpload = multer({ storage });
export default smartUpload;
