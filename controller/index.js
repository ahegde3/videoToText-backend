const express = require("express");
const router = express.Router();
const { convertToAudio, downloadYoutubeVideo } = require("../logic");

router.post("/convertToAudio", (req, res) => {
  return convertToAudio(req.body.url)
    .then((result) => {
      return res.json(result);
    })
    .catch((e) => {
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
