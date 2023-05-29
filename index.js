import Express from "express";
import Cors from "cors";
import BodyParser from "body-parser";
import { port } from './src/Configs/LoadEnv.js';
import Routers from "./src/Controllers/Controllers.js";

const app = Express();

app.use(Cors());
app.use(BodyParser.json());
app.use('/api', Routers);

try{
    app.listen(port, () => console.log(`App running in Port: ${port}`));
}catch(err){
    console.log(err);
}