import { UI } from "./UI";
import { bind, ScopicControl, basic, helper, attributes, collection, Processor, $$ } from "./corelib";
import { context } from "context";
//import { Resources } from ;
//import { comp_templates } from "template|../assets/templates/Components.html";

export namespace Components {
    //ValidateImport(comp_templates);
    @attributes.ComponentParser('md-textbox', (x, p) => {
        var dom = x.Dom as HTMLElement;
        var c = new MdTextbox<any>(dom);
        var tw = p.manager.getProcessorByAttribute('db-twoway');
        var ds = dom.getAttribute('data-source');
        if (ds) {
            let datasource = bind.Scop.Create(ds, x.parent.Scop, bind.BindingMode.SourceToTarget, x.controller);
            if (datasource) {
                datasource.OnPropertyChanged(bind.Scop.DPValue, (s, e) => { c.Suggestions = e._new; });
                c.Suggestions = datasource.Value;
            }
        }
        x.e.Control = c;
        c.Parent = x.controller.CurrentControl;
        c.Label = c.View.getAttribute('label');
        c.Type = c.View.getAttribute('type');
        if (dom.hasAttribute('bind-to-scop') && x.Scop) {
            var xs = new bind.TwoBind<string>(tw && tw.value, x.Scop, c, bind.Scop.DPValue, bind.Scop.DPValue);
            c.OnDisposing = (c) => { xs.Dispose(); }
            c.Value = x.Scop.Value;
        }
        return { Break: false };
    })
    export class MdTextbox<T> extends UI.JControl {
        @attributes.property(String, "Label", void 0, MdTextbox.prototype.OnLabelChanged)
        Label: string;
        Value: T;
        private _input: HTMLInputElement;
        private _label: HTMLLabelElement;
        private _isChanging: boolean;

        _hasValue_() { return true; }
        _OnValueChanged(e: bind.EventArgs<any, this>) {
            if (this._isChanging) return;
            this._isChanging = true;
            switch (this._input.type) {
                case 'date':
                    this._input.valueAsDate = e._new as any;
                    break;
                case 'number':
                    this._input.valueAsNumber = e._new as any;
                    break;
                default:
                    this._input.value = e._new || '';
            }
            this._auto && (this._auto.Value = e._new);
            this._isChanging = false;
        }
        OnLabelChanged(e: bind.EventArgs<string, this>) {
            this._label.textContent = e._new;
        }

        constructor(_view?: HTMLElement) {
            super(_view || document.createElement('md-textbox'));
            this.applyStyle('md-textbox');
            this._input = this.createElemnt('input') as any;
            this._input.setAttribute('required', "");
            this._input.type = 'text';
            this.createElemnt('span', "highlight");
            this.createElemnt('span', "bar");
            this._label = this.createElemnt('label') as any;
            this._label.classList.add('mdlabel');
            this.InputBox = new UI.Input(this._input);
        }
        private createElemnt(tag: string, _class?: string) {
            var f = document.createElement(tag);
            if (_class)
                f.classList.add(_class);
            this.View.appendChild(f);
            return f;
        }
        initialize() {
            if (!this._auto)
                this._input.addEventListener('change', this);
        }
        handleEvent(e: Event) {
            if (e.type == "change")
                return this.onInputChanged(e);
        }
        private onInputChanged(e: Event) {
            if (this._isChanging) return;
            this._isChanging = true;
            switch (this._input.type) {
                case 'date':
                    this.Value = this._input.valueAsDate as any;
                    break;
                case 'number':
                    this.Value = this._input.valueAsNumber as any;
                    break;
                default:
                    this.Value = this._input.value as any;
            }
            this._isChanging = false;
        }
        public set Type(v: string) {
            this._input.type = v;
        }
        public get Type() {
            return this._input.type;
        }
        private _auto: UI.ProxyAutoCompleteBox<T>;
        public InputBox: UI.Input;
        public get AutoCompleteBox() {
            return this._auto;
        }
        @attributes.property(collection.List, void 0, void 0, MdTextbox.prototype.OnSuggesionsChanged)
        Suggestions: collection.List<T>;

