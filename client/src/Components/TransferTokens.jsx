import React, { useState } from 'react';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const TransferTokens = ({ wallet_address }) => {
  const [recipient_address, setrecipient_address] = useState('');
  const [transfer_amount, settransfer_amount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  const handle = async () => {
    if (!recipient_address || !transfer_amount) {
      setTransactionStatus('Please provide both recipient address and amount.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []); 
      const signer = provider.getSigner(wallet_address); 

      //  transaction details
      const tx = {
        from: wallet_address,  // fromm adddress
        to: recipient_address,
        value: ethers.utils.parseEther(transfer_amount), // Convert amount to Ether
      };

      // Sending transaction
      const transaction_response = await signer.sendTransaction(tx);
      await transaction_response.wait(); // Waiting for transaction to be mined

      setTransactionStatus(`Transaction successful: ${transaction_response.hash}`);
    } catch (error) {
      console.error('Transaction Error:', error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div className="transfer-container">
      <h3 className="transfer-title">Transfer Tokens</h3>
      <h3 className="trans-class">Connnect to sepolia network to transfer</h3>
      <div className="transfer-form">
        <input
          type="text"
          className="input-field"
          placeholder="Recipient Address" 
          value={recipient_address}
          onChange={(e) => setrecipient_address(e.target.value)}
        />
        <input
          type="text"
          className="input-field"
          placeholder="Amount (ETH)"
          value={transfer_amount}
          onChange={(e) => settransfer_amount(e.target.value)}
        />
        <button
          className="transfer-button btn btn-lg px-4 py-2 rounded-pill shadow d-flex align-items-left justify-content-center"
          style={{
            background: 'linear-gradient(90deg, rgba(155,89,182,1) 0%, rgba(142,68,173,1) 100%)',
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            transition: 'transform 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '700px',
            height: '60px',
            borderRadius: '30px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
          }}
          onClick={handle}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '10px' }} />
          Transfer
        </button>
      </div>
      {/*transactionStatus && <p className="transaction-status">{transactionStatus}</p>*/}
    </div>
  );
};

export default TransferTokens;
