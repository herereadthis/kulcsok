const {expect} = require('chai');

const config = require('config');

const SeedPassword = require('../src/classes/seed-password');

const SHA3_HASH_LENGTH = config.get('seed_password.sha3_hash_length');

describe('SeedPassword', () => {
    describe('constructor', () => {
        it('have set defaults', () => {
            const seedPassword = new SeedPassword();
            // console.log(seedPassword.seedPhrase);
            // console.log(seedPassword.hashLength);
            expect(seedPassword.hashLength).to.equal(SHA3_HASH_LENGTH);
            // expect(seedPassword.encoding).to.equal('utf8');
        });
    });

    describe('SeedPassword.getSanitizedSeedPhrase()', () => {
        it('strips spaces', () => {
            const phrase = 'lorem ipsum';
            const paddedPhrase = ` ${phrase} `;
            const result = SeedPassword.getSanitizedSeedPhrase(paddedPhrase);
            expect(result).to.equal(phrase);
        });
    });

    describe('setSeedPhrase()', () => {
        let seedPassword;

        beforeEach(() => {
            seedPassword = new SeedPassword();
        });

        it('sets seed phrase', () => {
            const seedPhrase = 'lorem ipsum sit dolor amet';

            seedPassword.setSeedPhrase(seedPhrase);

            expect(seedPassword.seedPhrase).to.equal(seedPhrase);
        });

        it('sets fails with no phrase', () => {
            expect(() => {
                seedPassword.setSeedPhrase();
            }).to.throw(Error);
        });

        it('fails if phrase is not a string', () => {
            expect(() => {
                seedPassword.setSeedPhrase(1234);
            }).to.throw(Error);
            expect(() => {
                seedPassword.setSeedPhrase({foo: 'bar'});
            }).to.throw(Error);
            expect(() => {
                seedPassword.setSeedPhrase(['asdf']);
            }).to.throw(Error);
            expect(() => {
                seedPassword.setSeedPhrase(' spaces ');
            }).to.throw(Error);
        });

        it('fails if phrase has extra spaces', () => {
            expect(() => {
                seedPassword.setSeedPhrase(' spaces ');
            }).to.throw(Error);
        });
    });

    describe('setSeedPhraseFilePath()', () => {
        let seedPassword;

        beforeEach(() => {
            seedPassword = new SeedPassword();
        });

        it('sets path', () => {
            seedPassword.setSeedPhraseFilePath('./index.js');
            // expect(() => {
            //     seedPassword.setSeedPhrase(' spaces ');
            // }).to.throw(Error);
            expect(seedPassword.pathToFile).to.equal('./index.js');
        });

        it('throws error on missing file', () => {
            expect(() => {
                seedPassword.setSeedPhraseFilePath('foo.js');
            }).to.throw(Error);
        });
    });
});