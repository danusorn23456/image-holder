//#region import
const express = require("express");
const cors = require("cors");
const imageApi = require("./api/image")
//#endregion

//#region config

const app = express();
const port = 8000;

app.use(express.json({ extended: false }));
app.use(express.static('public'));
app.use(cors());
//#endregion
app.get('/', (req, res) => {
  res.send('Welcome to image holder api')
})

app.use("/api/image",imageApi)

//#region final command
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
//#endregion