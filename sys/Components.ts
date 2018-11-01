import { UI } from "./UI";
import { attributes, bind, collection, helper, Processor } from "./corelib";
import { context } from "context";
import { template } from "template|../assets/templates/Components.html";
ValidateImport(template);
export namespace Components {
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
    export interface Separator extends MenuItem  {
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

    export class MdIconGroup extends UI.ListAdapter<MdIconGroupItem, any> implements UI.ITemplateShadow{
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
                create(data,cnt) {
                    return this.template.CreateShadow(data);
                }
            };
            this.store['menu-item'] = {
                 template: this._menuItemTemplate,
                create(data,cnt) {
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
                create(data:IconGroup, cnt) {
                    var cv = new MdIconGroup();
                    cv.setDataContext(data);
                    return cv as any;
                },template:void 0

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