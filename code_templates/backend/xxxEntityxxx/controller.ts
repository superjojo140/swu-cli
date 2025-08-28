import express, { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";
import * as xxxentityxxxService from "./service";
import { xxxEntityxxx } from "../../model/xxxEntityxxx/model.js";

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

        const xxxentityxxxData: Omit<xxxEntityxxx, "id"> = req.body;

        const xxxentityxxxId = await xxxentityxxxService.createxxxEntityxxx(xxxentityxxxData);
        res.status(200).json({ status: "success", message: "Created xxxentityxxx successfully", xxxentityxxxId: xxxentityxxxId });
    }
    catch (e) { next(e); }
}

async function updatexxxEntityxxx(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    try {
        const xxxentityxxxData: xxxEntityxxx = {
            id: req.params.xxxentityxxxId,
            ...req.body
        }

        await xxxentityxxxService.updatexxxEntityxxx(xxxentityxxxData);
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
