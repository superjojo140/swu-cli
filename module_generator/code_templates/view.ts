import { SwuDom, SwuTable } from "swu-core";
import { xxxEntityxxx } from "./model.js";
import xxxEntityxxxModule from "./module.js";
import Modal from "bootstrap/js/dist/modal.js";

export default class xxxEntityxxxView {

    dataTable: SwuTable;
    modalElem: HTMLElement;
    modal: Modal;
    modalForm: HTMLFormElement = SwuDom.querySelector("#swu_xxxentityxxx_modal_form") as HTMLFormElement;

    constructor() {

        this.modalElem = SwuDom.querySelector('#swu_xxxentityxxx_modal');
        this.modal = new Modal(this.modalElem);
        //Reset monitoring form if the modal is closed
        this.modalElem.addEventListener("hide.bs.modal", this.resetModalForm);
        this.modalElem.addEventListener("hide.bs.modal", xxxEntityxxxModule.controller.refreshxxxEntityxxxList);


        let tableColumns = [
            { title: "Id", field: "id"},
            //xxxEntityPropertiesTablexxx //TODO:nicer replace selector
        ]
        //TODO: Make table filter fit with tabulator lib
        let searchInput = SwuDom.querySelectorAsInput("#swu_xxxentityxxx_filter_input");
        let searchInputClear = SwuDom.querySelectorAsInput("#swu_xxxentityxxx_filter_clear_button");
        this.dataTable = new SwuTable("#swu_xxxentityxxx_table", tableColumns);

        SwuDom.addEventListener("#swu_xxxentityxxx_create_button", "click", xxxEntityxxxModule.controller.showxxxEntityxxxModalForCreate);

    }




    async updateListView(xxxentityxxxList: xxxEntityxxx[]) {
        let tableDataList: xxxEntityxxx[] = [];

        for (let xxxentityxxxId in xxxentityxxxList) {
            let xxxentityxxx = xxxentityxxxList[xxxentityxxxId] as xxxEntityxxx;
            let editBtn = `<button type="button" class="btn btn-primary btn-sm swu-xxxentityxxx-edit-btn" data-swu-xxxentityxxx-id="${xxxentityxxx.id}">
                                <i class="fas fa-pencil-alt"></i>&nbsp; Edit
                           </button>`;
            let deleteBtn = `&nbsp;<button class="btn btn-danger btn-sm swu-xxxentityxxx-delete-btn" type="button" data-swu-xxxentityxxx-id="${xxxentityxxx.id}">
                                <i class="far fa-trash-alt"></i> Delete
                             </button>`;
            tableDataList.push(xxxentityxxx);
        }

        this.dataTable.update(tableDataList);
        SwuDom.querySelectorAsInput("#swu_xxxentityxxx_filter_input").value = "";
    }

    registerListItemButtons() {
        SwuDom.querySelectorAll(".swu-xxxentityxxx-edit-btn").forEach(elem => {
            const xxxentityxxxId = elem.getAttribute("data-swu-xxxentityxxx-id") as string;
            SwuDom.addEventListener(elem, "click", () => xxxEntityxxxModule.controller.showxxxEntityxxxModalForUpdate(xxxentityxxxId));
        });

        SwuDom.querySelectorAll(".swu-xxxentityxxx-delete-btn").forEach(elem => {
            const xxxentityxxxId = elem.getAttribute("data-swu-xxxentityxxx-id") as string;
            SwuDom.addEventListener(elem, "click", () => xxxEntityxxxModule.controller.handlexxxEntityxxxDelete(xxxentityxxxId));
        });
    }

    setModalSubmitEvent(callback: Function) {
        SwuDom.removeEventListener(this.modalForm, "submit");
        SwuDom.addEventListener(this.modalForm, "submit", (event) => {
            event.preventDefault();
            callback();
        });
    }


    /**
     * Sets form data 
     */
    setModalFormData(xxxentityxxxData: xxxEntityxxx) {
        let xxxsetPropertyCodexxx;
    }

    getModalFormData(): xxxEntityxxx {
        let xxxentityxxxData = {} as xxxEntityxxx;
        let xxxgetPropertyCodexxx;
        return xxxentityxxxData;
    }

    resetModalForm = () => {
        this.modalForm.reset();
    }


}