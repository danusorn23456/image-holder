//#region import
const express = require("express");
const cors = require("cors");
const imageApi = require("./api/image")
//#endregion

//#region config
const app = express();
const port = 8000;
app.use(express.static('public'));
app.use(cors());
//#endregion

app.use("/api/image",imageApi)

//#region final command
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
//#endregion