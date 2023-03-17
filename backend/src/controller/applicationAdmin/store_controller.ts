import {NextFunction, Request, Response, Router} from 'express';
import ValidationError from '../../dto/validation_error';
import {isValidStoreType} from '../../dto/store_type';
import prisma from "../../service/db";

const storeRouter: Router = Router();

const storeValidator = (req: Request, res: Response, next: NextFunction) => {
    let errros: ValidationError[] = [];

    if (!req.body.name || req.body.name.length < 6) {
        errros.push(new ValidationError('name', 'length cannot be less than 6 character'));
    }

    if (!req.body.type || !isValidStoreType(req.body.type)) {
        errros.push(new ValidationError('type', 'invalid store type'));
    }

    //todo need to check if store with same name already exist or not

    if (errros.length) {
        res.status(412);
        res.json(errros);
    } else {
        next();
    }
}

storeRouter.post('/create', storeValidator, async (req: Request, res: Response) => {
        const body = req.body;

        const store = await prisma.store.create({
            data: {
                name: body.name,
                description: body.description,
                type: body.type,
                street1: body.street1,
                street2: body.street2,
                city: body.city,
                zip: body.zip
            },
        });

        res.json(store);
    }
);

storeRouter.get('/list', async (req: Request, res: Response) => {
    const storeList = await prisma.store.findMany();
    res.json(storeList);
});

export default storeRouter;
