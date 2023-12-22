const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const colors = require("colors");
const app = express();

const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sequelize = require("./config/db");
const productRouter = require("./routes/productRoutes");
const shopRouter = require("./routes/shopRoutes");
const questionRouter = require("./routes/questionRoutes");
const reviewRouter = require("./routes/reviewRoutes");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use("/api/category", categoryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/product', productRouter)
app.use('/api/shop', shopRouter)
app.use('/api/question', questionRouter)
app.use('/api/review', reviewRouter)
sequelize.sync().then(() => {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`.blue);
  });
});