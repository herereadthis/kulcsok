const bip39 = require('bip39');
const config = require('config');
const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const {isNil, isEmpty, isString, isFinite} = require('lodash');

const SECRET_PATH = config.get('file_paths.secret');
const SECRET_ENCRYPTED_PATH = config.get('file_paths.secret_encrypted');

module.exports = class Encryptor {

    constructor(password, sourceFilePath = SECRET_PATH, destinationFilePath = SECRET_ENCRYPTED_PATH) {
        this.password = password;
        this.sourceFilePath = this.getSourceFilePath(sourceFilePath);
        this.destinationFilePath = destinationFilePath;
        this.fileType = Encryptor.getFileType(this.sourceFilePath);
    }

    static getFileType(filePath) {
        const extension = path.extname(filePath);
        return extension.substring(1);
    }

    getSourceFilePath(sourceFilePath) {
        if (!fs.existsSync(sourceFilePath)) {
            throw new Error('cannot find source file at path');
        }
        return sourceFilePath;
    }

    setDestinationFilePath(destinationFilePath) {
        this.destinationFilePath = destinationFilePath;
    }

    setFormattedSource() {
        this.checkValidity();

        try {
            let parsedSource;
            if (this.fileType === 'yml') {
                parsedSource = yaml.load(fs.readFileSync(this.sourceFilePath, 'utf8'));
            } else if (this.fileType = 'json') {
                parsedSource = JSON.parse(fs.readFileSync(this.sourceFilePath));
            }
            this.source = parsedSource;
        } catch (err) {
            console.error(err);
        }
    }

    setSource(data) {
        this.source = data;
    }

    writeEncryptedFile() {
        this.checkValidity();

        let cipherText;
        try {
            if (isNil(this.source)) {
                this.setFormattedSource();
            }

            cipherText = CryptoJS.AES.encrypt(JSON.stringify(this.source), this.password).toString();
            fs.writeFileSync(this.destinationFilePath, cipherText);
            console.info(`Encrypted file created at: ${this.destinationFilePath}`);
        } catch (err) {
            console.error(err);
        }
        return cipherText;
    }

    checkValidity() {
        if (isNil(this.sourceFilePath)) {
            throw new Error('source file path does not exist');
        }
        if (isNil(this.destinationFilePath)) {
            throw new Error('destination file path not set');
        }
        if (isNil(this.fileType)) {
            throw new Error('file type unknown!');
        }
        if (isNil(this.password)) {
            throw new Error('cannot encrypt file without password');
        }
    }
};
