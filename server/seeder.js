const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Add bcrypt
const User = require('./models/User');
const Part = require('./models/Part');
const Order = require('./models/Order');

dotenv.config();

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Connect to DB explicitly

        await Order.deleteMany();
        await Part.deleteMany();
        await User.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash('password123', salt);

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashPassword,
                role: 'admin', // Fixed role
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashPassword,
                role: 'user', // Fixed role
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashPassword,
                role: 'user', // Fixed role
            },
        ];

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleParts = [
            // ENGINE
            { name: 'V8 Engine Block', image: '/images/engine.png', brand: 'Ford Performance', category: 'Engine', description: 'Cast iron block for high performance builds.', modelNumber: 'ENG-V8-001', price: 1299.99, countInStock: 5 },
            { name: 'Turbocharger Kit', image: '/images/turbo.png', brand: 'Garrett', category: 'Engine', description: 'Complete turbo kit for 2.0L engines.', modelNumber: 'TRB-K-55', price: 850.00, countInStock: 8 },
            { name: 'High-Flow Air Filter', image: '/images/oil_filter.png', brand: 'K&N', category: 'Engine', description: 'Performance air filter for better airflow.', modelNumber: 'AF-HF-99', price: 54.99, countInStock: 100 },
            { name: 'Timing Belt Kit', image: '/images/engine.png', brand: 'Gates', category: 'Engine', description: 'Complete timing belt replacement kit.', modelNumber: 'TB-K-01', price: 120.50, countInStock: 25 },

            // BRAKES
            { name: 'Ceramic Brake Pads (Front)', image: '/images/brakes.png', brand: 'Brembo', category: 'Brakes', description: 'Low dust ceramic pads for street use.', modelNumber: 'BP-F-001', price: 89.99, countInStock: 50 },
            { name: 'Drilled Rotors (Pair)', image: '/images/brakes.png', brand: 'StopTech', category: 'Brakes', description: 'Cross-drilled rotors for better cooling.', modelNumber: 'RT-D-55', price: 199.99, countInStock: 15 },
            { name: 'Brake Caliper (Red)', image: '/images/brakes.png', brand: 'Wilwood', category: 'Brakes', description: '4-piston performance caliper.', modelNumber: 'BC-R-04', price: 349.50, countInStock: 10 },

            // SUSPENSION
            { name: 'Coilover Kit', image: '/images/suspension.png', brand: 'KW Suspension', category: 'Suspension', description: 'Adjustable height and damping coilovers.', modelNumber: 'CO-V3-00', price: 1450.00, countInStock: 4 },
            { name: 'Sway Bar Link', image: '/images/suspension.png', brand: 'Moog', category: 'Suspension', description: 'Heavy duty sway bar end link.', modelNumber: 'SB-L-99', price: 24.99, countInStock: 60 },

            // ELECTRICAL
            { name: 'AGM Car Battery', image: '/images/battery.png', brand: 'Optima', category: 'Electrical', description: 'High cold cranking amps battery.', modelNumber: 'BAT-AGM-34', price: 219.00, countInStock: 20 },
            { name: 'Alternator 120A', image: '/images/engine.png', brand: 'Denso', category: 'Electrical', description: 'High output alternator.', modelNumber: 'ALT-120-X', price: 180.00, countInStock: 12 },
            { name: 'LED Headlight Bulbs', image: '/images/lights.png', brand: 'Philips', category: 'Electrical', description: '6000K Cool White LED bulbs.', modelNumber: 'LED-H4-00', price: 45.99, countInStock: 80 },

            // BODY
            { name: 'Carbon Fiber Hood', image: '/images/interior.png', brand: 'Seibon', category: 'Body', description: 'Lightweight carbon fiber hood.', modelNumber: 'CF-HD-99', price: 899.00, countInStock: 3 },
            { name: 'Front Bumper Lip', image: '/images/interior.png', brand: 'APR', category: 'Body', description: 'Aerodynamic front splitter.', modelNumber: 'LIP-F-01', price: 350.00, countInStock: 8 },

            // TRANSMISSION
            { name: 'Clutch Kit Stage 2', image: '/images/engine.png', brand: 'Exedy', category: 'Transmission', description: 'Performance clutch for street/strip.', modelNumber: 'CL-ST2-00', price: 420.00, countInStock: 15 },
            { name: 'Short Throw Shifter', image: '/images/interior.png', brand: 'Hurst', category: 'Transmission', description: 'Reduces shift throw by 40%.', modelNumber: 'STS-01-X', price: 150.00, countInStock: 25 },

            // WHEELS/TIRES
            { name: '18" Alloy Wheel', image: '/images/wheel.png', brand: 'Enkei', category: 'Wheels', description: 'Lightweight racing wheel.', modelNumber: 'WH-RPF1', price: 325.00, countInStock: 40 },
            { name: 'Performance Tire 245/40', image: '/images/wheel.png', brand: 'Michelin', category: 'Wheels', description: 'Super Sport summer tire.', modelNumber: 'T-PSS-245', price: 250.00, countInStock: 30 },

            // MORE RANDOM
            { name: 'Spark Plug Wires', image: '/images/sparkplugs.png', brand: 'NGK', category: 'Ignition', description: 'Blue performance wires.', modelNumber: 'SPW-009', price: 40.00, countInStock: 50 },
            { name: 'Oil Cooler Kit', image: '/images/oil_filter.png', brand: 'Mishimoto', category: 'Engine', description: 'Keep oil temps low during track use.', modelNumber: 'OC-K-10', price: 280.00, countInStock: 7 },
            { name: 'Roof Rack', image: '/images/interior.png', brand: 'Thule', category: 'Body', description: 'Cargo carrier for roof.', modelNumber: 'RR-TH-01', price: 450.00, countInStock: 10 },
            { name: 'Floor Mats All-Weather', image: '/images/interior.png', brand: 'WeatherTech', category: 'Interior', description: 'Laser measured floor protection.', modelNumber: 'FM-AW-99', price: 180.00, countInStock: 25 },
            { name: 'Racing Seat', image: '/images/interior.png', brand: 'Sparco', category: 'Interior', description: 'FIA approved bucket seat.', modelNumber: 'RS-FIA-01', price: 700.00, countInStock: 6 },
        ].map(p => ({ ...p, user: adminUser }));

        await Part.insertMany(sampleParts);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Part.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
