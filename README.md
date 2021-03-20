# kulcsok

```bash
nvm use
npm install
```

## Generate password from seed phrase

A hash is random enough to serve as a good password. However, they are very difficult to memorize, input, or record
accurately. The proposal here is to generate a password via a SHA-3 hash from a seed phrase, since seed phrases are
easier to store accurately. Note: this project does not generate public and private keys from a seed phrase. If you need
keypairs, use npm [elliptic](https://www.npmjs.com/package/elliptic).

```bash
// copy+paste /src/secrets/seed-demo.txt as a new file, named seed.txt
// seed.txt will be ignored by git
// Paste your seed phrase into that file.
npm run password

// Otherwise, pass the seed phrase as an argument
npm run password 'lorem ipsum sit dolar amet'
```
