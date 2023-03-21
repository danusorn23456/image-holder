const express = require("express")
const fs = require('fs');
const path = require('path');
const multer = require('multer')


//#region multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)}
})

// const upload = multer({ storage: storage })

const multi_upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('uploadedImages', 12)
//#endregion

const router = express.Router()

router.get("/", (req, res) => {
    const directoryPath = path.join(__dirname, "/public");
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send('Error getting images.');
      }
      const images = files.filter(file => {
        const regex = /\.(jpg|jpeg|png|gif)$/i;
        return regex.test(file);
      }).map(file => {
        return {
          filename: file,
          src: `${req.protocol}://${req.hostname}:${port}/public/${file}`
        };
      });
      res.send(images);
    });
})
  
router.post("/uploads",(req,res)=>{
      multi_upload(req, res, function (err) {
          if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
              res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
              return;
          } else if (err) {
              // An unknown error occurred when uploading.
              if (err.name == 'ExtensionError') {
                  res.status(413).send({ error: { message: err.message } }).end();
              } else {
                  res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
              }
              return;
          }
  
          // Everything went fine.
          // show file `req.files`
          // show body `req.body`
          res.status(200).end('Your files uploaded.');
      })
})

module.exports = router