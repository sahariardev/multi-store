import {Request, Response, Router} from "express";
import prisma from "../service/db";
import {comparePasswords, createJwt} from "../util/auth_util";

const loginRouter: Router = Router();

loginRouter.post('/', async (req: Request, res: Response) => {
    const user = await prisma.user.findFirst({
        where: {
            username: req.body.username
        }
    });

    if (!user) {
        res.status(401);
        res.json({message: "UserName/Password Invalid!"});
        return;
    }

    let isValid: boolean = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
        res.status(401);
        res.json({message: "UserName/Password Invalid!"});
        return;
    }

    let token = createJwt(user);
    res.json({token});
});

//regularUserCreate
//AuthGroupCreate
//AuthgroupAssign


export default loginRouter;