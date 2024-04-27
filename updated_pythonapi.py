
'''

Author: Elijah Carter, Shivam Shelar, Joshua Chase
Date: 4/21/2024
Last Modified: 4/27/2024
Objective: Setup basic API connection and request for creditcraft

How to run:
- Navigate to location of file in local machine
- run the following command: python pythonyapi


Elijah changes 4/27/2024:
- GET Request: Wrapping the output in jsonify, you ensure that it's returned as a JSON
- GET Request: Added 400 error code for invalid table request
- GET Request: Added handling for user authentication to verify password
- Imports: Added CORS to handle cross port requests
- SQL Changes: Added auto increment and not null to primary key, please see example_sql_entries.sql for table definitions
- POST Request registration/authentication: combined the insertion of a new user and their authentication because we do not have admin roles, just user roles

'''

import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '$',
    'database': 'creditcraft'
}

@app.route('/get_data', methods=['GET'])
def get_data():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    table_name = request.args.get('table_name')
    username_or_email = request.args.get('usernameOrEmail')
    password = request.args.get('password')
    
    if table_name == "User":
        cursor.execute("SELECT * FROM User")
        output = cursor.fetchall()
    elif table_name == 'Asset':
        cursor.execute("SELECT * FROM Asset")
        output = cursor.fetchall()
    elif table_name == 'Authentication':
        # Check if the provided username/email and password exist in the authentication table
        cursor.execute("SELECT * FROM Authentication WHERE (Username = %s OR Email = %s) AND Password = %s", (username_or_email, username_or_email, password))
        user_data = cursor.fetchone()  # Fetch one matching record
        
        if user_data:
            # User has been authenticated
            return jsonify({'success': True, 'data': user_data})
        else:
            # User has not been authenticated
            return jsonify({'success': False, 'message': 'Invalid username/email or password.'}), 401
    elif table_name == 'BankAccount':
        cursor.execute("SELECT * FROM BankAccount")
        output = cursor.fetchall()
    elif table_name == 'CreditCard':
        cursor.execute("SELECT * FROM CreditCard")
        output = cursor.fetchall()
    elif table_name == 'Transactions':
        cursor.execute("SELECT * FROM Transaction")
        output = cursor.fetchall()
    else:
        return jsonify({"error": "Invalid table name"}), 400
    
    return jsonify({"data": output})

# @app.route('/register', methods=['POST'])
# def register():
    # try:
        # conn = mysql.connector.connect(**db_config)
        # cursor = conn.cursor()

        # # Extract registration data from the request
        # data = request.json
        # Name = data.get('name')
        # DOB = data.get('dob')
        # Password = data.get('password')
        # Email = data.get('email')
        # Username = data.get('username')
        
        # dob_date = datetime.strptime(DOB, '%Y-%m-%d')
        # current_date = datetime.now()
        # Age = current_date.year - dob_date.year - ((current_date.month, current_date.day) < (dob_date.month, dob_date.day))
        
        # # Check if required fields are provided
        # if not (Name and DOB and Age and Password and Email and Username):
            # return jsonify({'success': False, 'message': 'Please provide all required fields.'}), 400

        # # Insert user data into User table
        # query_user = "Insert Into User(Name, DOB, Age) VALUES (%s, %s, %s)"
        # values_user = (Name, DOB, Age)
        # cursor.execute(query_user, values_user)
        # UserID = cursor.lastrowid  # Get the auto-generated UserID

        # # Insert authentication data into Authentication table
        # query_auth = "Insert Into Authentication(UserID, Password, Email, Username) VALUES (%s, %s, %s, %s)"
        # values_auth = (UserID, Password, Email, Username)
        # cursor.execute(query_auth, values_auth)

        # conn.commit()
        
        # return jsonify({'success': True, 'message': 'Registration successful'}), 201

    # except Exception as e:
        # return jsonify({'success': False, 'message': 'Registration failed: ' + str(e)}), 500

    # finally:
        # cursor.close()
        # conn.close()
        
import hashlib

@app.route('/register', methods=['POST'])
def register():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        data = request.json
        Name = data.get('name')
        DOB = data.get('dob')
        plain_password = data.get('password')  # Get plain password
        Email = data.get('email')
        Username = data.get('username')
        
        dob_date = datetime.strptime(DOB, '%Y-%m-%d')
        current_date = datetime.now()
        Age = current_date.year - dob_date.year - ((current_date.month, current_date.day) < (dob_date.month, dob_date.day))
        
        # Check if required fields are provided
        if not (Name and DOB and Age and plain_password and Email and Username):
            return jsonify({'success': False, 'message': 'Please provide all required fields.'}), 400

        # Check if email or username already exists
        query_check_duplicate = "SELECT UserID FROM Authentication WHERE Email = %s OR Username = %s"
        cursor.execute(query_check_duplicate, (Email, Username))
        duplicate_entry = cursor.fetchone()
        if duplicate_entry:
            return jsonify({'success': False, 'message': 'Email or Username already exists.'}), 400

        hashed_password = hashlib.sha256(plain_password.encode()).hexdigest()

        query_user = "INSERT INTO User (Name, DOB, Age) VALUES (%s, %s, %s)"
        values_user = (Name, DOB, Age)
        cursor.execute(query_user, values_user)
        UserID = cursor.lastrowid  # Get the auto-generated UserID
        
        query_auth = "INSERT INTO Authentication (UserID, Password, Email, Username) VALUES (%s, %s, %s, %s)"
        values_auth = (UserID, hashed_password, Email, Username)
        cursor.execute(query_auth, values_auth)

        conn.commit()
        
        return jsonify({'success': True, 'message': 'Registration successful'}), 201

    except Exception as e:
        return jsonify({'success': False, 'message': 'Registration failed: ' + str(e)}), 500

    finally:
        cursor.close()
        conn.close()



