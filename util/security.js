const crypto = require("crypto");

const key = process.env.SERVER_KEY
  ? process.env.SERVER_KEY
  : "A?D(G-KaPdSgVkYp3s6v9y$B&E)H@MbQ";

// Inspired by https://gist.github.com/kljensen/7505729 but updated for better security
module.exports.encrypt = function encrypt(text) {
  let vector = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv("aes-256-cbc", key, vector);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return vector.toString("hex") + ":" + crypted.toString("hex");
};

module.exports.decrypt = function decrypt(text) {
  if (text === null || typeof text === "undefined") {
    return text;
  }
  try {
    let encryptedArray = text.split(":");
    let vector = Buffer.from(encryptedArray[0], "hex");
    let value = Buffer.from(encryptedArray[1], "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", key, vector);
    let dec = decipher.update(value);
    dec = dec.toString("utf-8") + decipher.final("utf8");
    return dec;
  } catch (e) {
    return "keyFail:" + text;
  }
};
