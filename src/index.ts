import uniswapPool from './pools/uniswapPool';
const uniswapPooldata = require( './data/uniswapPools.json');

uniswapPool(uniswapPooldata.pools.DAI_USDC);
