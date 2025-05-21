const express = require("express");
const routes = require("./routes");
const app = express();
// ✅ Tambahkan ini
app.use(express.json()); // agar bisa parsing body JSON
const port = 3000;

app.use("/api", routes);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
