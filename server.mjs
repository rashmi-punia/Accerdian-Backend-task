import express from "express";
import router from "./routes/routes.mjs";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

app.use(cors({
    origin:"*",methods:"*"
}));
app.use(express.json());
app.use((req, res, next)=>{
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use("/api",router);

app.listen(5000,()=>{
    console.log("server listening on port 5000");
});