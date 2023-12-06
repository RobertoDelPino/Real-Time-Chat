import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'UserPhotos/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
  
const fileFilter = (req, file, cb) => {
    // Aceptar solo archivos de imagen
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no válido. Solo se aceptan JPEG, PNG y JPG.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

export {
    upload
}