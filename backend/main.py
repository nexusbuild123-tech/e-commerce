from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
from api import MY_OWN_API

app = Flask(__name__)
# Purane CORS(app) ko hata dein aur ise lagayein
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "x-api-key"])

db_config = {
    "host": "127.0.0.1",     
    "user": "root",
    "password": "",          
    "database": "CRM_TRADERS",  
    "port": 3306              
}

def get_db_connection():
    return mysql.connector.connect(**db_config)


@app.route("/api_init", methods=["GET"])
def api_init():
    try:
        conn = get_db_connection()
        if conn.is_connected():
            conn.close()
            return jsonify({"status": "success", "message": "API and Database are working perfectly!"})
    except mysql.connector.Error as err:
        return jsonify({"status": "error", "message": f"Database connection failed: {err}"})


@app.route("/register", methods=["GET", "POST", "OPTIONS"])
def register():
    # Browser pre-flight request ke liye
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    if request.method == "POST":
        # 1. API KEY VALIDATION STEP
        client_api_key = request.headers.get("x-api-key")
        
        if client_api_key != MY_OWN_API:
            return jsonify({"status": "error", "message": "Unauthorized Access! Invalid API Key."}), 401

        # 2. DATA EXTRACTION STEP
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        mobile = data.get('mobile')

        if not name or not email or not password:
            return jsonify({"status": "error", "message": "All fields are required!"}), 400

        # 3. DATABASE INSERTION STEP
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            sql = "INSERT INTO users (name, email, password, mobile) VALUES (%s, %s, %s, %s)"
            val = (name, email, password, mobile)
            
            cursor.execute(sql, val)
            conn.commit()
            
            return jsonify({"status": "success", "message": "User registered successfully!"}), 201

        except mysql.connector.Error as err:
            if err.errno == 1062: 
                return jsonify({"status": "error", "message": "Email already registered!"}), 409
            return jsonify({"status": "error", "message": str(err)}), 500
        
        finally:
            if cursor: cursor.close()
            if conn: conn.close()
            
    return jsonify({"message": "Send a POST request with headers and data to register."})


@app.route("/login", methods=["GET", "OPTIONS", "POST"])
def login():
    # Browser pre-flight request ke liye
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    if request.method == "POST":
        # 1. API KEY VALIDATION STEP
        client_api_key = request.headers.get("x-api-key")
        
        if client_api_key != MY_OWN_API:
            return jsonify({"status": "error", "message": "Unauthorized Access! Invalid API Key."}), 401
        
        # 2. DATA EXTRACTION
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # Validation: Agar dono mein se koi ek cheez missing ho
        if not email or not password:
            return jsonify({"status": "error", "message": "Email and password are required!"}), 400
        
        # 3. DATABASE CHECK STEP
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            # dictionary=True karne se response sidha JSON format mein aayega
            cursor = conn.cursor(dictionary=True) 
            
            # Query: Check karo kya is email aur password ka koi user hai?
            sql = """
SELECT id, name, email, mobile, address, password,location
FROM users
WHERE email = %s AND password = %s
"""
            val = (email, password)
            
            cursor.execute(sql, val)
            user = cursor.fetchone() # Fetchone sirf 1 result nikalta hai
            
            if user:
                # Agar user mil gaya toh login success
                return jsonify({
                    "status": "success", 
                    "message": "Login successful!",
                    "user": user # Frontend ko name aur email de diya (password security ke liye wapas nahi bhejte)
                }), 200
            else:
                # Agar data match nahi hua
                return jsonify({"status": "error", "message": "Invalid email or password!!!"}), 401

        except mysql.connector.Error as err:
            return jsonify({"status": "error", "message": str(err)}), 500
        
        finally:
            if cursor: cursor.close()
            if conn: conn.close()
            
    return jsonify({"message": "Send a POST request with headers, email and password to login."})



