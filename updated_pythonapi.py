import mysql.connector
import hashlib
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'creditCraftPWD',
    'database': 'creditcraft'
}

@app.route('/get_data', methods=['GET'])
def get_data():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    table_name = request.args.get('table_name')
    
    if table_name == "User":
        cursor.execute("SELECT * FROM User")
        output = cursor.fetchall()
    elif table_name == 'Authentication':
        loginID = request.args.get('loginID')
        if loginID:
            # Fetch user information based on loginID
            cursor.execute("SELECT Email, Username, Password FROM Authentication WHERE LoginID = %s", (loginID,))
            user_data = cursor.fetchone()
            if not user_data:
                return jsonify({'success': False, 'message': 'No user found.'}), 401
            else:
                email, username, hashed_password = user_data
                user_info = {'Email': email, 'Username': username, 'Password': hashed_password}
                return jsonify({'success': True, 'data': [user_info]})

        else:
            username_or_email = request.args.get('usernameOrEmail')
            password = request.args.get('password')

            if username_or_email and password:
                cursor.execute("SELECT LoginID, UserID, Password, Email, Username FROM Authentication WHERE Username = %s OR Email = %s", (username_or_email, username_or_email))
            else:
                return jsonify({'success': False, 'message': 'Invalid request parameters.'}), 400

            user_data = cursor.fetchone()

            if not user_data:
                return jsonify({'success': False, 'message': 'No user found.'}), 401

            # Extract data from the fetched row
            LoginID, UserID, hashed_password, email, username = user_data

            # Verify the password
            if hashlib.sha256(password.encode()).hexdigest() == hashed_password:
                return jsonify({'success': True, 'UserID': UserID, 'Username': username, 'Email': email, 'LoginID': LoginID})
            else:
                return jsonify({'success': False, 'message': 'Invalid password.'}), 401
    elif table_name == 'Asset':
        userID = request.args.get('userID') 
        print("Asset: ", userID)
        cursor.execute("SELECT * FROM Asset WHERE UserID = %s", (userID,))
        output = cursor.fetchall()
    elif table_name == 'BankAccount':
        userID = request.args.get('userID') 
        print("Bank: ", userID)
        cursor.execute("SELECT * FROM BankAccount WHERE UserID = %s", (userID,))
        output = cursor.fetchall()
    elif table_name == 'CreditCard':
        userID = request.args.get('userID')
        print("Credit: ", userID)
        cursor.execute("SELECT * FROM CreditCard WHERE UserID = %s", (userID,))
        output = cursor.fetchall()
    elif table_name == 'Transactions':
        userID = request.args.get('userID')
        print("Transactions: ", userID)
        cursor.execute("SELECT * FROM Transactions WHERE UserID = %s", (userID,))
        output = cursor.fetchall()
    else:
        return jsonify({"error": "Invalid table name"}), 400
    return jsonify({"data": output})


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

        query = "INSERT INTO Transactions(UserID, CardID, AccountID, Merchant, Date, Amount, Category) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (UserID, CardID, AccountID, Merchant, Date, Amount, Category)
        cursor.execute(query, values)

        # Update the CurrentBalance of the credit card
        update_card_query = "UPDATE CreditCard SET CurrentBalance = CurrentBalance - %s WHERE CardID = %s"
        cursor.execute(update_card_query, (Amount, CardID))

        # Update the Balance of the bank account
        update_account_query = "UPDATE BankAccount SET Balance = Balance - %s WHERE AccountID = %s"
        cursor.execute(update_account_query, (Amount, AccountID))

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
