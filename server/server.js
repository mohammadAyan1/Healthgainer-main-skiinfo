const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedError } = require("./middleware/error");
const fileUpload = require("express-fileupload");
const sessionMiddleware = require("./utils/session.js");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable file uploads
app.use(fileUpload());

// Logger
app.use(logger("tiny"));

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://www.healthgainer.in",
  "https://healthgainer.in",
 
  
  
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// You can also add cors() middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

// Static file serving
app.use("/api/v1/uploads", express.static("uploads"));

// Cookie parser
app.use(cookieParser());
app.use(sessionMiddleware);

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const varientsRoutes = require("./routes/variantRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const contactRoutes = require("./routes/contactRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const healthGainerRoutes = require("./routes/healthGainerRoutes");
const headerSliderImagesRoutes = require("./routes/header-slider/imageAssetRoutes");
const benefitRoutes = require("./routes/benefit/benefitRoutes");
const supplementRoutes = require("./routes/supplement/supplementRoutes.js");
const videoRoutes = require("./routes/video-carousel/videoRoutes");
const dealRoutes = require("./routes/deal/dealRoutes.js");
const newsRoutes = require("./routes/news/newsRoutes.js");
const featureRoutes = require("./routes/why-choose/feature.js");
const advantagesRoutes = require("./routes/why-choose/advantage.js");
const mediaReportRoutes = require("./routes/mediaReport/mediaReportRoutes.js");
const reqRoutes = require("./routes/reqRoutes.js");
const distributorshipRoutes = require("./routes/distributorshipRoutes");
const OTP = require("./routes/OTP.js");

const paymentRoutes = require("./routes/paymentRoutes.js");
app.use("/api/v1/images", headerSliderImagesRoutes);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/variants", varientsRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/contacts", contactRoutes);


// getOTP
// OTP Call
app.use("/api/v1/getOTP",OTP );
// 

app.use("/api/distributorship", distributorshipRoutes);
app.use("/api/v1/req", reqRoutes);

app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/healthgainer", healthGainerRoutes);

// admin apis
app.use("/api/v1/benefits", benefitRoutes);
app.use("/api/v1/supplements", supplementRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/deals", dealRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/why/features", featureRoutes);
app.use("/api/v1/why/advantages", advantagesRoutes);
app.use("/api/v1/mediaReports", mediaReportRoutes);


app.use("/api/v1/payment", paymentRoutes);


// Error handling
app.use(generatedError);

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});

// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });


