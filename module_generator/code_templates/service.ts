import { SwuFetch, SwuHttpResponse } from "../../utils/swu_fetch.ts";
import { xxxEntityxxx } from "./model.ts";

export default class xxxEntityxxxService {

    //TODO: Use more than GET and POST (update SUFetch)

    async getAllxxxEntityxxx() {
        return await SwuFetch.getJson("xxxentityxxx") as xxxEntityxxx[];
    }

    async getxxxEntityxxx(xxxentityxxxId: string) {
        return await SwuFetch.getJson(`xxxentityxxx/${xxxentityxxxId}`) as xxxEntityxxx;
    }

    async updatexxxEntityxxx(xxxentityxxxData: xxxEntityxxx) {
        let resp = await SwuFetch.postJson(`xxxentityxxx/${xxxentityxxxData.id}`, xxxentityxxxData) as SwuHttpResponse;
        if (resp.status == "error") { throw new Error(resp.message) };
        return resp;
    }

    async createxxxEntityxxx(xxxentityxxxData: Omit<xxxEntityxxx, "id">) {
        let resp = await SwuFetch.postJson(`xxxentityxxx`, xxxentityxxxData) as SwuHttpResponse;
        if (resp.status == "error") { throw new Error(resp.message) };
        return resp;
    }

    async deletexxxEntityxxx(xxxentityxxxId: string) {
        let resp = await SwuFetch.getJson(`xxxentityxxx/${xxxentityxxxId}`) as SwuHttpResponse;
        if (resp.status == "error") { throw new Error(resp.message) };
        return resp;
    }
}
