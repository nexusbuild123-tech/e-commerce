const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const { MY_OWN_API } = require('./api');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "x-api-key"]
}));
app.use(express.json({ limit: '100mb' }));

// Database configuration
const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "CRM_TRADERS",
    port: 3306,
    connectTimeout: 60000
};

const pool = mysql.createPool(dbConfig);

// max_allowed_packet fix
(async function setMaxAllowedPacket() {
    try {
        const connection = await pool.getConnection();
        await connection.query('SET GLOBAL max_allowed_packet = 1073741824');
        console.log('✅ Global max_allowed_packet set to 1GB');
        connection.release();
    } catch (err) {
        console.warn('⚠️ Could not set max_allowed_packet globally. Please set manually or ignore.');
    }
})();

// OTP store (in-memory – replace with Redis in production)
const otpStore = {};

// ---------- NODEMAILER TRANSPORTER ----------
let transporter = null;
try {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    console.log('✅ Email transporter initialized');
} catch (err) {
    console.warn('⚠️ Email not configured – OTP will only be printed on console.');
}

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
        connection.release();
        return res.json({ status: "success", message: "API and Database are working perfectly!" });
    } catch (err) {
        return res.json({ status: "error", message: `Database connection failed: ${err.message}` });
    }
});

// ==========================================
// SEND OTP WITH EMAIL
// ==========================================
app.post("/send-otp", authenticateApiKey, async (req, res) => {
    const { target } = req.body; // target = user's email

    if (!target) {
        return res.status(400).json({ status: "error", message: "Email is required!" });
    }

    // Check if email already exists
    try {
        const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [target]);
        if (rows.length > 0) {
            return res.status(409).json({ status: "error", message: "Email already registered!" });
        }
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }

    // Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[target.toString()] = generatedOtp;

    // Send email
    let emailSent = false;
    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"CRM Traders" <${process.env.EMAIL_USER}>`,
                to: target,
                subject: "Your OTP for Registration",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                        <h2 style="color: #1f2937;">Welcome to CRM Traders</h2>
                        <p>Thank you for registering. Please use the OTP below to complete your registration.</p>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">
                            ${generatedOtp}
                        </div>
                        <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                        <p style="color: #9ca3af; font-size: 12px;">CRM Traders - Your trusted partner.</p>
                    </div>
                `
            });
            emailSent = true;
            console.log(`📧 OTP email sent to ${target}`);
        } catch (err) {
            console.error('❌ Email sending failed:', err.message);
            // Fallback to console
            console.log(`📧 [FALLBACK] OTP for ${target}: ${generatedOtp}`);
        }
    } else {
        console.log(`📧 [NO EMAIL CONFIG] OTP for ${target}: ${generatedOtp}`);
    }

    return res.status(200).json({
        status: "success",
        message: emailSent ? "OTP sent to your email!" : "OTP generated (email not configured – check console)"
    });
});

