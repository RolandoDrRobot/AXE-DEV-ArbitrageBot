require('dotenv').config();
import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
} from '@dynamic-amm/sdk';

async function kyberswapPool() {
  // DMM Factory Address if using Ethereum Mainnet
  const DMMFactoryAddress = '0x833e4083B7ae46CeA85695c4f7ed25CDAd8886dE';
  
  const DAI = new Token(
    ChainId.MAINNET,
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    18,
  );
  const pools = await Fetcher.fetchPairData(
    DAI,
    WETH[DAI.chainId],
    DMMFactoryAddress,
  );
  
  const route = new Route(pools, WETH[DAI.chainId]);
  
  const trade = new Trade(
    route,
    new TokenAmount(WETH[DAI.chainId], '1000000000000000000'),
    TradeType.EXACT_INPUT,
  );
  
  console.log(trade.executionPrice.toSignificant(6));
  console.log(trade.nextMidPrice.toSignificant(6));
}

export default kyberswapPool;