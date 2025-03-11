const {ec: EC} = require('elliptic');
const ec = new EC('secp256k1');

class KeyPair {
    constructor() {
        const key = ec.genKeyPair();
        this.publicKey = key.getPublic('hex');
        this.privateKey = key.getPrivate('hex');
    }

    static getKey(privateKey) {
        return ec.keyFromPrivate(privateKey);
    }

    static getPublicKey(key) {
        return key.getPublic('hex');
    }

    toJSON() {
        return {
            publicKey: this.publicKey,
            privateKey: this.privateKey
        };
    }
}

module.exports = KeyPair;
