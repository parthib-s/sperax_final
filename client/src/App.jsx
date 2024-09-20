import React, { useState, useEffect } from 'react';//import react
import { ethers } from 'ethers';
//import components
import Button from './Components/Button';
import TokenDropdown from './Components/TokenDropdown';
import HistoricalBalance from './Components/HistoricalBalance'; 
import Card from './Components/Card';
import './App.css';
import HistoricalPriceChart from './Components/HistoricalPriceChart'; 
import TransferTokens from './Components/TransferTokens';
import TokenAllowance from './Components/TokenAllowance'; 
import AOS from 'aos';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import 'aos/dist/aos.css'; // Import the AOS styles
//adding to git
AOS.init({
  duration: 1200, // Duration of the animation
});
//define the apis fetched with my infura key
const SEPOLIA_INFURA_API = "https://sepolia.infura.io/v3/3214da0098d94446a08ac556b4ee9142";
const LINEA_SEPOLIA_API = "https://linea-sepolia.infura.io/v3/2b0ce804dbc546da9dfc02da37d76482";
const ARBITRUM_SEPOLIA_API="https://arbitrum-sepolia.infura.io/v3/2b0ce804dbc546da9dfc02da37d76482";
const ARBITRUM_MAIN_API="https://arbitrum-mainnet.infura.io/v3/2b0ce804dbc546da9dfc02da37d76482";
import tokenSymbols from './Components/tokenSymbols'; // Import the token symbols mapping
const POLYGON_TOKEN_ADDRESS = "0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6";
const STARKNET_TOKEN_ADDRESS="0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766";
const ETHEREUM_MAINNET_API = "https://mainnet.infura.io/v3/2b0ce804dbc546da9dfc02da37d76482";
const ARB_TOKEN_ADDRESS = '0x912CE59144191C1204E64559FE8253a0e49E6548';
// ABI for ERC-20 tokens
const minABI = [
  // balanceOf function from ERC-20 standard
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];
function App() {
  const [wallet_address, setwallet_address] = useState('');
  const [error_message, seterror_message] = useState('');
  const [token_balances, settoken_balances] = useState({
    ethereum: '',
    bitcoin: '',
    linea: '',
    arbitrum: '',
  });
  const [selectedTokens, setSelectedTokens] = useState(['ethereum','arbitrum','polygon']);//deefult on screen when connecte to wallet update with balance
  const [selectedToken, setSelectedToken] = useState('arbitrum');

  // Function to request MetaMask account
  async function requestAccount() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setwallet_address(address);
        seterror_message('');
      } catch (error) {
        console.error('Error:', error);
        seterror_message(`Error connecting to MetaMask: ${error.message}`);
        setwallet_address('');
      }
    } else {
      seterror_message('MetaMask not detected');
    }
  }

  // Function to fetch Ethereum balance
  async function fetch_ethereum(address) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_INFURA_API);
      const balance = await provider.getBalance(address);
      const final_balance = ethers.utils.formatEther(balance);
      settoken_balances(prevState => ({ ...prevState, ethereum: final_balance }));
    } catch (error) {
      console.error('Error fetching Ethereum balance:', error);
      seterror_message('Failed to fetch Ethereum balance');
    }
  }

  // Function to fetch Linea Sepolia balance
  async function fetch_linea(address) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(LINEA_SEPOLIA_API);
      const balance = await provider.getBalance(address);
      const final_balance = ethers.utils.formatEther(balance);
      settoken_balances(prevState => ({ ...prevState, linea: final_balance }));
    } catch (error) {
      console.error('Error fetching Linea Sepolia balance:', error);
      seterror_message('Failed to fetch Linea Sepolia balance');
    }
  }

  // Function to fetch Polygon balance
  async function fetch_polygon(address) {
    try {
      // Create a provider connected to the Infura Ethereum Mainnet endpoint
      const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_MAINNET_API);
      
      // Create a contract instance for the Polygon token
      const contract = new ethers.Contract(POLYGON_TOKEN_ADDRESS, minABI, provider);
      
      // Fetch the balance of the token for the given address
      const balance = await contract.balanceOf(address);
      
      // Convert balance from wei to ether
      const final_balance = ethers.utils.formatUnits(balance, 18); 
      
      // Set the balance in the component state
      settoken_balances(prevState => ({ ...prevState, polygon: final_balance }));
      seterror_message(''); 
    } catch (error) {
      console.error('Error fetching Polygon token balance:', error);
      seterror_message('Failed to fetch Polygon token balance');
    }
  }
  
  async function fetch_starknet(address) {
    try {
      // Create a provider connected to the Infura Ethereum Mainnet endpoint
      const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_MAINNET_API);
      
      // Create a  instance for the Starknet token using the STARKNET_TOKEN_ADDRESS
      const contract = new ethers.Contract(STARKNET_TOKEN_ADDRESS, minABI, provider);
      
      // Fetch the balance  for the given address
      const balance = await contract.balanceOf(address);
      
      // Convert balance from wei to ether
      const final_balance = ethers.utils.formatUnits(balance, 18); 
      
      // Updating the balance in the component 
      settoken_balances(prevState => ({ ...prevState, starknet: final_balance }));
      seterror_message('');
    } catch (error) {
      console.error('Error fetching Polygon token balance:', error);
      seterror_message('Failed to fetch Polygon token balance');
    }
  }
    async function fetcharbitrum(address) {
  try {
    // Create a provider connected to the Infura Arbitrum One endpoint
    const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_MAIN_API);
    
    // use token address to create instance
    const contract = new ethers.Contract(ARB_TOKEN_ADDRESS, minABI, provider);
    
    // Fetch the balance of the ARB token 
    const balance = await contract.balanceOf(address);
    
    // Convert balance from wei to ether
    const final_balance = ethers.utils.formatUnits(balance, 18); // 18 decimal
    
    // Set the balance in the component state
    settoken_balances(prevState => ({ ...prevState, arbitrum: final_balance }));
    seterror_message('');
  } catch (error) {
    console.error('Error fetching ARB balance:', error);
    seterror_message('Failed to fetch ARB balance');
  }
}


