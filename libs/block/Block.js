const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(current_time, info, prevHash=" ", index=0) {
        this.index = index;
        this.current_time = current_time;
        this.info = info;
        this.prevHash = prevHash;
        this.hash = this.computeHash();
    }

    computeHash() {
        return SHA256(this.info + this.prevHash + this.current_time + JSON.stringify(this.info)).toString();
    }
}

module.exports = Block;