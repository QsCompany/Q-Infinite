import { UI } from "../../sys/UI";
import { collection, bind, reflection, ScopicControl, basic, helper } from "../../sys/Corelib";
import { template } from "template|../../assets/Components/HeavyTable/dom.htm";
import { ref } from "../../sys/Syntaxer";
export namespace Material {
    export interface OrderMap {
        factorHandled?: boolean;
        factor: number;
        lastStat: any;
    }
    export interface OrderByEventArgs<This> {
        sender: This;
        orderBy: string;
        col: UI.help.IColumnCellHeaderDef;
        view: HTMLTableHeaderCellElement;
        state: OrderMap;
        previous?: OrderByEventArgs<This>
    }

    export class HeavyTable<T> extends UI.ListAdapter<T, any> {
        public Rebound: boolean;
        public visibleCols: number[];
        private Controller: bind.Controller;
        
        constructor(private cols: UI.help.IColumnTableDef[]) {
            super(template.get("heavyTable") as any, UI.help.createTemplate(cols));
            this.Controller = bind.Controller.Attach(this, this);
            this.activateClass = 'selected';
            this.Controller.OnCompiled = {
                Invoke: this.OnCompileEnd, Owner: this
            };
            this.OnPropertyChanged(UI.ListAdapter.DPSelectedIndex, function (e, b) { this.setXY(undefined, b._new); }, this);
        }
        initialize() {
            super.initialize();
            this.editCell.addEventListener('blur', (e) => {
                if (this.isfocussed)
                    this.endEdit(true);
            });
        }
        protected OnCompileEnd(cnt: bind.Controller) {

        }
        public setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
            if (name == '_tbl_head') {
                UI.help.createHeader<this>(dom as any, this.cols, { Owner: this, Invoke: this.OnOrderBy });
            }
        }
        public OnOrderBy(sender: this, orderBy: string, col: UI.help.IColumnCellHeaderDef, view: HTMLTableHeaderCellElement) {
            if (this._orderHandler && this._orderHandler.Invoke) {
                var c = this.orderMap[orderBy];
                if (!c) this.orderMap[orderBy] = c = { factor: 1, lastStat: void 0 };
                else if (!c.factorHandled) c.factor *= -1;
                var e = <OrderByEventArgs<this>>{ col: col, state: c, orderBy: orderBy, sender: this, view: view, previous: this.currentOrderMap };
                helper.TryCatch(this._orderHandler.Owner, this._orderHandler.Invoke, void 0, [e]);
                if (!c.factorHandled) c.factor = c.factor < 0 ? -1 : 1;
                this.currentOrderMap = e;
                e.previous = void 0;
            }
        }
        currentOrderMap: OrderByEventArgs<this>;
        private _orderHandler: basic.ITBindable<(e:OrderByEventArgs<this>) => void>;
        private orderMap: { [name: string]: OrderMap } = {};
        public setOrderHandler<Owner>(handler: basic.ITBindable<(e: OrderByEventArgs<this>) => void>) {
            this._orderHandler = handler;
        }

        private endEdit(save: boolean) {
            if (!this.isfocussed) return false;
            this.isfocussed = false;
            try { this.editCell.remove(); } catch{ }
            if (save)
                this._selectedCell.textContent = this.editCell.value;
            else
                this._selectedCell.textContent = this.oldInnerText;
            return true;
        }
        private beginEdit():boolean {
            return this.edit(this.selectCell());
        }
        edit(currentElement: HTMLTableDataCellElement) {
            if (!this.cols[this._x].editable) return false;
            var input = this.editCell;
            this.oldInnerText = currentElement.textContent;
            input.value = this.oldInnerText;
            currentElement.innerText = "";
            currentElement.appendChild(input);
            input.focus();
            this.isfocussed = true;
            return true;
        }

        get EOF() {
            return this._x === this.ColCount() - 1 && this._y === this.Source.Count - 1;
        }

        OnKeyDown(e: KeyboardEvent):boolean {
            if (this.isfocussed && e.keyCode === 27) {
                if (this.isfocussed)
                    this.endEdit(false);
                else return false;
            }
            else if (e.keyCode == 13) {
                if (this.isfocussed) { if (this.endEdit(true)) return true; }
                else
                    if (this.beginEdit()) return true;
            } else if (e.keyCode == 9) {
                if (this.isfocussed)
                    this.endEdit(true);
                if (this.EOF) return;
                this.setXY(this.x + (e.shiftKey ? -1 : 1), undefined);
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                return true;
            }
            else if (!this.isfocussed && e.keyCode >= 37 && e.keyCode <= 40) {
                var r;
                switch (e.keyCode) {
                    case 37:
                        r = this.setXY(this.x - 1, undefined);
                        break;
                    case 38: r = this.setXY(undefined, this._y - 1);
                        break;
                    case 39: r = this.setXY(this.x + 1, undefined);
                        break;
                    case 40: r = this.setXY(undefined, this._y + 1);
                        break;
                    default: return false;
                }
                if (r)
                    return true;
            } else return false;
            return super.OnKeyDown(e);
        }
        _x: number = 0; _y: number = 0;
        oldInnerText;
        private get x(): number { return this._x; }
        private ColCount() { return this.visibleCols ? this.visibleCols.length : this.cols.length; }
        private set x(v: number) {
            if (this.cols.length == 0) return;
            var vc = this.ColCount();
            var i = v < 0 ? -1 : v < vc ? 0 : 1;
            if (i === -1) this._x = this.Rebound ? vc - 1 : 0;
            else if (i === +1) this._x = this.Rebound ? 0 : vc - 1;
            else this._x = v;
            if (i && this.Rebound)
                this.y += i;
        }
        private set y(v: number) {
            var vr = this.Source.Count;
            if (vr == 0) return;
            var i = v < 0 ? -1 : v < vr ? 0 : 1;
            if (i === -1) this._y = this.Rebound ? vr - 1 : 0;
            else if (i === +1) this._y = this.Rebound ? 0 : vr - 1;
            else this._y = v;
            if (i && this.Rebound)
                this.x += i;
        }
        private get y() { return this._y; }
        private stat: { x: number, y: number }[] = [];
        private _selectedCell: HTMLTableDataCellElement;
        public setXY(x: number, y: number) {
            if (!this.Rebound) {
                if (x < 0) return false;
                if (x >= this.ColCount()) return false;
                if (y >= this.Source.Count) return false;
            }
            this.deselectCell();
            if (x != undefined)
                this.x = x;
            if (y != undefined)
                this.y = y;
            this._selectedCell = this.getCurrentCell();
            this.selectCell();
            this.SelectedIndex = this._y;
            return true;
        }
        private isfocussed;
        private getStat() {
            return { x: this._x, y: this._y };
        }
        getCurrentCell() {
            var t = this.Content.getChild(this._y);
            if (!t) return;
            return t.View.children.item(this.visibleCols == null ? this.x : this.visibleCols[this.x]) as HTMLTableDataCellElement;
        }

        selectCell() {
            this._selectedCell && this._selectedCell.classList.add('selected');
            return this._selectedCell;
        }
        deselectCell() {
            this._selectedCell && this._selectedCell.classList.remove('selected');
        }

        private editCell: HTMLInputElement = document.createElement('input');

        static ctor() {
            require('style|../../assets/Components/HeavyTable/style.css');
        }
    }
}

ScopicControl.register('heavytable', (e:ScopicControl.ControlCreatorEventArgs) => {
    var tableDef = e.dom.getAttribute('tableDef');
    var tableDEF = e.currentScop.getScop(tableDef, false);
    var x = new Material.HeavyTable(tableDEF.Value);
    tableDEF.Dispose();
    if (e.dom.hasAttribute('bind-to-scop')) {
        if (e.currentScop)
            e.currentScop.OnPropertyChanged(bind.Scop.DPValue, (s, e) => {
                x.Source = e._new;
            }, x);
        x.OnInitialized = x => x.Source = e.currentScop.Value;
    }
    return x;
});