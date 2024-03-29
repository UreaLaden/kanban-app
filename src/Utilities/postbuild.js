const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../../dist"); // Path to your output directory

function addJsExtension(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const updatedContent = content.replace(
    /from\s+(['"])(\.\/|\.\.\/)(.*?)\1/g,
    (match, quote, importPath) => {
      if (
        !importPath.endsWith(".js") &&
        !importPath.startsWith(".") &&
        !importPath.startsWith("http")
      ) {
        return `from ${quote}${importPath}.js${quote}`;
      }
      return match;
    }
  );
  fs.writeFileSync(filePath, updatedContent, "utf8");
}

function processDirectory(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      processDirectory(fullPath);
    } else if (dirent.name.endsWith(".js")) {
      addJsExtension(fullPath);
    }
  });
}

processDirectory(directoryPath);
