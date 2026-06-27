const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { MY_OWN_API } = require('./api');

const app = express();

// Middleware setup
app.use(cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "x-api-key"]
}));

// ***** INCREASE JSON PAYLOAD LIMIT TO 100MB *****
app.use(express.json({ limit: '100mb' }));

// Database configuration
const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "CRM_TRADERS",
    port: 3306,
    // Increase connection timeout and packet size
    connectTimeout: 60000
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// -------- FIX: Increase max_allowed_packet for each connection ----------
pool.on('connection', function (connection) {
    // Set session variable to 1GB (1073741824 bytes)
    connection.query('SET SESSION max_allowed_packet = 1073741824', function (err) {
        if (err) {
            console.error('⚠️ Failed to set max_allowed_packet:', err.message);
        } else {
            console.log('✅ Session max_allowed_packet set to 1GB');
        }
    });
});

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
        connection.release();
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

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[target.toString()] = generatedOtp;

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

    if (!email_otp || otpStore[email.toString()] !== email_otp.toString()) {
        return res.status(400).json({ status: "error", message: "Invalid or missing Email OTP token!" });
    }

    if (!mobile_otp || otpStore[mobile.toString()] !== mobile_otp.toString()) {
        return res.status(400).json({ status: "error", message: "Invalid or missing Mobile OTP token!" });
    }

    delete otpStore[email.toString()];
    delete otpStore[mobile.toString()];

    try {
        const sql = "INSERT INTO users (name, email, password, mobile) VALUES (?, ?, ?, ?)";
        const values = [name, email, password, mobile];
        await pool.execute(sql, values);
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

// ==========================================
// PRODUCT CARD MANAGEMENT ROUTES
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
// SHOP CATEGORY MANAGEMENT ROUTES
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
// PRODUCT TYPES MANAGEMENT ROUTES
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
// PRODUCT COLOR VARIANTS ROUTES (with is_available)
// ==========================================

// Public: Get variants for a product type
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

// Admin: Get all variants (with product type info)
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

// Admin: Add variant (with is_available)
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

// Admin: Update variant (with is_available)
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

// Admin: Delete variant
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
// PRODUCT TYPE GALLERY ROUTES
// ==========================================

// Public: Get gallery images for a product type
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

// Admin: Add gallery image
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

// Admin: Delete gallery image
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

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});