import { User, Audit } from "../../../common/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { securityQueue } from "../queues/redisQueues.js";

/* ---------------------- SIGNUP ---------------------- */
export const signup = async (req, res) => {
  console.log("🔥 [SIGNUP] Route hit");
  console.log("🔥 [SIGNUP] Body received:", req.body);

  try {
    const { username, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ username }).catch(err => {
      console.log("❌ [SIGNUP] Mongo findOne error:", err);
    });

    console.log("🔎 [SIGNUP] Existing user lookup result:", existing);

    if (existing) {
      console.log("❌ [SIGNUP] User already exists:", username);
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10).catch(err => {
      console.log("❌ [SIGNUP] bcrypt hash error:", err);
    });

    console.log("🔐 [SIGNUP] Password hashed");

    // Create user
    const user = await User.create({
      username,
      passwordHash: hash
    }).catch(err => {
      console.log("❌ [SIGNUP] Mongo create error:", err);
    });

    console.log("✅ [SIGNUP] User created:", user);

    if (!user) {
      console.log("❌ [SIGNUP] User creation returned null");
      return res.status(500).json({ error: "Signup failed (null user)" });
    }

    // Send event to security agent
    console.log("📨 [SIGNUP] Sending signup audit to Security Agent...");

    await securityQueue.add("audit", {
      actor: username,
      action: "signup",
      resourceId: user._id.toString(),
      resourceType: "user",
      timestamp: new Date()
    }).catch(err => {
      console.log("❌ [SIGNUP] Security queue error:", err);
    });

    console.log("🔵 [SIGNUP] Audit event sent");

    // Respond success
    res.json({ success: true, userId: user._id });

  } catch (err) {
    console.error("🔥 [SIGNUP ERROR]", err);
    res.status(500).json({ error: "Signup failed", detail: err.message });
  }
};



/* ---------------------- LOGIN ---------------------- */
export const login = async (req, res) => {
  console.log("🔥 [LOGIN] Route hit");
  console.log("🔥 [LOGIN] Body received:", req.body);

  try {
    const { username, password } = req.body;

    // Lookup user
    const user = await User.findOne({ username }).catch(err => {
      console.log("❌ [LOGIN] Mongo findOne error:", err);
    });

    console.log("🔎 [LOGIN] User lookup result:", user);

    // Log login attempt
    console.log("📨 [LOGIN] Sending login_attempt audit to Security Agent...");
    await securityQueue.add("audit-login", {
      actor: username,
      action: "login_attempt",
      resourceId: "auth",
      resourceType: "login",
      timestamp: new Date()
    }).catch(err => {
      console.log("❌ [LOGIN] Security queue error:", err);
    });

    if (!user) {
      console.log("❌ [LOGIN] No user found for:", username);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash).catch(err => {
      console.log("❌ [LOGIN] bcrypt compare error:", err);
    });

    console.log("🔐 [LOGIN] Password match result:", match);

    if (!match) {
      console.log("❌ [LOGIN] Incorrect password for:", username);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Issue token
    const token = jwt.sign(
      { userId: user._id, username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("🔑 [LOGIN] Token generated");

    res.json({ success: true, token });

  } catch (err) {
    console.error("🔥 [LOGIN ERROR]", err);
    res.status(500).json({ error: "Login failed", detail: err.message });
  }
};
