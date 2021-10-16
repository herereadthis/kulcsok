const chalk = require('chalk');
const config = require('config');
const CryptoJS = require('crypto-js');
const fs = require('fs');
const {isNil} = require('lodash');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
// const bip39 = require('bip39');
// const yaml = require('js-yaml');

const SeedPassword = require('./../classes/seed-password');
const Encryptor = require('./../classes/encryptor');

const SEED_DEMO_PATH = config.get('file_paths.seed_demo');
const SECRET_DEMO_PATH = config.get('file_paths.secret_demo');
const SECRET_ENCRYPTED_FILE_NAME = config.get('file_paths.secret_encrypted_file');
const BUILD_PATH = config.get('file_paths.build');
const META_FILE_PATH = config.get('file_paths.meta_file');
// const SEED_PATH = config.get('file_paths.seed');
// const SECRET_PATH = config.get('file_paths.secret');
// const SECRET_ENCRYPTED_PATH = config.get('file_paths.secret_encrypted');
// const SHA3_HASH_LENGTH = config.get('sha3_hash_length');

const {argv} = yargs(hideBin(process.argv));

if (!fs.existsSync(BUILD_PATH)){
    fs.mkdirSync(BUILD_PATH);
}





if (argv.demo) {
    // Command example: 'npm run encrypt:demo'
    runDemoScript();
} else if (!isNil(process.argv[2]) && !isNil(process.argv[3])) {
    // Command Example: 'npm run "password123" "my secret phrase"'
    runManualScript(process.argv[2], process.argv[3]);
} else if (process.argv.length === 3) {
    // Command Example: 'npm run "password123"'
    runManualPasswordScript(process.argv[2]);
} else if (process.argv.length === 2) {
    console.log(4);
    const seedPassword = new SeedPassword();
    console.log(seedPassword.seedPhrase);
    console.log(seedPassword.hash);
}

function runDemoScript() {
    console.info(chalk.magenta('Running Encrypt (demo)...'));
    const seedPassword = new SeedPassword(SEED_DEMO_PATH);

    const encryptor = new Encryptor(seedPassword.hash, SECRET_DEMO_PATH);
    const timestampDirectory = encryptor.timestampDirectory;

    const buildFolder = `${BUILD_PATH}/${timestampDirectory}`;
    fs.mkdirSync(buildFolder);

    encryptor.destinationFilePath = `${buildFolder}/${SECRET_ENCRYPTED_FILE_NAME}`;
    encryptor.writeEncryptedFile();

    console.info(
        'Seed Path:', chalk.cyan(SEED_DEMO_PATH),
        '\nSeed Password:', chalk.cyan(seedPassword.seedPhrase),
        '\nTrue Password:', chalk.cyan(seedPassword.hash),
        '\nEncrypted secret: ', chalk.cyan(encryptor.cipherText),
        '\nEncrypted file location:', chalk.cyan(encryptor.destinationFilePath),
        '\n'
    );

    try {
        const metaFilePath = `${buildFolder}/${META_FILE_PATH}`;

        const text = encryptor.generateMeta({
            passwordEncoding: seedPassword.encoding,
            passwordHashLength: seedPassword.hashLength
        });
        fs.writeFileSync(metaFilePath, text);
    } catch (err) {
        console.error(chalk.red(err));
    }
}

function runManualScript(password, secret) {
    console.info(chalk.magenta('Running Encrypt (manual password + manual secret)...'));

    const encryptor = new Encryptor(password);
    encryptor.setSource(secret);

    console.info(
        'Seed Password:', chalk.cyan(password),
        '\nEncrypted secret: ', chalk.cyan(encryptor.cipherText),
        '\n'
    );

    // Confirmation
    const bytes  = CryptoJS.AES.decrypt(encryptor.cipherText, password);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    if (decryptedData !== secret) {
        throw new Error('whoops could not decrypt properly');
    }
}

function runManualPasswordScript(password) {
    console.info(chalk.magenta('Running Encrypt (manual password)...'));

    const encryptor = new Encryptor(password);
    const timestampDirectory = encryptor.timestampDirectory;

    const buildFolder = `${BUILD_PATH}/${timestampDirectory}`;
    fs.mkdirSync(buildFolder);

    encryptor.destinationFilePath = `${buildFolder}/${SECRET_ENCRYPTED_FILE_NAME}`;
    encryptor.writeEncryptedFile();

    console.info(
        'Seed Password:', chalk.cyan(password),
        '\nSource Path:', chalk.cyan(encryptor.sourceFilePath),
        '\nSource File Type:', chalk.cyan(encryptor.fileType),
        '\nEncrypted secret: ', chalk.cyan(encryptor.cipherText),
        '\nEncrypted file location:', chalk.cyan(encryptor.destinationFilePath),
        '\n'
    );

    const bytes3  = CryptoJS.AES.decrypt(encryptor.cipherText, password);
    const decryptedData3 = JSON.parse(bytes3.toString(CryptoJS.enc.Utf8));
    console.log(3, decryptedData3);
}



