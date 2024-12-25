from flask import Flask, jsonify, request, send_file, session
from flask_cors import CORS  # Import CORS
import mysql.connector
import os
from docxtpl import DocxTemplate
import secrets
from datetime import datetime, date
import pywhatkit
from datetime import timedelta

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS globally for all routes
app.secret_key = secrets.token_hex(24)

app.config['SESSION_COOKIE_SAMESITE'] = 'None'  
app.config['SESSION_COOKIE_SECURE'] = True  


# Database configuration
db_config = {
    'user': 'root',
    'password': 'root',
    'host': 'localhost',
    'database': 'capstonedb'
}

def connect_db():
    return mysql.connector.connect(**db_config)

# Sign Up Code - Do not delete
@app.route('/signup/lawyer', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')
    licenseNumber = data.get('licenseNumber')
    field = data.get('field')
    
    try:
        conn = connect_db()
        cursor = conn.cursor()

        query = """INSERT INTO lawyers (username, name, email, password, address, licenseNumber, field)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (username, name, email, password, address, licenseNumber, field))
        conn.commit()   
        return jsonify({'message': 'User signed up successfully!'}), 200

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        cursor.close()
        conn.close()


# Login Code - Do not delete
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM lawyers WHERE username=%s AND password=%s", (username, password))
        lawyer = cursor.fetchone()
       
        return jsonify({"message": "Lawyer login successful", "userType": "lawyer", "username": lawyer[1]})

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        cursor.close()
        conn.close()

# Route to handle logout
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clear the session data on logout
    print("Session cleared")
    return jsonify({"message": "Logged out successfully"}), 200

# Forgot Password Endpoint
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('newPassword')

    if not email or not new_password:
        return jsonify({"error": "Email and new password are required."}), 400

    try:
        # Use the connection from create_db_connection
        connection = connect_db()  # Use connect_db() instead of create_db_connection()
        cursor = connection.cursor()

        # Check if the email exists in the database
        cursor.execute("SELECT * FROM lawyers WHERE email = %s", (email,)) 
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "Email does not exist. Password cannot be changed."}), 404

        # Update the user's password directly (plain text)
        cursor.execute("UPDATE lawyers SET password = %s WHERE email = %s", (new_password, email)) 
        connection.commit()  # Commit using the connection

        # Close cursor and connection after the operation
        cursor.close()
        connection.close()

        return jsonify({"message": "Password updated successfully."}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred. Please try again later."}), 500
    

@app.route('/profile/<string:username>', methods=['GET'])
def get_profile(username):
    cursor = None
    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Fetch the lawyer's profile from the database
        cursor.execute("SELECT username, name, email, password, licenseNumber, field, address FROM lawyers WHERE username = %s", (username,))
        lawyer = cursor.fetchone()

        if lawyer:
            # Map fetched data to dictionary keys
            lawyer_data = {
                "username": lawyer[0],
                "name": lawyer[1],
                "email": lawyer[2],
                "password": lawyer[3],
                "licenseNumber": lawyer[4],
                "field": lawyer[5],
                "address": lawyer[6],
            }
            return jsonify(lawyer_data), 200
        else:
            return jsonify({'error': 'Lawyer not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        conn.close()

@app.route('/editProfile/<string:username>', methods=['PUT'])
def edit_profile(username):
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')
    licenseNumber = data.get('licenseNumber')
    field = data.get('field')

    cursor = None
    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Update the lawyer's profile in the database
        cursor.execute("""
            UPDATE lawyers 
            SET name=%s, email=%s, password=%s, address=%s, 
                licenseNumber=%s, field=%s
            WHERE username=%s
        """, (name, email, password, address, licenseNumber, field, username))

        conn.commit()

        return jsonify({'message': 'Profile updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        conn.close()
 

    
# Rent Document Generation Form- Do not delete
@app.route('/submitForm', methods=['POST'])
def submit_form():
    data = request.json
    lessor_name = data['lessor_name']
    lessor_address = data['lessor_address']
    lessee_name = data['lessee_name']
    lessee_address = data['lessee_address']
    location = data['location']
    day = data['day']
    month = data['month']
    year = data['year']
    lease_term = data['lease_term']
    property_location = data['property_location']
    start_date = data['start_date']
    rent_amount = data['rent_amount']
    first_rent_date = data['first_rent_date']
    interest_rate = data['interest_rate']
    taxes_amount = data.get('taxes_amount', None)
    arrears_months = data['arrears_months']
    lawyer_username = data.get('lawyer_username')


    cursor = None  # Initialize cursor to None

    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO lease_agreement (
                lessor_name, lessor_address, lessee_name, lessee_address, 
                location, day, month, year, lease_term, property_location, 
                start_date, rent_amount, first_rent_date, interest_rate, 
                taxes_amount, arrears_months, lawyer_username
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            lessor_name, lessor_address, lessee_name, lessee_address, 
            location, day, month, year, lease_term, property_location, 
            start_date, rent_amount, first_rent_date, interest_rate, 
            taxes_amount, arrears_months, lawyer_username
        ))

        # Commit changes to the database
        conn.commit()

        return jsonify({'message': 'Form submitted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        conn.close()  # Ensure the database connection is closed

# Rent Document Generation Form- Do not delete
# Route to fetch client data from the database
@app.route('/getClients', methods=['GET'])
def get_clients():
    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor(dictionary=True)  # Use dictionary cursor for JSON response
        cursor.execute("SELECT * FROM lease_agreement")
        clients = cursor.fetchall()
        return jsonify(clients), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        conn.close()  # Ensure the database connection is closed

# Rent Document Generation Update Form- Do not delete
# Route to update client data in the database
@app.route('/updateClient/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    data = request.json
    lessor_name = data['lessor_name']
    lessor_address = data['lessor_address']
    lessee_name = data['lessee_name']
    lessee_address = data['lessee_address']
    location = data['location']
    day = data['day']
    month = data['month']
    year = data['year']
    lease_term = data['lease_term']
    property_location = data['property_location']
    start_date = data['start_date']
    rent_amount = data['rent_amount']
    first_rent_date = data['first_rent_date']
    interest_rate = data['interest_rate']
    taxes_amount = data['taxes_amount']
    arrears_months = data['arrears_months']

    cursor = None

    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE lease_agreement 
            SET lessor_name=%s, lessor_address=%s, lessee_name=%s, lessee_address=%s,
                location=%s, day=%s, month=%s, year=%s, lease_term=%s, property_location=%s,
                start_date=%s, rent_amount=%s, first_rent_date=%s, interest_rate=%s,
                taxes_amount=%s, arrears_months=%s
            WHERE id=%s
        """, (
            lessor_name, lessor_address, lessee_name, lessee_address, location, 
            day, month, year, lease_term, property_location, start_date, rent_amount, 
            first_rent_date, interest_rate, taxes_amount, arrears_months, client_id
        ))

        conn.commit()

        return jsonify({'message': 'Client updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        conn.close()  # Ensure the database connection is closed

# Rent Document Generation Delete Code- Do not delete
# Route to delete client data from the database
@app.route('/deleteClient/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    cursor = None
    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor()
        cursor.execute("DELETE FROM lease_agreement WHERE id = %s", (client_id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'Client not found'}), 404

        return jsonify({'message': 'Client deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        conn.close()

# Rent Document Generation -  Do not delete
# Folder to save generated documents
GENERATED_FOLDER = './documents/generated'
if not os.path.exists(GENERATED_FOLDER):
    os.makedirs(GENERATED_FOLDER)

# Route to generate document based on client data
@app.route('/generateDocument/<int:client_id>', methods=['POST'])
def generate_document(client_id):
    cursor = None  # Initialize cursor to None
    try:
        # Fetch the client data from the database
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor(dictionary=True)  # Use dictionary cursor for JSON response
        cursor.execute("SELECT * FROM lease_agreement WHERE id = %s", (client_id,))
        client = cursor.fetchone()

        if client is None:
            return jsonify({'error': 'Client not found'}), 404

        print("Reading document template...")
        # Read your document template (e.g., using docxtpl)
        template_path = 'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/templates/Lease_Deed_Rent_Agreement.docx'
        doc = DocxTemplate(template_path)

        # Prepare context for document generation
        context = {
            'lessor_name': client['lessor_name'],
            'lessor_address': client['lessor_address'],
            'lessee_name': client['lessee_name'],
            'lessee_address': client['lessee_address'],
            'location': client['location'],
            'day': client['day'],
            'month': client['month'],
            'year': client['year'],
            'lease_term': client['lease_term'],
            'property_location': client['property_location'],
            'start_date': client['start_date'],
            'rent_amount': client['rent_amount'],
            'first_rent_date': client['first_rent_date'],
            'interest_rate': client['interest_rate'],
            'taxes_amount': client['taxes_amount'],
            'arrears_months': client['arrears_months'],
        }

        print("Updating document with client data...")
        doc.render(context)

        # Save the updated document
        output_path = f'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/generated/client_{client_id}_document.docx'
        doc.save(output_path)
        print("Document saved successfully.")

        # Send the document for download
        return send_file(output_path, as_attachment=True)
    except Exception as e:
        print("Error generating document:", str(e))
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()  # Close cursor only if it was created
        if conn:
            conn.close()  # Ensure the database connection is closed


# Route to handle form submission
# Route to handle form submission
@app.route('/submitHouseSaleForm', methods=['POST'])
def submit_house_sale_form():
    print("Received form submission request")
    
    data = request.json
    print(f"Data received: {data}")
    
    # Extract data from the request
    try:
        location = data['location']
        day = data['day']
        month = data['month']
        year = data['year']
        vendor_name = data['vendor_name']
        vendor_father_name = data['vendor_father_name']
        vendor_address = data['vendor_address']
        purchaser_name = data['purchaser_name']
        purchaser_father_name = data['purchaser_father_name']
        purchaser_address = data['purchaser_address']
        house_no = data['house_no']
        road_name = data['road_name']
        sale_price = data['sale_price']
        earnest_money = data['earnest_money']
        earnest_money_date = data['earnest_money_date']
        completion_period = data['completion_period']
        title_report_days = data['title_report_days']
        refund_days = data['refund_days']
        refund_delay_days = data['refund_delay_days']
        interest_rate = data['interest_rate']
        liquidated_damages = data['liquidated_damages']
        witness_1_name = data['witness_1_name']
        witness_2_name = data['witness_2_name']
        lawyer_username = data.get('lawyer_username')
        
        print("Extracted form data successfully")

    except KeyError as e:
        print(f"Missing data in the form: {str(e)}")
        return jsonify({'error': f"Missing data: {str(e)}"}), 400

    cursor = None  # Initialize cursor to None

    try:
        # Establish database connection and insert data into the table
        connection = connect_db()  # Use the correct connection function
        cursor = connection.cursor(dictionary=True)  # mysql.connector supports dictionary cursor
        print("Database connection established")
        
        cursor.execute("""
            INSERT INTO house_sale_agreement (
                location, day, month, year, vendor_name, vendor_father_name, vendor_address,
                purchaser_name, purchaser_father_name, purchaser_address, house_no, road_name,
                sale_price, earnest_money, earnest_money_date, completion_period,
                title_report_days, refund_days, refund_delay_days, interest_rate,
                liquidated_damages, witness_1_name, witness_2_name, lawyer_username
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            location, day, month, year, vendor_name, vendor_father_name, vendor_address,
            purchaser_name, purchaser_father_name, purchaser_address, house_no, road_name,
            sale_price, earnest_money, earnest_money_date, completion_period,
            title_report_days, refund_days, refund_delay_days, interest_rate,
            liquidated_damages, witness_1_name, witness_2_name, lawyer_username
        ))

        print("Query executed successfully, data inserted into database")

        # Commit changes to the database
        connection.commit()
        print("Changes committed to the database")

        return jsonify({'message': 'Form submitted successfully'}), 200

    except Exception as e:
        print(f"Error during database operation: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
            print("Database cursor closed")
        if connection:
            connection.close()
            print("Database connection closed")

@app.route('/getHouseSaleClients', methods=['GET'])
def get_clients_house_sale_form():
    print("Fetching house sale agreements from the database")
    cursor = None  # Initialize cursor to None
    try:
        connection = connect_db()  # Establish the database connection
        cursor = connection.cursor(dictionary=True)  # Create a dictionary cursor
        cursor.execute("SELECT * FROM house_sale_agreement")
        agreements = cursor.fetchall()
        print("Data fetched successfully")
        return jsonify(agreements), 200
    except Exception as e:
        print(f"Error during data fetching: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
            print("Database cursor closed")
        if connection:
            connection.close()
            print("Database connection closed")

# Route to update client data in the database
@app.route('/updateHouseSaleClients/<int:agreement_id>', methods=['PUT'])
def update_client_house_sale_form(agreement_id):
    data = request.json
    try:
        location = data['location']
        day = data['day']
        month = data['month']
        year = data['year']
        vendor_name = data['vendor_name']
        vendor_father_name = data['vendor_father_name']
        vendor_address = data['vendor_address']
        purchaser_name = data['purchaser_name']
        purchaser_father_name = data['purchaser_father_name']
        purchaser_address = data['purchaser_address']
        house_no = data['house_no']
        road_name = data['road_name']
        sale_price = data['sale_price']
        earnest_money = data['earnest_money']
        earnest_money_date = data['earnest_money_date']
        completion_period = data['completion_period']
        title_report_days = data['title_report_days']
        refund_days = data['refund_days']
        refund_delay_days = data['refund_delay_days']
        interest_rate = data['interest_rate']
        liquidated_damages = data['liquidated_damages']
        witness_1_name = data['witness_1_name']
        witness_2_name = data['witness_2_name']

        cursor = None
        connection = connect_db()  # Establish the database connection
        cursor = connection.cursor(dictionary=True)  # Create a dictionary cursor
        
        cursor.execute("""
            UPDATE house_sale_agreement 
            SET location=%s, day=%s, month=%s, year=%s, vendor_name=%s, vendor_father_name=%s,
                vendor_address=%s, purchaser_name=%s, purchaser_father_name=%s, purchaser_address=%s,
                house_no=%s, road_name=%s, sale_price=%s, earnest_money=%s, earnest_money_date=%s,
                completion_period=%s, title_report_days=%s, refund_days=%s, refund_delay_days=%s,
                interest_rate=%s, liquidated_damages=%s, witness_1_name=%s, witness_2_name=%s
            WHERE id=%s
        """, (
            location, day, month, year, vendor_name, vendor_father_name, vendor_address,
            purchaser_name, purchaser_father_name, purchaser_address, house_no, road_name,
            sale_price, earnest_money, earnest_money_date, completion_period, title_report_days,
            refund_days, refund_delay_days, interest_rate, liquidated_damages, witness_1_name,
            witness_2_name, agreement_id
        ))

        connection.commit()

        return jsonify({'message': 'Client updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Route to delete client data from the database
@app.route('/deleteHouseSaleClients/<int:agreement_id>', methods=['DELETE'])
def delete_client_house_sale_form(agreement_id):
    cursor = None
    try:
        connection = connect_db()  # Establish the database connection
        cursor = connection.cursor(dictionary=True)
        cursor.execute("DELETE FROM house_sale_agreement WHERE id = %s", (agreement_id,))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'Client not found'}), 404

        return jsonify({'message': 'Client deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Route to generate document based on client data
@app.route('/generateHouseSaleDocument/<int:agreement_id>', methods=['POST'])
def generate_document_house_sales_form(agreement_id):
    cursor = None  # Initialize cursor
    connection = None  # Initialize connection
    try:
        # Fetch the client data from the database
        connection = connect_db()  # Establish the database connection
        cursor = connection.cursor(dictionary=True)  # Create a dictionary cursor

        cursor.execute("SELECT * FROM house_sale_agreement WHERE id = %s", (agreement_id,))
        agreement = cursor.fetchone()

        if agreement is None:
            return jsonify({'error': 'Client not found'}), 404

        print("Reading document template...")
        # Path to the template document
        template_path = 'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/templates/House_Sale_Agreement.docx'

        try:
            doc = DocxTemplate(template_path)
            print("Document template read successfully.")
        except Exception as e:
            print("Error reading document template:", str(e))
            return jsonify({'error': 'Failed to read document template'}), 500

        # Prepare context for document generation
        context = {
            'location': agreement['location'],
            'day': agreement['day'],
            'month': agreement['month'],
            'year': agreement['year'],
            'vendor_name': agreement['vendor_name'],
            'vendor_father_name': agreement['vendor_father_name'],
            'vendor_address': agreement['vendor_address'],
            'purchaser_name': agreement['purchaser_name'],
            'purchaser_father_name': agreement['purchaser_father_name'],
            'purchaser_address': agreement['purchaser_address'],
            'house_no': agreement['house_no'],
            'road_name': agreement['road_name'],
            'sale_price': agreement['sale_price'],
            'earnest_money': agreement['earnest_money'],
            'earnest_money_date': agreement['earnest_money_date'],
            'completion_period': agreement['completion_period'],
            'title_report_days': agreement['title_report_days'],
            'refund_days': agreement['refund_days'],
            'refund_delay_days': agreement['refund_delay_days'],
            'interest_rate': agreement['interest_rate'],
            'liquidated_damages': agreement['liquidated_damages'],
            'witness_1_name': agreement['witness_1_name'],
            'witness_2_name': agreement['witness_2_name'],
        }

        # Render the template with context data
        doc.render(context)

        # Save the generated document
        output_path = f'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/generated/client_{agreement_id}_house_sale_agreement.docx'
        doc.save(output_path)

        # Send the generated document as a response for download
        return send_file(output_path, as_attachment=True)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# New endpoint to add a client
@app.route('/add-client', methods=['POST'])
def add_client():
    data = request.get_json()
    print("Received request to add client:", data)

    full_name = data.get('full_name')
    gender = data.get('gender')
    email_id = data.get('email_id')
    mobile_number = data.get('mobile_number')
    address = data.get('address')
    country = data.get('country')
    state = data.get('state')
    city = data.get('city')
    case_type = data.get('case_type')
    status = data.get('status')
    lawyer_username = data.get('lawyer_username')
    query = """
        INSERT INTO add_client (full_name, gender, email_id, mobile_number, address, country, state, city, case_type, status, lawyer_username)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (full_name, gender, email_id, mobile_number, address, country, state, city, case_type, status,lawyer_username)

    try:
        conn = connect_db()  # Establish a database connection
        cursor = conn.cursor()
        print("Executing SQL query to add client:", query, values)
        cursor.execute(query, values)
        conn.commit()

        print("Client added successfully")
        return jsonify({"message": "Client added successfully"}), 201
    except Exception as e:
        conn.rollback()
        print("Error adding client:", str(e))
        return jsonify({"message": "Error adding client", "error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Endpoint to fetch all clients
@app.route('/clients', methods=['GET'])
def get_clients_lawyer_page():
    print("Fetching all clients from the database")
    # global current_username
    try:
        conn = connect_db()  # Establish a database connection
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM add_client")
        rows = cursor.fetchall()
        clients = []
        
        for row in rows:
            clients.append({
                'id': row[0],
                'full_name': row[1],
                'gender': row[2],
                'email_id': row[3],
                'mobile_number': row[4],
                'address': row[5],
                'country': row[6],
                'state': row[7],
                'city': row[8],
                'case_type': row[9],
                'status': row[10],
                'lawyer_username': row[11]
            })
        
        print("Clients fetched:", clients)
        return jsonify(clients), 200
    
    except Exception as e:
        print("Error fetching clients:", str(e))
        return jsonify({"message": "Error fetching clients", "error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()

# Endpoint to delete a client by ID
@app.route('/delete-client/<int:id>', methods=['DELETE'])
def delete_client_lawyer_page(id):
    print(f"Received request to delete client with ID: {id}")
    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor()
        cursor.execute("DELETE FROM add_client WHERE id = %s", (id,))
        conn.commit()
        
        print("Client deleted successfully")
        return jsonify({"message": "Client deleted successfully"}), 200
    
    except Exception as e:
        conn.rollback()
        print("Error deleting client:", str(e))
        return jsonify({"message": "Error deleting client", "error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()

# Endpoint to update a client by ID
@app.route('/update-client/<int:id>', methods=['PUT'])
def update_client_lawyer_page(id):
    data = request.get_json()
    print(f"Received request to update client with ID: {id}")
    print("Data to update:", data)

    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor()

        query = """
            UPDATE add_client
            SET full_name = %s, gender = %s, email_id = %s, mobile_number = %s, address = %s, country = %s,
                state = %s, city = %s, case_type = %s, status = %s
            WHERE id = %s
        """
        values = (
            data['full_name'], data['gender'], data['email_id'], data['mobile_number'],
            data['address'], data['country'], data['state'], data['city'], data['case_type'],
            data['status'], id
        )
        print("Executing SQL query to update client:", query, values)
        cursor.execute(query, values)
        conn.commit()

        print("Client updated successfully")
        return jsonify({"message": "Client updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        print("Error updating client:", str(e))
        return jsonify({"message": "Error updating client", "error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/add-task', methods=['POST'])
def add_task():
    data = request.get_json()
    print("Received request to add task:", data)

    task_name = data.get('task_name')
    related_to = data.get('related_to')
    start_date = data.get('start_date')
    deadline = data.get('deadline')
    status = data.get('status')
    priority = data.get('priority')
    lawyer_username = data.get('lawyer_username')

    query = """
        INSERT INTO task (task_name, related_to, start_date, deadline, status, priority, lawyer_username)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    values = (task_name, related_to, start_date, deadline, status, priority, lawyer_username)

    try:
        conn = connect_db()  # Establish a database connection
        cursor = conn.cursor()
        print("Executing SQL query to add task:", query, values)
        cursor.execute(query, values)
        conn.commit()
        print("Task added successfully")
        return jsonify({"message": "Task added successfully"}), 201
    except Exception as e:
        conn.rollback()
        print("Error adding task:", str(e))
        return jsonify({"message": "Error adding task", "error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Endpoint to fetch all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    print("Fetching all tasks from the database")

    try:
        conn = connect_db()  # Establish a database connection
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM task")
        rows = cursor.fetchall()
        tasks = []

        for row in rows:
            tasks.append({
                'id': row[0],
                'task_name': row[1],
                'related_to': row[2],
                'start_date': row[3],
                'deadline': row[4],
                'status': row[5],
                'priority': row[6],
                'lawyer_username': row[7]
            })

        print("Tasks fetched:", tasks)
        return jsonify(tasks), 200

    except Exception as e:
        print("Error fetching tasks:", str(e))
        return jsonify({"message": "Error fetching tasks", "error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/delete-task/<int:id>', methods=['DELETE'])
def delete_task(id):
    print(f"Received request to delete task with ID: {id}")
    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor()
        cursor.execute("DELETE FROM task WHERE id = %s", (id,))
        conn.commit()

        print("Task deleted successfully")
        return jsonify({"message": "Task deleted successfully"}), 200

    except Exception as e:
        conn.rollback()
        print("Error deleting task:", str(e))
        return jsonify({"message": "Error deleting task", "error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Endpoint to update a task by ID
@app.route('/update-task/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.get_json()
    print(f"Received request to update task with ID: {id}")
    print("Data to update:", data)

    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor()

        query = """
            UPDATE task
            SET task_name = %s, related_to = %s, start_date = %s, deadline = %s, status = %s, priority = %s
            WHERE id = %s
        """
        values = (
            data['task_name'], data['related_to'], data['start_date'], data['deadline'],
            data['status'], data['priority'], id
        )
        print("Executing SQL query to update task:", query, values)
        cursor.execute(query, values)
        conn.commit()

        print("Task updated successfully")
        return jsonify({"message": "Task updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        print("Error updating task:", str(e))
        return jsonify({"message": "Error updating task", "error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/task-stats', methods=['GET'])
def get_task_statistics():
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        # Query to count tasks by status and lawyer_username
        query = """
        SELECT lawyer_username, status, COUNT(*) as count
        FROM task
        GROUP BY lawyer_username, status
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        
        # Initialize a dictionary to store task statistics per lawyer
        task_stats = {}

        # Populate task statistics based on the query result
        for row in rows:
            lawyer_username, status, count = row
            if lawyer_username not in task_stats:
                task_stats[lawyer_username] = {'Completed': 0, 'Pending': 0, 'In Progress': 0}
            
            # Update the task count based on the status
            if status in task_stats[lawyer_username]:
                task_stats[lawyer_username][status] = count
        
        # Calculate total tasks for each lawyer
        for lawyer_username in task_stats:
            task_stats[lawyer_username]['total'] = sum(task_stats[lawyer_username].values())

        return jsonify(task_stats), 200
    
    except Exception as e:
        print("Error fetching task statistics:", str(e))
        return jsonify({"message": "Error fetching task statistics", "error": str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()



# Endpoint to save appointment
@app.route('/add_appointment', methods=['POST'])
def add_appointment():
    data = request.json
    print(f"Received data for appointment: {data}")
    
    client_name = data.get('client_name')
    mobile_number = data.get('mobile_number')
    appointment_date = data.get('appointment_date')
    appointment_time = data.get('appointment_time')
    note = data.get('note')
    lawyer_username = data.get('lawyer_username')

    print(f"Parsed appointment details - Client Name: {client_name}, Mobile Number: {mobile_number}, "
          f"Date: {appointment_date}, Time: {appointment_time}, Note: {note}")
    
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO client_appointments (client_name, mobile_number, appointment_date, appointment_time, note, lawyer_username)
                          VALUES (%s, %s, %s, %s, %s, %s)''', (client_name, mobile_number, appointment_date, appointment_time, note, lawyer_username))
        conn.commit()
        print("Appointment added successfully.")
        return jsonify({"message": "Appointment added successfully!"}), 201
    except mysql.connector.Error as err:
        conn.rollback()
        print(f"Error adding appointment: {str(err)}")
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/check_appointment', methods=['GET'])
def check_appointment():
    client_name = request.args.get('client_name')
    appointment_date = request.args.get('appointment_date')
    lawyer_username = request.args.get('lawyer_username')
    
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        # Check for existing appointment
        cursor.execute('''SELECT COUNT(*) FROM client_appointments
                          WHERE client_name = %s AND appointment_date = %s AND lawyer_username = %s''',
                       (client_name, appointment_date, lawyer_username))
        exists = cursor.fetchone()[0] > 0

        if exists:
            return jsonify({"exists": True, "message": "An appointment already exists for this client on this date"}), 200
        else:
            return jsonify({"exists": False}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


# Endpoint to retrieve all appointments
@app.route('/get_appointments', methods=['GET'])
def get_appointments():
    print("Fetching appointments...")
    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM client_appointments')
        appointments = cursor.fetchall()
        print(f"Fetched appointments: {appointments}")

        # Prepare the response in a suitable format, converting date and time to strings
        response = [
            {
                "id": appointment[0],                              # id
                "client_name": appointment[1],                     # client_name
                "mobile_number": appointment[2],                   # mobile_number
                "appointment_date": appointment[3].strftime('%Y-%m-%d') if appointment[3] else None,  # appointment_date
                "appointment_time": str(appointment[4]) if appointment[4] else None,  # appointment_time as HH:MM:SS
                "note": appointment[5],                             # note,
                "lawyer_username": appointment[6]
            } for appointment in appointments
        ]
        return jsonify(response), 200

    except mysql.connector.Error as err:
        print(f"Error fetching appointments: {str(err)}")
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


# Endpoint to delete an appointment by id
@app.route('/delete_appointment/<int:id>', methods=['DELETE'])
def delete_appointment(id):
    print(f"Deleting appointment with ID: {id}")
    try:
        conn = connect_db()  # Create a new connection
        cursor = conn.cursor()

        cursor.execute('DELETE FROM client_appointments WHERE id = %s', (id,))
        conn.commit()
        print("Appointment deleted successfully.")
        return jsonify({"message": "Appointment deleted successfully!"}), 200

    except mysql.connector.Error as err:
        conn.rollback()
        print(f"Error deleting appointment: {str(err)}")
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/update-appointment/<int:id>', methods=['PUT'])
def update_appointment(id):
    data = request.get_json()
    print(f"Received request to update appointment with ID: {id}")
    print("Data to update:", data)

    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor()

        # Update SQL query without any trailing commas
        query = """
            UPDATE client_appointments
            SET client_name = %s,
                mobile_number = %s,
                appointment_date = %s,
                appointment_time = %s,
                note = %s
            WHERE id = %s
        """
        values = (
            data['client_name'],
            data['mobile_number'],
            data['appointment_date'],
            data['appointment_time'],
            data['note'],
            id
        )
        
        print("Executing SQL query to update appointment:", query, values)
        cursor.execute(query, values)
        conn.commit()

        print("Appointment updated successfully")
        return jsonify({"message": "Appointment updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        print("Error updating appointment:", str(e))
        return jsonify({"message": "Error updating appointment", "error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()



# Add Case Route
@app.route('/add-case', methods=['POST'])
def add_case():
    data = request.get_json()
    print("Received request to add case:", data)

    filling_number = data.get('filling_number')
    filling_date = data.get('filling_date')
    cnr_number = data.get('cnr_number')
    first_hearing_date = data.get('first_hearing_date')
    next_hearing_date = data.get('next_hearing_date')
    case_status = data.get('case_status')
    court_name = data.get('court_name')
    judge_name = data.get('judge_name')
    petitioner_name = data.get('petitioner_name')
    petitioner_advocate_name = data.get('petitioner_advocate_name')
    respondent_name = data.get('respondent_name')
    respondent_advocate_name = data.get('respondent_advocate_name')
    session_notes = data.get('session_notes')
    lawyer_username = data.get('lawyer_username')

    query = """
        INSERT INTO case_details (
            filling_number, filling_date, cnr_number, first_hearing_date, next_hearing_date,
            case_status, court_name, judge_name, petitioner_name, petitioner_advocate_name,
            respondent_name, respondent_advocate_name, session_notes, lawyer_username
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (filling_number, filling_date, cnr_number, first_hearing_date, next_hearing_date,
              case_status, court_name, judge_name, petitioner_name, petitioner_advocate_name,
              respondent_name, respondent_advocate_name, session_notes, lawyer_username)

    try:
        conn = connect_db()
        cursor = conn.cursor()
        print("Executing SQL query to add case:", query, values)
        cursor.execute(query, values)
        conn.commit()
        print("Case added successfully")
        return jsonify({"message": "Case added successfully"}), 201
    except mysql.connector.Error as e:
        conn.rollback()
        print("Error adding case:", str(e))
        return jsonify({"message": "Error adding case", "error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Endpoint to fetch all cases
@app.route('/cases', methods=['GET'])
def get_cases():
    try:
        conn = connect_db()  # Establish a database connection
        cursor = conn.cursor()

        print("Fetching all cases from the database")
        cursor.execute("SELECT * FROM case_details")
        rows = cursor.fetchall()

        cases = []
        for row in rows:
            cases.append({
                'filling_number': row[0],
                'filling_date': row[1],
                'cnr_number': row[2],
                'first_hearing_date': row[3],
                'next_hearing_date': row[4],
                'case_status': row[5],
                'court_name': row[6],
                'judge_name': row[7],
                'petitioner_name': row[8],
                'petitioner_advocate_name': row[9],
                'respondent_name': row[10],
                'respondent_advocate_name': row[11],
                'session_notes': row[12],
                'lawyer_username': row[13]
            })

        print("Cases fetched:", cases)
        return jsonify(cases), 200

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/delete-case/<int:filling_number>', methods=['DELETE'])
def delete_case(filling_number):
    print(f"Received request to delete case with Filling Number: {filling_number}")
    try:
        conn = connect_db()  # Ensure you connect to the database
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM case_details WHERE filling_number = %s", (filling_number,))
        conn.commit()
        print("Case deleted successfully")
        return jsonify({"message": "Case deleted successfully"}), 200
    except Exception as e:
        conn.rollback()
        print("Error deleting case:", str(e))
        return jsonify({"message": "Error deleting case", "error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# New Update Case Endpoint
@app.route('/update-case/<int:filling_number>', methods=['PUT'])
def update_case(filling_number):
    data = request.get_json()
    print(f"Received request to update case with Filling Number: {filling_number}")
    print("Data to update:", data)

    try:
        conn = connect_db()  # Ensure you connect to the database
        cursor = conn.cursor()
        
        query = """
            UPDATE case_details
            SET filling_date = %s, cnr_number = %s, first_hearing_date = %s, next_hearing_date = %s,
                case_status = %s, court_name = %s, judge_name = %s, petitioner_name = %s,
                petitioner_advocate_name = %s, respondent_name = %s, respondent_advocate_name = %s,
                session_notes = %s, lawyer_username = %s
            WHERE filling_number = %s
        """
        values = (
            data['filling_date'], data['cnr_number'], data['first_hearing_date'],
            data['next_hearing_date'], data['case_status'], data['court_name'],
            data['judge_name'], data['petitioner_name'], data['petitioner_advocate_name'],
            data['respondent_name'], data['respondent_advocate_name'],
            data['session_notes'], data['lawyer_username'], filling_number
        )
        print("Executing SQL query to update case:", query, values)
        cursor.execute(query, values)
        conn.commit()  # Use conn instead of db
        print("Case updated successfully")
        return jsonify({"message": "Case updated successfully"}), 200
    except Exception as e:
        conn.rollback()  # Use conn instead of db
        print("Error updating case:", str(e))
        return jsonify({"message": "Error updating case", "error": str(e)}), 500
    finally:
        cursor.close()  # Ensure to close the cursor
        conn.close()    # Ensure to close the connection


@app.route('/cases-per-status', methods=['GET'])
def get_cases_per_status():
    try:
        conn = connect_db()  # Establish a database connection
        cursor = conn.cursor()

        # SQL query to count cases by status and lawyer_username
        cursor.execute("""
            SELECT lawyer_username, case_status, COUNT(*) AS case_count
            FROM case_details
            GROUP BY lawyer_username, case_status
        """)
        rows = cursor.fetchall()

        # Initialize a dictionary to hold case counts per lawyer and case status
        cases_by_status = {}

        # List of possible case statuses
        case_statuses = ['Closed', 'In Progress', 'On Hold', 'Adjourned', 'Dismissed', 'Settled', 'Reopened']

        # Populate the cases by status dictionary
        for row in rows:
            lawyer_username, case_status, case_count = row
            if lawyer_username not in cases_by_status:
                # Initialize all possible case statuses for each lawyer
                cases_by_status[lawyer_username] = {status: 0 for status in case_statuses}
            
            # Update the case count based on the case_status
            if case_status in cases_by_status[lawyer_username]:
                cases_by_status[lawyer_username][case_status] = case_count

        # Return the dictionary containing case counts per lawyer and case status
        return jsonify(cases_by_status), 200

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        cursor.close()
        conn.close()




@app.route('/clients-stats', methods=['GET'])
def client_stats():
    try:
        conn = connect_db()  # Establish database connection
        cursor = conn.cursor(dictionary=True)  # Use dictionary cursor for JSON response
        cursor.execute("""
            SELECT 
                EXTRACT(MONTH FROM lease_date) AS month,
                EXTRACT(YEAR FROM lease_date) AS year,
                COUNT(*) AS client_count
            FROM lease_agreement
            GROUP BY year, month
            ORDER BY year, month
        """)
        clients = cursor.fetchall()
        return jsonify(clients), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        conn.close()  # Ensure the database connection is closed

@app.route('/submitEmployee', methods=['POST'])
def submit_employee():
    data = request.json
    print("Received employee submission data:", data)

    # Extract fields for employee_service_agreement table
    place_of_execution = data['place_of_execution']
    day = data['day']
    month = data['month']
    year = data['year']
    company_name = data['company_name']
    representative_position = data['representative_position']
    representative_name = data['representative_name']
    representative_father_name = data['representative_father_name']
    registered_office_address = data['registered_office_address']
    employee_name = data['employee_name']
    employee_father_name = data['employee_father_name']
    nationality = data['nationality']
    employee_age = data['employee_age']
    employee_address = data['employee_address']
    business_nature = data['business_nature']
    post_title = data['post_title']
    application_date = data['application_date']
    appointment_position = data['appointment_position']
    probation_period = data['probation_period']
    employment_duration = data['employment_duration']
    work_location = data['work_location']
    reporting_date = data['reporting_date']
    work_start_time = data['work_start_time']
    work_end_time = data['work_end_time']
    weekly_holiday = data['weekly_holiday']
    probation_stipend = data['probation_stipend']
    basic_salary = data['basic_salary']
    company_policy_reference = data['company_policy_reference']
    witness_name1 = data['witness_name1']
    witness_name2 = data['witness_name2']
    lawyer_username = data['lawyer_username']

    print("Extracted data for employee_service_agreement table.")

    cursor = None

    try:
        conn = connect_db()
        cursor = conn.cursor()
        print("Database cursor initialized.")

        cursor.execute("""
            INSERT INTO employee_service_agreement (
                place_of_execution, day, month, year, company_name, representative_position, 
                representative_name, representative_father_name, registered_office_address, 
                employee_name, employee_father_name, nationality, employee_age, employee_address, 
                business_nature, post_title, application_date, appointment_position, probation_period, 
                employment_duration, work_location, reporting_date, work_start_time, work_end_time, 
                weekly_holiday, probation_stipend, basic_salary, company_policy_reference, witness_name1, 
                witness_name2, lawyer_username
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                      %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            place_of_execution, day, month, year, company_name, representative_position, 
            representative_name, representative_father_name, registered_office_address, 
            employee_name, employee_father_name, nationality, employee_age, employee_address, 
            business_nature, post_title, application_date, appointment_position, probation_period, 
            employment_duration, work_location, reporting_date, work_start_time, work_end_time, 
            weekly_holiday, probation_stipend, basic_salary, company_policy_reference, witness_name1, 
            witness_name2, lawyer_username
        ))

        conn.commit()
        return jsonify({'message': 'Employee record submitted successfully'}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Route to fetch employee data from the database
@app.route('/getEmployees', methods=['GET'])
def get_employees():
    print("Fetching all employees from the database.")
    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)  # Use dictionary cursor to get column names as keys
        cursor.execute("SELECT * FROM employee_service_agreement")
        employees = cursor.fetchall()

        # Convert timedelta fields to string format
        for employee in employees:
            for key, value in employee.items():
                if isinstance(value, timedelta):
                    employee[key] = str(value)  # Convert timedelta to "HH:MM:SS" format

        print("Employees fetched successfully:", employees)
        return jsonify(employees), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Route to update employee data in the database
@app.route('/updateEmployee/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    data = request.json
    print("Received update data for employee ID:", employee_id, data)

    # Extract data fields from the JSON payload
    place_of_execution = data['place_of_execution']
    day = data['day']
    month = data['month']
    year = data['year']
    company_name = data['company_name']
    representative_position = data['representative_position']
    representative_name = data['representative_name']
    representative_father_name = data['representative_father_name']
    registered_office_address = data['registered_office_address']
    employee_name = data['employee_name']
    employee_father_name = data['employee_father_name']
    nationality = data['nationality']
    employee_age = data['employee_age']
    employee_address = data['employee_address']
    business_nature = data['business_nature']
    post_title = data['post_title']
    application_date = data['application_date']
    appointment_position = data['appointment_position']
    probation_period = data['probation_period']
    employment_duration = data['employment_duration']
    work_location = data['work_location']
    reporting_date = data['reporting_date']
    work_start_time = data['work_start_time']
    work_end_time = data['work_end_time']
    weekly_holiday = data['weekly_holiday']
    probation_stipend = data['probation_stipend']
    basic_salary = data['basic_salary']
    company_policy_reference = data['company_policy_reference']
    witness_name1 = data['witness_name1']
    witness_name2 = data['witness_name2']
    lawyer_username = data['lawyer_username']

    print("Extracted update data for employee.")

    cursor = None

    try:
        # Connect to the database
        conn = connect_db()
        cursor = conn.cursor()

        # Update employee data in the employee_service_agreement table
        cursor.execute("""
            UPDATE employee_service_agreement 
            SET place_of_execution=%s, day=%s, month=%s, year=%s, company_name=%s,
                representative_position=%s, representative_name=%s, representative_father_name=%s,
                registered_office_address=%s, employee_name=%s, employee_father_name=%s, nationality=%s,
                employee_age=%s, employee_address=%s, business_nature=%s, post_title=%s,
                application_date=%s, appointment_position=%s, probation_period=%s, employment_duration=%s,
                work_location=%s, reporting_date=%s, work_start_time=%s, work_end_time=%s,
                weekly_holiday=%s, probation_stipend=%s, basic_salary=%s, company_policy_reference=%s,
                witness_name1=%s, witness_name2=%s, lawyer_username=%s
            WHERE agreement_id=%s
        """, (
            place_of_execution, day, month, year, company_name, representative_position, 
            representative_name, representative_father_name, registered_office_address, 
            employee_name, employee_father_name, nationality, employee_age, 
            employee_address, business_nature, post_title, application_date, 
            appointment_position, probation_period, employment_duration, 
            work_location, reporting_date, work_start_time, work_end_time, 
            weekly_holiday, probation_stipend, basic_salary, company_policy_reference, 
            witness_name1, witness_name2, lawyer_username, employee_id
        ))

        conn.commit()
        return jsonify({'message': 'Employee updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Route to delete employee data from the database
@app.route('/deleteEmployee/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    cursor = None
    try:
        # Print the employee ID we are trying to delete
        print(f"Attempting to delete employee with ID: {employee_id}")

        # Establish a database connection and attempt to delete the employee
        conn = connect_db()
        cursor = conn.cursor()
        delete_query = "DELETE FROM employee_service_agreement WHERE agreement_id = %s"
        cursor.execute(delete_query, (employee_id,))
        conn.commit()

        # Check if the employee was found and deleted
        if cursor.rowcount == 0:
            print(f"No employee found with ID: {employee_id}")
            return jsonify({'error': 'Employee not found'}), 404

        print(f"Employee with ID {employee_id} deleted successfully.")
        return jsonify({'message': 'Employee deleted successfully'}), 200

    except Exception as e:
        # Print and return error information if any exception occurs
        print("Error deleting employee:", str(e))
        return jsonify({'error': str(e)}), 500

    finally:
        # Ensure the cursor and connection are closed to prevent resource leaks
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Route to generate a document based on employee data
@app.route('/generateServiceDocument/<int:employee_id>', methods=['GET'])
def generate_service_document(employee_id):
    print("Generating service document for employee ID:", employee_id)
    cursor = None

    try:
        # Establish a connection to the database
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        print("Database cursor initialized for document generation.")

        # Fetch employee data from the database
        cursor.execute("SELECT * FROM employee_service_agreement WHERE agreement_id = %s", (employee_id,))
        employee = cursor.fetchone()

        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        # Load the Word template
        template_path = 'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/templates/Employee_Service_Agreement.docx'
        doc = DocxTemplate(template_path)

        # Prepare context data for the placeholders in the template
        context = {
            'place_of_execution': employee['place_of_execution'],
            'day': employee['day'],
            'month': employee['month'],
            'year': employee['year'],
            'company_name': employee['company_name'],
            'representative_position': employee['representative_position'],
            'representative_name': employee['representative_name'],
            'representative_father_name': employee['representative_father_name'],
            'registered_office_address': employee['registered_office_address'],
            'employee_name': employee['employee_name'],
            'employee_father_name': employee['employee_father_name'],
            'nationality': employee['nationality'],
            'employee_age': employee['employee_age'],
            'employee_address': employee['employee_address'],
            'business_nature': employee['business_nature'],
            'post_title': employee['post_title'],
            'application_date': employee['application_date'],
            'appointment_position': employee['appointment_position'],
            'probation_period': employee['probation_period'],
            'employment_duration': employee['employment_duration'],
            'work_location': employee['work_location'],
            'reporting_date': employee['reporting_date'],
            'work_start_time': employee['work_start_time'],
            'work_end_time': employee['work_end_time'],
            'weekly_holiday': employee['weekly_holiday'],
            'probation_stipend': employee['probation_stipend'],
            'basic_salary': employee['basic_salary'],
            'company_policy_reference': employee['company_policy_reference'],
            'witness_name1': employee['witness_name1'],
            'witness_name2': employee['witness_name2'],
            'lawyer_username': employee['lawyer_username']
        }

        # Render the template with the context data
        doc.render(context)

        # Save the generated document
        output_path = f'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/generated/employee_service_agreement_{employee_id}.docx'
        doc.save(output_path)
        print("Service document generated successfully:", output_path)

        # Send the generated document as a download
        return send_file(output_path, as_attachment=True)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/submitBailPetition', methods=['POST'])
def submit_bail_petition():
    print("Received POST request on /submitBailPetition")
    data = request.json
    print("Request data:", data)

    court_location = data['court_location']
    accused_name = data['accused_name']
    fir_number = data['fir_number']
    section = data['section']
    police_station = data['police_station']
    residence_address = data['residence_address']
    applicant_name = data['applicant_name']
    counsel_name = data['counsel_name']
    counsel_designation = data['counsel_designation']
    lawyer_username = data.get('lawyer_username')

    cursor = None  # Initialize cursor to None

    try:
        conn = connect_db()
        cursor = conn.cursor()
        print("Database cursor created")

        # Insert data into the bail_petition table
        cursor.execute("""
            INSERT INTO bail_petition (
                court_location, accused_name, fir_number, section, police_station, 
                residence_address, applicant_name, counsel_name, counsel_designation, lawyer_username
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            court_location, accused_name, fir_number, section, police_station, 
            residence_address, applicant_name, counsel_name, counsel_designation, lawyer_username
        ))

        conn.commit()
        print("Bail petition inserted successfully")

        return jsonify({'message': 'Bail petition submitted successfully'}), 200

    except Exception as e:
        print("Error inserting bail petition:", e)
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
            print("Database cursor closed")

# Route to fetch bail petitions from the database
@app.route('/getBail', methods=['GET'])
def get_bail_petitions():
    print("Received GET request on /getBail")
    cursor = None

    try:
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM bail_petition")
        petitions = cursor.fetchall()
        print("Fetched bail petitions:", petitions)
        return jsonify(petitions), 200
    except Exception as e:
        print("Error fetching bail petitions:", e)
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
            print("Database cursor closed")

# Route to update bail petition data in the database
@app.route('/updateBail/<int:petition_id>', methods=['PUT'])
def update_bail_petition(petition_id):
    print(f"Received PUT request on /updateBail/{petition_id}")
    data = request.json
    print("Request data:", data)

    court_location = data['court_location']
    accused_name = data['accused_name']
    fir_number = data['fir_number']
    section = data['section']
    police_station = data['police_station']
    residence_address = data['residence_address']
    applicant_name = data['applicant_name']
    counsel_name = data['counsel_name']
    counsel_designation = data['counsel_designation']

    cursor = None

    try:
        conn = connect_db()  # Connect to the database
        cursor = conn.cursor()

        print("Database cursor created")

        # Execute the SQL query to update the bail petition
        cursor.execute("""
            UPDATE bail_petition 
            SET court_location=%s, accused_name=%s, fir_number=%s, section=%s, police_station=%s,
                residence_address=%s, applicant_name=%s, counsel_name=%s, counsel_designation=%s
            WHERE id=%s
        """, (
            court_location, accused_name, fir_number, section, police_station, 
            residence_address, applicant_name, counsel_name, counsel_designation, petition_id
        ))

        conn.commit()
        print("Bail petition updated successfully")

        return jsonify({'message': 'Bail petition updated successfully'}), 200

    except Exception as e:
        print("Error updating bail petition:", e)
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
            print("Database cursor closed")

# Route to delete bail petition data from the database
@app.route('/deleteBail/<int:petition_id>', methods=['DELETE'])
def delete_bail_petition(petition_id):
    print(f"Received DELETE request on /deleteBail/{petition_id}")
    cursor = None

    try:
        conn = connect_db()  # Connect to the database
        cursor = conn.cursor()

        # Execute the SQL query to delete the bail petition by petition_id
        cursor.execute("DELETE FROM bail_petition WHERE id = %s", (petition_id,))
        conn.commit()

        if cursor.rowcount == 0:
            print("Petition not found for deletion")
            return jsonify({'error': 'Petition not found'}), 404

        print("Bail petition deleted successfully")
        return jsonify({'message': 'Bail petition deleted successfully'}), 200

    except Exception as e:
        print("Error deleting bail petition:", e)
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
            print("Database cursor closed")

# Folder to save generated documents
GENERATED_FOLDER = 'generated'
if not os.path.exists(GENERATED_FOLDER):
    os.makedirs(GENERATED_FOLDER)
print("Generated folder path:", GENERATED_FOLDER)

# Route to generate document based on bail petition data
# Folder to save generated documents
GENERATED_FOLDER = 'generated'
if not os.path.exists(GENERATED_FOLDER):
    os.makedirs(GENERATED_FOLDER)
print("Generated folder path:", GENERATED_FOLDER)

# Route to generate document based on bail petition data
@app.route('/generateBailDocument/<int:petition_id>', methods=['POST', 'GET'])
def generate_bail_document(petition_id):
    print(f"Received POST request on /generateBailDocument/{petition_id}")
    cursor = None

    try:
        # Fetch the bail petition data from the database
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM bail_petition WHERE id = %s", (petition_id,))
        petition = cursor.fetchone()
        print("Fetched petition data:", petition)

        if petition is None:
            print("Petition not found for document generation")
            return jsonify({'error': 'Petition not found'}), 404

        # Document template path and loading
        template_path = f'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/templates/Anticipatory_Bail_Petition.docx'
        print("Template path:", template_path)
        doc = DocxTemplate(template_path)

        # Prepare context for document generation
        context = {
            'court_location': petition['court_location'],
            'accused_name': petition['accused_name'],
            'fir_number': petition['fir_number'],
            'section': petition['section'],
            'police_station': petition['police_station'],
            'residence_address': petition['residence_address'],
            'applicant_name': petition['applicant_name'],
            'counsel_name': petition['counsel_name'],
            'counsel_designation': petition['counsel_designation'],
        }
        print("Document context:", context)

        # Generate document from template with the context data
        doc.render(context)
        # output_path = f'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/generated/client_{petition_id}_bail_petition.docx'
        output_path = f'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/generated/client_{petition_id}_document.docx'
        doc.save(output_path)
        print("Document generated and saved at:", output_path)

        # Send the document for download
        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print("Error generating bail document:", e)
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
            print("Database cursor closed")

# New endpoint for adoption deed submission
@app.route('/submitAdoptionDeed', methods=['POST'])
def submit_adoption_deed():
    print("Received request at /submitAdoptionDeed endpoint")
    data = request.json
    print("Request data:", data)

    place_of_execution = data['place_of_execution']
    day = data['day']
    month = data['month']
    year = data['year']
    adoptive_father_name = data['adoptive_father_name']
    adoptive_father_residence = data['adoptive_father_residence']
    adoptive_father_address = data['adoptive_father_address']
    natural_mother_name = data['natural_mother_name']
    natural_mother_residence = data['natural_mother_residence']
    natural_mother_address = data['natural_mother_address']
    adopted_son_name = data['adopted_son_name']
    former_husband_name = data['former_husband_name']
    marriage_date = data['marriage_date']
    marriage_location = data['marriage_location']
    former_name = data['former_name']
    adopted_son_dob = data['adopted_son_dob']
    petition_number = data['petition_number']
    divorce_court_location = data['divorce_court_location']
    exhibit_number = data['exhibit_number']
    divorce_date = data['divorce_date']
    marriage_registration_location = data['marriage_registration_location']
    receipt_number = data['receipt_number']
    marriage_registration_date = data['marriage_registration_date']
    adoption_date = data['adoption_date']
    court_location = data['court_location']
    witness1_name = data['witness1_name']
    witness2_name = data['witness2_name']
    witness3_name = data['witness3_name']
    lawyer_username = data['lawyer_username']

    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO adoption_deed (
                place_of_execution, day, month, year, adoptive_father_name, 
                adoptive_father_residence, adoptive_father_address, natural_mother_name, 
                natural_mother_residence, natural_mother_address, adopted_son_name, 
                former_husband_name, marriage_date, marriage_location, former_name, 
                adopted_son_dob, petition_number, divorce_court_location, exhibit_number, 
                divorce_date, marriage_registration_location, receipt_number, 
                marriage_registration_date, adoption_date, court_location, witness1_name, 
                witness2_name, witness3_name, lawyer_username
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            place_of_execution, day, month, year, adoptive_father_name, 
            adoptive_father_residence, adoptive_father_address, natural_mother_name, 
            natural_mother_residence, natural_mother_address, adopted_son_name, 
            former_husband_name, marriage_date, marriage_location, former_name, 
            adopted_son_dob, petition_number, divorce_court_location, exhibit_number, 
            divorce_date, marriage_registration_location, receipt_number, 
            marriage_registration_date, adoption_date, court_location, witness1_name, 
            witness2_name, witness3_name, lawyer_username
        ))

        conn.commit()
        print("Adoption deed inserted successfully")
        return jsonify({'message': 'Adoption deed submitted successfully'}), 200

    except mysql.connector.Error as err:
        print("Error inserting adoption deed:", err)
        return jsonify({'error': str(err)}), 500

    finally:
        cursor.close()
        conn.close()

# Route to fetch adoption deed data from the database
@app.route('/getAdoption', methods=['GET'])
def get_adoption():
    print("Received request at /getAdoption endpoint")
    try:
        conn = connect_db()  # Establish a connection
        cursor = conn.cursor(dictionary=True)
        print("Database connection established")
        
        cursor.execute("SELECT * FROM adoption_deed")
        adoption_deeds = cursor.fetchall()
        print("Fetched adoption deeds:", adoption_deeds)
        
        return jsonify(adoption_deeds), 200

    except mysql.connector.Error as err:
        print("Error fetching adoption deeds:", err)
        return jsonify({'error': str(err)}), 500

    finally:
        cursor.close()
        conn.close()
        print("Database cursor closed")

# Route to update adoption deed data in the database
@app.route('/updateAdoption/<int:editClient>', methods=['PUT'])
def update_adoption(editClient):
    print("Received request at /updateAdoption endpoint")
    print("Edit client ID:", editClient)
    data = request.json
    print("Request data:", data)

    # Extract fields from the request
    place_of_execution = data['place_of_execution']
    day = data['day']
    month = data['month']
    year = data['year']
    adoptive_father_name = data['adoptive_father_name']
    adoptive_father_residence = data['adoptive_father_residence']
    adoptive_father_address = data['adoptive_father_address']
    natural_mother_name = data['natural_mother_name']
    natural_mother_residence = data['natural_mother_residence']
    natural_mother_address = data['natural_mother_address']
    adopted_son_name = data['adopted_son_name']
    former_husband_name = data['former_husband_name']
    marriage_date = data['marriage_date']
    marriage_location = data['marriage_location']
    former_name = data['former_name']
    adopted_son_dob = data['adopted_son_dob']
    petition_number = data['petition_number']
    divorce_court_location = data['divorce_court_location']
    exhibit_number = data['exhibit_number']
    divorce_date = data['divorce_date']
    marriage_registration_location = data['marriage_registration_location']
    receipt_number = data['receipt_number']
    marriage_registration_date = data['marriage_registration_date']
    adoption_date = data['adoption_date']
    court_location = data['court_location']
    witness1_name = data['witness1_name']
    witness2_name = data['witness2_name']
    witness3_name = data['witness3_name']
    lawyer_username = data['lawyer_username']

    try:
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE adoption_deed 
            SET place_of_execution=%s, day=%s, month=%s, year=%s, adoptive_father_name=%s,
                adoptive_father_residence=%s, adoptive_father_address=%s, natural_mother_name=%s,
                natural_mother_residence=%s, natural_mother_address=%s, adopted_son_name=%s,
                former_husband_name=%s, marriage_date=%s, marriage_location=%s, former_name=%s,
                adopted_son_dob=%s, petition_number=%s, divorce_court_location=%s, exhibit_number=%s,
                divorce_date=%s, marriage_registration_location=%s, receipt_number=%s,
                marriage_registration_date=%s, adoption_date=%s, court_location=%s, witness1_name=%s,
                witness2_name=%s, witness3_name=%s, lawyer_username=%s
            WHERE deed_id=%s
        """, (
            place_of_execution, day, month, year, adoptive_father_name, 
            adoptive_father_residence, adoptive_father_address, natural_mother_name, 
            natural_mother_residence, natural_mother_address, adopted_son_name, 
            former_husband_name, marriage_date, marriage_location, former_name, 
            adopted_son_dob, petition_number, divorce_court_location, exhibit_number, 
            divorce_date, marriage_registration_location, receipt_number, 
            marriage_registration_date, adoption_date, court_location, witness1_name, 
            witness2_name, witness3_name, lawyer_username, editClient
        ))

        conn.commit()
        return jsonify({'message': 'Adoption deed updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# Route to delete adoption deed data from the database
@app.route('/deleteAdoption/<int:client_id>', methods=['DELETE'])
def delete_adoption(client_id):
    print("Received request at /deleteAdoption endpoint")
    print("Client ID to delete:", client_id)
    cursor = None
    try:
        conn = connect_db()
        cursor = conn.cursor()
        print("Database connection established")

        # Execute the DELETE query
        cursor.execute("DELETE FROM adoption_deed WHERE deed_id = %s", (client_id,))
        conn.commit()

        # Check if any rows were affected (deletion successful)
        if cursor.rowcount == 0:
            return jsonify({'error': 'Adoption deed not found'}), 404

        return jsonify({'message': 'Adoption deed deleted successfully'}), 200

    except Exception as e:
        print("Error deleting adoption deed:", e)
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
            conn.close()
            print("Database cursor closed")

# Folder to save generated documents
GENERATED_FOLDER = 'generated'
if not os.path.exists(GENERATED_FOLDER):
    os.makedirs(GENERATED_FOLDER)

# Route to generate document based on adoption deed data
@app.route('/generateAdoptionDocument/<int:client_id>',  methods=['GET', 'POST'])
def generate_adoption_document(client_id):
    try:
        # Fetch the client data from the adoption_deed table
        conn = connect_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM adoption_deed WHERE deed_id = %s", (client_id,))
        client = cursor.fetchone()

        if client is None:
            return jsonify({'error': 'Client not found'}), 404

        print("Reading document template...")
        # Define template path
        template_path = f'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/templates/Adoption_Deed.docx'
        try:
            doc = DocxTemplate(template_path)
            print("Document template read successfully.")
        except Exception as e:
            print("Error reading document template:", str(e))
            return jsonify({'error': 'Failed to read document template'}), 500

        # Prepare context for document generation
        context = {
            'place_of_execution': client['place_of_execution'],
            'day': client['day'],
            'month': client['month'],
            'year': client['year'],
            'adoptive_father_name': client['adoptive_father_name'],
            'adoptive_father_residence': client['adoptive_father_residence'],
            'adoptive_father_address': client['adoptive_father_address'],
            'natural_mother_name': client['natural_mother_name'],
            'natural_mother_residence': client['natural_mother_residence'],
            'natural_mother_address': client['natural_mother_address'],
            'adopted_son_name': client['adopted_son_name'],
            'former_husband_name': client['former_husband_name'],
            'marriage_date': client['marriage_date'],
            'marriage_location': client['marriage_location'],
            'former_name': client['former_name'],
            'adopted_son_dob': client['adopted_son_dob'],
            'petition_number': client['petition_number'],
            'divorce_court_location': client['divorce_court_location'],
            'exhibit_number': client['exhibit_number'],
            'divorce_date': client['divorce_date'],
            'marriage_registration_location': client['marriage_registration_location'],
            'receipt_number': client['receipt_number'],
            'marriage_registration_date': client['marriage_registration_date'],
            'adoption_date': client['adoption_date'],
            'court_location': client['court_location'],
            'witness1_name': client['witness1_name'],
            'witness2_name': client['witness2_name'],
            'witness3_name': client['witness3_name'],
            'lawyer_username': client['lawyer_username']
        }

        print("Updating document with client data...")
        try:
            doc.render(context)
            print("Document updated successfully.")
        except Exception as e:
            print("Error updating document:", str(e))
            return jsonify({'error': 'Failed to update document'}), 500

        # Define the output path for the generated document
        output_path = f'C:/Users/omvalia/Desktop/react_flask_project/backend/documents/generated/Client_{client_id}_Adoption_Deed.docx'

        try:
            doc.save(output_path)
            print("Document saved successfully.")
        except Exception as e:
            print("Error saving document:", str(e))
            return jsonify({'error': 'Failed to save document'}), 500

        # Send the document for download
        return send_file(output_path, as_attachment=True)
    except Exception as e:
        print("Error generating document:", str(e))
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
            conn.close()


if __name__ == '__main__':
    app.run(debug=True)
