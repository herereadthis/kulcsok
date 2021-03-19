# kulcsok

```bash
nvm use
npm install
```

## Generate password from seed phrase

A hash is random enough to serve a good password. However, it is very heard to memorize, report, or record accurately.
The proposal here is to generate a password via a SHA-3 hash from a seed phrase, since seed phrases are easier to
store accurately. Note: this project does not generate public and private keys from a seed phrase. If you need keypairs,
use npm elliptic.

```bash
// copy+paste /src/secrets/seed-demo.txt as a new file seed.txt, which will be ignored by git
// Paste your seed phrase into that file.
npm run password

// Otherwise, pass the seed phrase as an argument
npm run password 'lorem ipsum sit dolar amet'
```