        OnSuggesionsChanged(e: bind.EventArgs<collection.List<T>, this>) {
            if (!this._auto) {
                this._input.removeEventListener('change', this);
                this._auto = new UI.ProxyAutoCompleteBox<T>(this.InputBox, e._new);
                this._auto.initialize();
                this._auto.OnValueChanged(this, (box, oldVal, newVal) => { this.Value = newVal; });
            }
            else this._auto.DataSource = e._new;
        }
        //public get Plots() { return this.Plots;}
    }

    export interface MenuItem {
        type: string;
        nonSelectable: boolean;
    }

    export interface MdMenuItem extends MenuItem {
        type: 'menu-item';
        iconName: string;
        label: string;
        commandName: string;
        control?: UI.JControl;
    }
    export interface Separator extends MenuItem {
        type: 'separator';
        nonSelectable: false;
    }
    export interface Label extends MenuItem {
        type: 'label';
        value: string;
        nonSelectable: false;
    }
    export interface MdIconGroupItem {
        iconName: string;
        commandName: string;
    }
    export interface IconGroup extends MenuItem {
        type: 'icongroup',
        value: MdIconGroupItem[]
    }
    interface x {
        create(this: x, data: any, cnt?: UI.JControl): UI.TemplateShadow
        template: UI.Template;
    }

    export class MdIconGroup extends UI.ListAdapter<MdIconGroupItem, any> implements UI.ITemplateShadow {
        private _data: IconGroup;
        setDataContext(data: IconGroup) {
            var s = this.Source;
            if (s) {
                s.Clear();
                s.AddRange(data.value);
            } else {
                this.Source = new collection.List(Object, data.value);
            }
            this._data = data;
        }
        getDataContext() {
            return this._data;
        }
        constructor() {
            super(document.createElement('div'), 'IconGroup.Item');
        }
        initialize() {
            this.applyStyle('icon-group');
        }
    }

    export class ContextMenuTemplate extends UI.Template {
        private static _labelTemplate: UI.Template;
        private static _menuItemTemplate: UI.Template;
        private static store: { [s: string]: x };

        private garbage: { [type: string]: UI.TemplateShadow[] } = {};
        private static readonly EmptyArray: UI.TemplateShadow[] = [];
        static ctor() {
            this.store = {};
            this._labelTemplate = UI.Template.ToTemplate("MdContextMenu.label", true);
            this._menuItemTemplate = UI.Template.ToTemplate("MdContextMenu.menuitem", true);
            this.store['label'] = {
                template: this._labelTemplate,
                create(data, cnt) {
                    return this.template.CreateShadow(data);
                }
            };
            this.store['menu-item'] = {
                template: this._menuItemTemplate,
                create(data, cnt) {
                    return this.template.CreateShadow(data);
                }
            };
            var sep = document.createElement('div'); sep.classList.add('separator');
            this.store['separator'] = {
                template: new UI.HtmlTemplate(sep, true),
                create(data, cnt) {
                    return this.template.CreateShadow(data, cnt);
                }
            };
            this.store['icongroup'] = {
                create(data: IconGroup, cnt) {
                    var cv = new MdIconGroup();
                    cv.setDataContext(data);
                    return cv as any;
                }, template: void 0

            }
        }
        CreateShadow<T>(data: T | bind.Scop, cnt: UI.JControl): UI.TemplateShadow {
            var item = data instanceof bind.Scop ? data.Value as MenuItem : data as any as MenuItem;
            var x = (this.garbage[item.type] || ContextMenuTemplate.EmptyArray).pop();
            if (x) x.setDataContext(data);
            else x = ContextMenuTemplate.store[item.type].create(item, cnt) as any;
            return x;
        }
        public CacheTemplateShadow(item: MenuItem, child: UI.TemplateShadow) {
            var g = this.garbage[item.type];
            g.push(child);
        }
        constructor() {
            super();
            if (!ContextMenuTemplate.store) ContextMenuTemplate.ctor();
        }
    }

