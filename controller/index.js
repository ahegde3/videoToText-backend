const express = require("express");
const router = express.Router();
const { convertToAudio, downloadYoutubeVideo } = require("../logic");

router.post("/convertToAudio", (req, res) => {
  return convertToAudio(req.body.url)
    .then((result) => {
      //return responseClass.getResponseFormat(res, 200, { ...result });
      return result;
    })
    .catch((e) => {
      // logger("error in searching is" + e);
      // return responseClass.getResponseFormat(res, 403, { e });
      return e;
    });
});

router.post("/downloadVideo", (req, res) => {
  return downloadYoutubeVideo(req.body.url)
    .then((result) => {
      //return responseClass.getResponseFormat(res, 200, { ...result });
      return result;
    })
    .catch((e) => {
      // logger("error in searching is" + e);
      // return responseClass.getResponseFormat(res, 403, { e });
      return e;
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
