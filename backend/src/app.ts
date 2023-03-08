import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import storeRouter from './controller/store_controller'

dotenv.config();

const app: Express = express();
const port:Number = 8080;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req: Request, res:Response) => {
    res.json({test:'Hello World'});
});

app.use('/store', storeRouter);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});