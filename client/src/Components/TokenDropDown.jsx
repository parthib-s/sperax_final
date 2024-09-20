import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
 
//handle functionn for the onChange attribute of the select element 
//selected  state updated with the help of setSelected
const TokenDropdown = ({ onChange }) => {
  const [selected, setSelected] = useState('');

  const handle = (event) => {
    setSelected(event.target.value); 
    onChange(event);
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <FontAwesomeIcon icon={faSearch} style={styles.icon} />
        <select 
          value={selected} 
          onChange={handle}
          style={styles.select}
        >
          <option value="" disabled hidden>
            <FontAwesomeIcon icon={faSearch} style={styles.icon} />
            Search a token
          </option>
          <option value="polygon">Polygon</option>
          <option value="ethereum">Ethereum</option>
          <option value="linea">Linea</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="starknet">Starknet</option>
        </select>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  wrapper: {
    position: 'relative',
    width: '700px', 
    height: '60px',
    borderRadius: '30px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'black', 
  },
  icon: {
    position: 'absolute', 
    left: '15px', 
    color: 'white',
    fontSize: '1.25rem',
    marginLeft: '10px', 
    zIndex: 1, 
  },
  select: {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '30px',
    backgroundColor: 'black', // Black background for the dropdown
    color: 'white', // White text color
    fontWeight: 'bold',
    fontSize: '1.25rem',
    paddingLeft: '50px', // Space for the icon
    textAlign: 'center',
    cursor: 'pointer',
    appearance: 'none',
    outline: 'none',
    position: 'relative',
    zIndex: 0, // Ensure select is below the icon
  },
};


export default TokenDropdown;
