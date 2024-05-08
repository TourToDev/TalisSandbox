//import { existsSync } from 'node:fs';
const { existsSync } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const helpers = require("../utils/helpers");
const assetPath = helpers.root("./public");
const publicPath = helpers.root("./public/components");
const compileModule = require("./compileModule");
const getPageDeclarationTemplate = require("./template_page.js");
// apiService.js
class ApiService {
  static async createComponent(componentName) {
    let message = null;
    try {
      const componentDirPath = path.resolve(publicPath, componentName);
      await fs.mkdir(componentDirPath);
      await fs.mkdir(path.resolve(componentDirPath, "dist", "js"), {
        recursive: true,
      });
      await fs.mkdir(path.resolve(componentDirPath, "src"));
      await fs.writeFile(
        path.resolve(componentDirPath, "src", "index.vue"),
        ""
      );
      await fs.writeFile(
        path.resolve(componentDirPath, "src", "_index.js"),
        ""
      );
      await fs.writeFile(
        path.resolve(componentDirPath, "package.json"),
        `{
        "main": "./src/_index.js",
        "dependencies": {
            
        }
      }
      `
      );

      message = {
        status: 0,
        message: "success",
      };
    } catch (e) {
      message = {
        status: -1,
        message: e,
      };
    }
    return message;
  }

  static async compileComponent(compName) {
    const fileName = await compileModule({ compName });
    // Define the path to the template and the output file
    const templatePath = path.join(assetPath, "runner/template.html");
    const templateActivityDataPath = path.join(
      assetPath,
      "runner/template_page.js"
    );
    const outputPath = path.join(assetPath, "runner/index.html");

    // Using async/await for cleaner asynchronous code
    async function generateHtml() {
      try {
        // Read the template HTML file
        const templateHtmlStr = await readFile(templatePath);
        const componentObject = `{
          detail: {
            name: '${compName}',
          },
          mark: '${compName}-${Date.now()}',
          style: {},
          baseEvent: [
            {
              conditionConfig: { isOpen: false, relation: "and" },
              event: "none",
              failEvent: "none",
              moreSetting: true,
              isSeedCRM: false,
              sourceType: "",
              backWash: { isOpen: false, isJumpToHome: false, url: "" },
              isKeyBehavior: false,
              isRecord: false,
              historyEvent: [],
              historyFailEvent: [],
            },
          ],
          statInfo: { button: "按钮" },
          clientRects: {
          },
        }`;
        const templateActivityDataStr = getPageDeclarationTemplate(
          componentObject
        );
        // Placeholder values to replace in the template
        const replacements = {
          "{{fileName}}": fileName,
          "{{compName}}": compName,
          "<!-- __DATA_PLACEHOLDER__ -->": templateActivityDataStr,
        };

        // Replace placeholders in the template
        const result = replacePlaceholders(templateHtmlStr, replacements);
        // Write the new HTML content to the output file
        await writeFile(outputPath, result);

        console.log("The file has been saved!");
      } catch (err) {
        console.error("Error:", err);
      }
    }
    generateHtml();
    return fileName;
  }

  static async findAllComponent() {
    const componentsDir = path.resolve(publicPath);
    try {
      const components = await fs.readdir(componentsDir, {
        withFileTypes: true,
      });
      const directoryList = components.filter((dirent) => dirent.isDirectory());
      const componentsDetail = [];
      for (let i = 0; i < directoryList.length; i++) {
        const dirent = directoryList[i];
        const componentName = dirent.name;
        if (componentName.startsWith("_")) {
          continue;
        }
        const componentJsDir = path.resolve(
          componentsDir,
          componentName,
          "dist",
          "js"
        );
        const isExist = existsSync(componentJsDir);
        if (!isExist) {
          componentsDetail.push({
            name: componentName,
            file_name: null,
          });
          continue;
        }
        const files = await fs.readdir(componentJsDir);
        const componentFile = files.find((file) => file.endsWith(".js"));
        componentsDetail.push({
          name: componentName,
          file_name: componentFile,
        });
      }
      return componentsDetail;
    } catch (error) {
      console.error("Failed to find all components:", error);
      throw error; // Rethrow or handle as needed
    }
  }

  static async createComponentFile({
    component_name,
    file_name,
    content = "",
  }) {
    const componentPath = path.resolve(publicPath, component_name, "src");
    const filePath = path.join(componentPath, file_name);

    try {
      // Create directories recursively if they don't exist
      await fs.mkdir(componentPath, { recursive: true });

      // Write the file with the provided content
      await fs.writeFile(filePath, content);

      return `File ${file_name} created successfully at ${filePath}`;
    } catch (error) {
      return `Error creating file ${file_name}: ${error.message}`;
    }
  }

  static async editComponentFile({ component_name, full_file_name, content }) {
    try {
      let componentPath = path.resolve(publicPath, component_name, "src");
      if (full_file_name === "package.json") {
        componentPath = path.resolve(publicPath, component_name);
      }

      await fs.writeFile(path.resolve(componentPath, full_file_name), content);

      return {
        status: 0,
        message: "success",
      };
    } catch (e) {
      return {
        status: -1,
        message: e,
      };
    }
  }

  static async checkFileStructure(component_name) {
    const componentPath = path.resolve(publicPath, component_name, "src");
    try {
      // Read the directory
      const dirents = await fs.readdir(componentPath, { withFileTypes: true });
      const filesInfoArr = [];
      for (let i = 0; i < dirents.length; i++) {
        const dirent = dirents[i];
        if (!dirent.isFile()) {
          continue;
        }
        const filePath = path.join(componentPath, dirent.name);
        const content = await fs.readFile(filePath, "utf8");
        filesInfoArr.push({
          file_name: dirent.name,
          file_content: content,
        });
      }
      // Wait for all file read operations to complete
      //const data = await Promise.all(filesInfoPromise);
      const packagejson = await fs.readFile(
        path.resolve(publicPath, component_name, "package.json"),
        "utf-8"
      );
      filesInfoArr.push({
        file_name: "package.json",
        file_content: packagejson,
      });
      return { data: filesInfoArr, msg: "success" };
    } catch (error) {
      console.error("Error reading directory:", error);
      return {
        data: null,
        msg: "Error reading directory:",
        error,
      };
    }
  }

  static installDependencies(component_name) {
    return new Promise((resovle) => {
      const projectPath = path.join(publicPath, component_name);

      // Construct the command to run `npm install` in the specified directory
      const command = `npm install --prefer-offline --no-audit --no-fund`;

      // Change the current working directory to the target path
      process.chdir(projectPath);
      console.log("execute install command");
      // Execute `npm install` in the specified directory
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          resovle({ status: -1, msg: error });
          return;
        }
        resovle({ status: 0, msg: stdout });
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    });
  }
}

module.exports = ApiService;

// Function to read a file
function readFile(filePath) {
  return fs.readFile(filePath, "utf8");
}

// Function to write to a file
function writeFile(filePath, content) {
  return fs.writeFile(filePath, content, "utf8");
}

// Function to replace placeholders in the template content
function replacePlaceholders(content, replacements) {
  let result = content;
  for (const [placeholder, replacement] of Object.entries(replacements)) {
    result = result.replace(new RegExp(placeholder, "g"), replacement);
  }
  return result;
}
