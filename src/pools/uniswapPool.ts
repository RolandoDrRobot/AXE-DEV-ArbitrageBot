
require('dotenv').config();
import { ethers } from 'ethers';
import { Pool } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';

const IUniswapV3Pool = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json');
const IUniswapV3PoolABI = IUniswapV3Pool.abi;

interface Immutables {
  factory: string
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: ethers.BigNumber
}

interface State {
  liquidity: ethers.BigNumber
  sqrtPriceX96: ethers.BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

interface PoolParams {
  address: string,
  chainId: number,
  tokenASymbol: string,
  tokenADecimals: number,
  tokenBSymbol: string,
  tokenBDecimals: number
}

async function uniswapPool(poolParams:PoolParams){
  console.log(poolParams);
  const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
  const poolContract = new ethers.Contract(poolParams.address, IUniswapV3PoolABI, provider);

  async function getPoolImmutables() {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ])
  
    const immutables:Immutables = {
      factory,
      token0,
      token1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    }
    return immutables
  }
  
  async function getPoolState() {
    const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])
  
    const PoolState: State = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    }
    return PoolState
  }

  const [immutables, state] = await Promise.all([getPoolImmutables(), getPoolState()])

  const TokenA = new Token(poolParams.chainId, immutables.token0, poolParams.tokenADecimals, poolParams.tokenASymbol, poolParams.tokenASymbol)
  const TokenB = new Token(poolParams.chainId, immutables.token1, poolParams.tokenBDecimals, poolParams.tokenBSymbol, poolParams.tokenBSymbol)

  const pool = new Pool(
    TokenA,
    TokenB,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  )

  
  const token0Price = pool.token0Price.toSignificant(6);
  const token1Price = pool.token1Price.toSignificant(6);
  console.log(token0Price);
  console.log(token1Price);
}

export default uniswapPool;
