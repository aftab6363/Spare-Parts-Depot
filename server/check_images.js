const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Part = require('./models/Part');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const parts = await Part.find({}, 'name image');
        console.log("Checking first 5 parts:");
        parts.slice(0, 5).forEach(p => console.log(`${p.name}: ${p.image}`));
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
