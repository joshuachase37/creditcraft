import React, { useState, useEffect } from 'react';

function ViewAssets() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_data?table_name=Asset', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formattedData = data.data.map(row => ({
          AssetID: row[0],
          UserID: row[1],
          Type: row[2],
          Name: row[3],
          CurrentValue: row[4]
        }));
        setAssets(formattedData);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    }

    fetchAssets();
  }, []);

  return (
    <div>
      <h2>View Existing Assets</h2>
      <ul>
        {assets.map(asset => (
          <li key={asset.AssetID}>
            {asset.Name} - {asset.Type} - {asset.CurrentValue}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewAssets;