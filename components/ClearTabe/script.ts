import { UI, conv2template } from "../../sys/UI";
import { basic, bind, css, collection } from "../../sys/Corelib";
import { Material, test as test1 } from "../QSidebar/script";
import { context } from 'context';
//import * as icss from 'style|style.css';
import * as tmpl from 'template|../../assets/Components/ClearTabe/dom.html';
ValidateImport(/*icss,*/ tmpl);
/// best galery ever https://colorlib.com/polygon/gentelella/media_gallery.html#
export class ClearTable extends UI.ListAdapter<any, any> {
    private Controller: bind.Controller;
    private _tbl_head: HTMLTableRowElement;
    private _tbl_rows: HTMLTableSectionElement;
    private _templateRoot: HTMLTemplateElement;
    constructor(private cols:UI.help.IColumnTableDef[]) {
        super("material.clearTable", UI.help.createTemplate(cols));
        UI.JControl.LoadCss(context.GetPath('style.css'));
        this.Controller = bind.Controller.Attach(this, this);
        this.Controller.OnCompiled = {
            Invoke: this.OnCompileEnd, Owner: this
        };
    }

    protected OnCompileEnd(cnt: bind.Controller) {

    }
    public setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
        var t = this[name];
        this[name] = dom;
        if (name == '_tbl_head')
            UI.help.createHeader(dom as any, this.cols);
    }
    static ctor() {
        require('style|../../assets/Components/ClearTabe/style.css');
        //require();
    }
}

export var counter = 0;
var textRight: UI.help.IAttribute = { values: ['text-right'], spliter: " " };

var cols: any = [
    {
        Header: {
            Attributes: { style: 'visibility: collapse;display:none;width:0px' }
        },
        Cell: {
            Attributes: { style: 'visibility: collapse;display:none;width:0px', 'db-job': "clientStat", 'db-bind': "SoldTotal" }
        }
    },
    {
        Header: "Full Name", Cell: {
            Attributes: { 'db-bind': 'FullName', 'db-job': 'label' }
        }
    },
    {
        Header: "Tel", Cell: {
            Attributes: { 'db-bind': 'Tel', 'db-job': 'label' }
        }
    },
    {
        Header: "Total Vendus", Cell: {
            Attributes: { 'db-bind': 'MontantTotal', 'db-job': 'number', 'db-twoway': false, 'class': textRight}
        }
    },
    {
        Header: "Total Versments", Cell: {
            Attributes: { 'db-bind': 'VersmentTotal', 'db-job': 'number', 'db-twoway': false, 'class':textRight }
        }
    },
    {
        Header: "Sold Total", Cell: {
            Attributes: { 'db-bind': 'SoldTotal', 'db-job': 'soldStatus', 'db-twoway': false, 'class': textRight}
        }
    }
];
export function test() {    
    var t = test1();
    var app = t.app;
    var x = new ClearTable(cols);
    app.Content = x;
    return x;
}