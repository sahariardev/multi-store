import {NextFunction, Request, Response} from "express";
import ValidationError from "../dto/validation_error";


export interface ValidationFunction {
    (body: any): Promise<ValidationError[]>;
}

const validator = (validate: ValidationFunction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let errors: ValidationError[] = await validate(req.body);

        if (errors.length) {
            res.status(412);
            res.json(errors);
        } else {
            next();
        }
    };
}

export default validator;