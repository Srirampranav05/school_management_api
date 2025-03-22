import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import schoolRoutes from "./routes/schoolRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", schoolRoutes);

app.get("/", (req, res) => {
  res.send("School Management API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
