require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby:{
      url: "https://rinkeby.infura.io/v3/04512b4ef91b490fa1989deac4856bb8",
      accounts: ['2f67b3c4f7fbed2fbb54162a787a44e3388c5bc585ce7079e8dfe7e2743011ba']
    },
    evmosdev:{
      url:"https://eth.bd.evmos.dev:8545",
      accounts: ['59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d']
    }
  }
};
