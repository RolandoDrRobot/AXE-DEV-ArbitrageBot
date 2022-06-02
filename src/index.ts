import uniswapPool from './pools/uniswapPool';
import kyberswapPool from './pools/kyberswapPool';
const { mainnet: addresses } = require('./data/addresses');

kyberswapPool(addresses.tokens.pools.USDC_ETH, addresses.kyber.kyberNetworkProxy);
