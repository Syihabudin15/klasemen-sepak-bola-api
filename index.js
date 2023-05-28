import Express from "express";
import Cors from "cors";
import BodyParser from "body-parser";
import { port } from './src/Configs/LoadEnv.js';

const app = Express();

app.use(Cors());
app.use(BodyParser.json());

try{
    app.listen(port, () => console.log(`App running in Port: ${port}`));
}catch(err){
    console.log(err);
}