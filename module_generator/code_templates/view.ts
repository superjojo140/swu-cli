import { SwuDom, SwuTable } from "swu-core";
import { xxxEntityxxx } from "./model";
import xxxEntityxxxModule from "./module";
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
            { title: "", field: "swuTableActionButtons", formatter: "html", headerSort: false, headerFilter: false },
            { title: "Id", field: "id", formatter: "html", sorter: "number", headerFilter: "input" },
            { title: "", field: "xxxEntityPropertiesTablexxx" },
        ]
        this.dataTable = new SwuTable("#swu_xxxentityxxx_table", tableColumns);

        SwuDom.addEventListener("#swu_xxxentityxxx_create_button", "click", xxxEntityxxxModule.controller.showxxxEntityxxxModalForCreate);

    }




    async updateListView(xxxentityxxxList: xxxEntityxxx[]) {
        interface xxxentityxxxTableDataset extends xxxEntityxxx { swuTableActionButtons: string };
        let tableDataList: xxxentityxxxTableDataset[] = [];

        for (let xxxentityxxxId in xxxentityxxxList) {
            let xxxentityxxx = xxxentityxxxList[xxxentityxxxId] as xxxentityxxxTableDataset;
            let editBtn = `<button type="button" class="btn btn-primary btn-sm swu-xxxentityxxx-edit-btn" data-swu-xxxentityxxx-id="${xxxentityxxx.id}">
                                <i class="fas fa-pencil-alt"></i>&nbsp; Edit
                           </button>`;
            let deleteBtn = `&nbsp;<button class="btn btn-danger btn-sm swu-xxxentityxxx-delete-btn" type="button" data-swu-xxxentityxxx-id="${xxxentityxxx.id}">
                                <i class="far fa-trash-alt"></i> Delete
                             </button>`;
            xxxentityxxx.swuTableActionButtons = editBtn + deleteBtn;
            tableDataList.push(xxxentityxxx);
        }

        this.dataTable.update(tableDataList);
        this.registerListItemButtons();
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