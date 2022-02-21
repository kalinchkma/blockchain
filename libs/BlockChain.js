
const Block = require('./block/Block');
const time = require('./time');

class BlockChain {
    constructor() {
        this.blockchain = [this.initGenesisBlock()];
        this.length = 0
    }
    initGenesisBlock() {
        return new Block(time(), "Initial Block in the Chain", "0", this.length);
    }

    latestBlock(){
        return this.blockchain[this.blockchain.length - 1];
    }

    // add new block to the blockchain
    addNewBlock(newBlock){
        newBlock.prevHash = this.latestBlock().hash;
        newBlock.hash = newBlock.computeHash();
        newBlock.index = ++this.length;        
        this.blockchain.push(newBlock);
    }

    checkValidity(){
        const blockLength = this.blockchain.length;
        for(let i = 1; i < blockLength; i++) {
            const currentBlock = this.blockchain[i];
            const nextBlock= this.blockchain[i-1];

            if(currentBlock.hash !== currentBlock.computeHash()) {
                 return false;
            }
            if(currentBlock.prevHash !== nextBlock.hash) {
                 return false;
            }

            return true;
        }
    }
}


module.exports = BlockChain;