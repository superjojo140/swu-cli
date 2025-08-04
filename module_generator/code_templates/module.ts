import xxxEntityxxxController from "./controller.js";
import xxxEntityxxxService from "./service.js";
import xxxEntityxxxView from "./view.js";

export default class xxxEntityxxxModule {

    static state = {};

    static service: xxxEntityxxxService;
    static controller: xxxEntityxxxController;
    static view: xxxEntityxxxView;

    static async init() {
        xxxEntityxxxModule.service = new xxxEntityxxxService();
        xxxEntityxxxModule.controller = new xxxEntityxxxController();
        xxxEntityxxxModule.view = new xxxEntityxxxView();

        await xxxEntityxxxModule.view.init();
        await xxxEntityxxxModule.controller.init();
    }
}

await xxxEntityxxxModule.init();












