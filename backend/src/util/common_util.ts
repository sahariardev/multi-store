import {NextFunction, Request, Response} from "express";
import prisma from "../service/db";
import {hasRole} from "./auth_util";

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

export const storeAccessCheck = (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const allowedStores = req.body.accessibleStores.filter((store: any) => store.id == body.storeId);

    if (!allowedStores) {
        res.status(401);
        res.json('Invalid action in Store');
        return;
    }
}

export const storeMapper: DataMapperFunction = async (body: any): Promise<void> => {
    if (body.storeId) {
        body.store = await prisma.store.findFirst({
            where: {
                id: body.storeId,
            },
        });
    }
}

export const roleCheck = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;
        if (!body.user) {
            res.status(401);
            res.json('User need for role check');
            return;
        }
        let actionAllowed = false;

        roles.forEach(role => {
            if (role === 'SUPER_ADMIN') {
                if (body.user.superAdmin) {
                    actionAllowed = true;
                }
            } else if (role === 'STORE_ADMIN') {
                if (body.user.storeAdmin) {
                    actionAllowed = true;
                }
            } else {
                actionAllowed = actionAllowed || hasRole(req, role)
            }
        });

        if (!actionAllowed) {
            res.status(401);
            res.json('User does not have proper role to perform this action');
            return;
        }

        next();
    };
}

export const accessibleUserList = async (accessibleStores: any) => {
    return await prisma.user.findMany(
        {
            where: {
                storeId: {
                    in: accessibleStores.map((store: any) => {
                        return store.id
                    })
                }
            }
        }
    );
}