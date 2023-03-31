import validator, {ValidationFunction} from "../util/validator_util";
import ValidationError from "../dto/validation_error";
import {comparePasswords, createJwt, hashPassword} from "../util/auth_util";
import {Request, Response, Router} from "express";
import prisma from "../service/db";

const passwordChangeRouter: Router = Router();

const validationPasswordChange: ValidationFunction = async (body: any): Promise<ValidationError[]> => {
    let errors: ValidationError[] = [];

    const user = body.user;
    const existingPassword = body.oldPassword;

    let isValid: boolean = await comparePasswords(existingPassword, user.password);

    if (!isValid) {
        errors.push(new ValidationError('oldPassword', 'Invalid old password'));
    }

    if (!body.newPassword) {
        errors.push(new ValidationError('newPassword', 'required'));
    }

    if (!body.repeatPassword || body.newPassword !== body.repeatPassword) {
        errors.push(new ValidationError('repeatPassword', 'Repeat Password does not match with new password'));
    }

    return new Promise<ValidationError[]>((resolve) => {
        resolve(errors);
    });
}

passwordChangeRouter.post('/', validator(validationPasswordChange), async (req: Request, res: Response) => {
    const updatedPassword = await prisma.user.update({
        where: {id: req.body.user.id},
        data: {password: await hashPassword(req.body.newPassword), passwordReset: false},
    });

    if (updatedPassword) {
        res.status(200);
        let token = createJwt(updatedPassword);
        res.json(token);
    } else {
        res.status(400);
        res.json({message: "Something went wrong. Please contact the Administrator"});
    }
});

export default passwordChangeRouter;