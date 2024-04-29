import React, { useState, useEffect } from 'react';

function ViewAssets() {
  const [assets, setAssets] = useState([]);
  const userID = sessionStorage.getItem('userID');

  const fetchAssets = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_data?table_name=Asset&userID=${userID}`, {
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
  };

  useEffect(() => {
    if (userID) {
      fetchAssets();
    }
  }, [userID]);

  const handleUpdate = async (assetID) => {
    const options = ['Name', 'Type', 'CurrentValue'];
    const selectedOption = prompt(`Select the parameter to update:\n${options.join('\n')}`);
    if (selectedOption === null) {
      return; // User clicked Cancel
    }
    if (!options.includes(selectedOption)) {
      alert('Invalid option selected. Please try again.');
      return;
    }
    const newValue = prompt(`Enter the new ${selectedOption}:`);
    if (newValue === null) {
      return; // User clicked Cancel
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/update_data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Asset',
          update_values: { [selectedOption]: newValue },
          condition: `AssetID=${assetID}`,
        }),
      });
  
      if (response.ok) {
        alert('Asset updated successfully');
        fetchAssets(); // Refresh the assets list after updating
      } else {
        alert('Failed to update asset. Please try again.');
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      alert('Failed to update asset. Please try again.');
    }
  };

  const handleDelete = async (assetID) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/delete_data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Asset',
          condition: `AssetID=${assetID}`,
        }),
      });

      if (response.ok) {
        alert('Asset deleted successfully');
        fetchAssets(); // Refresh the assets list after deleting
      } else {
        alert('Failed to delete asset. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Failed to delete asset. Please try again.');
    }
  };

  return (
    <div>
      <h2>View Existing Assets</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Current Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.AssetID}>
              <td>{asset.Name}</td>
              <td>{asset.Type}</td>
              <td>{asset.CurrentValue}</td>
              <td>
                <button onClick={() => handleUpdate(asset.AssetID)}>
                  Update
                </button>
                <button onClick={() => handleDelete(asset.AssetID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewAssets;