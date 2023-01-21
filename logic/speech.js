// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
const fs = require("fs");
const { Deepgram } = require("@deepgram/sdk");

// Creates a client
const client = new speech.SpeechClient();

async function quickstart() {
  // The path to the remote LINEAR16 file

  const filename = "./fJ9rUzIMcZQ.mp3";

  const file = fs.readFileSync(filename);
  const audioBytes = file.toString("base64");

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: "MP3",
    sampleRateHertz: 48000,
    languageCode: "en-US",
  };
  const request = {
    audio: audio,
    config: config,
  };
  console.log("before conver");

  try {
    // Detects speech in the audio file
    const [response] = await client
      .recognize(request)
      .then((res) => {
        console.log("response");
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("recieved response");
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(`Transcription: ${transcription}`);
  } catch (e) {
    console.log(e);
  }
}

const audioToTextUsingDeepGram = async (videoId) => {
  try {
    const deepgram = new Deepgram(process.env.DEEPGRAM_KEY);

    const filename = `./audio/${videoId}.mp3`;
    const audioFile = {
      buffer: fs.readFileSync(filename),
      mimetype: "audio/mpeg",
    };
    console.log("before transcript");
    const response = await deepgram.transcription.preRecorded(audioFile, {
      punctuation: true,
      utterances: true,
    });

    console.log(JSON.stringify(response.results));
    return response.results;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { quickstart, audioToTextUsingDeepGram };
