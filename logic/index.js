const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ytdl = require("ytdl-core");
const { audioToTextUsingDeepGram } = require("./speech");

ffmpeg.setFfmpegPath(ffmpegPath);

function convert(input, output, callback) {
  ffmpeg(input)
    .output(output)
    .on("end", function () {
      console.log("conversion ended");
      callback(null);
    })
    .on("error", function (e) {
      console.log(e);
      console.log("error: ", e.code, e.msg);
      callback(e);
    })
    .run();
}

// convert("./input.mp4", "./output.mp3", function (err) {
//   if (!err) {
//     console.log("conversion complete");
//     //...
//   }
// });

downloadYoutubeVideo = async (url) => {
  console.log(url);
  const videoId = url.split("v=")[1]?.split("&")?.[0];
  console.log(videoId);

  ytdl(`http://www.youtube.com/watch?v=${videoId}`).pipe(
    fs.createWriteStream(`${videoId}.mp4`)
  );
};

const convertToAudio = async (url) => {
  console.log(url);
  const videoId = url.split("v=")[1];
  console.log(videoId);

  const videoInfo = await ytdl.getInfo(
    `http://www.youtube.com/watch?v=${videoId}`,
    { quality: "highestaudio" }
  );

  const stream = ytdl.downloadFromInfo(videoInfo, {
    quality: "highestaudio",
  });
  console.log(videoInfo.formats[0]);
  return new Promise((resolve, reject) => {
    ffmpeg(stream)
      .audioBitrate(videoInfo.formats[0].bitrate)
      .withAudioCodec("libmp3lame")
      .toFormat("mp3")
      .saveToFile(`${videoId}.mp3`)
      .on("end", () => {
        console.log("completed");
        resolve();
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      });
  })
    .then(() => {
      return audioToTextUsingDeepGram(videoId);
    })
    .catch((err) => console.log(err));
};

module.exports = { convertToAudio, downloadYoutubeVideo };
