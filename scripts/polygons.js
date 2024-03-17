const axios = require('axios');

const endpointUrl = 'http://localhost:3000/contours';

async function sendPostRequest(coordinates) {
    const requestBody = {
        type: 'Polygon',
        coordinates: coordinates,
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
        const sideLength = Math.random() * (10 - 5) + 5; // Random side length between 5 and 10
        const centerX = Math.random() * 340 - 170;
        const centerY = Math.random() * 160 - 80;
        const coordinates = [
            [centerX - sideLength / 2, centerY - sideLength / 2],
            [centerX + sideLength / 2, centerY - sideLength / 2],
            [centerX + sideLength / 2, centerY + sideLength / 2],
            [centerX - sideLength / 2, centerY + sideLength / 2],
            [centerX - sideLength / 2, centerY - sideLength / 2],
        ];
        await sendPostRequest(coordinates);
    }
}

sendMultipleRequests(50);