    export class MdContextMenu extends UI.ListAdapter<MenuItem, any> implements UI.IContextMenu<MenuItem> {
        OnClosed(result: MenuItem, e: UI.IContextMenuEventArgs<MenuItem>): boolean {
            e.selectedItem = result || this.SelectedItem;
            helper.TryCatch(e, e.callback, void 0, [e]);
            return e.cancel;
        }
        getView(): UI.JControl {
            return this;
        }
        @attributes.property(collection.List)
        ItemsSource: collection.List<MdMenuItem | Separator | Label>;
        static ctor() {
            var csses = ['../assets/fonts/robotoFamily.css', '../assets/icons/roboto-icons.css', '../assets/style/Components.css'];
            for (var i of csses)
                require('style|' + i, void 0, void 0, context);
        }
        constructor(items?: MenuItem[]) {
            super(document.createElement('md-contextmenu'), new ContextMenuTemplate());
            this.Source = new collection.List(Object);
            if (items && items.length)
                this.OnInitialized = n => n.Source.AddRange(items);
            this.OnIconGroupItemCliced = this.OnIconGroupItemCliced.bind(this);
        }
        protected getItemShadow(item: MenuItem, i: number) {
            var x = this.Template.CreateShadow(item, void 0) as any as MdIconGroup;
            if ((item as IconGroup).type === 'icongroup')
                x.OnChildClicked.Remove('icon-group-clicked'), x.OnChildClicked.Add(this.OnIconGroupItemCliced, 'icon-group-clicked');
            return x as any;
        }
        private OnIconGroupItemCliced(e: UI.ListAdapterEventArgs<MdIconGroupItem, any>) {
            UI.Desktop.Current.CurrentApp.CloseContextMenu(e.template.getDataContext());
            e.Cancel = true;
        }
        protected disposeItemShadow(item: MenuItem, child: UI.TemplateShadow, i: number) {
            var t = this.Template as ContextMenuTemplate;
            t.CacheTemplateShadow(item, child);
            return child;
        }
        protected disposeItemsShadow(items: MenuItem[], childs: UI.TemplateShadow[]) {
            if (!items && !childs) return;
            var t = this.Template as ContextMenuTemplate;
            if (!items) {
                for (var i = 0; i < childs.length; i++) {
                    var child = childs[i];
                    var c = child.getDataContext() as MenuItem;
                    if (c == void 0)
                        helper.TryCatch(child, child.Dispose);
                    else t.CacheTemplateShadow(c, child);
                }
            } else if (!childs) {
                return;
            }
            else if (items.length == childs.length) {
                for (var i = 0; i < childs.length; i++) {
                    var child = childs[i];
                    var item = items[i];
                    var c = child.getDataContext() as MenuItem;
                    if (c == item || c == void 0)
                        t.CacheTemplateShadow(item, child);
                    else t.CacheTemplateShadow(c || item, child);
                }
            } else for (var i = 0; i < childs.length; i++) {
                var c = childs[i].getDataContext() as MenuItem;
                t.CacheTemplateShadow(c, childs[i]);
            }
        }
        initialize() {
            this.applyStyle('rc-context-menu');
            this._view.style.top = "100px";
            this._view.style.left = "300px";
        }
        //private _current: UI.IContextMenuEventArgs<MenuItem>;
        getTarget(): UI.JControl {
            throw new Error("Method not implemented.");
        }
        private _revalidate(e: UI.IContextMenuEventArgs<MenuItem>) {
            if (e.x || e.y) return;
            e.x = e.e.x;
            e.y = e.e.y;
        }
        OnAttached(e: UI.IContextMenuEventArgs<MenuItem>) {
            this._revalidate(e);
            this.disapplyStyle('hidden');
            this._view.style.left = e.x + "px";
            this._view.style.top = e.y + "px";
        }

