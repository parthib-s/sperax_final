import React from 'react';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons'; // Import the desired icon

const Button = ({ onClick }) => {
  return (
    <button
      className="btn btn-lg px-4 py-2 rounded-pill shadow d-flex align-items-left justify-content-center"
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
        marginBottom:'20px'
      }}
      onClick={onClick}
      onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
      onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
    >
      <FontAwesomeIcon icon={faWallet} style={{ marginRight: '10px', fontSize: '1.5rem' }} />
      Connect Wallet
    </button>
  );
};

export default Button;
