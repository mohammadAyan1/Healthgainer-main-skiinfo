const dotenv = require("dotenv");
dotenv.config();
const ImageKit = require("imagekit");


const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

module.exports = imagekit;
