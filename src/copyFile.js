export function copyFile(sourcePath, destinationPath) {
    const source = getAbsolutePath(sourcePath);
    const destination = getAbsolutePath(destinationPath);
    if (fs.existsSync(source) && fs.statSync(source).isFile()) {
      fs.copyFileSync(source, destination);
    } else {
      handleOperationFailure();
    }
  }