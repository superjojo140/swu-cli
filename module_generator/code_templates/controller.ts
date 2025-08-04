import xxxEntityxxxModule from "./module.ts";
import { SwuAlert } from "../../utils/swu_alert.ts";

export default class xxxEntityxxxController {



    async init() {
        await this.refreshxxxEntityxxxList();
    }

    async refreshxxxEntityxxxList() {
        try {
            let xxxentityxxxList = await xxxEntityxxxModule.service.getAllxxxEntityxxx();
            xxxEntityxxxModule.view.updateListView(xxxentityxxxList);
        } catch (error) {
            SwuAlert.alertError(error);
        }
    }


    async handlexxxEntityxxxEdit(xxxentityxxxId: string) {
        try {
            let xxxentityxxxData = xxxEntityxxxModule.view.getModalFormData();
            xxxentityxxxData.id = xxxentityxxxId;
            const resp = await xxxEntityxxxModule.service.updatexxxEntityxxx(xxxentityxxxData);
            SwuAlert.alertResp(resp, "Saving xxxEntityDisplayNamexxx");
            xxxEntityxxxModule.view.modal.hide(); //refresh xxxentityxxx list via hide event
        } catch (error) {
            SwuAlert.alertError(error);
        }

    }

    async handlexxxEntityxxxCreate() {
        try {
            let xxxentityxxxData = xxxEntityxxxModule.view.getModalFormData();
            const resp = await xxxEntityxxxModule.service.createxxxEntityxxx(xxxentityxxxData);
            SwuAlert.alertResp(resp, "Create xxxEntityDisplayNamexxx");
            xxxEntityxxxModule.view.modal.hide(); //refresh xxxentityxxx list via hide event
        } catch (error) {
            SwuAlert.alertError(error);
        }

    }

    async handlexxxEntityxxxDelete(xxxentityxxxId: string) {
        try {
            let confirmResp = await SwuAlert.deleteConfirm("Nutzeraccount löschen", "Soll der Nutzeraccount wirklich gelöscht werden?");
            let resp = await xxxEntityxxxModule.service.deletexxxEntityxxx(xxxentityxxxId);
            SwuAlert.alertResp(resp, "Nutzeraccount Löschen");
            await this.refreshxxxEntityxxxList();
        } catch (error) {
            SwuAlert.alertError(error);
        }
    }

    async showxxxEntityxxxModalForUpdate(xxxentityxxxId: string) {
        try {
            const xxxentityxxxData = await xxxEntityxxxModule.service.getxxxEntityxxx(xxxentityxxxId);
            xxxEntityxxxModule.view.setModalFormData(xxxentityxxxData);
            xxxEntityxxxModule.view.setModalSubmitEvent(() => {
                xxxEntityxxxModule.controller.handlexxxEntityxxxEdit(xxxentityxxxId);
            });
            xxxEntityxxxModule.view.modal.show();
        } catch (error) {
            SwuAlert.alertError(error);
        }
    }

    async showxxxEntityxxxModalForCreate() {
        try {
            xxxEntityxxxModule.view.setModalSubmitEvent(() => {
                xxxEntityxxxModule.controller.handlexxxEntityxxxCreate();
            });
            xxxEntityxxxModule.view.modal.show();
        } catch (error) {
            SwuAlert.alertError(error);
        }
    }


}




