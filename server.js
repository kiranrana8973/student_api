const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const MongoDBConnection = require("./src/infrastructure/database/MongoDBConnection");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");

dotenv.config();

const dbConnection = new MongoDBConnection(process.env.LOCAL_DATABASE_URI);
dbConnection.connect();

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: process.env.CORS_CREDENTIALS === "true",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const bodyLimit = process.env.REQUEST_BODY_LIMIT || "10mb";
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  const morganFormat = process.env.MORGAN_FORMAT || "dev";
  app.use(morgan(morganFormat));
}

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const staticFolder = process.env.STATIC_FOLDER || "public";
app.use(express.static(path.join(__dirname, staticFolder)));

const Container = require("./src/container");
const createStudentRoutes = require("./src/presentation/http/routes/studentRoutes");
const createCourseRoutes = require("./src/presentation/http/routes/courseRoutes");
const createBatchRoutes = require("./src/presentation/http/routes/batchRoutes");
const errorHandler = require("./src/presentation/http/middlewares/errorHandlerMiddleware");

const container = new Container();

const studentController = container.getStudentController();
const courseController = container.getCourseController();
const batchController = container.getBatchController();
const authMiddleware = container.getAuthMiddleware();

const studentRoutes = createStudentRoutes(studentController, authMiddleware);
const courseRoutes = createCourseRoutes(courseController, authMiddleware);
const batchRoutes = createBatchRoutes(batchController, authMiddleware);

const API_VERSION = process.env.API_VERSION || "v1";
const API_BASE_PATH = process.env.API_BASE_PATH || "api";
const ROUTE_PREFIX_AUTH = process.env.ROUTE_PREFIX_AUTH || "auth";
const ROUTE_PREFIX_COURSE = process.env.ROUTE_PREFIX_COURSE || "course";
const ROUTE_PREFIX_BATCH = process.env.ROUTE_PREFIX_BATCH || "batch";

app.use(`/${API_BASE_PATH}/${API_VERSION}/${ROUTE_PREFIX_AUTH}`, studentRoutes);
app.use(`/${API_BASE_PATH}/${API_VERSION}/${ROUTE_PREFIX_COURSE}`, courseRoutes);
app.use(`/${API_BASE_PATH}/${API_VERSION}/${ROUTE_PREFIX_BATCH}`, batchRoutes);

app.get(`/${API_BASE_PATH}/${API_VERSION}/health`, (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
