# env-format
Houses various ENV conversion scripts. AWS prefixed/postfixed scripts are designed to convert from or to array of task def environment variables. See `AWS_example.json` to see what the files should look like after you have copied in your task def vars.

# env files
Place your env json files in a folder called `environments` this is ignored by git so you don't have to worry about accidentally committing them

# running a file
- `npm install`
- JS - `node AWS_to_AppSettings.js path/to/file.json`
- TS - `tsx AWS_to_node_env.ts path/to/file.json`