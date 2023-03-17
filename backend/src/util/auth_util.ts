import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import prisma from "../service/db";
import {Request} from "express";

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 5)
}

export const comparePasswords = (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
}
//todo:set expiry
export const createJwt = (user: any) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            superAdmin: user.superAdmin,
            storeAdmin: user.storeAdmin,
            passwordReset: user.passwordReset
        },
        // @ts-ignore
        process.env.JWT_SECRET);
}

export const protect = (ignorePassReset: boolean = false) => {
    return async (req: any, res: any, next: any) => {
        const bearer = req.header('authorization');


        if (!bearer) {
            res.status(401);
            res.json({message: 'Not Authorized'});
            return;
        }

        const [, token] = bearer.split(' ');

        if (!token) {
            res.status(401);
            res.json({message: 'Not Authorized'});
            return;
        }

        try {
            // @ts-ignore
            const user = jwt.verify(token, process.env.JWT_SECRET);

            const dbUser = await prisma.user.findFirst({
                where: {
                    id: user.id,
                },
                include: {store: true, authorities: true}
            });

            if (!dbUser) {
                res.status(401);
                res.json({message: 'Sorry! you access has been revoked.Please contact the administrator'});
                return;
            }

            if (!ignorePassReset && dbUser.passwordReset) {
                res.status(401);
                res.json({message: 'Please reset your password before doing any action'});
                return;
            }

            req.body.user = dbUser;
            req.body.accessibleStores = await prisma.store.findMany({
                where: {
                    id: dbUser.store.id,
                },
            });

            next();
        } catch (e) {
            if (!token) {
                res.status(401);
                res.json({message: 'Not Authorized'});
                return;
            }
        }
    }
}
export const hasRole = (req: Request, role: string) => {
    const authorities = req.body.authorities;

    authorities.forEach((auth: any) => {
        if (auth.name == role) {
            return true;
        }
    });

    return false;
}

