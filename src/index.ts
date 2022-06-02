import uniswapPool from './pools/uniswapPool';
import kyberswapPool from './pools/kyberswapPool';
const { mainnet: addresses } = require('./data/addresses');

kyberswapPool(addresses.tokens.pools.DAI_ETH, addresses.kyber.kyberNetworkProxy);
