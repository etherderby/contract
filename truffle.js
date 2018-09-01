
require('babel-register');
require('babel-polyfill');

var HDWalletProvider = require("truffle-hdwallet-provider")

// secrets only needed for mainnet and rinkeby
var secrets
try {
  secrets = require('./secrets.json')
} catch (err) {
  // do nothing
}


module.exports = {
  networks: {
    dev: {
      host: "localhost",
      port: 7545,
      network_id: "*",
      gas: 7000000,
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(secrets.mnemonic, `https://rinkeby.infura.io/v3/${secrets.infura_token}`)
      },
      network_id: 4,
      gas: 7000000,
    },
    mainnet: {
      provider: function() { 
        return new HDWalletProvider(secrets.mnemonic, `https://mainnet.infura.io/v3/${secrets.infura_token}`) 
      },
      network_id: '1',
      gas: 7000000,
      gasPrice: 10000000000,
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

