//writing the necessary imports
import React, { useState } from 'react';
import { ethers } from 'ethers';
import TokenDropdown from './TokenDropdown'; 
import './TokenAllowance.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';

//defining the minABI for ERC 20 tokens
const minABI = [
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    type: "function",
  },
];


//URL with the help of my infura key
const LINEA_SEPOLIA_API = "https://linea-mainnet.infura.io/v3/2b0ce804dbc546da9dfc02da37d76482";
const ETHEREUM_SEPOLIA_API = "https://sepolia.infura.io/v3/3214da0098d94446a08ac556b4ee9142";
const ETHEREUM_MAINNET_API="https://mainnet.infura.io/v3/2b0ce804dbc546da9dfc02da37d76482";

  
// Function to fetch Linea allowance
const fetchLineaAllowance = async (wallet_address, spenderAddress) => {
   //linea is fetched from the linea sepollia network hence using the LINEA_SEPOLIA_API
    //we pass the token address of the linea to the contract
    //use the ethers.Contract to get the contract variablee
    try {
        const provider = new ethers.providers.JsonRpcProvider(LINEA_SEPOLIA_API);
        const contract = new ethers.Contract('0xd83af4fbD77f3AB65C3B1Dc4B38D7e67AEcf599A', minABI, provider); 
        const allowanceInWei = await contract.allowance(wallet_address, spenderAddress);
        const finalAllowance = ethers.utils.formatUnits(allowanceInWei, 18);
        return finalAllowance;
      } catch (error) {
        console.error('Error fetching Ethereum allowance:', error); 
        throw new Error('Failed to fetch Ethereum allowance.');
      }
};

// Function to fetch Ethereum Sepolia allowance
const fetchEthereumAllowance = async (wallet_address, spenderAddress) => {
     //sepollia is fetched from the ethereum sepollia network hence using the ETHEREUM_SEPOLIA_API
    //we pass the token address of the sepoliaeth to the contract
    //use the ethers.Contract to get the contract variablee
    try {
      const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_SEPOLIA_API);
      const contract = new ethers.Contract('0xcbAcE4cfC965efA06Cd7C64f8dcd733d5e2B37A3', minABI, provider); 
      const allowanceInWei = await contract.allowance(wallet_address, spenderAddress);
      const finalAllowance = ethers.utils.formatUnits(allowanceInWei, 18); 
      return finalAllowance;
    } catch (error) {
      console.error('Error fetching Ethereum allowance:', error); 
      throw new Error('Failed to fetch Ethereum allowance.');
    }
  };
  

// Function to fetch Arbitrum allowance
const fetchArbitrumAllowance = async (wallet_address, spenderAddress) => {
   //arbiitrum is fetched from the ethereum mmainnet hence using the ETHEREUM_MAINNET_API
    //we pass the token address of the arbitrum to the contract
    //use the ethers.Contract to get the contract variablee
  try {
    const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_MAINNET_API);
    const contract = new ethers.Contract('0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1', minABI, provider);
    const allowanceInWei = await contract.allowance(wallet_address, spenderAddress); 
    const finalAllowance = ethers.utils.formatUnits(allowanceInWei, 18); 
    return finalAllowance;
  } catch (error) {
    console.error('Error fetching Ethereum allowance:', error); 
    throw new Error('Failed to fetch Arbitrum allowance.');
  }

};

// Function to fetch Polygon allowance
const fetchPolygonAllowance = async (wallet_address, spenderAddress) => {
  try {
    //polygon is fetched from the ethereum mmainnet hence using the ETHEREUM_MAINNET_API
    //we pass the token address of the pollygon to the contract
    //use the ethers.Contract to get the contract variablee
    const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_MAINNET_API);
    const contract = new ethers.Contract('0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6', minABI, provider); 
    const allowanceInWei = await contract.allowance(wallet_address, spenderAddress);
    const finalAllowance = ethers.utils.formatUnits(allowanceInWei, 18);
    return finalAllowance;
  } catch (error) {
    console.error('Error fetching Ethereum allowance:', error);
    throw new Error('Failed to fetch Polygon allowance.');
  }
};

const TokenAllowance = ({ wallet_address }) => {
  const [spenderAddress, setSpenderAddress] = useState('');
  const [allowance, setAllowance] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [allowanceClass, setAllowanceClass] = useState(''); 

  //handle sets the value of the selected token state andd iis passed as the onchange to the Tokendropdown
  const handle = (event) => {
    setSelectedToken(event.target.value);
    console.log('Selected Token:', event.target.value);
  };

  //dependiing on the selectedToken tthe appropriate function is called
  const fetchTokenAllowance = async () => {
    if (!wallet_address || !spenderAddress || !selectedToken) {
      setErrorMessage('Please connect your wallet, select a token, and enter a valid spender address.');
      return;
    }

    try {
      let finalAllowance;
      switch (selectedToken) {
        case 'ethereum':
          finalAllowance = await fetchEthereumAllowance(wallet_address, spenderAddress);
          break;
        case 'arbitrum':
          finalAllowance = await fetchArbitrumAllowance(wallet_address, spenderAddress);
          break;
        case 'polygon':
          finalAllowance = await fetchPolygonAllowance(wallet_address, spenderAddress);
          break;
        case 'linea':
          finalAllowance = await fetchLineaAllowance(wallet_address, spenderAddress);
          break;
        case 'starknet':
          finalAllowance = await fetchLineaAllowance(wallet_address, spenderAddress);
          break;
        default:
          setErrorMessage('Selected token is not supported.');
          return;
      }

      setAllowance(finalAllowance);
      setErrorMessage('');
      // Trigger effect when allowance is fetched
      setAllowanceClass('highlight'); 
      setTimeout(() => setAllowanceClass(''), 500);
    } catch (error) {
      console.error('Error fetching allowance:', error);
      setErrorMessage('Failed to fetch allowance.');
    }
  };

  return (
    <div className="token-allowance">
      <h3 className="headingtemp">     Token Allowance</h3>
      <div className="input-group">
        <label>Token:</label>
        <TokenDropdown onChange={handle} />
      </div>
      <div className="input-group">
        <label>Spender Address:</label>
        <input
          type="text"
          value={spenderAddress}
          onChange={(e) => setSpenderAddress(e.target.value)}
          placeholder="Enter spender address"
        />
      </div>
      <button onClick={fetchTokenAllowance}><FontAwesomeIcon icon={faCoins}/> Fetch Allowance</button>
      {allowance && (
        <div className="allowance-display">
          <h3>Allowance:</h3>
          <p>{allowance}{selectedToken.charAt(0).toUpperCase() + selectedToken.slice(1)} Tokens</p>
        </div>
      )}
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default TokenAllowance;
