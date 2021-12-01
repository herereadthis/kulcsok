# kulcsok

```bash
nvm use
npm install
// At this point, you no longer need the Internets. If you are using this repo
// for serious business, then disconnect your machine from the Internets.
```

## How to get a seed (mnemonic) phrase

It really can be anything you want. However, you are never as random as you think you are. If you want a generated seed
phrase, try

## Generate password from seed phrase

A hash is random enough to serve as a good password. However, they are very difficult to memorize, input, or record
accurately. The proposal here is to generate a password via a SHA-3 hash from a seed phrase, since seed phrases are
easier to store accurately. Note: this project does not generate public and private keys from a seed phrase. If you need
keypairs, use npm [elliptic](https://www.npmjs.com/package/elliptic).

```bash
// demo to see it in action. It will use ./secrets/secret-demo.txt
npm run password:demo

// Generate a brand new password. Seed phrase is stored in seed.txt, which is
// ignored via .gitignore
npm run password:new

// Retrieve the password based on stored seed file. Idempotent as long as seed
// file does not change
npm run password

// Otherwise, pass the seed phrase as an argument.
// This manual operation will not save the seed phrase to file.
npm run password 'my secret phrase has many words'

// Overwrite seed.txt file if you want to store the seed phrase
npm run password -- 'my secret phrase has many words' --overwrite
```

**Why not just use `bip39` to generate hashes?** While everything here is a NodeJS app, it should not have to be. The
secrets generated from this package are intended to last forever, so we must rely on stuff that can be recalled
potentially decades from now. The scripts in this package are just using SHA-3 for generating hashes, and AES for
encryption. Both of these standards are approved by the National Institutes of Standards and Technology (NIST).

Even if the npm packages are no longer maintained (or NodeJS itself dies), you should still be able to use those
standards to recover your secrets. Just do all the work again in COBOL, or Scala, or whatever they are using in the
year 2036. If we were to rely on bip39, then your secrets will become subject to the whims of those working on bip39,
assuming that the project even lasts as long as we need it to.

## Encrypt

```bash
// See it in action
npm run encrypt:demo

// Manually do it
npm run encrypt 'myPass1234' 'This is my secret message'

// Past your .yml or .json file for secrets
```

## Decrypt

```bash
// See it in action
npm run decrypt:demo
```
