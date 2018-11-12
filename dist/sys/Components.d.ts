import { UI } from "./UI";
import { bind, basic, collection } from "./corelib";
export declare namespace Components {
    class MdTextbox<T> extends UI.JControl {
        Label: string;
        Value: T;
        private _input;
        private _label;
        private _isChanging;
        _hasValue_(): boolean;
        _OnValueChanged(e: bind.EventArgs<any, this>): void;
        OnLabelChanged(e: bind.EventArgs<string, this>): void;
        constructor(_view?: HTMLElement);
        private createElemnt;
        initialize(): void;
        handleEvent(e: Event): void;
        private onInputChanged;
        Type: string;
        private _auto;
        InputBox: UI.Input;
        readonly AutoCompleteBox: UI.ProxyAutoCompleteBox<T>;
        Suggestions: collection.List<T>;
        OnSuggesionsChanged(e: bind.EventArgs<collection.List<T>, this>): void;
    }
    interface MenuItem {
        type: string;
        nonSelectable: boolean;
    }
    interface MdMenuItem extends MenuItem {
        type: 'menu-item';
        iconName: string;
        label: string;
        commandName: string;
        control?: UI.JControl;
    }
    interface Separator extends MenuItem {
        type: 'separator';
        nonSelectable: false;
    }
    interface Label extends MenuItem {
        type: 'label';
        value: string;
        nonSelectable: false;
    }
    interface MdIconGroupItem {
        iconName: string;
        commandName: string;
    }
    interface IconGroup extends MenuItem {
        type: 'icongroup';
        value: MdIconGroupItem[];
    }
    class MdIconGroup extends UI.ListAdapter<MdIconGroupItem, any> implements UI.ITemplateShadow {
        private _data;
        setDataContext(data: IconGroup): void;
        getDataContext(): IconGroup;
        constructor();
        initialize(): void;
    }
    class ContextMenuTemplate extends UI.Template {
        private static _labelTemplate;
        private static _menuItemTemplate;
        private static store;
        private garbage;
        private static readonly EmptyArray;
        static ctor(): void;
        CreateShadow<T>(data: T | bind.Scop, cnt: UI.JControl): UI.TemplateShadow;
        CacheTemplateShadow(item: MenuItem, child: UI.TemplateShadow): void;
        constructor();
    }
    class MdContextMenu extends UI.ListAdapter<MenuItem, any> implements UI.IContextMenu<MenuItem> {
        OnClosed(result: MenuItem, e: UI.IContextMenuEventArgs<MenuItem>): boolean;
        getView(): UI.JControl;
        ItemsSource: collection.List<MdMenuItem | Separator | Label>;
        static ctor(): void;
        constructor(items?: MenuItem[]);
        protected getItemShadow(item: MenuItem, i: number): any;
        private OnIconGroupItemCliced;
        protected disposeItemShadow(item: MenuItem, child: UI.TemplateShadow, i: number): UI.TemplateShadow;
        protected disposeItemsShadow(items: MenuItem[], childs: UI.TemplateShadow[]): void;
        initialize(): void;
        getTarget(): UI.JControl;
        private _revalidate;
        OnAttached(e: UI.IContextMenuEventArgs<MenuItem>): void;
        OnItemClicked(s: UI.TemplateShadow, e: Event, t: UI.ListAdapter<MenuItem, MenuItem>): void;
    }
}
export declare namespace Components {
    function getTemplates(): {
        heavyTable: ITemplateExport;
        uiTemplate: ITemplateExport;
        components: ITemplateExport;
        strechyButton: ITemplateExport;
    };
    interface OrderMap {
        factorHandled?: boolean;
        factor: number;
        lastStat: any;
    }
    interface OrderByEventArgs<This> {
        sender: This;
        orderBy: string;
        col: UI.help.IColumnCellHeaderDef;
        view: HTMLTableHeaderCellElement;
        state: OrderMap;
        previous?: OrderByEventArgs<This>;
    }
    class HeavyTable<T> extends UI.ListAdapter<T, any> {
        private cols;
        Rebound: boolean;
        visibleCols: number[];
        private Controller;
        constructor(cols: UI.help.IColumnTableDef[]);
        initialize(): void;
        protected OnCompileEnd(cnt: bind.Controller): void;
        setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
        OnOrderBy(sender: this, orderBy: string, col: UI.help.IColumnCellHeaderDef, view: HTMLTableHeaderCellElement): void;
        currentOrderMap: OrderByEventArgs<this>;
        private _orderHandler;
        private orderMap;
        setOrderHandler<Owner>(handler: basic.ITBindable<(e: OrderByEventArgs<this>) => void>): void;
        private endEdit;
        private beginEdit;
        edit(currentElement: HTMLTableDataCellElement): boolean;
        readonly EOF: boolean;
        OnKeyDown(e: KeyboardEvent): boolean;
        _x: number;
        _y: number;
        oldInnerText: any;
        private x;
        private ColCount;
        private y;
        private stat;
        private _selectedCell;
        setXY(x: number, y: number): boolean;
        private isfocussed;
        private getStat;
        getCurrentCell(): HTMLTableDataCellElement;
        selectCell(): HTMLTableDataCellElement;
        deselectCell(): void;
        private editCell;
        static ctor(): void;
    }
}
export declare namespace Components {
    class ActionButton<T> extends UI.JControl {
        static __fields__(): bind.DProperty<any, ActionButton<any>>[];
        static DPSource: bind.DProperty<collection.List<any>, ActionButton<any>>;
        static DPValue: bind.DProperty<any, ActionButton<any>>;
        Value: T;
        Source: collection.List<T>;
        Caption: UI.Label;
        Box: UI.Input;
        AutocompleteBox: UI.ProxyAutoCompleteBox<T>;
        constructor();
        initialize(): void;
        OnSourceChanged(e: bind.EventArgs<collection.List<T>, this>): void;
        OnValueChanged(box: UI.IAutoCompleteBox, oldValue: T, newValue: T): void;
    }
}
export declare namespace Components {
    class StrechyButton extends UI.TControl<StrechyButton> {
        private _Title;
        private _Items;
        private _Trigger;
        constructor();
        setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
        initialize(): void;
        OnCompileEnd(): void;
        handleEvent(event: Event): void;
        static ctor(): void;
    }
}
