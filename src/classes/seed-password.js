const CryptoJS = require('crypto-js');
const fs = require('fs');
const yaml = require('js-yaml');
const {isEmpty, isString, hashLength} = require('lodash');

module.exports = class SeedPassword {

    constructor(pathToFile, seedPhrase, hashLength = 256) {
        this.seedPhrase = seedPhrase;
        this.pathToFile = pathToFile;
        this.setHashLength(hashLength);
    }

    setSeedPhraseFilePath(pathToFile) {
        this.pathToFile = pathToFile;
    }

    setSeedPhraseFromFile() {
        try {
            let rawdata = fs.readFileSync(this.pathToFile, {encoding: 'utf8', flag: 'r'});
            // Only get first line of txt file
            // trim beginning and ending of seed phrase
            this.setSeedPhrase(rawdata.split('\n')[0].trim());
        } catch (err) {
            console.error(err);
        }
    }

    setHashLength(hashLength) {
        hashLength = parseInt(hashLength, 10);

        if (!isFinite(hashLength)) {
            throw new Error('Hash Length must be a number');
        }
        if (![512, 384, 256, 224].includes(hashLength)) {
            throw new Error('Hash length must be 512, 384, 256, or 224');
        }
        this.hashLength = hashLength;
    }

    setSeedPhrase(seedPhrase) {
        if (isEmpty(seedPhrase)) {
            throw new Error('Cannot set empty seed phrase.');
        }
        if (!isString(seedPhrase)) {
            throw new Error('Seed Phrase must be a string.');
        }
        if (seedPhrase.trim() !== seedPhrase) {
            throw new Error('Seed Phrase must not include beginning or ending spaces.');
        }
        this.seedPhrase = seedPhrase;
    }

    get password() {
        return CryptoJS.SHA3(this.seedPhrase, {outputLength: this.hashLength}).toString();
    }
};
