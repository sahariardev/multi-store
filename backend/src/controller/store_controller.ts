import { NextFunction, Request, Response, Router} from 'express';
import ValidationError from '../dto/validation_error';
import {isValidStoreType} from '../dto/store_type';

const storeRouter:Router = Router();

const storeValidator = (req:Request, res: Response, next:NextFunction) => {
    let errros: ValidationError[] = [];
    
    if (!req.body.name || req.body.name.length < 6) {
       errros.push(new ValidationError('name', 'length cannot be less than 6 character'));          
    }

    if (!req.body.type || !isValidStoreType(req.body.type)) {
        errros.push(new ValidationError('type', 'invalid store type'));
    }

    if (errros.length) {
        res.status(412);
        res.json(errros);
    } else {
        next();
    }
}

storeRouter.post('/create', storeValidator, (req:Request, res: Response) => {
        //store can only be created by super admin, access check will be placed on routes
        res.json('hello world');
    }
);


export default storeRouter;
