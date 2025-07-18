// AWS_to_node_env.ts

// To compile this script for Node.js, it's recommended to use a tsconfig.json file
// with "module": "commonjs" to ensure compatibility with Node.js's default module system.
// Example tsconfig.json:
// {
//   "compilerOptions": {
//     "target": "es2016",
//     "module": "commonjs", // This is crucial for Node.js compatibility
//     "strict": true,
//     "esModuleInterop": true,
//     "skipLibCheck": true,
//     "forceConsistentCasingInFileNames": true,
//     "outDir": "./dist" // Optional: output compiled JS to a 'dist' folder
//   },
//   "include": ["AWS_to_node_env.ts"]
// }

import * as fs from 'fs';
import * as path from 'path';

/**
 * Defines the structure of an environment variable object as found in AWS task definitions.
 */
interface AwsEnvVar {
    name: string;
    value: string;
}

/**
 * Main function to read the AWS environment variables from a JSON file
 * and output them in a Node.js environment file format (KEY=VALUE).
 */
async function convertAwsEnvToNodeEnv() {
    // Get the file path from the command-line arguments.
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage:');
        console.error('  To run directly with ts-node: ts-node AWS_to_node_env.ts <path_to_your_aws_env_vars.json>');
        console.error('  To run compiled JavaScript: node AWS_to_node_env.js <path_to_your_aws_env_vars.json>');
        process.exit(1);
    }

    const filePath = args[0];

    // Resolve the absolute path to ensure correct file access.
    const absoluteFilePath = path.resolve(filePath);

    try {
        // Read the content of the JSON file.
        const fileContent = await fs.promises.readFile(absoluteFilePath, { encoding: 'utf8' });

        // Parse the JSON content into an array of AwsEnvVar objects.
        const awsEnvVars: AwsEnvVar[] = JSON.parse(fileContent);

        // Validate the parsed data to ensure it matches the expected format.
        if (!Array.isArray(awsEnvVars) || !awsEnvVars.every(item => typeof item.name === 'string' && typeof item.value === 'string')) {
            console.error('Error: The JSON file does not contain an array of objects with "name" and "value" properties.');
            process.exit(1);
        }

        // Iterate through the environment variables and print them in the desired format.
        awsEnvVars.forEach(envVar => {
            console.log(`${envVar.name}=${envVar.value}`);
        });

    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.error(`Error: File not found at ${absoluteFilePath}`);
        } else if (error instanceof SyntaxError) {
            console.error(`Error: Invalid JSON format in file ${absoluteFilePath}. Please ensure it's valid JSON.`);
        } else {
            console.error(`An unexpected error occurred: ${error.message}`);
        }
        process.exit(1);
    }
}

// Call the main function to execute the script.
convertAwsEnvToNodeEnv();