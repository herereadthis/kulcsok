/**
 * @module Decryptor
 */

// const bip39 = require('bip39');
// const config = require('config');
const CryptoJS = require('crypto-js');
const dayjs = require('dayjs');
const fs = require('fs');
// const path = require('path');
// const jsYaml = require('js-yaml');
const utc = require('dayjs/plugin/utc');
// const YAML = require('yaml');

// const SECRET_PATH = config.get('file_paths.secret');
// const SECRET_ENCRYPTED_FILE_NAME = config.get('file_paths.secret_encrypted');

dayjs.extend(utc);

module.exports = class Decryptor {

    constructor(password, destinationFilePath) {
        const now = new Date();

        this.password = password;
        this.decryptOptions = {
            encoding:'utf8',
            flag:'r'
        };
        this.decryptedData = undefined;
        this.destinationFilePath = destinationFilePath;
        this.decryptionTimestamp = dayjs.utc(now).toISOString();
    }

    get timestampDirectory() {
        return dayjs.utc(this.decryptionTimestamp).format('YYYY-MM-DD-HHmmss');
    }

    /**
     * Decrypts the data from a source and sets it as decryptedData.
     * 
     * @param {string} sourcePath - file path of source
     */
    decryptFromSource(sourcePath) {
        const sourceEncrypted = fs.readFileSync(sourcePath, this.decryptOptions);
        const bytes  = CryptoJS.AES.decrypt(sourceEncrypted, this.password);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        this.decryptedData = decryptedData;
    }

    /**
     * Takes decryptedData and writes it to a file.
     */
    writeDecryptedFile() {
        try {
            fs.writeFileSync(this.destinationFilePath, JSON.stringify(this.decryptedData, null, 4));
            console.info(`Decrypted file created at: ${this.destinationFilePath}`);
        } catch (err) {
            console.error(err);
        }
    }
};
