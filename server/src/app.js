// app.js
const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const path = require("path");
const ApiController = require("./controllers/apiController");
const cors = require("koa2-cors"); // Import koa2-cors middleware

const app = new Koa();
const router = new Router();
const bodyParser = require("koa-bodyparser");
// Serve static files from the "public" folder
app.use(serve(path.join(__dirname, "../public")));
app.use(bodyParser());

// API route using the controller
router.get("/api/hello", ApiController.getHello);
router.get("/api/create-component", ApiController.createComponent);
router.post("/api/edit-component", ApiController.editComponent);
router.post("/api/edit-component-file", ApiController.editComponentFile);
router.get("/api/compile-component", ApiController.compileComponent);
router.get("/api/get-component-list", ApiController.findAllComponent);
router.get("/api/create-component-file", ApiController.createFile);
router.get("/api/check-file-structure", ApiController.checkFileStructure);
router.get("/api/install-dep", ApiController.installDependencies);


app.use(cors());

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Catch-all route for non-existing API routes
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = { error: "Not Found" };
});

// Start the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