// ==========================================
// REGISTER (EMAIL OTP ONLY)
// ==========================================
app.post("/register", authenticateApiKey, async (req, res) => {
    const { name, email, password, mobile, email_otp } = req.body;

    if (!name || !email || !password || !mobile) {
        return res.status(400).json({ status: "error", message: "All fields are required!" });
    }

    if (!email_otp || otpStore[email.toString()] !== email_otp.toString()) {
        return res.status(400).json({ status: "error", message: "Invalid or missing Email OTP token!" });
    }

    delete otpStore[email.toString()];

    try {
        const sql = "INSERT INTO users (name, email, password, mobile) VALUES (?, ?, ?, ?)";
        await pool.execute(sql, [name, email, password, mobile]);
        return res.status(201).json({ status: "success", message: "User registered successfully!" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: "error", message: "Email already registered!" });
        }
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.get("/register", (req, res) => {
    return res.json({ message: "Send a POST request with headers and data to register." });
});

// ==========================================
// LOGIN
// ==========================================
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

// ==========================================
// UPDATE PROFILE
// ==========================================
app.put("/update-profile", authenticateApiKey, async (req, res) => {
    const { id: userId, name, email, mobile, address, password, email_otp, mobile_otp } = req.body;

    if (!userId || !name || !email || !mobile || !password || !address) {
        return res.status(400).json({ status: "error", message: "All fields are required!" });
    }

    try {
        const [currentRecords] = await pool.execute("SELECT email, mobile FROM users WHERE id = ?", [userId]);
        if (currentRecords.length === 0) {
            return res.status(404).json({ status: "error", message: "Target record not found." });
        }
        const currentRecord = currentRecords[0];

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

        delete otpStore[email.toString()];
        delete otpStore[mobile.toString()];

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

// ==========================================
// ADMIN PANEL (unchanged)
// ==========================================

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
// BANNER MANAGEMENT (unchanged)
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

// ==========================================
// PRODUCT CARD MANAGEMENT (unchanged)
// ==========================================

app.get("/product-cards", async (req, res) => {
    try {
        const [products] = await pool.execute("SELECT * FROM product_cards ORDER BY id DESC");
        return res.status(200).json({ status: "success", products });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.post("/admin/add-product-card", authenticateApiKey, async (req, res) => {
    const { name, category, description, image, discount, rating } = req.body;
    if (!name || !category || !image) {
        return res.status(400).json({ status: "error", message: "Name, category, and image are required!" });
    }
    try {
        const sql = "INSERT INTO product_cards (name, category, description, image, discount, rating) VALUES (?, ?, ?, ?, ?, ?)";
        await pool.execute(sql, [name, category, description || '', image, discount || null, rating || "4.5"]);
        return res.status(201).json({ status: "success", message: "Product card added successfully!" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.put("/admin/update-product-card/:id", authenticateApiKey, async (req, res) => {
    const { id } = req.params;
    const { name, category, description, image, discount, rating } = req.body;
    if (!name || !category || !image) {
        return res.status(400).json({ status: "error", message: "Name, category, and image are required!" });
    }
    try {
        const sql = "UPDATE product_cards SET name=?, category=?, description=?, image=?, discount=?, rating=? WHERE id=?";
        await pool.execute(sql, [name, category, description || '', image, discount || null, rating || "4.5", id]);
        return res.status(200).json({ status: "success", message: "Product card updated successfully!" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.delete("/admin/delete-product-card/:id", authenticateApiKey, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute("DELETE FROM product_cards WHERE id = ?", [id]);
        return res.status(200).json({ status: "success", message: "Product card deleted successfully!" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

// ==========================================
// SHOP CATEGORY MANAGEMENT (unchanged)
// ==========================================

app.get("/categories", async (req, res) => {
    try {
        const [categories] = await pool.execute("SELECT * FROM shop_categories ORDER BY id DESC");
        return res.status(200).json({ status: "success", categories });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.post("/admin/add-category", authenticateApiKey, async (req, res) => {
    const { name, slug, image } = req.body;
    if (!name || !slug || !image) return res.status(400).json({ status: "error", message: "All fields required!" });
    try {
        await pool.execute("INSERT INTO shop_categories (name, slug, image) VALUES (?, ?, ?)", [name, slug, image]);
        return res.status(201).json({ status: "success", message: "Category added!" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.put("/admin/update-category/:id", authenticateApiKey, async (req, res) => {
    const { id } = req.params;
    const { name, slug, image } = req.body;
    try {
        await pool.execute("UPDATE shop_categories SET name=?, slug=?, image=? WHERE id=?", [name, slug, image, id]);
        return res.status(200).json({ status: "success", message: "Category updated!" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.delete("/admin/delete-category/:id", authenticateApiKey, async (req, res) => {
    try {
        await pool.execute("DELETE FROM shop_categories WHERE id = ?", [req.params.id]);
        return res.status(200).json({ status: "success", message: "Category deleted!" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});

// ==========================================
// PRODUCT TYPES MANAGEMENT (unchanged)
// ==========================================

app.get("/product-types", async (req, res) => {
    try {
        const sql = `
            SELECT pt.*, 
                   sc.name AS category_name, 
                   pc.name AS product_card_name
            FROM product_types pt
            LEFT JOIN shop_categories sc ON pt.category_id = sc.id
            LEFT JOIN product_cards pc ON pt.product_card_id = pc.id
            ORDER BY pt.id DESC
        `;
        const [productTypes] = await pool.execute(sql);
        console.log(`✅ Fetched ${productTypes.length} product types`);
        return res.status(200).json({ status: "success", productTypes });
    } catch (err) {
        console.error("❌ Error fetching product types:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.post("/admin/add-product-type", authenticateApiKey, async (req, res) => {
    const { name, slug, description, category_id, product_card_id, image, price, discount, rating, specifications } = req.body;
    if (!name || !slug) {
        return res.status(400).json({ status: "error", message: "Name and Slug are required!" });
    }
    try {
        const sql = `
            INSERT INTO product_types 
            (name, slug, description, category_id, product_card_id, image, price, discount, rating, specifications)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [
            name, slug, description || '',
            category_id || null, product_card_id || null,
            image || null,
            price !== undefined ? price : null,
            discount !== undefined ? discount : null,
            rating !== undefined ? rating : null,
            specifications || null
        ]);
        console.log("✅ Insert result:", result);
        return res.status(201).json({ status: "success", message: "Product Type added successfully!", id: result.insertId });
    } catch (err) {
        console.error("❌ Insert error:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: "error", message: "This slug or type already exists!" });
        }
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.put("/admin/update-product-type/:id", authenticateApiKey, async (req, res) => {
    const { id } = req.params;
    const { name, slug, description, category_id, product_card_id, image, price, discount, rating, specifications } = req.body;
    if (!name || !slug) {
        return res.status(400).json({ status: "error", message: "Name and Slug are required!" });
    }
    try {
        const sql = `
            UPDATE product_types 
            SET name=?, slug=?, description=?, category_id=?, product_card_id=?, image=?, 
                price=?, discount=?, rating=?, specifications=?
            WHERE id=?
        `;
        const [result] = await pool.execute(sql, [
            name, slug, description || '',
            category_id || null, product_card_id || null,
            image || null,
            price !== undefined ? price : null,
            discount !== undefined ? discount : null,
            rating !== undefined ? rating : null,
            specifications || null,
            id
        ]);
        console.log("✅ Update result:", result);
        return res.status(200).json({ status: "success", message: "Product Type updated successfully!" });
    } catch (err) {
        console.error("❌ Update error:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.delete("/admin/delete-product-type/:id", authenticateApiKey, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute("DELETE FROM product_types WHERE id = ?", [id]);
        return res.status(200).json({ status: "success", message: "Product Type permanently deleted!" });
    } catch (err) {
        console.error("❌ Delete error:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

// ==========================================
// PRODUCT COLOR VARIANTS (unchanged)
// ==========================================

app.get("/product-color-variants/:productTypeId", async (req, res) => {
    const { productTypeId } = req.params;
    try {
        const [variants] = await pool.execute(
            "SELECT * FROM product_color_variants WHERE product_type_id = ? ORDER BY id ASC",
            [productTypeId]
        );
        return res.status(200).json({ status: "success", variants });
    } catch (err) {
        console.error("❌ Error fetching variants:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.get("/admin/product-color-variants", authenticateApiKey, async (req, res) => {
    try {
        const [variants] = await pool.execute(`
            SELECT v.*, pt.name AS product_type_name 
            FROM product_color_variants v
            JOIN product_types pt ON v.product_type_id = pt.id
            ORDER BY v.product_type_id, v.id
        `);
        return res.status(200).json({ status: "success", variants });
    } catch (err) {
        console.error("❌ Error fetching all variants:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.post("/admin/product-color-variants", authenticateApiKey, async (req, res) => {
    const { product_type_id, color_name, color_hex, image, is_available } = req.body;
    if (!product_type_id || !color_name || !color_hex) {
        return res.status(400).json({ status: "error", message: "Product type, color name and hex are required!" });
    }
    try {
        const [result] = await pool.execute(
            "INSERT INTO product_color_variants (product_type_id, color_name, color_hex, image, is_available) VALUES (?, ?, ?, ?, ?)",
            [product_type_id, color_name, color_hex, image || null, is_available !== undefined ? is_available : true]
        );
        return res.status(201).json({ status: "success", message: "Variant added!", id: result.insertId });
    } catch (err) {
        console.error("❌ Add variant error:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.put("/admin/product-color-variants/:id", authenticateApiKey, async (req, res) => {
    const { id } = req.params;
    const { color_name, color_hex, image, is_available } = req.body;
    try {
        await pool.execute(
            "UPDATE product_color_variants SET color_name=?, color_hex=?, image=?, is_available=? WHERE id=?",
            [color_name, color_hex, image || null, is_available !== undefined ? is_available : true, id]
        );
        return res.status(200).json({ status: "success", message: "Variant updated!" });
    } catch (err) {
        console.error("❌ Update variant error:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.delete("/admin/product-color-variants/:id", authenticateApiKey, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute("DELETE FROM product_color_variants WHERE id = ?", [id]);
        return res.status(200).json({ status: "success", message: "Variant deleted!" });
    } catch (err) {
        console.error("❌ Delete variant error:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

// ==========================================
// PRODUCT TYPE GALLERY (unchanged)
// ==========================================

app.get("/product-type-gallery/:productTypeId", async (req, res) => {
    const { productTypeId } = req.params;
    try {
        const [images] = await pool.execute(
            "SELECT * FROM product_type_gallery WHERE product_type_id = ? ORDER BY id ASC",
            [productTypeId]
        );
        return res.status(200).json({ status: "success", images });
    } catch (err) {
        console.error("❌ Error fetching gallery:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.post("/admin/product-type-gallery", authenticateApiKey, async (req, res) => {
    const { product_type_id, image } = req.body;
    if (!product_type_id || !image) {
        return res.status(400).json({ status: "error", message: "Product type ID and image are required!" });
    }
    try {
        const [result] = await pool.execute(
            "INSERT INTO product_type_gallery (product_type_id, image) VALUES (?, ?)",
            [product_type_id, image]
        );
        return res.status(201).json({ status: "success", message: "Gallery image added!", id: result.insertId });
    } catch (err) {
        console.error("❌ Add gallery image error:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.delete("/admin/product-type-gallery/:id", authenticateApiKey, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute("DELETE FROM product_type_gallery WHERE id = ?", [id]);
        return res.status(200).json({ status: "success", message: "Gallery image deleted!" });
    } catch (err) {
        console.error("❌ Delete gallery image error:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

// ==========================================
// ORDERS ROUTES (unchanged)
// ==========================================

app.post("/place-order", async (req, res) => {
    const {
        product_type_id, variant_id, product_name, variant_name, price, quantity, total,
        customer_name, customer_email, customer_phone, delivery_address
    } = req.body;

    if (!product_name || !price || !customer_name || !customer_email || !customer_phone || !delivery_address) {
        return res.status(400).json({ status: "error", message: "All fields are required!" });
    }

    try {
        const sql = `
            INSERT INTO orders 
            (product_type_id, variant_id, product_name, variant_name, price, quantity, total, 
             customer_name, customer_email, customer_phone, delivery_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [
            product_type_id || null,
            variant_id || null,
            product_name,
            variant_name || null,
            price,
            quantity || 1,
            total || (price * (quantity || 1)),
            customer_name,
            customer_email,
            customer_phone,
            delivery_address
        ]);
        return res.status(201).json({ 
            status: "success", 
            message: "Order placed successfully!",
            order_id: result.insertId
        });
    } catch (err) {
        console.error("❌ Order placement error:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.get("/admin/orders", authenticateApiKey, async (req, res) => {
    try {
        const [orders] = await pool.execute("SELECT * FROM orders ORDER BY created_at DESC");
        return res.status(200).json({ status: "success", orders });
    } catch (err) {
        console.error("❌ Error fetching orders:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.put("/admin/orders/:id", authenticateApiKey, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ status: "error", message: "Status is required" });
    }
    try {
        await pool.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
        return res.status(200).json({ status: "success", message: "Order status updated" });
    } catch (err) {
        console.error("❌ Error updating order:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.get("/track-order/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute("SELECT * FROM orders WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Order not found" });
        }
        return res.status(200).json({ status: "success", order: rows[0] });
    } catch (err) {
        console.error("❌ Error fetching order:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.get("/my-orders/:email", async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ status: "error", message: "Email is required" });
    }
    try {
        const [orders] = await pool.execute(
            "SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC",
            [email]
        );
        return res.status(200).json({ status: "success", orders });
    } catch (err) {
        console.error("❌ Error fetching user orders:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.post("/cancel-order/:id", async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ status: "error", message: "Email is required" });
    }

    try {
        const [rows] = await pool.execute("SELECT * FROM orders WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Order not found" });
        }
        const order = rows[0];

        if (order.customer_email !== email) {
            return res.status(403).json({ status: "error", message: "You are not authorized to cancel this order" });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ status: "error", message: "Order is already cancelled" });
        }
        if (order.status === 'delivered') {
            return res.status(400).json({ status: "error", message: "Cannot cancel a delivered order" });
        }
        if (order.status !== 'pending' && order.status !== 'confirmed') {
            return res.status(400).json({ status: "error", message: "Order cannot be cancelled at this stage" });
        }

        await pool.execute("UPDATE orders SET status = ? WHERE id = ?", ['cancelled', id]);

        return res.status(200).json({ status: "success", message: "Order cancelled successfully" });
    } catch (err) {
        console.error("❌ Cancel order error:", err);
        return res.status(500).json({ status: "error", message: err.message });
    }
});


// ==========================================
// FORGOT PASSWORD ROUTES
// ==========================================

// 1. Send OTP for password reset
app.post("/forgot-password", authenticateApiKey, async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ status: "error", message: "Email is required!" });
    }

    // Check if email exists
    try {
        const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Email not registered!" });
        }
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }

    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store with a prefix to differentiate from registration OTP
    otpStore[`reset_${email}`] = generatedOtp;

    // Send email
    let emailSent = false;
    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"CRM Traders" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Password Reset OTP",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                        <h2 style="color: #1f2937;">Password Reset Request</h2>
                        <p>You requested to reset your password. Use the OTP below to proceed.</p>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">
                            ${generatedOtp}
                        </div>
                        <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                        <p style="color: #9ca3af; font-size: 12px;">CRM Traders - Your trusted partner.</p>
                    </div>
                `
            });
            emailSent = true;
            console.log(`📧 Reset OTP email sent to ${email}`);
        } catch (err) {
            console.error('❌ Email sending failed:', err.message);
            console.log(`📧 [FALLBACK] Reset OTP for ${email}: ${generatedOtp}`);
        }
    } else {
        console.log(`📧 [NO EMAIL CONFIG] Reset OTP for ${email}: ${generatedOtp}`);
    }

    return res.status(200).json({
        status: "success",
        message: emailSent ? "OTP sent to your email!" : "OTP generated (email not configured – check console)"
    });
});

// 2. Verify OTP and reset password
app.post("/reset-password", authenticateApiKey, async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ status: "error", message: "Email, OTP and new password are required!" });
    }

    // Check OTP
    const storedOtp = otpStore[`reset_${email}`];
    if (!storedOtp || storedOtp !== otp) {
        return res.status(400).json({ status: "error", message: "Invalid or expired OTP!" });
    }

    // Delete OTP after successful verification
    delete otpStore[`reset_${email}`];

    // Update password in database
    try {
        await pool.execute("UPDATE users SET password = ? WHERE email = ?", [newPassword, email]);
        return res.status(200).json({ status: "success", message: "Password updated successfully!" });
    } catch (err) {
        return res.status(500).json({ status: "error", message: err.message });
    }
});


// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});