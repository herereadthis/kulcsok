const sha256 = require('crypto-js/sha256');
const {isNil, isEmpty, isFinite} = require('lodash');
const {ec: EC} = require('elliptic');
const ec = new EC('secp256k1');

class Transaction {

    /**
     * @param {string} fromAddress
     * @param {string} toAddress
     * @param {string} amount
     */
    constructor(fromAddress, toAddress, amount) {
        if (!isFinite(amount) || amount < 0) {
            throw new Error('Invalid transaction amount!');
        }

        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    /**
     * Create the SHA256 hash of the transaction.
     * Later, use this hash to sign with the private key.
     *
     * @returns {string}
     */
    calculateHash() {
        return sha256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    /**
     * signing key should have keypair
     * Sign a transaction with signing key, which is an Elliptic keypair that
     * contains a public and private key. The signature will be added to the
     * transaction instance, and ultimately, the blockchain
     *
     * @param {string} signingKey
     */
    signTransaction(signingKey) {
        // The fromAddress is a public key. It should match the public key of
        // the signing key.
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        // hash of the transaction
        const transactionHash = this.calculateHash();
        const signature = signingKey.sign(transactionHash, 'base64');
        // store the signature onto the transaction instance.
        this.signature = signature.toDER('hex');
    }


    /**
     * Check to see if the signature is valid.
     * Mining rewards are automatically valid.
     *
     * @returns {boolean}
     */
    get isValid() {
        // mining a block gets a reward that is automatically valid, but it
        // comes from the system. hence, null address.
        if (isNil(this.fromAddress)) {
            return true;
        }

        // check to see if the transaction has been signed
        if (isEmpty(this.signature)) {
            throw new Error('No signature in this transaction');
        }

        // check to see if the transaction was signed by the key
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature)

    }

    /**
     * Return a JSON-formatted transaction with all data. Can be used as backup.
     *
     * @returns {object}
     */
    toJSON() {
        const {
            fromAddress,
            toAddress,
            amount,
            signature
        } = this;
        return {
            fromAddress,
            toAddress,
            amount,
            signature
        };
    }
}


module.exports = Transaction;
