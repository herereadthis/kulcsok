const bip39 = require('bip39');
const config = require('config');
const CryptoJS = require('crypto-js');
const fs = require('fs');
const yaml = require('js-yaml');
const {isNil, isEmpty, isString, isFinite} = require('lodash');

const SEED_PATH = config.get('file_paths.seed');

module.exports = class SeedPassword {

    constructor(pathToFile = SEED_PATH, seedPhrase, hashLength = 256) {
        this.seedPhrase = seedPhrase;
        this.setHashLength(hashLength);
        this.pathToFile = null;

        if (!isNil(pathToFile)) {
            this.setSeedPhraseFromFile(pathToFile);
        }
    }

    /**
     * Creates a seed phrase (mnemonic) of random words that are easy to record
     * accurately. As long as the bip39 project is maintained, this method can
     * be used.
     *
     * @param {number} wordLength
     */
    static getBip39Mnemonic(wordLength = 12) {
        const allowed = [12, 15, 18, 21, 24];

        if (!isFinite(wordLength)) {
            throw new Error('invalid bip39 strength');
        }

        if (!allowed.includes(wordLength)) {
            throw new Error(`Allowed word lengths: ${allowed.join(', ')}`);
        }

        let strength;
        switch(wordLength) {
            case 12:
                strength = 128;
                break;
            case 15:
                strength = 160;
                break;
            case 18:
                strength = 192;
                break;
            case 21:
                strength = 224;
                break;
            case 24:
                strength = 256;
                break;
        }

        return bip39.generateMnemonic(strength);
    }

    static getSanitizedSeedPhrase(seedPhase) {
        return seedPhase.split('\n')[0].trim();
    }

    setSeedPhraseFilePath(pathToFile) {
        if (!fs.existsSync(pathToFile)) {
            throw new Error('cannot find seed file at path');
        }
        this.pathToFile = pathToFile;
    }

    setSeedPhraseFromFile(pathToFile) {
        if (!isNil(pathToFile)) {
            this.setSeedPhraseFilePath(pathToFile);
        }
        try {
            let rawdata = fs.readFileSync(this.pathToFile, {encoding: 'utf8', flag: 'r'});
            // Only get first line of txt file
            // trim beginning and ending of seed phrase
            this.setSeedPhrase(SeedPassword.getSanitizedSeedPhrase(rawdata));
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

    generateSeed(pathToFile, wordLength = 15, showSeed = false) {
        this.setSeedPhraseFilePath(pathToFile);
        console.info('Generating Seed File...');
        if (isNil(this.pathToFile)) {
            throw new Error('File Path not specified!');
        }
        const mnemonic = SeedPassword.getBip39Mnemonic(wordLength);
        if (showSeed) {
            console.info(mnemonic);
        }
        this.setSeedPhrase(mnemonic);
        this.writeSeedFile(mnemonic);
    }

    writeSeedFile() {
        try {
            fs.writeFileSync(this.pathToFile, this.seedPhrase);
            console.info(`Created seed file at: ${this.pathToFile}`);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Validates the mnemonic
     *
     * @param {string} mnemonic
     * @returns {boolean} validity
     */
    validateBip39Mnemonic(mnemonic) {
        return bip39.validateMnemonic(mnemonic);
    }

    setSeedPhrase(seedPhrase) {
        if (isEmpty(seedPhrase)) {
            throw new Error('Cannot set empty seed phrase.');
        }
        if (!isString(seedPhrase)) {
            throw new Error('Seed Phrase must be a string.');
        }
        if (SeedPassword.getSanitizedSeedPhrase(seedPhrase) !== seedPhrase) {
            throw new Error('Seed Phrase must not include line breaks or beginning or ending spaces.');
        }
        this.seedPhrase = seedPhrase;
    }

    get hash() {
        return CryptoJS.SHA3(this.seedPhrase, {outputLength: this.hashLength}).toString();
    }
};
