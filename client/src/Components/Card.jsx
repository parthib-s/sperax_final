import React from 'react';

const Card = ({ tokenName, tokenSymbol, balance, price, change }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>{tokenName}</h2>
      </div>
      <div className="card-body">
        <p className="token-symbol">
          {price} {tokenSymbol}
        </p>
        <p className="balance">Balance: {balance}</p>
        
      </div>
    </div>
  );
};

export default Card;
