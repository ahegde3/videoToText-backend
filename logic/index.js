const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ytdl = require("ytdl-core");
const { audioToTextUsingDeepGram } = require("./speech");

const YOUTUBE_WATCH_LINK = "http://www.youtube.com/watch?v=";

ffmpeg.setFfmpegPath(ffmpegPath);

downloadYoutubeVideo = async (url) => {
  const videoId = url.split("v=")[1]?.split("&")?.[0];
  if (!videoId) return;
  console.log(videoId);

  ytdl(`${YOUTUBE_WATCH_LINK}${videoId}`).pipe(
    fs.createWriteStream(`${videoId}.mp4`)
  );
};

const convertToText = async (url) => {
  console.log(url);
  const videoId = url.split("v=")[1]?.split("&")?.[0];
  if (!videoId) return;
  console.log(videoId);

  const videoInfo = await ytdl.getInfo(`${YOUTUBE_WATCH_LINK}${videoId}`, {
    quality: "highestaudio",
  });

  const stream = ytdl.downloadFromInfo(videoInfo, {
    quality: "highestaudio",
  });

  return new Promise((resolve, reject) => {
    ffmpeg(stream)
      .audioBitrate(videoInfo.formats[0].bitrate)
      .withAudioCodec("libmp3lame")
      .toFormat("mp3")
      .saveToFile(`./audio/${videoId}.mp3`)
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

module.exports = { convertToText, downloadYoutubeVideo };
