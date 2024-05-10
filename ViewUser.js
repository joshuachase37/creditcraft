import React, { useState, useEffect } from 'react';

function ViewUser() {
  const [users, setUsers] = useState([]);
  const userID = sessionStorage.getItem('userID');
  const loginID = sessionStorage.getItem('loginID'); 
  
  console.log("LoginID: ", loginID);

 const fetchUsers = async () => {
    try {
        // Fetch data from server
        const response = await fetch(`http://127.0.0.1:5000/get_data?table_name=Authentication&loginID=${loginID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Parse response JSON
        const data = await response.json();
        // Log the data received
        console.log('Received data:', data);
        // Check if data is in expected format
        if (!data || !data.data || !Array.isArray(data.data)) {
            throw new Error('Invalid data received from server');
        }
        // Format the data and set it to state
        const formattedData = data.data.map(row => ({
            Email: row.Email,
            Username: row.Username,
            Password: row.Password
        }));
        setUsers(formattedData);
    } catch (error) {
        console.error('Error fetching users:', error);
    } 
 };
 
  useEffect(() => {
    fetchUsers();
  }, [userID]); // Add userID to the dependency array

  const handleUpdate = async (userID) => {
    const options = ['Email', 'Username'];
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
          table_name: 'Authentication',
          update_values: { [selectedOption]: newValue },
          condition: `UserID=${userID}`,
        }),
      });
  
      if (response.ok) {
        alert('User information updated successfully');
        fetchUsers(); // Refresh the user list after updating
      } else {
        alert('Failed to update user information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      alert('Failed to update user information. Please try again.');
    }
  };

	
  // works correctly but decided to remove because this is more of an admin feature and we do not have an admin yet
  // const handleDelete = async (userID) => {
    // try {
      // const response = await fetch('http://127.0.0.1:5000/delete_data', {
        // method: 'DELETE',
        // headers: {
          // 'Content-Type': 'application/json',
        // },
        // body: JSON.stringify({
          // table_name: 'Authentication',
          // condition: `UserID=${userID}`,
        // }),
      // });

      // if (response.ok) {
        // alert('User deleted successfully');
        // fetchUsers(); // Refresh the user list after deleting
      // } else {
        // alert('Failed to delete user. Please try again.');
      // }
    // } catch (error) {
      // console.error('Error deleting user:', error);
      // alert('Failed to delete user. Please try again.');
    // }
  // };

  return (
    <div>
      <h2>View Existing Users</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.Email}>
              <td>{user.Email}</td>
              <td>{user.Username}</td>
              <td>
                <button onClick={() => handleUpdate(userID)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewUser;
