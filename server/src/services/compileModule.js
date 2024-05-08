const { cloneDeep } = require("lodash");
const fs = require("fs").promises;
const webpack = require("webpack");
const getWebpackConfig = require("./webpackCompilationConfig.js");
const path = require("path");
const publicPath = "./public/components";
const helpers = require("../utils/helpers.js");
module.exports = function compileModule({ compName }) {
  return new Promise(async (resolve, reject) => {
    // create the index.js file that imports the newly created component
    // and register it into the application
    const config = getWebpackConfig({ componentName: compName });
    // console.log("**** webpack-config ****");
    // console.log(config);
    const componentDistDir = helpers.root(
      "public/components",
      compName,
      "dist"
    );

    // const isExist = fs.existsSync(componentDistDir);
    // if (isExist) {
    //   fs.unlinkSync(componentDistDir);
    // }
    const filesInDist = await fs.readdir(path.resolve(componentDistDir, "js"), {
      withFileTypes: true,
    });
    console.log(filesInDist);
    for (let i = 0; i < filesInDist.length; i++) {
      const file = filesInDist[i];
      await fs.unlink(path.resolve(componentDistDir, "js", file.name));
    }

    await fs.writeFile(
      helpers.root("public/components", compName, "src", "_index.js"),
      `
    import ${compName} from './index.vue'
    creationBook.registerComponent({
      name: '${compName}',
      component: ${compName},
  })
    `
    );

    webpack(config, async (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const info = stats.toJson();
      await fs.writeFile("./log-json.json", JSON.stringify(info));

      if (stats.hasErrors()) {
        console.log("=== errors ===");
        console.error(info.errors);
        resolve(info.errors);
      }

      if (stats.hasWarnings()) {
        console.log("=== warning ===");
        console.warn(info.warnings);
      }

      const componentFileName = info.assetsByChunkName.main;
      console.log("component name");
      console.log(componentFileName);
      resolve(componentFileName);
    });
  });
};
