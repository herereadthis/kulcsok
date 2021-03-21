const bip39 = require('bip39');
const config = require('config');
const CryptoJS = require('crypto-js');
const fs = require('fs');
const yaml = require('js-yaml');
const {isNil} = require('lodash');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');

const {argv} = yargs(hideBin(process.argv));


const SeedPassword = require('./../classes/seed-password');

const SEED_DEMO_PATH = config.get('file_paths.seed_demo');
const SECRET_DEMO_PATH = config.get('file_paths.secret_demo');
const SEED_PATH = config.get('file_paths.seed');
const SECRET_PATH = config.get('file_paths.secret');
const SHA3_HASH_LENGTH = config.get('sha3_hash_length');

const seedPassword = new SeedPassword();
seedPassword.setHashLength(SHA3_HASH_LENGTH);

if (!isNil(argv.seed)) {
    seedPassword.setSeedPhrase(argv.seed);
} else {
    if (argv.new) {
        seedPassword.setSeedPhraseFilePath(SEED_PATH);
        seedPassword.generateSeedFile(12, true);
    } else if (argv.demo) {
        if (!fs.existsSync(SEED_DEMO_PATH)) {
            throw new Error('cannot find demo seed file');
        }
        seedPassword.setSeedPhraseFilePath(SEED_DEMO_PATH);
    }
    seedPassword.setSeedPhraseFromFile();
}

console.log('\nhash');
console.log(seedPassword.hash);
console.log('hash\n');

const {hash: password} = seedPassword;

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
const ciphertext2 = CryptoJS.AES.encrypt(JSON.stringify(secret), password).toString();

console.log(ciphertext2);

// Decrypt
const bytes2  = CryptoJS.AES.decrypt(ciphertext2, password);
const decryptedData2 = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8));
console.log(decryptedData2);
