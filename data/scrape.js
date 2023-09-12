const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://www.refugerestrooms.org/api/v1/restrooms';

// Set the total number of pages to fetch
// Max pages is 535
const totalPages = 535;

// Set the number of records per page
const recordsPerPage = 100;

// Initialize a variable to keep track of the current page
let currentPage = 503;

// Function to fetch data for the current page
async function fetchData() {
  try {
    const offset = 0

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

    currentPage++;

    // If there are more pages to fetch, schedule the next request
    if (currentPage <= totalPages) {
      setTimeout(fetchData, 45000);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to save data to a JSON file
function saveDataToFile(data) {
  const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON format with 2-space indentation

  const filePath = `./output-${currentPage}.json`;

  // Write the JSON data to the file
  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('Data saved to JSON file:', filePath);
    }
  });
}

fetchData();