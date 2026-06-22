from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
from api import MY_OWN_API
import random  # NAYA IMPORT: OTP generate karne ke liye

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "x-api-key"])

db_config = {
    "host": "127.0.0.1",     
    "user": "root",
    "password": "",          
    "database": "CRM_TRADERS",  
    "port": 3306              
}

# GLOBAL IN-MEMORY STORE FOR OTP TOKENS
otp_store = {}

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


# ==========================================
# OTP GENERATION ROUTE (NEW)
# ==========================================
@app.route("/send-otp", methods=["POST", "OPTIONS"])
def send_otp():
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    client_api_key = request.headers.get("x-api-key")
    if client_api_key != MY_OWN_API:
        return jsonify({"status": "error", "message": "Unauthorized Access! Invalid API Key."}), 401

    data = request.get_json()
    target = data.get("target")  # Email ya Mobile integer stream

    if not target:
        return jsonify({"status": "error", "message": "Target destination address is required!"}), 400

    # 6-Digit random secure numeric setup
    generated_otp = str(random.randint(100000, 999999))
    otp_store[str(target)] = generated_otp

    # LOGGING EXECUTION: Aapke terminal me OTP print hoga!
    print("\n" + "="*50)
    print(f"[SECURITY CONTROL]: OTP sent to target destination: {target}")
    print(f"[ACTIVE TOKEN VALUE]: {generated_otp}")
    print("="*50 + "\n")

    return jsonify({"status": "success", "message": "Verification code dispatched successfully!"}), 200