async function fetch24hPriceChange(tokenId) {
  try {
    // Use CoinGecko API to get the token data, tokenId like 'ethereum', 'arbitrum'
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`
    );

    const priceChange = response.data[tokenId]?.usd_24h_change;
    return priceChange ? priceChange.toFixed(2) : null; //2 decimal place
  } catch (error) {
    console.error('Error fetching 24h price change:', error);
    return null; 
  }
}


  // Handle token selection from the dropdown
  const handle = (event) => {
    const token = event.target.value;
    if (!selectedTokens.includes(token)) {
      setSelectedTokens(prevTokens => [...prevTokens, token]);
    }
  };

  // Use useEffect to trigger balance fetch whenever selectedTokens or wallet_address changes
  useEffect(() => {
    if (wallet_address && selectedTokens.length > 0) {
      selectedTokens.forEach(token => {
        switch (token) {
          case 'ethereum':
            fetch_ethereum(wallet_address);
            break;
          case 'polygon':
            fetch_polygon(wallet_address,"0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6");
            break;
          case 'linea':
            fetch_linea(wallet_address);
            break;
          case 'arbitrum':
            fetcharbitrum(wallet_address);
            break;
          case 'starknet':
            fetch_starknet(wallet_address);
            break;
          default:
            break;
        }
    });
  }
}, [selectedTokens, wallet_address]); // Runs when either selectedTokens or wallet_address changes

  return (
    <div className="App">
      <div class="welcome-container">
        <h1 class="welcome-text">
          Welcome to the world of crypto
        </h1>
      </div>
      <div className="button-and-message-container">
        <div className="button-container">
          <Button onClick={requestAccount} />
        </div>
        <div className="message-container">
          {wallet_address && (
            <h3 className="success-message">
              <i className="fas fa-check-circle"></i> Account connected successfully
            </h3>
          )}
          {error_message && (
            <h3 className="error-message">
              {error_message}
            </h3>
          )}
        </div>
      </div>

      <h3 className="gradient-text">Add token to watchlist</h3>
      <TokenDropdown onChange={handle} />

      <div className="cards-container"  data-aos="fade-up">
        {selectedTokens.map(token => (
          <Card
            key={token}
            tokenName={token.charAt(0).toUpperCase() + token.slice(1)}
            tokenSymbol={tokenSymbols[token] || token.toUpperCase()}
            balance={token_balances[token] || 'Fetching...'}
           
          />
        ))}
      </div>
      {/* Historical Balance Component */}
      
      <div className="historical-container " data-aos="zoom-in">
          <HistoricalBalance wallet_address={wallet_address} />
        </div>
        <div className="heading-wrapper">
          <h3><span>Crypto Currency Historical Data </span></h3>
      </div>
      <div className="historical-price-chart-container" data-aos="zoom out">
        <HistoricalPriceChart selectedToken={selectedToken} />
      </div>
      <div className="transfer-section" data-aos="zoom-in">
        <TransferTokens wallet_address={wallet_address} />
      </div>
      <div className="token-allowance-section" data-aos="zoom-in" >
        <TokenAllowance wallet_address={wallet_address} />
      </div>
    </div>
  );
}

export default App;
