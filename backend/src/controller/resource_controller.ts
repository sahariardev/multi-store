import {Request, Response, Router} from "express";

const resourceRouter: Router = Router();

resourceRouter.get('/stores', async (req: Request, res: Response) => {
    res.json(req.body.accessibleStores);
});

export default resourceRouter;