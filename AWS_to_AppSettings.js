// Required modules
const fs = require('fs');

// Function to convert the input array to the appsettings format
function convertToAppSettings(arr, clearValues = false) {
    let appSettings = {};

    // Sort the array by the group part (everything before the "__")
    arr.sort((a, b) => {
        const groupA = a.name.split("__")[0];
        const groupB = b.name.split("__")[0];
        return groupA.localeCompare(groupB);
    });

    arr.forEach(item => {
        // Split the name by the "__" delimiter to get the hierarchy
        let keys = item.name.split("__");

        // Create a reference to the appSettings object
        let current = appSettings;

        // Loop through the keys, except the last one (which will store the value)
        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                // On the last key, set the value to either the original value (or empty string if clearValues is true)
                current[key] = clearValues ? "" : item.value;
            } else {
                // Create an object if it doesn't already exist
                if (!current[key]) {
                    current[key] = {};
                }
                // Move the reference deeper
                current = current[key];
            }
        });
    });

    return appSettings;
}

// Check if the file was passed as an argument
if (process.argv.length < 3) {
    console.error('Please provide a source file as an argument.');
    process.exit(1);
}

// Read the file name from the command line argument
const fileName = process.argv[2];

// Check if a flag for clearing values was passed
const clearValuesFlag = process.argv.includes("--clear-values");

// Read the file asynchronously
fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        process.exit(1);
    }

    // Parse the JSON file
    let inputArray;
    try {
        inputArray = JSON.parse(data);
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        process.exit(1);
    }

    // Convert to appsettings format (clear values if flag is set)
    const appSettings = convertToAppSettings(inputArray, clearValuesFlag);

    // Print the output
    console.log(JSON.stringify(appSettings, null, 2));
});
