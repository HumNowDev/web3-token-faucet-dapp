require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

console.log("Private key length:", process.env.PRIVATE_KEY.length);

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
