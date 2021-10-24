const {expect} = require('chai');

const config = require('config');

const SeedPassword = require('../src/classes/seed-password');

const SHA3_HASH_LENGTH = config.get('seed_password.sha3_hash_length');

describe('SeedPassword', () => {
    describe('instantiation', () => {
        it('have set defaults', () => {
            const seedPassword = new SeedPassword();
            // console.log(seedPassword.seedPhrase);
            // console.log(seedPassword.hashLength);
            expect(seedPassword.hashLength).to.equal(SHA3_HASH_LENGTH);
            // expect(seedPassword.encoding).to.equal('utf8');
        });
    });
});