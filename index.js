require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db/db");
const path = require("path");
const router = express.Router();
const userRoutes = require("./routes/users");
const userRoute = require("./routes/userRoutes");
const authRouters = require("./routes/auth");
const suitRouter = require("./routes/SuitRouters");
const fashionRouter = require("./routes/FashionRouters");
const cartRouter = require("./routes/cart");
const wishlistRouter = require("./routes/wishlist");
const newsRouter = require("./routes/NewsRouters");
const commentRouter = require("./routes/CommentRouters");
const checkoutRouter = require("./routes/Checkout");
const { authMiddleware } = require("./middleware/middleware");
//database connection
connection();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.use("/api/v2/fashions", fashionRouter);
app.use("/api/v2/news", newsRouter);
app.use("/api/v2/suits", suitRouter);
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/userProfile", userRoute);
app.use("/api/v2/comments", commentRouter);
app.use("/api/v2/auth", authRouters);
app.use("/api/v2/cart", authMiddleware, cartRouter);
app.use("/api/v2/wishlist", authMiddleware, wishlistRouter);
app.use("/api/v2/checkout", authMiddleware, checkoutRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
