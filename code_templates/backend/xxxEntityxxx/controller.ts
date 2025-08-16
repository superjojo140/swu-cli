import express, { NextFunction, Request as ExpressRequest, Response as ExpressResponse} from "express";
import * as xxxentityxxxService from "./service";

const router = express.Router();
//Register own routes
router.get("/", getxxxEntityxxxList);
router.get("/:xxxentityxxxId", getxxxEntityxxx);
router.post("/", createxxxEntityxxx);
router.put("/:xxxentityxxxId", updatexxxEntityxxx);
router.delete("/:xxxentityxxxId", deletexxxEntityxxx);
export default router;

async function getxxxEntityxxxList(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    try {
        let xxxentityxxxList = await xxxentityxxxService.getxxxEntityxxxList();
        res.status(200).json(xxxentityxxxList);
    }
    catch (e) { next(e); }
}

async function getxxxEntityxxx(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    try {
        const xxxentityxxxId = req.params.xxxentityxxxId;
        let xxxentityxxxData = await xxxentityxxxService.getxxxEntityxxx(xxxentityxxxId);
        res.status(200).json(xxxentityxxxData);
    }
    catch (e) { next(e); }
}

async function createxxxEntityxxx(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const notes = req.body.notes;

        const xxxentityxxxId = await xxxentityxxxService.createxxxEntityxxx(title, description, notes);
        res.status(200).json({ status: "success", message: "Created xxxentityxxx successfully", xxxentityxxxId: xxxentityxxxId });
    }
    catch (e) { next(e); }
}

async function updatexxxEntityxxx(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const notes = req.body.notes;
        const xxxentityxxxId = req.params.xxxentityxxxId;

        await xxxentityxxxService.updatexxxEntityxxx(xxxentityxxxId, title, description, notes);
        res.status(200).json({ status: "success", message: "Updated xxxentityxxx successfully" });
    }
    catch (e) { next(e); }
}

async function deletexxxEntityxxx(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    try {
        const xxxentityxxxId = req.params.xxxentityxxxId;

        await xxxentityxxxService.deletexxxEntityxxx(xxxentityxxxId);
        res.status(200).json({ status: "success", message: "Deleted xxxentityxxx successfully" });
    }
    catch (e) { next(e); }
}
