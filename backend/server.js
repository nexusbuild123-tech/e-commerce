const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promise wrapper for async/await
const { MY_OWN_API } = require('./api');

const app = express();

// Middleware setup
app.use(cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "x-api-key"]
}));
app.use(express.json()); // Parses incoming JSON requests

// Database configuration
const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "CRM_TRADERS",
    port: 3306
};

// Create a connection pool (Better performance than opening/closing per request)
const pool = mysql.createPool(dbConfig);

// GLOBAL IN-MEMORY STORE FOR OTP TOKENS
const otpStore = {};

// Helper Middleware: API Key Validator
const authenticateApiKey = (req, res, next) => {
    const clientApiKey = req.headers['x-api-key'];
    if (clientApiKey !== MY_OWN_API) {
        return res.status(401).json({ status: "error", message: "Unauthorized Access! Invalid API Key." });
    }
    next();
};

// ==========================================
// ROUTES
// ==========================================

app.get("/api_init", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release(); // release back to pool
        return res.json({ status: "success", message: "API and Database are working perfectly!" });
    } catch (err) {
        return res.json({ status: "error", message: `Database connection failed: ${err.message}` });
    }
});

// ==========================================
// OTP GENERATION ROUTE
// ==========================================
app.post("/send-otp", authenticateApiKey, (req, res) => {
    const { target } = req.body;

    if (!target) {
        return res.status(400).json({ status: "error", message: "Target destination address is required!" });
    }

    // 6-Digit random secure numeric setup
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[target.toString()] = generatedOtp;

    // LOGGING EXECUTION
    console.log("\n" + "=".repeat(50));
    console.log(`[SECURITY CONTROL]: OTP sent to target destination: ${target}`);
    console.log(`[ACTIVE TOKEN VALUE]: ${generatedOtp}`);
    console.log("=".repeat(50) + "\n");

    return res.status(200).json({ status: "success", message: "Verification code dispatched successfully!" });
});

