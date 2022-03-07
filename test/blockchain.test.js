const cryptoHash = require('../utils/crypto-hash');
const Blockchain = require('../blockchain/blockchain');
const Block = require('../blockchain/block');

describe('Blockchain', () => {

    let blockchain, newChain, originalChain;

    // foreach test
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
    })

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toEqual(true);
    });

    it('starts wtih genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = "hello";
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {

        beforeEach(() => {
            blockchain.addBlock({data: 'hunter'});
            blockchain.addBlock({data: 'narumi'});
            blockchain.addBlock({data: 'valorent'});
        })

        describe('when the chain does not with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = {data: 'fake-genesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the genesis block and has multiple blocks', () => {

            describe('and a lastHash reference hash changed', () => {
                it('returns false', () => {

                    blockchain.chain[2].lastHash = 'broken lastHash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

                });
            });

            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', () => {
                
                    blockchain.chain[2].data = 'bad data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

                });
            });

            describe('and the chain does not contain any invalid blocks', () => {
                it('returns true', () => {

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });

            describe('and the chain contains a block with a jumped difficulty', () => {
                it('returns false', () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

                    const badBlock = new Block({ timestamp, lastHash, hash, nonce, difficulty, data });

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
        });
    });

    describe('replaceChain()', () => {
        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        })

        describe('when the new chain is not longer', () => {

            beforeEach(() => {
                newChain.chain[0] = {new: 'chain'};

                blockchain.replaceChain(newChain.chain);
            })

            it('does not replace the chain', () => {
               
                expect(blockchain.chain).toEqual(originalChain);
            });
            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            })
        });
        describe('when the new chain is longer', () => {

            beforeEach(() => {
                newChain.addBlock({data: 'hunter'});
                newChain.addBlock({data: 'narumi'});
                newChain.addBlock({data: 'valorent'});
            });

            describe('and the chain is invalid', () => {

                beforeEach(() => {
                    newChain.chain[2].hash = 'some-fake- hash';

                    blockchain.replaceChain(newChain.chain);

                })

                it('does not replace the chain', () => {
                   
                    expect(blockchain.chain).toEqual(originalChain);
                });


                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                })
            });
            describe('and the chain is valid', () => {

                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });

                it('replaces the chain', () => {
                   
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about the chain replacement', ()=>{
                    expect(logMock).toHaveBeenCalled();
                })
            });
        });
    });


});