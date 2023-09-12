const fs = require('fs');
const path = require('path');

// Directory path where your JSON files are located
const directoryPath = './dataset';

// Function to read and merge JSON files in a directory
function mergeJSONFiles(dirPath) {
  const mergedData = []; // Initialize an empty object to store merged data

  // Read all JSON files in the directory
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (file.endsWith('.json')) {
      const filePath = path.join(dirPath, file);

      try {
        // Read and parse the JSON file
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        mergedData.push(...fileData)

        console.log(`Merged data from ${filePath}`);
      } catch (error) {
        console.error(`Error reading JSON file ${filePath}:`, error);
      }
    }
  });

  return mergedData;
}

// Merge all JSON files in the directory
const mergedData = mergeJSONFiles(directoryPath);

// Convert the merged data object to a JSON string
const mergedDataJSON = JSON.stringify(mergedData, null, 2); // 2-space indentation for formatting

const outputPath = './merged_data.json';

// Write the merged data to a single JSON file
fs.writeFileSync(outputPath, mergedDataJSON, 'utf-8');

console.log(`Merged data saved to ${outputPath}`);