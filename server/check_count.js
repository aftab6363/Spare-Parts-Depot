const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Part = require('./models/Part');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const count = await Part.countDocuments();
        console.log(`\n\nExisting Parts in DB: ${count}\n\n`);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
