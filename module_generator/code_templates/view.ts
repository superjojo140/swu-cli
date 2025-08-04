import { xxxEntityxxx } from "./model.ts";
import xxxEntityxxxModule from "./module.ts";
import { SwuDom } from "../../utils/swu_dom.ts";
import { TableSortable } from "../../utils/table-sortable/ts_wrapper.js";
import Modal from "bootstrap/js/dist/modal.ts";

export default class xxxEntityxxxView {

    table: TableSortable;
    modalElem: HTMLElement;
    modal: Modal;
    modalForm: HTMLFormElement = SwuDom.querySelector("#swu_xxxentityxxx_modal_form") as HTMLFormElement;

    async init() {

        this.modalElem = SwuDom.querySelector('#swu_xxxentityxxx_modal');
        this.modal = new Modal(this.modalElem);
        //Reset monitoring form if the modal is closed
        this.modalElem.addEventListener("hide.bs.modal", this.resetModalForm);
        this.modalElem.addEventListener("hide.bs.modal", xxxEntityxxxModule.controller.refreshxxxEntityxxxList);


        let tableColumns = {
            id: "Id",
            xxxEntityPropertiesTablexxx : "",
        }
        let searchInput = SwuDom.querySelectorAsInput("#swu_xxxentityxxx_filter_input");
        let searchInputClear = SwuDom.querySelectorAsInput("#swu_xxxentityxxx_filter_clear_button");
        this.table = new TableSortable("#swu_xxxentityxxx_table", tableColumns, searchInput, searchInputClear, 10, this.registerListItemButtons);

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

        this.table.update(tableDataList, "id"); //button events are registered by table's onUpdate function
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