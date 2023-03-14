import {Request, Response, Router} from "express";
import validator, {ValidationFunction} from "../util/validator_util";
import ValidationError from "../dto/validation_error";
import dataMapper, {DataMapperFunction} from "../util/common_util";
import prisma from "../service/db";
import {hashPassword} from "../util/auth_util";

const loginRouter: Router = Router();

const validation: ValidationFunction = async (body: any): Promise<ValidationError[]> => {
    let errors: ValidationError[] = [];

    if (!body.firstname || body.firstname.length < 4) {
        errors.push(new ValidationError('firstname', 'length cannot be less than 4 character'));
    }

    if (!body.lastname || body.lastname.length < 4) {
        errors.push(new ValidationError('lastname', 'length cannot be less than 4 character'));
    }

    if (!body.username || body.username.length < 6) {
        errors.push(new ValidationError('username', 'length cannot be less than 6 character'));
    } else {
        let user = await prisma.user.findFirst({
            where: {
                username: body.username,
            },
        });

        if (user) {
            errors.push(new ValidationError('username', 'Username already exist'));
        }
    }

    if (!body.password) {
        errors.push(new ValidationError('password', 'required'));
    }

    if (!body.repeatPassword || body.password !== body.repeatPassword) {
        errors.push(new ValidationError('repeatPassword', 'Repeat Password does not match with password'));
    }

    if (!body.store) {
        errors.push(new ValidationError('storeId', 'Invalid store'));
    }

    return new Promise<ValidationError[]>((resolve) => {
        resolve(errors);
    });
}

const mapper: DataMapperFunction = async (body: any): Promise<void> => {
    if (body.storeId) {
        body.store = await prisma.store.findFirst({
            where: {
                id: body.storeId,
            },
        });

        console.log(body.store);
    }
}

loginRouter.post('/createAdmin', dataMapper(mapper), validator(validation), async (req: Request, res: Response) => {
    const body = req.body;

    const user = await prisma.user.create({
        data: {
            username: body.username,
            password: await hashPassword(body.password),
            firstname: body.firstname,
            lastname: body.lastname,
            store: {
                connect: {
                    id: body.store.id
                }
            },
            createdAt: new Date(),
            storeAdmin: true,
            superAdmin: false,
            passwordReset: true
        },
    });

    res.json(user);
});

//passwordChange
//regularUserCreate
//AuthGroupCreate
//AuthgroupAssign


export default loginRouter;