// Required modules
const fs = require('fs');

// Function to convert appsettings JSON to AWS task definition format
function convertToTaskDef(appSettings, prefix = "") {
    let taskDefArray = [];

    function traverse(obj, currentPath = []) {
        for (let key in obj) {
            const value = obj[key];
            const newPath = [...currentPath, key];

            if (typeof value === "object" && value !== null) {
                // Recursively traverse nested objects
                traverse(value, newPath);
            } else {
                // Join the path with `__` as a delimiter and store the key-value pair
                const fullName = newPath.join("__");
                taskDefArray.push({
                    name: fullName,
                    value: value
                });
            }
        }
    }

    // Start the recursive traversal
    traverse(appSettings);

    // Sort the task definition by name
    taskDefArray.sort((a, b) => a.name.localeCompare(b.name));

    return taskDefArray;
}

// Check if the file was passed as an argument
if (process.argv.length < 3) {
    console.error('Please provide a source file as an argument.');
    process.exit(1);
}

// Read the file name from the command line argument
const fileName = process.argv[2];

// Read the file asynchronously
fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        process.exit(1);
    }

    // Parse the JSON file
    let appSettings;
    try {
        appSettings = JSON.parse(data);
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        process.exit(1);
    }

    // Convert to task definition format
    const taskDefArray = convertToTaskDef(appSettings);

    // Print the output
    console.log(JSON.stringify(taskDefArray, null, 2));
});
