const bip39 = require('bip39');
const chalk = require('chalk');
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
const SECRET_ENCRYPTED_FILE_NAME = config.get('file_paths.secret_encrypted_file');
const SECRET_ENCRYPTED_PATH = config.get('file_paths.secret_encrypted');
const SHA3_HASH_LENGTH = config.get('sha3_hash_length');
const BUILD_PATH = config.get('file_paths.build');
const META_FILE_PATH = config.get('file_paths.meta_file');

const {argv} = yargs(hideBin(process.argv));

if (!fs.existsSync(BUILD_PATH)){
    fs.mkdirSync(BUILD_PATH);
}

// Command example: 'npm run encrypt:demo'
if (argv.demo) {
    console.info(chalk.magenta('Running Encrypt (demo)...'));
    const seedPassword = new SeedPassword(SEED_DEMO_PATH);

    console.info(
        'Seed Path:', chalk.cyan(SEED_DEMO_PATH),
        '\nSeed Password:', chalk.cyan(seedPassword.seedPhrase),
        '\n'
    );

    const encryptor = new Encryptor(seedPassword.hash, SECRET_DEMO_PATH);
    const timestampDirectory = encryptor.timestampDirectory;

    const buildFolder = `${BUILD_PATH}/${timestampDirectory}`;
    fs.mkdirSync(buildFolder);

    encryptor.destinationFilePath = `${buildFolder}/${SECRET_ENCRYPTED_FILE_NAME}`;
    encryptor.writeEncryptedFile();

    try {
        const metaFilePath = `${buildFolder}/${META_FILE_PATH}`;

        const text = encryptor.generateMeta({
            passwordEncoding: seedPassword.encoding,
            passwordHashLength: seedPassword.hashLength
        });
        fs.writeFileSync(metaFilePath, text);
    } catch (err) {
        console.error(err);
    }

} else if (!isNil(process.argv[2]) && !isNil(process.argv[3])) {
    // Command Example: 'npm run "password123" "my secret phrase"'
    console.info(chalk.magenta('Running Encrypt (manual password + manual secret)...'));

    const password = process.argv[2];
    const secret = process.argv[3];
    // args: password and message
    const encryptor = new Encryptor(password);
    encryptor.setSource(secret);
    const cipherText = encryptor.cipherText;

    console.info(
        'Seed Password:', chalk.cyan(password),
        '\nEncrypted secret: ', chalk.cyan(cipherText),
        '\n'
    );

    // Confirmation
    const bytes  = CryptoJS.AES.decrypt(cipherText, password);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    if (decryptedData !== secret) {
        throw new Error('whoops could not decrypt properly');
    }
} else if (process.argv.length === 3) {
    // args: password only
    const encryptor = new Encryptor(process.argv[2]);
    let foo = encryptor.cipherText;

    console.log(2, foo);

    const bytes3  = CryptoJS.AES.decrypt(foo, process.argv[2]);
    const decryptedData3 = JSON.parse(bytes3.toString(CryptoJS.enc.Utf8));
    console.log(3, decryptedData3);
} else if (process.argv.length === 2) {
    console.log(4);
    const seedPassword = new SeedPassword();
    console.log(seedPassword.seedPhrase);
    console.log(seedPassword.hash);
}



