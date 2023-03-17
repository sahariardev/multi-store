import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import storeRouter from './controller/applicationAdmin/store_controller'
import loginRouter from "./controller/login_controller";
import {protect} from "./util/auth_util";
import passwordChangeRouter from "./controller/password_reset_controller";
import userRouter from "./controller/user_controller";
import userAuth from "./controller/user_auth_controller";

dotenv.config();

const app: Express = express();
const port: Number = 8080;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.json({test: 'Hello World'});
});

app.use('/store', protect(), storeRouter);
app.use('/user', protect(), userRouter);
app.use('/login', loginRouter);
app.use('/changePassword', protect(true), passwordChangeRouter);
app.use('/roleAssign',  userAuth);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});