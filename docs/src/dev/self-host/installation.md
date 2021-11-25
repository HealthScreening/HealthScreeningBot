# Installation

To get the source code, you need to clone the repository using Git. **This requires you know what the command line is.**

1. Open your platform’s terminal. On Windows, this is either Windows Command Prompt (cmd.exe) or PowerShell (
   powershell.exe). On MacOS, this is the Terminal app. On Linux, this is also one of the terminal apps.
2. Go to the directory where you want to store the code.
3. Run the following command: `git clone https://github.com/PythonCoderAS/HealthScreeningBot.git`

## Dependency Installation

In order to install dependencies, assuming you have the prerequisites installed from the earlier section,

1. Change the terminal’s working directory to the cloned folder, usually via `cd HealthScreeningBot`.
2. Run `npm ci` and wait.

3. Installation may take a few minutes depending on the computer’s CPU and network speed.

## TypeScript Compilation

The code is provided as TypeScript files, which are not directly runnable by Node. In order to run them, the TypeScript
transpiler will need to be used to compile the TypeScript files into JavaScript files. Luckily, it isn’t very hard to
manually compile the code yourself.

1. Change the terminal’s working directory to the cloned folder if you already haven’t.
2. Run `./node_modules/.bin/tsc -p tsconfig.json` on Mac/Linux or `./node_modules/.bin/tsc.exe -p tsconfig.json` on
   Windows.

You will need to re-run the command on item #2 every time the code is updated, since the underlying JavaScript files are
not updated.