app.post("/register", authenticateApiKey, async (req, res) => {
    const { name, email, password, mobile, email_otp, mobile_otp } = req.body;

    if (!name || !email || !password || !mobile) {
        return res.status(400).json({ status: "error", message: "All fields are required!" });
    }

    // OTP Validation processing block
    if (!email_otp || otpStore[email.toString()] !== email_otp.toString()) {
        return res.status(400).json({ status: "error", message: "Invalid or missing Email OTP token!" });
    }

    if (!mobile_otp || otpStore[mobile.toString()] !== mobile_otp.toString()) {
        return res.status(400).json({ status: "error", message: "Invalid or missing Mobile OTP token!" });
    }

    // Clear token verification cache post processing
    delete otpStore[email.toString()];
    delete otpStore[mobile.toString()];

    try {
        const sql = "INSERT INTO users (name, email, password, mobile) VALUES (?, ?, ?, ?)";
        const values = [name, email, password, mobile];
        await pool.execute(sql, values);
        
        return res.status(201).json({ status: "success", message: "User registered successfully!" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') { // Node equivalent of MySQL 1062
            return res.status(409).json({ status: "error", message: "Email already registered!" });
        }
        return res.status(500).json({ status: "error", message: err.message });
    }
});

// Handled GET request to mimic Flask's message functionality
app.get("/register", (req, res) => {
    return res.json({ message: "Send a POST request with headers and data to register." });
});

app.post("/login", authenticateApiKey, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Email and password are required!" });
    }

    try {
        const sql = "SELECT id, name, email, mobile, address, password, location FROM users WHERE email = ? AND password = ?";
        const [rows] = await pool.execute(sql, [email, password]);
        
        if (rows.length > 0) {
            return res.status(200).json({ status: "success", message: "Login successful!", user: rows[0] });
        } else {
            return res.status(401).json({ status: "error", message: "Invalid email or password!!!" });
        }
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.get("/login", (req, res) => {
    return res.json({ message: "Send a POST request with headers, email and password to login." });
});

app.put("/update-profile", authenticateApiKey, async (req, res) => {
    const { id: userId, name, email, mobile, address, password, email_otp, mobile_otp } = req.body;

    if (!userId || !name || !email || !mobile || !password || !address) {
        return res.status(400).json({ status: "error", message: "All fields are required!" });
    }

    try {
        // STEP 1: Fetch current record to verify updates
        const [currentRecords] = await pool.execute("SELECT email, mobile FROM users WHERE id = ?", [userId]);
        
        if (currentRecords.length === 0) {
            return res.status(404).json({ status: "error", message: "Target record not found." });
        }
        
        const currentRecord = currentRecords[0];

        // STEP 2: Condition matching for field differences
        if (currentRecord.email !== email) {
            if (!email_otp || otpStore[email.toString()] !== email_otp.toString()) {
                return res.status(400).json({ status: "error", message: "Invalid verification tracking token for new email Address!" });
            }
        }

        if (currentRecord.mobile !== mobile) {
            if (!mobile_otp || otpStore[mobile.toString()] !== mobile_otp.toString()) {
                return res.status(400).json({ status: "error", message: "Invalid verification tracking token for new mobile number!" });
            }
        }

        // Purge used OTP entries from dictionary
        delete otpStore[email.toString()];
        delete otpStore[mobile.toString()];

        // STEP 3: Database execution block
        const sql = "UPDATE users SET name=?, email=?, mobile=?, address=?, password=? WHERE id=?";
        await pool.execute(sql, [name, email, mobile, address, password, userId]);

        return res.status(200).json({
            status: "success",
            message: "Profile updated successfully!",
            user: { id: userId, name, email, mobile, address, password }
        });

    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.put("/update-location", authenticateApiKey, async (req, res) => {
    const { id: userId, location } = req.body;

    if (!userId || !location) {
        return res.status(400).json({ status: "error", message: "User ID and location required" });
    }

    try {
        const sql = "UPDATE users SET location=? WHERE id=?";
        await pool.execute(sql, [location, userId]);
        return res.json({ status: "success", message: "Location updated successfully" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

// --------ADMIN PANEL--------

app.post("/admin/login", authenticateApiKey, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Admin Email and password are required!" });
    }

    try {
        const sql = "SELECT id, email FROM admins WHERE email = ? AND password = ?";
        const [rows] = await pool.execute(sql, [email, password]);
        
        if (rows.length > 0) {
            return res.status(200).json({ 
                status: "success", 
                message: "Admin Login successful!", 
                admin: rows[0], 
                redirect_to: "/admin/dashboard" 
            });
        } else {
            return res.status(401).json({ status: "error", message: "Invalid Admin credentials!" });
        }
    } catch (err) {
        return res.status(500).json({ status: "error", message: `Database Error: ${err.message}` });
    }
});

app.get("/admin/login", (req, res) => {
    return res.json({ message: "Send a POST request with admin email and password to login." });
});

// ==========================================
// BANNER MANAGEMENT ROUTES
// ==========================================

app.get("/banners", async (req, res) => {
    try {
        const [banners] = await pool.execute("SELECT id, filename, image_data FROM banners ORDER BY id DESC");
        return res.status(200).json({ status: "success", banners });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.post("/admin/upload-banner", authenticateApiKey, async (req, res) => {
    const { filename, image_data } = req.body;

    if (!filename || !image_data) {
        return res.status(400).json({ status: "error", message: "Image and filename are required!" });
    }

    try {
        const sql = "INSERT INTO banners (filename, image_data) VALUES (?, ?)";
        await pool.execute(sql, [filename, image_data]);
        return res.status(201).json({ status: "success", message: "Banner uploaded successfully!" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.delete("/admin/delete-banner/:banner_id", authenticateApiKey, async (req, res) => {
    const { banner_id } = req.params;

    try {
        await pool.execute("DELETE FROM banners WHERE id = ?", [banner_id]);
        return res.status(200).json({ status: "success", message: "Banner deleted successfully!" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});