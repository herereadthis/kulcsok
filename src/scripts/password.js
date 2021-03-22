const config = require('config');
const fs = require('fs');
const {isNil} = require('lodash');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');

const SeedPassword = require('./../classes/seed-password');

const SEED_DEMO_PATH = config.get('file_paths.seed_demo');
const SEED_PATH = config.get('file_paths.seed');
const SEED_WORD_LENGTH = config.get('seed_word_length');
const SHA3_HASH_LENGTH = config.get('sha3_hash_length');

const {argv} = yargs(hideBin(process.argv));

const seedPassword = new SeedPassword();
seedPassword.setHashLength(SHA3_HASH_LENGTH);

if (argv.demo) {
    seedPassword.setSeedPhraseFromFile(SEED_DEMO_PATH);
} else if (argv.new) {
    seedPassword.generateSeed(SEED_PATH, SEED_WORD_LENGTH);
} else if (!isNil(process.argv[2])) {
    console.log(process.argv[2]);
    console.log(argv.overwrite);
    seedPassword.setSeedPhrase(process.argv[2]);
    if (argv.overwrite) {
        seedPassword.writeSeedFile();
    }
} else {
    seedPassword.setSeedPhraseFromFile(SEED_PATH);
}

console.log('\nhash');
console.log(seedPassword.hash);
console.log('hash\n');