@app.route("/update-profile", methods=["PUT", "OPTIONS"])
def update_profile():

    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    data = request.get_json()

    user_id = data.get("id")
    name = data.get("name")
    email = data.get("email")
    mobile = data.get("mobile")
    address = data.get("address")
    password = data.get('password')

    if not user_id or not name or not email or not mobile or not password or not address:
        return jsonify({
            "status": "error",
            "message": "All fields are required!"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        sql = """
            UPDATE users
            SET name=%s, email=%s, mobile=%s, address=%s, password=%s
            WHERE id=%s
        """
        # Val tuple ka order bhi fix kiya
        val = (name, email, mobile, address, password, user_id)

        cursor.execute(sql, val)
        conn.commit()

        if cursor.rowcount >= 0:
            return jsonify({
                "status": "success",
                "message": "Profile updated successfully!",
                "user": {
                    "id": user_id,
                    "name": name,
                    "email": email,
                    "mobile": mobile,
                    "address": address,
                    "password": password,
                }
            }), 200

        return jsonify({
            "status": "error",
            "message": "User not found"
        }), 404

    except mysql.connector.Error as err:
        return jsonify({
            "status": "error",
            "message": str(err)
        }), 500

    finally:
        cursor.close()
        conn.close()

@app.route("/update-location", methods=["PUT"])
def update_location():

    client_api_key = request.headers.get("x-api-key")

    if client_api_key != MY_OWN_API:
        return jsonify({
            "status": "error",
            "message": "Invalid API Key"
        }), 401

    data = request.get_json()

    user_id = data.get("id")
    location = data.get("location")

    if not user_id or not location:
        return jsonify({
            "status": "error",
            "message": "User ID and location required"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        sql = """
        UPDATE users
        SET location=%s
        WHERE id=%s
        """

        cursor.execute(sql, (location, user_id))
        conn.commit()

        return jsonify({
            "status": "success",
            "message": "Location updated successfully"
        })

    except mysql.connector.Error as err:
        return jsonify({
            "status": "error",
            "message": str(err)
        }), 500

    finally:
        cursor.close()
        conn.close()


# --------ADMIN PANEL--------


@app.route("/admin/login", methods=["GET", "OPTIONS", "POST"])
def admin_login():
    # Browser pre-flight request ke liye
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    if request.method == "POST":
        # 1. API KEY VALIDATION STEP
        client_api_key = request.headers.get("x-api-key")
        
        if client_api_key != MY_OWN_API:
            return jsonify({"status": "error", "message": "Unauthorized Access! Invalid API Key."}), 401
        
        # 2. DATA EXTRACTION
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"status": "error", "message": "Admin Email and password are required!"}), 400
        
        # 3. DATABASE CHECK STEP
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True) 
            
            # Query: Check karein admins table mein
            sql = "SELECT id, email FROM admins WHERE email = %s AND password = %s"
            val = (email, password)
            
            cursor.execute(sql, val)
            admin_user = cursor.fetchone() 
            
            if admin_user:
                # Agar admin mil gaya toh login success
                return jsonify({
                    "status": "success", 
                    "message": "Admin Login successful!",
                    "admin": admin_user,
                    # Frontend dev ko hint dene ke liye ki ab dashboard pe redirect karna hai
                    "redirect_to": "/admin/dashboard" 
                }), 200
            else:
                return jsonify({"status": "error", "message": "Invalid Admin credentials!"}), 401
        except mysql.connector.Error as err:
                    return jsonify({"status": "error", "message": f"Database Error: {str(err)}"}), 500
        
        # YEH NAYA BLOCK ADD KAREIN: Baaki saare errors pakadne ke liye
        except Exception as e:
                 return jsonify({"status": "error", "message": f"Server Error: {str(e)}"}), 500
            
        finally:
                if cursor: cursor.close()
                if conn: conn.close()
                
    return jsonify({"message": "Send a POST request with admin email and password to login."})
    

if __name__ == '__main__':
    app.run(debug=True, port=5000)


