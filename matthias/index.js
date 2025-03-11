const {performance} = require('perf_hooks');
const Blockchain = require('./src/classes/blockchain');
const Transaction = require('./src/classes/transaction');
const KeyPair = require('./src/classes/key-pair');

const keyPair = {
    publicKey: '0467c9205869d234028dd58d7320503a4def9ef1a950a0dd69c48b7a7c564816eca9bb776db638bbd845e809455eba97030cce4ff5dda73999c722137ee00fcbba',
    privateKey: 'e4798c76bb5392626690a1d3c5c471a0d51afe4fa90eee30cba158c1f260786d'
};

const johnKey = new KeyPair();
const janeKey = new KeyPair();

const myKey = KeyPair.getKey(keyPair.privateKey);
const myWalletAddress = KeyPair.getPublicKey(myKey);

const matthiasCoin = new Blockchain();
let miningTimes = [];

// Block 1
miningTimes[matthiasCoin.blockchainLength - 1] = performance.now();
const transaction1 = new Transaction(myWalletAddress, johnKey.publicKey, 60);
transaction1.signTransaction(myKey);
matthiasCoin.addTransaction(transaction1);
matthiasCoin.minePendingTransactions(myWalletAddress);

// Block 2
miningTimes[matthiasCoin.blockchainLength - 1] = performance.now();
const transaction2 = new Transaction(johnKey.publicKey, janeKey.publicKey, 10);
transaction2.signTransaction(KeyPair.getKey(johnKey.privateKey));
matthiasCoin.addTransaction(transaction2);
matthiasCoin.minePendingTransactions(johnKey.publicKey);

miningTimes[matthiasCoin.blockchainLength - 1] = performance.now();

// Results
console.log('\nWallets:');
console.log(`My wallet balance: ${matthiasCoin.getAddressBalance(myWalletAddress)}`);
console.log(`John's wallet balance: ${matthiasCoin.getAddressBalance(johnKey.publicKey)}`);
console.log(`Jane's wallet balance: ${matthiasCoin.getAddressBalance(janeKey.publicKey)}`);

console.log(`\nEntire Blockchain (${matthiasCoin.isChainValid ? 'valid' : 'invalid'}):`);
console.log(matthiasCoin.toJSON());

console.log('\nPerformance');
const miningDiffs = miningTimes.map((time, index) => {
    if (index === 0) {
        return 0;
    }
    return Math.round(time - miningTimes[index - 1]);
});
miningDiffs.forEach((diff, index) => {
    console.log(`${diff / 1000} second(s) on block ${index}`);
});
