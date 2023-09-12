const axios = require('axios');
const fs = require('fs'); // Import the 'fs' module

// Set the API endpoint URL
const apiUrl = 'https://www.refugerestrooms.org/api/v1/restrooms';

// Set the rate limit (requests per minute)
const rateLimit = 60;

// Set the total number of pages to fetch
// Max pages is 535
const totalPages = 535; // Adjust this based on your needs

// Set the number of records per page
const recordsPerPage = 100;

// Initialize a variable to keep track of the current page
let currentPage = 503;

// Function to fetch data for the current page
async function fetchData() {
  try {
    // Calculate the offset for the current page
    // const offset = (currentPage - 1) * recordsPerPage;
    const offset = 0

    // Make the API request for the current page
    const response = await axios.get(apiUrl, {
      params: {
        page: currentPage,
        per_page: recordsPerPage,
        offset: offset,
      },
      headers: {
        'Accept': 'application/json',
      },
    });

    // Save the data to a JSON file
    saveDataToFile(response.data);

    // Increment the current page
    currentPage++;

    // If there are more pages to fetch, schedule the next request
    if (currentPage <= totalPages) {
      setTimeout(fetchData, 45000); // Sleep for 60 seconds (1 minute)
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to save data to a JSON file
function saveDataToFile(data) {
  const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON format with 2-space indentation

  // Define the file path where you want to save the JSON data
  const filePath = `./output-${currentPage}.json`; // Change this to your desired file path

  // Write the JSON data to the file
  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('Data saved to JSON file:', filePath);
    }
  });
}

// Start fetching data
fetchData();