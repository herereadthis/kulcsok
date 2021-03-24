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
        console.log(12345);
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

    setFormattedSource() {
        this.checkValidity();

        try {
            let parsedSource;
            const options = {encoding:'utf8', flag:'r'};
            if (this.fileType === 'yml') {
                parsedSource = yaml.load(fs.readFileSync(this.sourceFilePath, options));
            } else if (this.fileType === 'json') {
                parsedSource = JSON.parse(fs.readFileSync(this.sourceFilePath, options));
            } else if (this.fileType === 'txt') {
                parsedSource = fs.readFileSync(this.sourceFilePath, options);
            }
            this.source = parsedSource;
        } catch (err) {
            console.error(err);
        }
    }

    setSource(data) {
        this.source = data;
    }

    get cipherText() {
        this.checkValidity();

        if (isNil(this.source)) {
            this.setFormattedSource();
        }
        return CryptoJS.AES.encrypt(JSON.stringify(this.source), this.password).toString();
    }

    writeEncryptedFile() {
        try {
            fs.writeFileSync(this.destinationFilePath, this.cipherText);
            console.info(`Encrypted file created at: ${this.destinationFilePath}`);
        } catch (err) {
            console.error(err);
        }
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
