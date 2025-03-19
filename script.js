// Grab DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const requestTokensBtn = document.getElementById('requestTokens');
const walletAddressSpan = document.getElementById('walletAddress');
const tokenBalanceSpan = document.getElementById('tokenBalance');
const messageArea = document.getElementById('messageArea');

// Your deployed contract address (replace with your actual deployed one)
const CONTRACT_ADDRESS = "0x0a0dFB73Bfea14b8953dB3B61E3b8e2769C24Ff1";

// Minimal ABI (set of functions your frontend will call)
const CONTRACT_ABI = [
  "function requestTokens() external",
  "function balanceOf(address owner) view returns (uint256)",
  "function lastFaucetRequest(address user) view returns (uint256)",
  "function faucetCooldown() view returns (uint256)",
  "function symbol() view returns (string)"
];

// Global variables
let provider;
let signer;
let contract;
let userAddress;

// Handle wallet connection
async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install MetaMask to use this faucet.");
    return;
  }

  try {
    // Request wallet access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];

    // Display address
    walletAddressSpan.textContent = userAddress;

    // Set up provider/signer/contract
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Load token balance
    const balance = await contract.balanceOf(userAddress);
    tokenBalanceSpan.textContent = ethers.utils.formatEther(balance);

    // Enable request button
    requestTokensBtn.disabled = false;

    // Optional: check cooldown before enabling
    const lastRequest = await contract.lastFaucetRequest(userAddress);
    const cooldown = await contract.faucetCooldown();
    const now = Math.floor(Date.now() / 1000);

    if (now < Number(lastRequest) + Number(cooldown)) {
      const secondsLeft = Number(lastRequest) + Number(cooldown) - now;
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      messageArea.textContent = `⏳ Please wait ${minutes}m ${seconds}s before requesting again.`;
      requestTokensBtn.disabled = true;
    }

  } catch (error) {
    console.error("❌ Wallet connection failed:", error);
    alert("Wallet connection failed. See console.");
  }
}

// Handle token request
async function requestTokens() {
  try {
    messageArea.textContent = "⛏ Requesting tokens...";

    const tx = await contract.requestTokens();
    await tx.wait();

    messageArea.textContent = "✅ Tokens received!";
    
    // Update balance
    const balance = await contract.balanceOf(userAddress);
    tokenBalanceSpan.textContent = ethers.utils.formatEther(balance);
    
    // Disable button after request
    requestTokensBtn.disabled = true;

  } catch (error) {
    console.error("❌ Request failed:", error);
    if (error.message.includes("Please wait before requesting again")) {
      messageArea.textContent = "⏳ You must wait before requesting again.";
    } else {
      messageArea.textContent = "⚠️ Something went wrong. See console.";
    }
  }
}

// Attach event listeners
connectWalletBtn.addEventListener('click', connectWallet);
requestTokensBtn.addEventListener('click', requestTokens);
