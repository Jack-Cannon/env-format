const fs = require('fs'); // Import 'fs' module

function sortAndFormatJson(inputFile) {
  // Read the JSON file content
  fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Parse the JSON data
    const input = JSON.parse(data);

    // Sort the input array by the 'name' property
    input.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    // Map and format the sorted input
    const output = input.map(i => {
      return `"${i.name}":"${i.value}"`;
    });

    // Output each line
    var finalString = ''
    output.forEach(line => {
      if (!line.toLowerCase().includes("redis")){
        finalString += (line + ",\n")
      }
    });
    console.log(finalString.substring(0, finalString.length - 2))
  });
}

// Access the second element of process.argv (ignoring the first element, which is `node`)
const inputFile = process.argv[2];

if (!inputFile) {
  console.error('Please provide an input file path as an argument.');
  process.exit(1); // Exit with an error code (optional)
}

// Call the function with the input file path
sortAndFormatJson(inputFile);