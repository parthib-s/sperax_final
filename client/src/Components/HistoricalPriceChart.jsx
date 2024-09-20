import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // For Chart.js v3 and above
import TokenDropdown from './TokenDropdown'; 

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/';

const token_list = {
  polygon: "matic-network",
  ethereum: 'ethereum',
  linea: 'linea', 
  arbitrum: 'arbitrum',
  starknet:'starknet'
};

function HistoricalPriceChart() {
  const [selected, setselected] = useState('ethereum'); // Default chaart to display when screen loaded
  const [chart_data, setchart_data] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHist = async () => {
      try {
        setLoading(true);
        const endDate = Math.floor(Date.now() / 1000); //  timestamp in seconds
        const startDate = endDate - 6 * 30 * 24 * 60 * 60; // 6 months ago

        const tokenId = token_list[selected];
        if (!tokenId) {
          setError('Invalid token selected.');
          setLoading(false);
          return;
        }
        //using axios to call get on the endpoint with the coingecko api
        const response = await axios.get(`${COINGECKO_API_URL}${tokenId}/market_chart/range?vs_currency=usd&from=${startDate}&to=${endDate}`);
        const prices = response.data.prices;

        const labels = prices.map(([timestamp]) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short' }));
        const data = prices.map(([_, price]) => price);

        setchart_data({
          labels,
          datasets: [
            {
              label: `Price of ${selected.toUpperCase()}`,//x axiss
              data,
              borderColor: 'purple',
              backgroundColor: 'rgba(128, 0, 128, 0.2)',
              borderWidth: 2,
            },
          ],
        });
        setError('');
      } catch (err) {
        console.error('Error fetching historical data:', err);
        setError('Failed to fetch historical data.');
      } finally {
        setLoading(false);
      }
    };

    if (selected) {
      fetchHist();
    }
  }, [selected]);

  const handle = (event) => {
    setselected(event.target.value);
  };

  //chart design and alignmen
  return (
    <div className="historical-price-chart-container" style={{ backgroundColor: '#202020', width: '80%' }}>
      <TokenDropdown onChange={handle} />
      {loading && <p style={{ color: 'white' }}>Loading chart...</p>}
      {error && <p style={{ color: 'white' }}>{error}</p>}
      {chart_data.labels && (
        <Line
          data={chart_data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  color: 'white',
                },
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: 'white',
                },
              },
              y: {
                ticks: {
                  color: 'white',
                  beginAtZero: true,
                  callback: (value) => `$${value.toFixed(2)}`,
                },
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default HistoricalPriceChart;