        OnItemClicked(s: UI.TemplateShadow, e: Event, t: UI.ListAdapter<MenuItem, MenuItem>) {
            super.OnItemClicked(s, e, t);
            var i = t.SelectedItem;
            if (i && i.type !== 'icongroup' && !i.nonSelectable)
                UI.Desktop.Current.CurrentApp.CloseContextMenu(i);
        }
    }
}
export namespace Components {
    export function getTemplates(): {
        heavyTable: ITemplateExport;
        uiTemplate: ITemplateExport;
        components: ITemplateExport;
        strechyButton: ITemplateExport;
    } {
        return r.Resources.result;
    }
    var r;
    require("./sys/resources", (e) => {
        r = e;
    });

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
            super(getTemplates().heavyTable.template.get("heavyTable") as any, UI.help.createTemplate(cols));
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
        private _orderHandler: basic.ITBindable<(e: OrderByEventArgs<this>) => void>;
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
        private beginEdit(): boolean {
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

        OnKeyDown(e: KeyboardEvent): boolean {
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
            require('style|../assets/Components/HeavyTable/style.css');
        }
    }

    ScopicControl.register('heavytable', (e: ScopicControl.ControlCreatorEventArgs) => {
        var tableDef = e.dom.getAttribute('tableDef');
        var tableDEF = e.currentScop.getScop(tableDef, false);
        var x = new HeavyTable(tableDEF.Value);
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
}


export namespace Components {
    export class ActionButton<T> extends UI.JControl {
        static __fields__() { return [this.DPSource, this.DPValue]; }
        public static DPSource = bind.DObject.CreateField<collection.List<any>, ActionButton<any>>("Source", collection.List, undefined, ActionButton.prototype.OnSourceChanged);

        public static DPValue = bind.DObject.CreateField<any, ActionButton<any>>("Value", Object);
        public get Value(): T { return this.get(ActionButton.DPValue); }
        public set Value(v: T) { this.set(ActionButton.DPValue, v); }
        public Source: collection.List<T>;
        public Caption: UI.Label;
        public Box: UI.Input;
        public AutocompleteBox: UI.ProxyAutoCompleteBox<T>;
        constructor() {
            super(document.createElement('div'));
            this.applyStyle('pull-right', 'flat');
            `
            <div id="68" class="pull-right flat">
                <label class="btn btn-default glyphicon glyphicon-filter">  </label>
                <input id="70" autocomplete="off" placeholder="Select a Client" class="input form-control" style="min-width: 300px; margin-top: 1px; float: left; width: auto;">
            </div>
            `
        }
        initialize() {
            this.Caption = new UI.Label("").applyStyle('btn', 'btn-default', 'glyphicon', 'glyphicon-filter');
            this.Box = new UI.Input().applyStyle('input', 'form-control');
            this.Box.setAttribute('style', 'min-width: 300px; margin-top: 1px; float: left; width: auto;').setAttribute('autocomplete', 'off').setAttribute('placeholder', 'Search ...');
            this.AutocompleteBox = new UI.ProxyAutoCompleteBox(this.Box, this.Source);
            this.AutocompleteBox.OnValueChanged(this, this.OnValueChanged);
            this.Add(this.Caption).Add(this.Box);
            this.AutocompleteBox.initialize();
        }


        OnSourceChanged(e: bind.EventArgs<collection.List<T>, this>) {
            this.AutocompleteBox.DataSource = e._new;
        }

        OnValueChanged(box: UI.IAutoCompleteBox, oldValue: T, newValue: T): void {
            this.Value = newValue;
        }
    }
}

export namespace Components {
    export class StrechyButton extends UI.TControl<StrechyButton> {
        private _Title: Text;
        private _Items: HTMLUListElement;
        private _Trigger: HTMLDivElement;
        constructor() {
            super(Components.getTemplates().strechyButton.template.get('strechy-button') /*'templates.strechy-button'*/, UI.TControl.Me);
        }

        public setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
            this['_'.concat(name)] = dom;
        }
        initialize() {
            UI.JControl.LoadCss(context.GetPath('style.css'));
        }
        OnCompileEnd() {
            this._Trigger.addEventListener('click', this);
        }
        handleEvent(event: Event) {
            $$(this.View).toggleClass('nav-is-visible');
        }

        static ctor() {
            require('style|../assets/Components/StrechyButton/style.css');
        }
    }

}