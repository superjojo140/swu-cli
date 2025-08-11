import { SwuDom } from "swu-core";
import xxxEntityxxxController from "./controller";
import xxxEntityxxxService from "./service";
import xxxEntityxxxView from "./view";

export default class xxxEntityxxxModule {

    static state = {};

    static service: xxxEntityxxxService;
    static controller: xxxEntityxxxController;
    static view: xxxEntityxxxView;

    static async init() {
        await SwuDom.loadHtml("markup.html");
        xxxEntityxxxModule.service = new xxxEntityxxxService();
        xxxEntityxxxModule.controller = new xxxEntityxxxController();
        xxxEntityxxxModule.view = new xxxEntityxxxView();

        await xxxEntityxxxModule.controller.init();
    }
}

await xxxEntityxxxModule.init();












