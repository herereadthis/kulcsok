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
const Decryptor = require('./../classes/decryptor');

const SEED_DEMO_PATH = config.get('file_paths.seed_demo');
const SECRET_DEMO_PATH = config.get('file_paths.secret_demo');
const SEED_PATH = config.get('file_paths.seed');
const SECRET_PATH = config.get('file_paths.secret');
const SECRET_DECRYPTED_FILE_NAME = config.get('file_paths.secret_decrypted_file');
const SECRET_ENCRYPTED_FILE_NAME = config.get('file_paths.secret_encrypted_file');
const SECRET_ENCRYPTED_PATH = config.get('file_paths.secret_encrypted');
const SHA3_HASH_LENGTH = config.get('sha3_hash_length');
const BUILD_PATH = config.get('file_paths.build');
const META_FILE_PATH = config.get('file_paths.meta_file');

const {argv} = yargs(hideBin(process.argv));

if (argv.demo) {
    const seedPassword = new SeedPassword(SEED_DEMO_PATH);

    const options = {encoding:'utf8', flag:'r'};
    const parsedSource = fs.readFileSync(SECRET_ENCRYPTED_PATH, options);

    const decryptor = new Decryptor(seedPassword.hash);
    const timestampDirectory = decryptor.timestampDirectory;
    const buildFolder = `${BUILD_PATH}/${timestampDirectory}`;
    fs.mkdirSync(buildFolder);

    decryptor.destinationFilePath = `${buildFolder}/secret.txt`;
    decryptor.decryptFromSource(SECRET_ENCRYPTED_PATH);
    decryptor.writeDecryptedFile();
}
