const axios = require('axios');

const checkApi = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/parts');
        console.log("Status:", response.status);
        console.log("Is Array:", Array.isArray(response.data));
        console.log("Length:", response.data.length);
        if (response.data.length > 0) {
            console.log("First Item:", response.data[0]);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkApi();
