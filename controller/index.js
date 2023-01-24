const express = require("express");
const router = express.Router();
const fs = require("fs");
const { convertToText, downloadYoutubeVideo } = require("../logic");

router.post("/convertToText", (req, res) => {
  return convertToText(req.body.url)
    .then((result) => {
      const { fileName } = result;

      if(!fileName) throw Error("file not found")

      const path = __dirname + "/../transcripts/" + fileName;
      fs.readFile(path, (err, data) => {
        if (err) res.status(500).send(err);
        res.contentType('application/text')
           .send(JSON.stringify(`data:application/text;base64,${new Buffer.from(data).toString('base64')}`));
         fs.unlinkSync(path)  
    });

    })
    .catch((e) => {
      console.log(e);
      return res.json(e);
    });
});

router.post("/downloadVideo", (req, res) => {
  return downloadYoutubeVideo(req.body.url)
    .then((result) => {
      return res.json(result);
    })
    .catch((e) => {
      return res.json(e);
    });
});

// Default Routers
router.get("/", function (req, res) {
  res.json({
    status: "Server responding",
    time: req.body.startTimeEpoch,
  });
});

module.exports = router;
