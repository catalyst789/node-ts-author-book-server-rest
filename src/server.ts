import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logger from "./library/Logger";
import authorRoutes from "./routes/Author";
import bookRoutes from "./routes/Book";

const router = express();

/** Connect to Mongo */
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    Logger.info("Connected to Mongoose...!");
    startServer();
  })
  .catch((error) => {
    Logger.error("Unable to Connect Mongoose: ");
    Logger.error(error);
  });

/** Only Connects to Server if Mongo Connects */
const startServer = () => {
  router.use((req, res, next) => {
    /** Logger the request */
    Logger.info(
      `Incoming -> Method: [${req.method}] - Url : [${req.url}] -IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      Logger.info(
        `Incoming -> Method: [${req.method}] - Url : [${req.url}] -IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  router.use("/author", authorRoutes);
  router.use("/book", bookRoutes);

  /** HealthCheck */
  router.get("/ping", (req, res, next) =>
    res.status(200).json({ message: "pong" })
  );

  /** Error Handling */
  router.use((req, res, next) => {
    const error = new Error("not found");
    Logger.error(error);

    res.status(404).json({ message: error.message });
  });

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logger.info(`Server is Running on port ${config.server.port}.`)
    );
};
