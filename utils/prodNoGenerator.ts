import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'prodNoCounter.json');

// Initial default configuration
const defaultData = {
  lastNumber: 0
};

export function generateProductionNo() {

  // Create the JSON counter file if it does not exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      JSON.stringify(defaultData, null, 2)
    );
  }

  // Read current tracking data from the file
  const data = JSON.parse(
    fs.readFileSync(filePath, 'utf-8')
  );

  // Increment the sequential counter
  data.lastNumber += 1;

  // Save the updated counter value back to the file
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2)
  );

  // Format number with leading zeros (e.g., 001, 002, 003)
  const formattedNumber = String(data.lastNumber)
    .padStart(3, '0');

  // Return the final formatted Production Number
  return `14E09A${formattedNumber}`;
}