const fs = require('fs');
const path = require('path');

// Global variables
let currentDirectory = process.cwd(); // Starting working directory

// Helper functions
function printCurrentDirectory() {
  console.log(`You are currently in ${currentDirectory}`);
}

function getAbsolutePath(filePath) {
  if (path.isAbsolute(filePath)) {
    return filePath;
  } else {
    return path.resolve(currentDirectory, filePath);
  }
}

function handleInvalidInput() {
  console.log('Invalid input');
}

function handleOperationFailure() {
  console.log('Operation failed');
}



function navigateUp() {
  const parentDirectory = path.dirname(currentDirectory);
  if (parentDirectory !== currentDirectory) {
    currentDirectory = parentDirectory;
  }
  printCurrentDirectory();
}

function changeDirectory(directoryPath) {
  const absolutePath = getAbsolutePath(directoryPath);
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
    currentDirectory = absolutePath;
  } else {
    handleOperationFailure();
  }
  printCurrentDirectory();
}

function listDirectoryContents() {
  const contents = fs.readdirSync(currentDirectory).sort();
  contents.forEach((item) => {
    const itemPath = path.join(currentDirectory, item);
    const itemType = fs.statSync(itemPath).isDirectory() ? 'Folder' : 'File';
    console.log(`${item} (${itemType})`);
  });
}

function readFile(filePath) {
  const absolutePath = getAbsolutePath(filePath);
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
    const fileStream = fs.createReadStream(absolutePath);
    fileStream.pipe(process.stdout);
  } else {
    handleOperationFailure();
  }
}

function createFile(fileName) {
  const absolutePath = path.join(currentDirectory, fileName);
  fs.writeFileSync(absolutePath, '');
}

function renameFile(filePath, newFileName) {
  const absolutePath = getAbsolutePath(filePath);
  const newPath = path.join(currentDirectory, newFileName);
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
    fs.renameSync(absolutePath, newPath);
  } else {
    handleOperationFailure();
  }
}

function copyFile(sourcePath, destinationPath) {
  const source = getAbsolutePath(sourcePath);
  const destination = getAbsolutePath(destinationPath);
  if (fs.existsSync(source) && fs.statSync(source).isFile()) {
    fs.copyFileSync(source, destination);
  } else {
    handleOperationFailure();
  }
}

function moveFile(sourcePath, destinationPath) {
  const source = getAbsolutePath(sourcePath);
  const destination = getAbsolutePath(destinationPath);
  if (fs.existsSync(source) && fs.statSync(source).isFile()) {
    fs.renameSync(source, destination);
  } else {
    handleOperationFailure();
  }
}

function deleteFile(filePath) {
  const absolutePath = getAbsolutePath(filePath);
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
    fs.unlinkSync(absolutePath);
  } else {
    handleOperationFailure();
  }
}

function getEOL() {
  console.log(require('os').EOL);
}

function getCPUsInfo() {
  const cpus = require('os').cpus();
  cpus.forEach((cpu, index) => {
    console.log(`CPU ${index + 1}: ${cpu.model} @ ${cpu.speed / 1000} GHz`);
  });
}

function getHomeDirectory() {
  console.log(require('os').homedir());
}

function getSystemUsername() {
  console.log(require('os').userInfo().username);
}

function getCpuArchitecture() {
  console.log(process.arch);
}



function processCommand(command) {
  const [operation, ...args] = command.trim().split(' ');

  switch (operation) {
    case 'up':
      navigateUp();
      break;
    case 'cd':
      if (args.length === 1) {
        changeDirectory(args[0]);
      } else {
        handleInvalidInput();
      }
      break;
    case 'ls':
      listDirectoryContents();
      break;
    case 'cat':
      if (args.length === 1) {
        readFile(args[0]);
      } else {
        handleInvalidInput();
      }
      break;
    case 'add':
      if (args.length === 1) {
        createFile(args[0]);
      } else {
        handleInvalidInput();
      }
      break;
    case 'rn':
      if (args.length === 2) {
        renameFile(args[0], args[1]);
      } else {
        handleInvalidInput();
      }
      break;
    case 'cp':
      if (args.length === 2) {
        copyFile(args[0], args[1]);
      } else {
        handleInvalidInput();
      }
      break;
    case 'mv':
      if (args.length === 2) {
        moveFile(args[0], args[1]);
      } else {
        handleInvalidInput();
      }
      break;
    case 'rm':
      if (args.length === 1) {
        deleteFile(args[0]);
      } else {
        handleInvalidInput();
      }
      break;
    case 'os':
      if (args.length === 1) {
        switch (args[0]) {
          case '--EOL':
            getEOL();
            break;
          case '--cpus':
            getCPUsInfo();
            break;
          case '--homedir':
            getHomeDirectory();
            break;
          case '--username':
            getSystemUsername();
            break;
          case '--architecture':
            getCpuArchitecture();
            break;
          default:
            handleInvalidInput();
            break;
        }
      } else {
        handleInvalidInput();
      }
      break;
    default:
      handleInvalidInput();
      break;
  }
}

// Start the file manager
function startFileManager() {
  const username = process.argv[2].slice(11);
  console.log(`Welcome to the File Manager, ${username}!`);
  printCurrentDirectory();

  process.stdin.on('data', (data) => {
    try {
      
    const command = data.toString().trim();
    if (command === '.exit') {
      console.log(`Thank you for using File Manager, ${username}, goodbye!`);
      process.exit(0);
    }
    processCommand(command);
    } catch (error) {
      console.log("Something went wrong!!!\n");
      console.log(error);
    }
  });
}

startFileManager();
