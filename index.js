//#region import
const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const multer = require('multer')
//#endregion

//#region config

const app = express();
const port = 8000;

app.use('/static', express.static(path.join(__dirname + '/public')));
app.use(express.json({ extended: false }));

app.use(cors());
//#endregion
app.get('/', (req, res) => {
  res.send('Welcome to image holder api')
})

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

app.get("/api/image/", (req, res) => {
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

app.post("/api/image/uploads",(req,res)=>{
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

//#region final command
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
//#endregion