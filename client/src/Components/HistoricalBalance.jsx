import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons'; 

// Infura  details for Sepolia and Linea
const INFURA_SEPOLIA_URL = `https://sepolia.infura.io/v3/2b0ce804dbc546da9dfc02da37d76482`;
const LINEA_URL = `https://linea-sepolia.infura.io/v3/2b0ce804dbc546da9dfc02da37d76482`; 

// using binary search to get the block number based on the time stamp providd
async function getHistoricBlockByTimestamp(historicTimestamp, provider) {
  let lowerBound = 0;
  let upperBound = await provider.getBlockNumber();
  let midPoint = 0;
  
  while (lowerBound <= upperBound) {
    midPoint = Math.floor(lowerBound + (upperBound - lowerBound) / 2);
    const blockDetails = await provider.getBlock(midPoint);

    if (!blockDetails) {
      console.log(`Block ${midPoint} not found.`);
      return null;
    }

    console.log(`Checking block ${midPoint}: Timestamp ${blockDetails.timestamp}`);

    if (blockDetails.timestamp === historicTimestamp) {
      return midPoint;
    } else if (blockDetails.timestamp > historicTimestamp) {
      upperBound = midPoint - 1;
    } else {
      lowerBound = midPoint + 1;
    }
  }

  // Returning the closest block
  return midPoint;
}

// Function to fetch the historical balance
async function fetchHistoricalBalance(address, timestamp, provider) {
  try {
    const blockAtTimestamp = await getHistoricBlockByTimestamp(timestamp, provider);

    if (blockAtTimestamp === null) {
      throw new Error('Failed to find a valid block.');
    }

    const blockAtTimestampDetails = await provider.getBlock(blockAtTimestamp);
    console.log(`Using block ${blockAtTimestamp} for timestamp ${timestamp}: Block Timestamp ${blockAtTimestampDetails.timestamp}`);

    const balanceAtTimestampBigNumber = await provider.getBalance(address, blockAtTimestamp);
    const balanceAtTimestamp = ethers.utils.formatEther(balanceAtTimestampBigNumber);
    return balanceAtTimestamp;
  } catch (error) {
    console.error("Error fetching historical balance:", error);
    throw error;
  }
}

function HistoricalBalance({ wallet_address }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [balance, setBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('Sepolia'); // Default network is Sepolia

  useEffect(() => {
    const setupProvider = async () => {
      try {
        let networkProvider;
        if (selectedNetwork === 'Sepolia') {
          networkProvider = new ethers.providers.JsonRpcProvider(INFURA_SEPOLIA_URL);
        } else if (selectedNetwork === 'Linea') {
          networkProvider = new ethers.providers.JsonRpcProvider(LINEA_URL);
        }
        setProvider(networkProvider);
      } catch (error) {
        console.error('Error setting up provider:', error);
        setErrorMessage('Failed to connect to the network.');
      }
    };

    setupProvider();
  }, [selectedNetwork]);

  // Convert date to Unix 
  const getUnixTimestamp = (date) => Math.floor(new Date(date).getTime() / 1000);

  // Fetch balance at  timestamp
  const fetchBalanceAtTimestamp = async () => {
    if (!wallet_address) {
      setErrorMessage('Wallet address is not provided.');
      return;
    }

    if (!selectedDate || !provider) {
      setErrorMessage('Please select a valid date and ensure the provider is set up.');
      return;
    }

    setIsLoading(true);
    try {
      const timestamp = getUnixTimestamp(selectedDate);
      const balanceAtTimestamp = await fetchHistoricalBalance(wallet_address, timestamp, provider);
      setBalance(balanceAtTimestamp);
      setErrorMessage(''); 
    } catch (error) {
      setErrorMessage('Failed to fetch the historical balance.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="historical-balance-container">
      <h2 className="title">Historical Balance</h2>

      {/* Network selection */}
      <div className="input-group">
        <h4>Select Network:</h4>
        <select
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value)}
          className="network-selector"
        >
          <option value="Sepolia">Sepolia</option>
          <option value="Linea">Linea</option>
        </select>
      </div>

      <div className="input-container">
        {/* Date Picker */}
        <div className="input-group">
          <h4>Select Date:</h4>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            placeholderText="Choose a date"
          />
        </div>
      </div>

      <button className="historical-fetch-button" onClick={fetchBalanceAtTimestamp} disabled={!provider}>
      <FontAwesomeIcon icon={faHistory} style={{ marginRight: '8px' }} />
        Fetch Balance
      </button>

      {isLoading && <p>Loading...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {balance !== null && !isLoading && (
        <div className="balance-box">
          <h3>
            Balance on {selectedDate?.toLocaleDateString()}:
          </h3>
          <p>{balance} ETH</p>
        </div>
      )}
    </div>
  );
}

export default HistoricalBalance;
