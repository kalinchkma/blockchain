
import hashlib

class Block():
    def __init__(self, data, previous_hash) -> None:
        self.hash = hashlib.sha512()
        self.previous_hash = previous_hash
        self.nonce = 0
        self.data = data
    
    def mine(self, difficulty) -> None:
        self.hash.update(str(self).encode('utf-8'))
        while(int(self.hash.hexdigest(), 16) > 2**(512-difficulty)):
            self.nonce += 1
            self.hash = hashlib.sha512()
            self.hash.update(str(self).encode('utf-8'))
            
    
    def __str__(self) -> str:
        return "{}{}{}".format(self.previous_hash.hexdigest(), self.data, self.nonce)
    