@app.route("/register", methods=["GET", "POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    if request.method == "POST":
        client_api_key = request.headers.get("x-api-key")
        if client_api_key != MY_OWN_API:
            return jsonify({"status": "error", "message": "Unauthorized Access! Invalid API Key."}), 401

        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        mobile = data.get('mobile')
        
        # OTP data targets
        email_otp = data.get('email_otp')
        mobile_otp = data.get('mobile_otp')

        if not name or not email or not password or not mobile:
            return jsonify({"status": "error", "message": "All fields are required!"}), 400

        # OTP Validation processing block
        if not email_otp or otp_store.get(str(email)) != str(email_otp):
            return jsonify({"status": "error", "message": "Invalid or missing Email OTP token!"}), 400

        if not mobile_otp or otp_store.get(str(mobile)) != str(mobile_otp):
            return jsonify({"status": "error", "message": "Invalid or missing Mobile OTP token!"}), 400

        # Clear token verification cache post processing
        otp_store.pop(str(email), None)
        otp_store.pop(str(mobile), None)

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
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    if request.method == "POST":
        client_api_key = request.headers.get("x-api-key")
        if client_api_key != MY_OWN_API:
            return jsonify({"status": "error", "message": "Unauthorized Access! Invalid API Key."}), 401
        
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"status": "error", "message": "Email and password are required!"}), 400
        
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True) 
            sql = "SELECT id, name, email, mobile, address, password, location FROM users WHERE email = %s AND password = %s"
            cursor.execute(sql, (email, password))
            user = cursor.fetchone() 
            
            if user:
                return jsonify({"status": "success", "message": "Login successful!", "user": user}), 200
            else:
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
    
    email_otp = data.get('email_otp')
    mobile_otp = data.get('mobile_otp')

    if not user_id or not name or not email or not mobile or not password or not address:
        return jsonify({"status": "error", "message": "All fields are required!"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # STEP 1: Fetch current record to verify updates
        cursor.execute("SELECT email, mobile FROM users WHERE id = %s", (user_id,))
        current_record = cursor.fetchone()

        if not current_record:
            return jsonify({"status": "error", "message": "Target record not found."}), 404

        # STEP 2: Condition matching for field differences
        if current_record['email'] != email:
            if not email_otp or otp_store.get(str(email)) != str(email_otp):
                return jsonify({"status": "error", "message": "Invalid verification tracking token for new email Address!"}), 400

        if current_record['mobile'] != mobile:
            if not mobile_otp or otp_store.get(str(mobile)) != str(mobile_otp):
                return jsonify({"status": "error", "message": "Invalid verification tracking token for new mobile number!"}), 400

        # Purge used OTP entries from dictionary
        otp_store.pop(str(email), None)
        otp_store.pop(str(mobile), None)

        # STEP 3: Database execution block
        sql = "UPDATE users SET name=%s, email=%s, mobile=%s, address=%s, password=%s WHERE id=%s"
        val = (name, email, mobile, address, password, user_id)
        cursor.execute(sql, val)
        conn.commit()

        return jsonify({
            "status": "success",
            "message": "Profile updated successfully!",
            "user": {"id": user_id, "name": name, "email": email, "mobile": mobile, "address": address, "password": password}
        }), 200

    except mysql.connector.Error as err:
        return jsonify({"status": "error", "message": str(err)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route("/update-location", methods=["PUT"])
def update_location():
    client_api_key = request.headers.get("x-api-key")
    if client_api_key != MY_OWN_API:
        return jsonify({"status": "error", "message": "Invalid API Key"}), 401

    data = request.get_json()
    user_id = data.get("id")
    location = data.get("location")

    if not user_id or not location:
        return jsonify({"status": "error", "message": "User ID and location required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        sql = "UPDATE users SET location=%s WHERE id=%s"
        cursor.execute(sql, (location, user_id))
        conn.commit()
        return jsonify({"status": "success", "message": "Location updated successfully"})
    except mysql.connector.Error as err:
        return jsonify({"status": "error", "message": str(err)}), 500
    finally:
        cursor.close()
        conn.close()


# --------ADMIN PANEL--------

@app.route("/admin/login", methods=["GET", "OPTIONS", "POST"])
def admin_login():
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    if request.method == "POST":
        client_api_key = request.headers.get("x-api-key")
        if client_api_key != MY_OWN_API:
            return jsonify({"status": "error", "message": "Unauthorized Access! Invalid API Key."}), 401
        
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"status": "error", "message": "Admin Email and password are required!"}), 400
        
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True) 
            sql = "SELECT id, email FROM admins WHERE email = %s AND password = %s"
            cursor.execute(sql, (email, password))
            admin_user = cursor.fetchone() 
            
            if admin_user:
                return jsonify({"status": "success", "message": "Admin Login successful!", "admin": admin_user, "redirect_to": "/admin/dashboard"}), 200
            else:
                return jsonify({"status": "error", "message": "Invalid Admin credentials!"}), 401
        except mysql.connector.Error as err:
            return jsonify({"status": "error", "message": f"Database Error: {str(err)}"}), 500
        except Exception as e:
             return jsonify({"status": "error", "message": f"Server Error: {str(e)}"}), 500
        finally:
            if cursor: cursor.close()
            if conn: conn.close()
                
    return jsonify({"message": "Send a POST request with admin email and password to login."})

 
# ==========================================
# BANNER MANAGEMENT ROUTES (NEW)
# ==========================================

@app.route("/banners", methods=["GET"])
def get_banners():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, filename, image_data FROM banners ORDER BY id DESC")
        banners = cursor.fetchall()
        return jsonify({"status": "success", "banners": banners}), 200
    except mysql.connector.Error as err:
        return jsonify({"status": "error", "message": str(err)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


@app.route("/admin/upload-banner", methods=["POST", "OPTIONS"])
def upload_banner():
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    client_api_key = request.headers.get("x-api-key")
    if client_api_key != MY_OWN_API:
        return jsonify({"status": "error", "message": "Unauthorized Access!"}), 401

    data = request.get_json()
    filename = data.get("filename")
    image_data = data.get("image_data")

    if not filename or not image_data:
        return jsonify({"status": "error", "message": "Image and filename are required!"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "INSERT INTO banners (filename, image_data) VALUES (%s, %s)"
        cursor.execute(sql, (filename, image_data))
        conn.commit()
        return jsonify({"status": "success", "message": "Banner uploaded successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"status": "error", "message": str(err)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


@app.route("/admin/delete-banner/<int:banner_id>", methods=["DELETE", "OPTIONS"])
def delete_banner(banner_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "success"}), 200

    client_api_key = request.headers.get("x-api-key")
    if client_api_key != MY_OWN_API:
        return jsonify({"status": "error", "message": "Unauthorized Access!"}), 401

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM banners WHERE id = %s", (banner_id,))
        conn.commit()
        return jsonify({"status": "success", "message": "Banner deleted successfully!"}), 200
    except mysql.connector.Error as err:
        return jsonify({"status": "error", "message": str(err)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()   

if __name__ == '__main__':
    app.run(debug=True, port=5000)