const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Fix path to .env if needed, but assuming run from server dir:
dotenv.config();

const User = require('./models/User');
const Part = require('./models/Part');

const diagnose = async () => {
    console.log("--- DIAGNOSTIC START ---");
    console.log("1. Checking Environment Variables...");
    if (!process.env.MONGODB_URI) {
        console.error("ERROR: MONGODB_URI is missing!");
        process.exit(1);
    }
    if (!process.env.JWT_SECRET) {
        console.error("ERROR: JWT_SECRET is missing!");
        process.exit(1);
    }
    console.log("   URI exists. Secret exists.");

    console.log("2. Connecting to MongoDB...");
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("   Connection Successful.");
    } catch (err) {
        console.error("   Connection FAILED:", err.message);
        process.exit(1);
    }

    console.log("3. Testing User Model...");
    try {
        const userCount = await User.countDocuments();
        console.log(`   Found ${userCount} users.`);
        const admin = await User.findOne({ email: 'admin@example.com' });
        if (admin) {
            console.log("   Admin query: SUCCESS");
            console.log("   Admin Role:", admin.role);
            console.log("   Admin Password (Hashed):", admin.password.substring(0, 10) + "...");
        } else {
            console.warn("   Admin query: User Not Found (Did seeder run?)");
        }
    } catch (err) {
        console.error("   User Model Error:", err.message);
    }

    console.log("4. Testing Part Model...");
    try {
        const partCount = await Part.countDocuments();
        console.log(`   Found ${partCount} parts.`);
        const parts = await Part.find({}).limit(1);
        if (parts.length > 0) {
            console.log("   Part query: SUCCESS");
            console.log("   Sample Part:", parts[0].name);
        } else {
            console.warn("   Part query: No parts found.");
        }
    } catch (err) {
        console.error("   Part Model Error:", err.message);
    }

    console.log("--- DIAGNOSTIC END ---");
    process.exit(0);
};

diagnose();