@app.route('/insert_asset', methods=['POST'])
def insert_asset():
    data = request.json
    AssetID = data.get('AssetID')
    UserID = data.get('UserID')
    Type = data.get('Type')
    Name = data.get('Name')
    CurrentValue = data.get('CurrentValue')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "Insert Into Asset(AssetID, UserID, Type, Name, CurrentValue) VALUES (%s, %s, %s, %s, %s)"
        values = (AssetID, UserID, Type, Name, CurrentValue)

        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Data added successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'Failed to add data', 'error': str(e)}), 500

@app.route('/insert_bankaccount', methods=['POST'])
def insert_bankaccount():
    data = request.json
    AccountID = data.get('AccountID')
    UserID = data.get('UserID')
    AccountType = data.get('AccountType')
    AccountNumber = data.get('AccountNumber')
    BankName = data.get('BankName')
    Balance = data.get('Balance')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        AccountInfo = AccountType + ", " + AccountNumber
        query = "Insert Into BankAccount(AccountID, UserID, AccountInfo, BankName, Balance) VALUES (%s, %s, %s, %s, %s)"
        values = (AccountID, UserID, AccountInfo, BankName, Balance)

        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Data added successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'Failed to add data', 'error': str(e)}), 500

@app.route('/insert_creditcard', methods=['POST'])
def insert_creditcard():
    data = request.json
    CardID = data.get('CardID')
    UserID = data.get('UserID')
    ExpiryDate = data.get('ExpiryDate')
    CardNumber = data.get('CardNumber')
    CardType = data.get('CardType')
    AvailableCredit = data.get('AvailableCredit')
    CurrentBalance = data.get('CurrentBalance')
    InterestRate = data.get('InterestRate')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        CardInfo = ExpiryDate + ", " + CardNumber + ", " + CardType
        query = "Insert Into CreditCard(CardID, UserID, CardInfo, AvailableCredit, CurrentBalance, InterestRate) VALUES (%s, %s, %s, %s, %s, %s)"
        values = (CardID, UserID, CardInfo, AvailableCredit, CurrentBalance, InterestRate)

        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Data added successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'Failed to add data', 'error': str(e)}), 500

@app.route('/insert_transactions', methods=['POST'])
def insert_transactions():
    data = request.json
    TransactionID = data.get('TransactionID')
    UserID = data.get('UserID')
    CardID = data.get('CardID')
    AccountID = data.get('AccountID')
    Merchant = data.get('Merchant')
    Date = data.get('Date')
    Amount = data.get('Amount')
    Category = data.get('Category')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "Insert Into Transactions(TransactionID, UserID, CardID, AccountID, Merchant, Date, Amount, Category) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = (TransactionID, UserID, CardID, AccountID, Merchant, Date, Amount, Category)

        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Data added successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'Failed to add data', 'error': str(e)}), 500

@app.route('/update_data', methods=['PUT'])
def update_data():

    data = request.json
    table_name = data.get('table_name')
    update_values = data.get('update_values')
    condition = data.get('condition')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        if table_name == "User":
            query = f"UPDATE User SET "
            for column, value in update_values.items():
                query += f"{column} = '{value}'"
            query += f" WHERE {condition};"
        elif table_name == 'Asset':
            query = f"UPDATE Asset SET "
            for column, value in update_values.items():
                query += f"{column} = '{value}'"
            query += f" WHERE {condition};"
        elif table_name == 'Authentication':
            query = f"UPDATE Authentication SET "
            for column, value in update_values.items():
                query += f"{column} = '{value}'"
            query += f" WHERE {condition};"
        elif table_name == 'BankAccount':
            query = f"UPDATE BankAccount SET "
            for column, value in update_values.items():
                query += f"{column} = '{value}'"
            query += f" WHERE {condition};"
        elif table_name == 'CreditCard':
            query = f"UPDATE CreditCard SET "
            for column, value in update_values.items():
                query += f"{column} = '{value}'"
            query += f" WHERE {condition};"
        elif table_name == 'Transactions':
            query = f"UPDATE Transactions SET "
            for column, value in update_values.items():
                query += f"{column} = '{value}'"
            query += f" WHERE {condition};"
        else:
            return "Invalid table name"

        cursor.execute(query)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Data updated successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'Failed to update data', 'error': str(e)}), 500

@app.route('/delete_data', methods=['DELETE'])
def delete_data():
    data = request.json
    table_name = data.get('table_name')
    condition = data.get('condition')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        if table_name == "User":
            query = f"DELETE FROM User WHERE {condition};"
        elif table_name == 'Asset':
            query = f"DELETE FROM Asset WHERE {condition};"
        elif table_name == 'Authentication':
            query = f"DELETE FROM Authentication WHERE {condition};"
        elif table_name == 'BankAccount':
            query = f"DELETE FROM BankAccount WHERE {condition};"
        elif table_name == 'CreditCard':
            query = f"DELETE FROM CreditCard WHERE {condition};"
        elif table_name == 'Transactions':
            query = f"DELETE FROM Transactions WHERE {condition};"
        else:
            return "Invalid table name"

        cursor.execute(query)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Data deleted successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'Failed to delete data', 'error': str(e)}), 500

@app.route('/')
def test_connection():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM User")
    result = cursor.fetchone()
    return f"Connection to MySQL successful. Result: {result[0]}"

if __name__ == '__main__':
    app.run(debug=True)
