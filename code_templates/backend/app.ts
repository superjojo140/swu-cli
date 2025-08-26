// Import npm modules
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
import express from "express";
import bodyParser from "body-parser"; 

//import authMiddleware from "./auth/middleware";
import * as errorMiddleware from "./error/middleware";

// Init app

const app = express();

// Serve static files
app.use(express.static('../../public'));
//Serve markup files from module's frontend folders
app.use(express.static('../frontend', { extensions: ['html'], index: false }));

// Middleware
app.use(bodyParser.json());
//app.use(authMiddleware); // Use Auth middleware for all following API routes

//Import module controllers
//      import XXXController from "./XXX/controller";
// Register routes and controller
//      app.use("/xxx", XXXController);

// Error handler
app.use(errorMiddleware.notFoundRoute);
app.use(errorMiddleware.errorHandler);

// Start server
const port: number = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.info(`xxxProjectNamexxx Server started and listening on http://localhost:${port}`);
});