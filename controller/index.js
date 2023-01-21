const express = require("express");
const router = express.Router();
const { convertToText, downloadYoutubeVideo } = require("../logic");

router.post("/convertToText", (req, res) => {
  return convertToText(req.body.url)
    .then((result) => {
      const { fileName } = result;
      const path = __dirname + "/../transcripts/" + fileName;

      return res.download(path, fileName, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          });
        }
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
