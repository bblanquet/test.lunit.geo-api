const axios = require('axios');

function generateRandomCoordinates() {
    const min = -180;
    const max = 180;
    const randomLongitude = Math.random() * 360 - 180;
    const randomLatitude = Math.random() * 180 - 90;
    return [randomLongitude, randomLatitude];
}

const endpointUrl = 'http://localhost:3000/points';

async function sendPostRequest(coordinates) {
    const requestBody = {
        type: "Point",
        coordinates: coordinates
    };

    try {
        const response = await axios.post(endpointUrl, requestBody);
        console.log(`Request succeeded with status code ${response.status}`);
    } catch (error) {
        if (error.response) {
            console.error(`Request failed with status code ${error.response.status}`);
            console.error(`Response data:`, error.response.data);
            console.error(`Response headers:`, error.response.headers);
        } else if (error.request) {
            console.error(`Request made but no response received:`, error.request);
        } else {
            console.error(`Error setting up request:`, error.message);
        }
    }
}

async function sendMultipleRequests(numRequests) {
    for (let i = 0; i < numRequests; i++) {
        const coordinates = generateRandomCoordinates();
        await sendPostRequest(coordinates);
    }
}

sendMultipleRequests(50);