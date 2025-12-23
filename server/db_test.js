const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log("Testing DB Connection...");
console.log("URI present:", !!process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("SUCCESS: MongoDB Connected!");
        process.exit(0);
    })
    .catch(err => {
        console.error("FAILURE: Connection Error:");
        console.error(err);
        process.exit(1);
    });
