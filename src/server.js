const express = require('express');
require("dotenv").config();
const healthRoutes = require("./routes/health.routes")
const usersRoutes = require("./routes/users.routes")
const requestLogger = require("./middleware/requestLogger")
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger)
app.use("/api/health", healthRoutes)
app.use("/api/users", usersRoutes)

app.listen(PORT, () => {
  console.log(`Server is running in the PORT ${PORT}`);
});
