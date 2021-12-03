const config = require('config');
// const fs = require('fs');
const {isNil} = require('lodash');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');

const SeedPassword = require('./../classes/seed-password');

const SEED_DEMO_PATH = config.get('file_paths.seed_demo');

const {argv} = yargs(hideBin(process.argv));

let seedPassword;

if (argv.demo) {
    seedPassword = new SeedPassword({pathToFile: SEED_DEMO_PATH});
    seedPassword.setSeedPhraseFromFile();
} else if (argv.new) {
    seedPassword = new SeedPassword();
    seedPassword.writeNewSeed();
} else if (!isNil(process.argv[2])) {
    seedPassword = new SeedPassword();
    seedPassword.setSeedPhraseManually(process.argv[2]);
    if (argv.overwrite) {
        seedPassword.writeSeedFile();
    }
} else {
    seedPassword = new SeedPassword();
    seedPassword.setSeedPhraseFromFile();
}

console.log('\nseedphrase', `<${seedPassword.seedPhrase}>`);
console.log('hash', `<${seedPassword.hash}>`, '\n');
