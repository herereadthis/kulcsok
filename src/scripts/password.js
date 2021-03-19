const CryptoJS = require('crypto-js');
const fs = require('fs');
const yaml = require('js-yaml');
const {isEmpty} = require('lodash');

const SeedPassword = require('./../classes/seed-password');

const seedPassword = new SeedPassword('./src/secrets/seed.txt');

// process.argv is an array of command-line arguments
// [0] is process.execPath
// [1] is the file being executed
// [n > 1] are any additional arguments
// see https://nodejs.org/docs/latest/api/process.html#process_process_argv
const seedPhraseArg = process.argv[2];

if (isEmpty(seedPhraseArg)) {
    seedPassword.setSeedPhraseFromFile();
} else {
    seedPassword.setSeedPhrase(seedPhraseArg);
}

console.log(seedPassword.password);

const password = seedPassword.password;

//Get document, or throw exception on error
let secret;
try {
    secret = yaml.load(fs.readFileSync('./src/secrets/secret.yml', 'utf8'));
} catch (err) {
    console.error(err);
}

// Encrypt
const ciphertext2 = CryptoJS.AES.encrypt(JSON.stringify(secret), password).toString();

console.log(ciphertext2);

// Decrypt
const bytes2  = CryptoJS.AES.decrypt(ciphertext2, password);
const decryptedData2 = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8));
console.log(decryptedData2);
