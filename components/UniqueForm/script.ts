//import * as css from "style|style.css";
import * as template from "template|../../assets/Components/UniqueForm/dom.html";
import { UI } from "../../sys/UI";
ValidateImport(/*css,*/ template);


export class LightForm extends UI.JControl {
    protected initialize() {
        throw new Error("Method not implemented.");
    }
    constructor() {
        super(null);
    }
    static ctor() {
        require('style|../../assets/Components/UniqueForm/style.css');
    }
}


