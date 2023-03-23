import {Request, Response, Router} from "express";
import prisma from "../service/db";
import {hasRole} from "../util/auth_util";

const userAuth: Router = Router();

userAuth.get('/', async (req: Request, res: Response) => {
    if (!req.body.user.storeAdmin || hasRole(req, 'ROLE_ASSIGN')) {
        res.status(401);
        res.json('Invalid action');
        return;
    }

    const roles = await prisma.authority.findMany();
    res.json(roles);
});

userAuth.post('/', async (req: Request, res: Response) => {
    if (!req.body.user.storeAdmin || hasRole(req, 'ROLE_ASSIGN')) {
        res.status(401);
        res.json('Invalid action');
        return;
    }

    const userId = req.body.userId;

    const user = await prisma.user.findFirst({
        where: {
            id: userId,
            storeId: {
                in: req.body.accessibleStores.map((store: any) => {
                    return store.id
                })
            },
        },
        include: {authorities: true}
    });

    if (!user) {
        res.status(401);
        res.json('Invalid action');
        return;
    }

    const existingUserRoles: string[] = user.authorities.map(role => role.id);
    const newAddedRoles = req.body.roles.filter((role: any) => !existingUserRoles.includes(role));
    const removedRoles = existingUserRoles.filter((role) => !req.body.roles.includes(role));

    const rolesToBeAdded: any = [];

    for (let id in newAddedRoles) {
        rolesToBeAdded.push({
            id: newAddedRoles[id]
        });
    }

    const rolesToBeDeleted: any = [];

    for (let id in removedRoles) {
        rolesToBeDeleted.push({
            id: removedRoles[id]
        });
    }

    const updateUser = await prisma.user.update(
        {
            where: {
                id: userId,
            },
            data: {
                authorities: {
                    connect: rolesToBeAdded,
                    disconnect: rolesToBeDeleted
                }
            },
            include: {authorities: true}
        }
    );

    res.json("Successfully updated user roles");
});

export default userAuth;
