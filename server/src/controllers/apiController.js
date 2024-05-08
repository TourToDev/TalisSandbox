// apiController.js
const ApiService = require("../services/apiService");

class ApiController {
  static async getHello(ctx) {
    const message = ApiService.getHelloMessage();
    ctx.body = { message };
  }

  static async createComponent(ctx) {
    const { name } = ctx.request.query;
    const message = await ApiService.createComponent(name);
    ctx.body = message;
  }

  static async editComponent(ctx) {
    const { name, content } = ctx.request.body;
    const message = await ApiService.editComponent(name, content);
    ctx.body = message;
  }

  static async compileComponent(ctx) {
    const { component_name } = ctx.request.query;
    const fileName = await ApiService.compileComponent(component_name);
    ctx.body = { fileName };
  }

  static async findAllComponent(ctx) {
    const componentList = await ApiService.findAllComponent();

    ctx.body = componentList;
  }

  // Create a file in the directory of a specific component
  // parameters: component_name full_file_name
  // full_file_name includes the format of that file
  static async createFile(ctx) {
    const { component_name, full_file_name } = ctx.request.query;
    const message = await ApiService.createComponentFile({
      component_name,
      file_name: full_file_name,
    });
    ctx.body = message;
  }

  static async editComponentFile(ctx) {
    const { component_name, full_file_name, content } = ctx.request.body;
    const result = await ApiService.editComponentFile({
      component_name,
      full_file_name,
      content,
    });
    ctx.body = result;
  }

  // Delete a file in the directory of a specific component
  // parameters: component_name full_file_name
  // full_file_name includes the format of that file
  static async deleteFile() {
    const { component_name, full_file_name } = ctx.request.query;
  }

  // Show the file sturcuture in the form of an object-array
  // of a folder for a specific component
  static async checkFileStructure(ctx) {
    const { component_name } = ctx.request.query;
    const fileStructureArr = await ApiService.checkFileStructure(
      component_name
    );
    ctx.body = fileStructureArr;
  }

  static async installDependencies(ctx) {
    const { component_name } = ctx.request.query;
    const info = await ApiService.installDependencies(
      component_name
    );
    ctx.body = info;
  }
}

module.exports = ApiController;
