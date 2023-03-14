import {NextFunction, Request, Response} from "express";

export interface DataMapperFunction {
     (body: any): void;
}

const dataMapper = (mapper: DataMapperFunction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await mapper(req.body)
        next();
    };
}

export default dataMapper;