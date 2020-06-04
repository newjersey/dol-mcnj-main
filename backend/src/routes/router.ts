import {Request, Response, Router} from "express";

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    return res.status(200).json({message: 'pong'})
});

export default router;