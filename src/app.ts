import express from "express";

const app = express();

app.use(express.json());

//health check route
app.get("/health" , (req ,res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    })
})

export default app;