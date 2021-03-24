const bip39 = require('bip39');
const config = require('config');
const CryptoJS = require('crypto-js');
const fs = require('fs');
const yaml = require('js-yaml');
const {isNil} = require('lodash');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');

const SeedPassword = require('./../classes/seed-password');
const Encryptor = require('./../classes/encryptor');

const SEED_DEMO_PATH = config.get('file_paths.seed_demo');
const SECRET_DEMO_PATH = config.get('file_paths.secret_demo');
const SEED_PATH = config.get('file_paths.seed');
const SECRET_PATH = config.get('file_paths.secret');
const SECRET_ENCRYPTED_PATH = config.get('file_paths.secret_encrypted');
const SHA3_HASH_LENGTH = config.get('sha3_hash_length');

const {argv} = yargs(hideBin(process.argv));

if (argv.demo) {
    const seedPassword = new SeedPassword(SEED_DEMO_PATH);
    const encryptor = new Encryptor(seedPassword.hash, SECRET_DEMO_PATH);
    console.log(encryptor.cipherText);
    console.log(encryptor.source);
} else if (!isNil(process.argv[2]) && !isNil(process.argv[3])) {
    // args: password and message
    const encryptor = new Encryptor(process.argv[2]);
    encryptor.setSource(process.argv[3]);
    let foo = encryptor.cipherText;

    console.log(foo);

    const bytes2  = CryptoJS.AES.decrypt(foo, process.argv[2]);
    const decryptedData2 = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData2);
} else if (process.argv.length === 3) {
    // args: password only
    const encryptor = new Encryptor(process.argv[2]);
    let foo = encryptor.cipherText;

    console.log(foo);

    const bytes3  = CryptoJS.AES.decrypt(foo, process.argv[2]);
    const decryptedData3 = JSON.parse(bytes3.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData3);
} else if (process.argv.length === 2) {

    const seedPassword = new SeedPassword();
    console.log(seedPassword.seedPhrase);
    console.log(seedPassword.hash);
}



/*

module.exports.encrypt = (password) => {
    console.log('\n***\n', argv, '\n***\n')

    console.log('asdf');

    //Get document, or throw exception on error
    let secret;
    try {
        let seedPath;
        if (argv.demo) {
            if (!fs.existsSync(SECRET_DEMO_PATH)) {
                throw new Error('cannot find demo secret file');
            }
            seedPath = SECRET_DEMO_PATH;
        } else {
            if (!fs.existsSync(SECRET_PATH)) {
                throw new Error('cannot find secret file');
            }
            seedPath = SECRET_PATH;
        }
        secret = yaml.load(fs.readFileSync(seedPath, 'utf8'));
    } catch (err) {
        console.error(err);
    }

    // Encrypt
    const cipherText = CryptoJS.AES.encrypt(JSON.stringify(secret), password).toString();

    console.log('\nencrypted');
    console.log(cipherText);
    console.log('encrypted\n');

    return cipherText;
};

module.exports.decrypt = (cipher) => {

// Decrypt
    const bytes2  = CryptoJS.AES.decrypt(cipher, password);
    const decryptedData2 = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData2);

    console.log('\ndecrypted');
    console.log(decryptedData2);
    console.log('decrypted\n');

    return decryptedData2;
};

*/



