// Imports the Google Cloud client library
const fs = require("fs");
const { Deepgram } = require("@deepgram/sdk");

const audioToTextUsingDeepGram = async (videoId) => {
  try {
    const deepgram = new Deepgram(process.env.DEEPGRAM_KEY);

    const filePath = `./audio/${videoId}.mp3`;
    const audioFile = {
      buffer: fs.readFileSync(filePath),
      mimetype: "audio/mpeg",
    };

    const response = await deepgram.transcription.preRecorded(audioFile, {
      punctuation: true,
      utterances: true,
    });

    const transcript = response?.results?.utterances?.map(
      (utterance) => utterance.transcript
    );

    fs.writeFileSync(
      `./transcripts/${videoId}.txt`,
      transcript.join("\r\n"),
      () => `Wrote ${videoId}.txt`
    );
    fs.unlinkSync(filePath)
    return { fileName: `${videoId}.txt` };
  } catch (err) {
    console.log(err);
  }
};

module.exports = {  audioToTextUsingDeepGram };
