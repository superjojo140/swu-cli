import { SwuHttpResponse } from "swu-core";
import { xxxEntityxxx } from "../model/model";

export default class xxxEntityxxxService {

    async getAllxxxEntityxxx() {
        const resp = await fetch("xxxentityxxx");
        return await resp.json() as xxxEntityxxx[];
    }

    async getxxxEntityxxx(xxxentityxxxId: string) {
        const resp = await fetch(`xxxentityxxx/${xxxentityxxxId}`);
        return await resp.json() as xxxEntityxxx;
    }

    async updatexxxEntityxxx(xxxentityxxxData: xxxEntityxxx) {
        const resp = await fetch(`xxxentityxxx/${xxxentityxxxData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(xxxentityxxxData)
        });

        const respJson = await resp.json() as SwuHttpResponse;
        if (respJson.status == "error") { throw new Error(respJson.message) };
        return respJson;
    }

    async createxxxEntityxxx(xxxentityxxxData: Omit<xxxEntityxxx, "id">) {
        const resp = await fetch(`xxxentityxxx`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(xxxentityxxxData)
        });

        const respJson = await resp.json() as SwuHttpResponse;
        if (respJson.status == "error") { throw new Error(respJson.message) };
        return respJson;
    }

    async deletexxxEntityxxx(xxxentityxxxId: string) {
        const resp = await fetch(`xxxentityxxx/${xxxentityxxxId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        const respJson = await resp.json() as SwuHttpResponse;
        if (respJson.status == "error") { throw new Error(respJson.message) };
        return respJson;
    }
}
