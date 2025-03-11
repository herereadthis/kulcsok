const sha256 = require('crypto-js/sha256');
const dayjs = require('dayjs');

module.exports = class Block {

    /**
     * @param {Date} timestamp
     * @param {Transaction[]} transactions
     * @param {string} previousHash
     */
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = Block.getTimestamp(timestamp);
        this.transactions = transactions;
        // The hash of the block will change if you change the contents of the
        // block. Nonce value is a random number that has nothing to do with
        // the contents of the block.
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    static getTimestamp(timestamp) {
        if (!dayjs(timestamp).isValid()) {
            throw new Error('invalid date!');
        }
        return dayjs(timestamp).format();
    }

    /**
     * Get SHA256 hash of all data in this block.
     *
     * @returns {string}
     */
    calculateHash() {
        return sha256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    /**
     *
     * Mining is computationally intensive as it has to calculate hashes until
     * it has enough preceding zeros.
     *
     * @param {number} difficulty
     */
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            // keep figuring out new hashes until arrive at one with a number of zeros equal to difficulty
            this.hash = this.calculateHash();
        }
    }

    /**
     * Checks to make sure all transactions in the block are valid.
     *
     * @returns {boolean}
     */
    get hasValidTransactions() {
        return this.transactions.every(tx => tx.isValid);
    }

    /**
     * Return a JSON-formatted block with all data. Can be used as backup.
     *
     * @returns {object}
     */
    toJSON() {
        const {
            timestamp,
            transactions,
            previousHash,
            hash,
            nonce
        } = this;
        return {
            timestamp,
            transactions: transactions.map(t => t.toJSON()),
            previousHash,
            hash,
            nonce
        };
    }
};
