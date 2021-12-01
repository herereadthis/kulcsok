const config = require('config');
// const fs = require('fs');
const {isNil} = require('lodash');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');

const SeedPassword = require('./../classes/seed-password');

const SEED_DEMO_PATH = config.get('file_paths.seed_demo');
const SEED_PATH = config.get('file_paths.seed');
const BIP39_WORD_LENGTH = config.get('bip39_word_length');

const {argv} = yargs(hideBin(process.argv));

let hash;

if (argv.demo) {
    const seedPassword = new SeedPassword({pathToFile: SEED_DEMO_PATH});
    seedPassword.setSeedPhraseFromFile();
    hash = seedPassword.hash;
} else if (argv.new) {
    const seedPassword = new SeedPassword();
    seedPassword.writeNewSeed();
    hash = seedPassword.hash;
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
console.log(hash);
console.log('hash\n');
