import express from "express";
import cors from "cors";

import accountRoutes from "./routes/accountRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "Banking API is running"
    });
});


app.use("/api/accounts", accountRoutes);


export default app;