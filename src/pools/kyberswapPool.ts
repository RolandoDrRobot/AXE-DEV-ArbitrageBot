require('dotenv').config();
const Web3 = require('web3');
const abis = require('../data/abis');

const web3 = new Web3(
  // Ponemos el Provider para inicializar web 3
  new Web3.providers.WebsocketProvider(process.env.WS_INFURA_URL)
);

async function kyberswapPool(pool:any, kyberNetworkProxy:any) {
  const kyber = new web3.eth.Contract(
    abis.kyber.kyberNetworkProxy,
    kyberNetworkProxy
  );

  let ethPrice:any;
  const updatePrice = async () => {
    const results = await kyber
      .methods
      .getExpectedRate(
        pool.tokenAAddress,
        pool.tokenBAddress,
        1
      )
      .call();

    // We enter as param eth unit -> so we got how much wei It is
    const ONE_ETH_WEI = web3.utils.toBN(web3.utils.toWei('1'));
    // Here we do the necessary conversion to have a readable ETH price
    ethPrice = web3.utils.toBN('1').mul(web3.utils.toBN(results.expectedRate)).div(ONE_ETH_WEI);
    console.log(ethPrice.toString());
  }
  await updatePrice();
  // Actualizamos la variable ethPrice cada 15 segundos
  setInterval(updatePrice, 15000);

}

export default kyberswapPool;
