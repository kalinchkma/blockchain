from chain import Chain

blockChain = Chain(20)

lists = ['hunter', 'nanashi', 'collins']

for item in lists:
    blockChain.add_to_pool(item)
    blockChain.mine()
