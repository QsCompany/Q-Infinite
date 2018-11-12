import { basic, bind, mvc, collection, utils, BuckupList, reflection } from './corelib';
import { defs } from './defs';
import { filters } from './Filters';
export declare type conv2template = mvc.ITemplate | string | Function | UI.Template | HTMLElement;
export declare module UI {
    enum KeyboardControllerResult {
        Handled = 0,
        Release = -1,
        ByPass = 2
    }
    interface IKeyCombinerTarget extends basic.ITBindable<(k: keyCominerEvent, e: IKeyCombinerTarget) => void> {
        target?: Node | JControl;
    }
    interface IKeyA {
        [s: string]: IKeyCombinerTarget[];
    }
    class keyCominerEvent {
        Owner: any;
        OnComined: bind.EventListener<(owner: this, e: IKeyCombinerTarget) => void>;
        private _keyA;
        private _keyB;
        private handlers;
        sort(ar: IKeyCombinerTarget[]): undefined;
        sort1(ar: Node[]): void;
        KeyA: KeyboardEvent;
        KeyB: KeyboardEvent;
        constructor(Owner: any);
        private elementInViewport1;
        private elementInViewport;
        Cancel: boolean;
        private _stopEvent;
        private _rise;
        reset(): void;
        handleEvent(e: KeyboardEvent): void;
        private isValid;
        On(keyA: string, keyB: string, handle: (s: keyCominerEvent, e: IKeyCombinerTarget) => void, target?: JControl | Node, owner?: any): IKeyCombinerTarget;
        Off(keyA: string, keyB: string, e: IKeyCombinerTarget): void;
        private _pause;
        protected dom: HTMLElement;
        pause(): void;
        resume(): void;
        attachTo(dom: HTMLElement): void;
        stopPropagation(): void;
    }
    class DesktopKeyboardManager extends keyCominerEvent {
        protected desk: Desktop;
        constructor(desk: Desktop);
        dom: HTMLElement;
        attachTo(v: HTMLElement): void;
    }
    interface IKeyboardControllerEventArgs {
        e?: KeyboardEvent;
        Result?: KeyboardControllerResult;
        Controller: IKeyboardController;
    }
    interface IKeyboardController {
        owner?: any;
        invoke(e: IKeyboardControllerEventArgs): any;
        onResume?(e: IKeyboardControllerEventArgs): boolean;
        onPause?(e: IKeyboardControllerEventArgs): boolean;
        onStop?(e: IKeyboardControllerEventArgs): boolean;
        stackable?: boolean;
        params?: any[];
    }
    class KeyboardControllerManager {
        Desktop: UI.Desktop;
        private _controllers;
        _current: IKeyboardController;
        constructor(Desktop: UI.Desktop);
        Current(): IKeyboardController;
        GetController(nc: IKeyboardController): boolean;
        Release(c: IKeyboardController): boolean;
        ResumeStack(): boolean;
        Invoke(e: KeyboardEvent): KeyboardControllerResult;
    }
}
export declare module UI {
    enum Events {
        keydown = 2,
        keyup = 3,
        keypress = 5
    }
    abstract class JControl extends bind.Scop implements EventListenerObject {
        protected _view: HTMLElement;
        private _parentScop;
        getParent(): bind.Scop;
        protected _OnValueChanged(e: bind.EventArgs<any, any>): void;
        setParent(v: bind.Scop): boolean;
        CombinatorKey(keyA: string, keyB: string, callback: (this: this, e: keyCominerEvent) => void): IKeyCombinerTarget;
        SearchParents<T extends JControl>(type: Function): T;
        static LoadCss(url: any): HTMLLinkElement;
        static __fields__(): any[];
        readonly InnerHtml: string;
        Float(v: HorizontalAlignement): void;
        Clear(): void;
        protected parent: JControl;
        _presenter: JControl;
        private _hotKey;
        _onInitialize: bind.EventListener<(s: JControl) => void>;
        OnInitialized: (s: this) => void;
        Presenter: JControl;
        setAttribute(name: any, value: any): this;
        OnKeyDown(e: KeyboardEvent): any | void;
        OnContextMenu(e: MouseEvent): any;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any | void;
        setAttributes(attributes: {
            [s: string]: string;
        }): this;
        applyStyle(a: string, b: string, c: string, d: string, e: string, f: string): any;
        applyStyle(a: string, b: string, c: string, d: string, e: string): any;
        applyStyle(a: string, b: string, c: string, d: string): any;
        applyStyle(a: string, b: string, c: string): any;
        applyStyle(a: string, b: string): any;
        applyStyle(a: string): any;
        disapplyStyle(a: string, b: string, c: string, d: string, e: string, f: string, x: string): any;
        disapplyStyle(a: string, b: string, c: string, d: string, e: string, f: string): any;
        disapplyStyle(a: string, b: string, c: string, d: string, e: string): any;
        disapplyStyle(a: string, b: string, c: string, d: string): any;
        disapplyStyle(a: string, b: string, c: string): any;
        disapplyStyle(a: string, b: string): any;
        disapplyStyle(a: string): any;
        private _display;
        Visible: boolean;
        Wait: boolean;
        Enable: boolean;
        Parent: JControl;
        private static counter;
        private _id;
        private init;
        readonly IsInit: boolean;
        protected OnFullInitialized(): void;
        protected OnPaint: (this: this, n: this) => void;
        protected instantanyInitializeParent(): boolean;
        ToolTip: string;
        readonly View: HTMLElement;
        constructor(_view: HTMLElement);
        protected _hasValue_(): boolean;
        protected abstract initialize(): any;
        static createDiv(): HTMLDivElement;
        addEventListener<T>(event: string, handle: (sender: this, e: Event, param: T) => void, param: T, owner?: any): basic.DomEventHandler<any, any>;
        private static _handle;
        AddRange(chidren: JControl[]): this;
        Add(child: JControl): this;
        IndexOf(child: JControl): void;
        Insert(child: JControl, to: number): this;
        Remove(child: JControl, dispose?: boolean): boolean;
        protected getTemplate(child: JControl): JControl;
        readonly Id: number;
        Dispose(): void;
        protected OnHotKey(): void;
        HotKey: HotKey;
        handleEvent(e: Event): void;
        private _events;
        private isEventRegistred;
        private registerEvent;
        static toggleClass(dom: any, className: any): void;
    }
    namespace attributes {
        function ContentProperty(propertyName: string | bind.DProperty<any, any>): (target: typeof JControl) => void;
        function ChildrenProperty(e: {
            PropertyName?: string;
            MethodName?: string;
        }): (target: typeof JControl) => void;
        function SelfProcessing(): (target: typeof JControl) => void;
    }
    interface IContentControl extends JControl {
        Content: JControl;
    }
    abstract class Control<T extends JControl> extends JControl {
        private _c;
        private readonly Children;
        Add(child: T): this;
        Insert(child: T, to: number): this;
        Remove(child: T, dispose?: boolean): boolean;
        RemoveAt(i: number, dispose: boolean): boolean;
        protected abstract Check(child: T): any;
        protected readonly HasTemplate: boolean;
        protected getTemplate(child: T): JControl;
        protected OnChildAdded(child: T): void;
        getChild(i: number): T;
        IndexOf(item: T): number;
        constructor(view: HTMLElement);
        readonly Count: number;
        CloneChildren(): void;
        Clear(dispose?: boolean): void;
        Dispose(): void;
    }
    class Desktop extends Control<App> {
        static DPCurrentApp: bind.DProperty<App, Desktop>;
        static DPCurrentLayout: bind.DProperty<JControl, Desktop>;
        CurrentLayout: JControl;
        Logout(): any;
        OpenSignin(): void;
        isReq: number;
        KeyCombiner: keyCominerEvent;
        CurrentApp: defs.$UI.IApp;
        static ctor(): void;
        private _currentLayoutChanged;
        private selectApp;
        static __fields__(): bind.DProperty<JControl, Desktop>[];
        AuthStatChanged(v: boolean): void;
        private apps;
        IsSingleton: boolean;
        constructor();
        initialize(): void;
        private observer;
        private mouseController;
        KeyboardManager: UI.KeyboardControllerManager;
        private _keyboardControllers;
        private _keyboardController;
        private KeyboardController;
        GetKeyControl(owner: any, invoke: (e: KeyboardEvent, ...params: any[]) => KeyboardControllerResult, params: any[]): void;
        ReleaseKeyControl(): void;
        private focuser;
        private handleTab;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): void;
        defaultKeys: string;
        OnKeyDown(e: KeyboardEvent): void;
        handleEvent(e: Event): any;
        OnContextMenu(e: MouseEvent): any;
        private ShowStart;
        static readonly Current: Desktop;
        Check(v: defs.$UI.IApp): boolean;
        Show(app: defs.$UI.IApp): void;
        private to;
        private loadApp;
        Add(i: defs.$UI.IApp): this;
        Register(app: defs.$UI.IApp): void;
        AuthenticationApp: defs.$UI.IAuthApp;
        private Redirect;
        OnUsernameChanged(job: any, e: any): void;
    }
    class Container extends Control<JControl> {
        constructor();
        initialize(): void;
        Check(child: JControl): boolean;
    }
    enum Icons {
        Bar = 0,
        Next = 1,
        Prev = 2
    }
    enum Glyphs {
        none = 0,
        asterisk = 1,
        plus = 2,
        eur = 3,
        euro = 4,
        minus = 5,
        cloud = 6,
        envelope = 7,
        pencil = 8,
        glass = 9,
        music = 10,
        search = 11,
        heart = 12,
        star = 13,
        starEmpty = 14,
        user = 15,
        film = 16,
        thLarge = 17,
        th = 18,
        thList = 19,
        ok = 20,
        remove = 21,
        zoomIn = 22,
        zoomOut = 23,
        off = 24,
        signal = 25,
        cog = 26,
        trash = 27,
        home = 28,
        file = 29,
        time = 30,
        road = 31,
        downloadAlt = 32,
        download = 33,
        upload = 34,
        inbox = 35,
        playCircle = 36,
        repeat = 37,
        refresh = 38,
        listAlt = 39,
        lock = 40,
        flag = 41,
        headphones = 42,
        volumeOff = 43,
        volumeDown = 44,
        volumeUp = 45,
        qrcode = 46,
        barcode = 47,
        tag = 48,
        tags = 49,
        book = 50,
        bookmark = 51,
        print = 52,
        camera = 53,
        font = 54,
        bold = 55,
        italic = 56,
        textHeight = 57,
        textWidth = 58,
        alignLeft = 59,
        alignCenter = 60,
        alignRight = 61,
        alignJustify = 62,
        list = 63,
        indentLeft = 64,
        indentRight = 65,
        facetimeVideo = 66,
        picture = 67,
        mapMarker = 68,
        adjust = 69,
        tint = 70,
        edit = 71,
        share = 72,
        check = 73,
        move = 74,
        stepBackward = 75,
        fastBackward = 76,
        backward = 77,
        play = 78,
        pause = 79,
        stop = 80,
        forward = 81,
        fastForward = 82,
        stepForward = 83,
        eject = 84,
        chevronLeft = 85,
        chevronRight = 86,
        plusSign = 87,
        minusSign = 88,
        removeSign = 89,
        okSign = 90,
        questionSign = 91,
        infoSign = 92,
        screenshot = 93,
        removeCircle = 94,
        okCircle = 95,
        banCircle = 96,
        arrowLeft = 97,
        arrowRight = 98,
        arrowUp = 99,
        arrowDown = 100,
        shareAlt = 101,
        resizeFull = 102,
        resizeSmall = 103,
        exclamationSign = 104,
        gift = 105,
        leaf = 106,
        fire = 107,
        eyeOpen = 108,
        eyeClose = 109,
        warningSign = 110,
        plane = 111,
        calendar = 112,
        random = 113,
        comment = 114,
        magnet = 115,
        chevronUp = 116,
        chevronDown = 117,
        retweet = 118,
        shoppingCart = 119,
        folderClose = 120,
        folderOpen = 121,
        resizeVertical = 122,
        resizeHorizontal = 123,
        hdd = 124,
        bullhorn = 125,
        bell = 126,
        certificate = 127,
        thumbsUp = 128,
        thumbsDown = 129,
        handRight = 130,
        handLeft = 131,
        handUp = 132,
        handDown = 133,
        circleArrowRight = 134,
        circleArrowLeft = 135,
        circleArrowUp = 136,
        circleArrowDown = 137,
        globe = 138,
        wrench = 139,
        tasks = 140,
        filter = 141,
        briefcase = 142,
        fullscreen = 143,
        dashboard = 144,
        paperclip = 145,
        heartEmpty = 146,
        link = 147,
        phone = 148,
        pushpin = 149,
        usd = 150,
        gbp = 151,
        sort = 152,
        sortByAlphabet = 153,
        sortByAlphabetAlt = 154,
        sortByOrder = 155,
        sortByOrderAlt = 156,
        sortByAttributes = 157,
        sortByAttributesAlt = 158,
        unchecked = 159,
        expand = 160,
        collapseDown = 161,
        collapseUp = 162,
        logIn = 163,
        flash = 164,
        logOut = 165,
        newWindow = 166,
        record = 167,
        save = 168,
        open = 169,
        saved = 170,
        import = 171,
        export = 172,
        send = 173,
        floppyDisk = 174,
        floppySaved = 175,
        floppyRemove = 176,
        floppySave = 177,
        floppyOpen = 178,
        creditCard = 179,
        transfer = 180,
        cutlery = 181,
        header = 182,
        compressed = 183,
        earphone = 184,
        phoneAlt = 185,
        tower = 186,
        stats = 187,
        sdVideo = 188,
        hdVideo = 189,
        subtitles = 190,
        soundStereo = 191,
        soundDolby = 192,
        sound$5$1 = 193,
        sound$6$1 = 194,
        sound$7$1 = 195,
        copyrightMark = 196,
        registrationMark = 197,
        cloudDownload = 198,
        cloudUpload = 199,
        treeConifer = 200,
        treeDeciduous = 201,
        cd = 202,
        saveFile = 203,
        openFile = 204,
        levelUp = 205,
        copy = 206,
        paste = 207,
        alert = 208,
        equalizer = 209,
        king = 210,
        queen = 211,
        pawn = 212,
        bishop = 213,
        knight = 214,
        babyFormula = 215,
        tent = 216,
        blackboard = 217,
        bed = 218,
        apple = 219,
        erase = 220,
        hourglass = 221,
        lamp = 222,
        duplicate = 223,
        piggyBank = 224,
        scissors = 225,
        bitcoin = 226,
        btc = 227,
        xbt = 228,
        yen = 229,
        jpy = 230,
        ruble = 231,
        rub = 232,
        scale = 233,
        iceLolly = 234,
        iceLollyTasted = 235,
        education = 236,
        optionHorizontal = 237,
        optionVertical = 238,
        menuHamburger = 239,
        modalWindow = 240,
        oil = 241,
        grain = 242,
        sunglasses = 243,
        textSize = 244,
        textColor = 245,
        textBackground = 246,
        objectAlignTop = 247,
        objectAlignBottom = 248,
        objectAlignHorizontal = 249,
        objectAlignLeft = 250,
        objectAlignVertical = 251,
        objectAlignRight = 252,
        triangleRight = 253,
        triangleLeft = 254,
        triangleBottom = 255,
        triangleTop = 256,
        console = 257,
        superscript = 258,
        subscript = 259,
        menuLeft = 260,
        menuRight = 261,
        menuDown = 262,
        menuUp = 263
    }
    class Glyph extends JControl {
        private isIcon?;
        static AllGlyphs(panel: JControl): void;
        static Test(): any;
        static CreateGlyphDom(glyph: UI.Glyphs, toolTip: string, cssClass?: string): HTMLSpanElement;
        private static GetGlyphCSS;
        private static GetIconCSS;
        private getStyle;
        constructor(glyph: Glyphs | Icons, isIcon?: boolean, toolTip?: string);
        initialize(): void;
        private v;
        Type: Glyphs | Icons;
    }
    class Button extends JControl {
        Focus(): any;
        private v;
        Style: ButtonStyle;
        initialize(): void;
        constructor();
        private _text;
        private _content;
        Text: string;
        Content: Node;
        Type: string;
        private reset;
    }
    class GlyphButton extends Button {
        initialize(): void;
        AddGlyphs(isIcon: (i: number) => boolean, ...glyphs: (Glyphs | Icons)[]): void;
        AddGlyph(glyph: Glyphs | Icons, isIcon?: boolean): Glyph;
        protected Check(child: JControl): boolean;
        private target;
        CollapsedZone: JControl;
    }
    class Dom extends JControl {
        constructor(tagName: string | HTMLElement, classList?: string[]);
        initialize(): void;
    }
    class Anchore extends JControl {
        constructor(content?: string | HTMLElement | JControl, href?: string);
        initialize(): void;
        Add(child: JControl): this;
        Remove(child: JControl): boolean;
        Text: string;
        Href: string;
    }
    class Label extends JControl {
        constructor(text: string);
        initialize(): void;
        Text: string;
    }
    class Text extends JControl {
        constructor(text: string);
        initialize(): void;
        Text: string;
    }
    class Textbox extends JControl {
        constructor(text?: string);
        Focus(): void;
        initialize(): void;
        Add(child: JControl): this;
        Remove(child: JControl): boolean;
        Text: string;
        PlaceHolder: string;
    }
    enum ListType {
        Ordred = 0,
        UnOrdred = 1
    }
    class List extends Control<JControl> {
        constructor(type?: ListType);
        initialize(): void;
        Check(child: JControl): boolean;
        readonly HasTemplate: boolean;
        getTemplate(child: JControl | HTMLElement | string): JControl;
        AddText(item: string): Div;
        protected OnChildAdded(child: JControl): void;
        private _si;
        SelectedIndex: number;
    }
    class DivControl extends Control<JControl> {
        constructor(tag?: string | HTMLElement);
        initialize(): void;
        Check(child: JControl): boolean;
    }
    class Div extends Control<JControl> {
        constructor();
        initialize(): void;
        Check(item: JControl): boolean;
    }
    class ServiceNavBar<T extends IItem> extends JControl {
        App: defs.$UI.IApp;
        private autoInitializePanels;
        constructor(App: defs.$UI.IApp, autoInitializePanels: boolean);
        initialize(): void;
        private _lefttabs;
        private _righttabs;
        private bi;
        LeftTabs: Navbar<T>;
        RightTabs: Navbar<T>;
        private createItem;
        OnPageSelected: (page: T) => void;
        OnClick(page: T): void;
        Add(child: JControl): this;
        AddRange(child: JControl[]): this;
        Remove(child: JControl): boolean;
        serviceNotified(s: IService, n: NotifyType): void;
        private services;
        private readonly currentStack;
        private CurrentService;
        PushGBar(ser: IService): void;
        PopGBar(ser: IService): void;
        ExitBar(): void;
        PushBar(ser: IService): void;
        PopBar(): void;
        private HideCurrentService;
        private ShowCurrentService;
        Push(s: IService): void;
        private Has;
        Pop(s?: IService): void;
        Register(service: IService): void;
        private _services;
    }
    class Navbar<T extends IItem> extends List {
        private _items;
        constructor();
        initialize(): void;
        private oicd;
        private ItemsChanged;
        private createItem;
        selectable: boolean;
        private _selectedItem;
        readonly SelectedItem: MenuItem;
        private onClick;
        Float(v: HorizontalAlignement): void;
        private CClear;
        readonly Items: collection.ExList<T, any>;
        OnSelectedItem: bind.EventListener<(item: T) => void>;
    }
    class NavbarHeader extends JControl {
        Title: string;
        private _brand;
        private _brandContainer;
        private _toggleButton;
        readonly Brand: JControl;
        readonly ToggleButton: GlyphButton;
        constructor();
        initialize(): void;
        IsFixedTop: boolean;
        IsHeader: boolean;
    }
    interface IItem {
        Tag: any;
        Content: string | HTMLElement | JControl;
        Url: string;
        OnItemSelected(menuItem: MenuItem): any;
    }
    class MenuItem extends Anchore implements EventListenerObject, basic.IDisposable {
        Source: IItem;
        constructor(Source: IItem);
        propChanged(p: bind.PropBinding, e: bind.EventArgs<string, Page>): void;
        handleEvent(e: Event): void;
        OnClick: (page: IItem, sender: MenuItem) => void;
        Dispose(): void;
    }
    class ContentControl extends JControl implements IContentControl {
        constructor(dom?: HTMLElement);
        initialize(): void;
        private _content;
        Content: JControl;
        OnKeyDown(e: any): any;
        OnContextMenu(e: any): any;
    }
    enum ButtonStyle {
        Default = 0,
        Primary = 1,
        success = 2,
        Info = 3,
        Warning = 4,
        Danger = 5,
        Link = 6,
        Block = 7
    }
    class Input extends JControl {
        Disable(disable: any): void;
        constructor(dom?: any);
        initialize(): void;
        Placeholder: string;
        Text: string;
        Blur(): void;
        handleEvent(e: FocusEvent): void;
        OnFocusIn(e: FocusEvent): void;
        OnKeyPressed(e: KeyboardEvent): KeyboardControllerResult;
        OnFocusOut(e: FocusEvent): void;
    }
    enum SearchActionMode {
        None = 0,
        Validated = 1,
        Instantany = 2,
        NoSearch = 3
    }
    class ActionText extends JControl {
        private btn_ok;
        private txtInput;
        readonly Box: Input;
        readonly Icon: Button;
        OnAction: bind.EventListener<(sender: ActionText, oldText: string, newText: string) => void>;
        Bur(): void;
        constructor(input?: HTMLInputElement);
        initialize(): void;
        private ia;
        AutoAction: SearchActionMode;
        btnClicked(ev: Event): void;
        txtChanged(ev: Event): void;
        handleEvent(e: Event): void;
        private isExecuting;
        private tout;
        private job;
        private ls;
        Text: string;
        Focus(): void;
    }
    class CItem implements IItem {
        Tag: any;
        Content: string | HTMLElement | JControl;
        Url: string;
        private onselect;
        OnPropertyChanged(e: bind.DProperty<string, any>, m: (p: bind.PropBinding, e: bind.EventArgs<string, Page>) => void): void;
        constructor(Tag: any, Content: string | HTMLElement | JControl, Url: string, onselect: basic.ITBindable<(menuItem: MenuItem) => void>);
        OnItemSelected(menuItem: MenuItem): void;
    }
    class QBar<T extends IItem> extends JControl {
        private top;
        private _header;
        private _container;
        private _lefttabs;
        private _righttabs;
        private _colapsedZone;
        private bi;
        LeftTabs: Navbar<T>;
        RightTabs: Navbar<T>;
        readonly Header: NavbarHeader;
        constructor(top: boolean);
        private createItem;
        initialize(): void;
        Open(on?: boolean): void;
        OnPageSelected: (page: T) => void;
        OnClick(page: T): void;
        Add(child: JControl): this;
        Remove(child: JControl): boolean;
    }
    class Head<T extends IItem> extends JControl {
        private top;
        private _container;
        private _header;
        private _tabs;
        private _stabs;
        readonly Menu: Navbar<T>;
        readonly SubsMenu: Navbar<T>;
        private _colapsedZone;
        readonly Header: NavbarHeader;
        readonly Container: Container;
        constructor(top: boolean);
        private createItem;
        static __fields__(): any;
        Clear(): void;
        private CClear;
        initialize(): void;
        OnClick(item: T): void;
        static DPSelectedItem: bind.DProperty<IItem, Head<IItem>>;
        SelectedItem: T;
    }
    class Foot extends JControl {
        constructor();
        initialize(): void;
        Check(c: JControl): boolean;
    }
    enum Keys {
        Enter = 13,
        Tab = 9,
        Esc = 27,
        Escape = 27,
        Up = 38,
        Down = 40,
        Left = 37,
        Right = 39,
        PgDown = 34,
        PageDown = 34,
        PgUp = 33,
        PageUp = 33,
        End = 35,
        Home = 36,
        Insert = 45,
        Delete = 46,
        Backspace = 8,
        Space = 32,
        Meta = 91,
        Win = 91,
        Mac = 91,
        Multiply = 106,
        Add = 107,
        Subtract = 109,
        Decimal = 110,
        Divide = 111,
        Scrollock = 145,
        Pausebreak = 19,
        Numlock = 144,
        "5numlocked" = 12,
        Shift = 16,
        Capslock = 20,
        F1 = 112,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        F10 = 121,
        F11 = 122,
        F12 = 123,
        AltLeft = 18,
        AltRight = 18,
        ShiftLeft = 18,
        ShiftRight = 18,
        ControlLeft = 17,
        ControlRight = 17,
        MetaLeft = 91,
        MetaRight = 91
    }
    enum Controlkeys {
        Alt = 18,
        Shift = 16,
        Control = 17,
        Meta = 91
    }
    class HotKey {
        private _key;
        private __ctrl;
        Key: Keys;
        Control: Controlkeys;
        IsPressed(e: KeyboardEvent): boolean;
        private checkKey;
        private checkControl;
    }
    class Page extends Control<JControl> implements defs.$UI.IPage, basic.IDisposable, IService, IItem {
        protected app: App;
        Name: string;
        Tag: any;
        Callback(args: any): void;
        _fl: boolean;
        FloatLeft: boolean;
        static DPTitle: bind.DProperty<string | HTMLElement | JControl, Page>;
        getDPTitle(): bind.DProperty<string | HTMLElement | JControl, Page>;
        getDPUrl(): bind.DProperty<string, {}>;
        Content: string | HTMLElement | JControl;
        ServiceType: ServiceType;
        Notify: bind.EventListener<(s: IService, notifyTYpe: NotifyType) => void>;
        static DPUrl: bind.DProperty<string, {}>;
        Url: string;
        static __fields__(): (bind.DProperty<string | HTMLElement | JControl, Page> | bind.DProperty<string, {}>)[];
        HasSearch: UI.SearchActionMode;
        getSuggessions(): collection.List<any>;
        OnSearche(oldPatent: string, newPatent: string): void;
        initialize(): void;
        Update(): void;
        private readonly intern;
        Check(c: Page): boolean;
        constructor(app: App, title: string | HTMLElement | JControl, Name: string);
        Dispose(): void;
        GetLeftBar(): JControl | QBar<any>;
        GetRightBar(): any;
        OnItemSelected(menuItem: MenuItem): void;
        _onSelected: bind.EventListener<(p: this) => void>;
        readonly OnSelected: bind.EventListener<(p: this) => void>;
        ContextMenu: ContextMenu;
        Handled(): boolean;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
        OnKeyDown(e: KeyboardEvent): any;
        OnPrint(): any;
        OnDeepSearche(): void;
        OnContextMenu(e: MouseEvent): boolean;
    }
    class BarStack {
        private _current;
        private others;
        constructor(current: IService);
        readonly Current: IService;
        Push(s: IService): void;
        Pop(): IService;
        Has(s: IService): number;
        Exit(): void;
    }
    enum HorizontalAlignement {
        Left = 0,
        Center = 1,
        Right = 2
    }
    enum VerticalAlignement {
        Top = 0,
        Center = 1,
        Bottom = 2
    }
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    enum MetricType {
        Pixel = 0,
        Percentage = 1,
        Inch = 2,
        Em = 3
    }
    class Metric {
        Value: number;
        Type: MetricType;
        constructor(value: number | string, type?: MetricType);
        minus(v: any): Metric;
        toString(): string;
        fromString(s: string): void;
    }
    class Error extends JControl {
        IsInfo: boolean;
        private container;
        private _text;
        Message: string;
        Expire: number;
        constructor();
        initialize(): void;
        handleEvent(e: any): void;
        Push(): void;
        private timeout;
        Pop(): void;
        Dispose(): void;
    }
    class InfoArea extends Control<JControl> {
        static readonly Default: InfoArea;
        constructor();
        initialize(): void;
        Check(j: JControl): boolean;
        static push(msg: string, isInfo?: boolean, expire?: number): void;
    }
    class Size {
        w: Metric;
        h: Metric;
        constructor(w: Metric | string | number, h: Metric | number | string);
    }
    class Badge extends JControl {
        constructor();
        initialize(): void;
        Content: any;
    }
    class DragManager {
        private handler;
        private target;
        private View;
        private loc;
        constructor(handler: JControl, target: JControl);
        private mouseloc;
        private cntloc;
        handleEvent(e: DragEvent): void;
        Location: Point;
        private RelocationJob;
        reLocation(hr: boolean, vr: boolean): void;
    }
    class FixedPanel extends JControl {
        private ha;
        private va;
        private loc;
        private body;
        private size;
        constructor(view?: HTMLElement);
        initialize(): void;
        Check(i: any): boolean;
        private mouseloc;
        private cntloc;
        handleEvent(e: DragEvent): void;
        private static resizeBody;
        Height: Metric;
        Width: Metric;
        HorizontalAlignement: HorizontalAlignement;
        VerticalAlignement: VerticalAlignement;
        Location: Point;
        Size: Size;
        private RelocationJob;
        private reLocation;
        Add(child: JControl): this;
        AddRange(childs: JControl[]): this;
    }
    abstract class Layout<T extends defs.$UI.IPage> extends Control<T> implements defs.$UI.IApp {
        readonly IsAuthentication: boolean;
        protected OnPageChanging(e: bind.EventArgs<T, this>): void;
        protected OnPageChanged(e: bind.EventArgs<T, this>): void;
        static DPSelectedPage: bind.DProperty<defs.$UI.IPage, Layout<any>>;
        static DPCurrentModal: bind.DProperty<Modal, Layout<any>>;
        CurrentModal: Modal;
        SelectedPage: T;
        static __fields__(): (bind.DProperty<defs.$UI.IPage, Layout<any>> | bind.DProperty<Modal, Layout<any>>)[];
        Name: string;
        abstract Foot: ServiceNavBar<IItem>;
        abstract SearchBox: ActionText;
        Pages: collection.List<T>;
        protected abstract showPage(page: T): any;
        Logout(): void;
        constructor(view: any);
        protected silentSelectPage(oldPage: T, page: T): void;
        Open(page: T): void;
        private PagesChanged;
        OpenPage(pageNme: string): boolean;
        AddPage(child: T): void;
        SelectNaxtPage(): void;
        SelectPrevPage(): void;
        private opcd;
        Update(): void;
        OnKeyDown(e: KeyboardEvent): void;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
        OnPrint(): any;
        OnDeepSearche(): void;
        OnContextMenu(e: MouseEvent): void;
        handleEvent(e: KeyboardEvent): void;
        Show(): void;
        initialize(): void;
        protected static getView(): HTMLElement;
        protected searchActioned(s: ActionText, o: string, n: string): void;
        OnAttached(): void;
        OnDetached(): void;
        OpenModal(m: Modal): void;
        CloseModal(m: Modal): void;
        _onCurrentModalChanged(e: bind.EventArgs<Modal, Layout<any>>): any;
        private openedModal;
        private zIndex;
        OpenContextMenu<T>(cm: IContextMenu<T>, e: IContextMenuEventArgs<T>): boolean;
        CloseContextMenu<T>(r?: T): boolean;
        private _contextMenuLayer;
        private _currentContextMenu;
        private _currentContextMenuEventArgs;
        private _contextMenuZIndex;
    }
    class App extends Layout<Page> {
        private name;
        static DPTitle: bind.DProperty<String, App>;
        Title: String;
        static DPBadge: bind.DProperty<String, App>;
        Badge: String;
        private static Apps;
        static readonly CurrentApp: defs.$UI.IApp;
        readonly Name: string;
        Head: Head<Page>;
        private AppBody;
        Foot: ServiceNavBar<IItem>;
        PageBody: ContentControl;
        private AppTitle;
        private _search;
        slogant: Dom;
        readonly SearchBox: ActionText;
        createTitle(t: string): ContentControl;
        constructor(name: string);
        protected showPage(page: Page): void;
        protected OnPageChanged(e: bind.EventArgs<Page, this>): void;
        initialize(): void;
        IsTopNavBarhidden(): boolean;
        HideTopNavBar(v: boolean): boolean;
        ToggleTitle(): void;
        IsTitleBringged(): boolean;
        private intern;
        Check(page: any): boolean;
        Add(child: Page | Head<IItem> | Foot | QBar<IItem> | ContentControl | ServiceNavBar<IItem>): this;
        static __fields__(): any;
    }
    abstract class AuthApp extends App implements defs.$UI.IAuthApp {
        readonly IsAuthentication: boolean;
        constructor(key: any, b: bind.EventListener<(v: boolean) => void>);
        abstract IsLogged<T>(callback: (v: boolean, param: T) => void, param: T): any;
        abstract RedirectApp: defs.$UI.IApp;
        OnStatStatChanged: bind.EventListener<(auth: this, isLogged: boolean) => void>;
    }
    enum NotifyType {
        Focuse = 0,
        UnFocus = 1
    }
    enum ServiceType {
        Main = 0,
        Stackable = 1,
        Instantany = 3
    }
    interface IService {
        GetLeftBar(): JControl;
        GetRightBar(): JControl;
        Handler?: EventTarget;
        ServiceType: ServiceType;
        Notify?: bind.EventListener<(s: IService, notifyTYpe: NotifyType) => void>;
        Callback(args: any): any;
        Handled(): boolean;
    }
    class FunctionGroup<T extends Function> extends Function {
        private _;
        private map;
        constructor();
        Push(f: T, name?: string): void;
        Remove(name: string): T;
        Create(): Function;
    }
    class Modal extends JControl {
        Content: UI.JControl;
        protected focuser: basic.focuser;
        private _searchBox;
        private abonment;
        private getSearchBox;
        private callBack;
        onSearch: (modal: this, s: ProxyAutoCompleteBox<any>, oldValue: any, newValue: any) => void;
        OnSearch(i: (modal: this, s: ProxyAutoCompleteBox<any>, oldValue: any, newValue: any) => void): void;
        private _container;
        private _container1;
        private _fm;
        private _head;
        private _body;
        private _foot;
        OkTitle(v: string): this;
        AbortTitle(v: string): this;
        Canceltitle(v: string): this;
        Title(v: string): this;
        Search(d: collection.List<any>): void;
        private asSearch;
        private drgmngr;
        SetDialog(title: string, content: JControl): void;
        private static zIndex;
        static NextZIndex(): number;
        readonly IsOpen: boolean;
        Open(): void;
        targetApp: defs.$UI.IApp;
        protected silentClose(): void;
        Close(msg: MessageResult): void;
        constructor();
        initialize(): void;
        private lastRect;
        private _dtitle;
        private _ts;
        protected createHeader(head: JControl): void;
        protected createFoot(foot: JControl): void;
        private events;
        private static casses;
        private _setText;
        SetVisible(role: MessageResult, visible: boolean): void;
        private createBtn;
        private _initBtn;
        private _btnClicked;
        Add(child: JControl): this;
        Remove(child: JControl): boolean;
        Insert(child: JControl, i: number): this;
        Dispose(): void;
        private _onClick;
        readonly OnClosed: bind.EventListener<(e: MessageEventArgs) => void>;
        OnKeyDown(e: KeyboardEvent): any;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
        Clear(): void;
        static _ShowDialog(title: string, msg: string | HTMLElement | JControl, callback?: (r: any, m: Modal) => void, ok?: string, cancel?: string): (msg: any) => void | void;
        private static closedMessages;
        static ShowDialog(title: string, msg: string | HTMLElement | JControl, callback?: (e: MessageEventArgs) => void, ok?: string, cancel?: string, abort?: string): Modal;
        setStyle(name: string, value: string): this;
        setWidth(value: string): this;
        setHeight(value: string): this;
        IsMaterial: boolean;
        OnContextMenu(e: any): any;
    }
    enum MessageResult {
        Exit = 0,
        ok = 1,
        cancel = 2,
        abort = 3
    }
    class MessageEventArgs {
        Modal: Modal;
        Result: MessageResult;
        msg: string;
        private _stayOpen;
        readonly stayOpen: boolean;
        StayOpen(): void;
        Close(): void;
        constructor(Modal: Modal, Result: MessageResult, msg: string);
    }
    class Image extends JControl {
        Source: string;
        constructor();
        initialize(): void;
    }
    class CarouselItem extends JControl {
        Indicator: any;
        private _image;
        private _caption;
        constructor(url: string, caption: any);
        initialize(): void;
        Active: boolean;
    }
    class Carousel extends Control<CarouselItem> {
        private _items;
        private _indecators;
        private _inner;
        private leftButton;
        private rightButton;
        constructor();
        initialize(): void;
        private opcd;
        private fromInit;
        protected createButton(isLeft: boolean): any;
        private createIndecator;
        private b;
        private ItemsChanged;
        private selectNext;
        Clear(): void;
        Check(child: CarouselItem): boolean;
        Add(child: CarouselItem): this;
        Remove(child: CarouselItem): boolean;
        RemoveAt(i: number): boolean;
    }
    class PaginationSurf extends JControl {
        private isNext?;
        private anchore;
        private span;
        private text;
        constructor(isNext?: boolean);
        initialize(): void;
        Icon: string;
        Title: string;
        OnClick: (e: PaginationSurf) => void;
        handleEvent(e: MouseEvent): void;
    }
    class BiPagination extends JControl {
        static __fields__(): bind.DProperty<number, BiPagination>[];
        private isc;
        static DPIndex: bind.DProperty<number, BiPagination>;
        Index: number;
        Max: number;
        static DPMax: bind.DProperty<number, BiPagination>;
        private prev;
        private next;
        private list;
        private actionText;
        constructor();
        initialize(): void;
        handleEvent(e: Event): void;
        static ctor(): void;
        _onIndexChanged(e: bind.EventArgs<number, this>): void;
    }
    class Pagination extends JControl {
        private prev;
        private next;
        private items;
        static DPRange: bind.DProperty<number, Pagination>;
        static DPStartIndex: bind.DProperty<number, Pagination>;
        static DPCount: bind.DProperty<number, Pagination>;
        readonly SelectedRange: number;
        readonly Count: number;
        StartIndex: number;
        private OnCountChanged;
        private OnRangeChanged;
        private OnStartIndexChanged;
        constructor();
        AddItem(page: PaginationSurf): void;
        initialize(): void;
        private opcd;
        private sp;
        OnClick(e: PaginationSurf): void;
        private isInRange;
        private convert;
        private OnItemsChanged;
    }
    class NumericUpDown extends JControl {
        private f;
        static DPValue: bind.DProperty<number, NumericUpDown>;
        Value: number;
        static __fields__(): bind.DProperty<number, NumericUpDown>[];
        private minValue;
        private defaultValue;
        private maxvalue;
        private sleft;
        private sright;
        private text;
        protected _hasValue_(): boolean;
        constructor();
        initialize(): void;
        private textChanged;
        Focus(): void;
        SelectAll(): void;
    }
    interface pair<K, P> {
        Key: K;
        Value: P;
    }
    class NavPanel extends JControl implements IService {
        Name: string;
        OnPrint(): any;
        private title;
        private container;
        private caption;
        HasSearch: UI.SearchActionMode;
        readonly CaptionControl: Button;
        Title: string | HTMLElement;
        Caption: string;
        constructor(Name: string, caption: string);
        initialize(): void;
        ToolTip: string;
        Add(item: JControl): this;
        AddRange(items: JControl[]): this;
        Remove(item: JControl): boolean;
        RemoveAt(i: number, dispose?: boolean): boolean;
        Clear(): void;
        Update(): void;
        GetLeftBar(): any;
        GetRightBar(): any;
        Handled(): boolean;
        readonly ServiceType: ServiceType;
        Callback(): void;
        OnBringIntoFront(): void;
        IsActive: boolean;
        OnKeyDown(e: KeyboardEvent): void;
        OnSearche(oldPatent: string, newPatent: string): void;
        OnDeepSearch(): void;
        getHelp(t: Object): void;
    }
    class IContent extends JControl {
        private navPage;
        constructor(navPage: NavPage);
        initialize(): void;
        Check(item: JControl): boolean;
        Add(p: NavPanel): this;
        Remove(p: NavPanel): boolean;
    }
    class NavPage extends UI.Page {
        static DPSelectedItem: bind.DProperty<NavPanel, NavPage>;
        static __fields__(): any;
        private _onSelectedItemChanged;
        private con;
        private nav;
        private caption;
        Caption: string;
        constructor(app: App, title: string | HTMLElement | JControl, name: string);
        private islocal;
        initialize(): void;
        ToggleNav(): void;
        Add(c: JControl): this;
        AddRange(c: JControl[]): this;
        Check(j: JControl): boolean;
        SelectedItem: NavPanel;
        private children;
        SetPanel(panel: NavPanel): void;
        GetPanelOf(type: typeof NavPanel): NavPanel;
        GetPanelsOf(type: typeof NavPanel): NavPanel[];
        SetSeparator(): void;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
        OnKeyDown(e: KeyboardEvent): void;
        OnContextMenu(e: MouseEvent): boolean;
        OnPrint(): any;
        private static _onItemSelected;
        private events;
        Select(name: string): boolean;
        GetLeftBar(): any;
        HasSearch: UI.SearchActionMode;
        GetRightBar(): any;
        Update(): void;
        private panels;
        OnSearche(oldPatent: string, newPatent: string): void;
        OnDeepSearche(): void;
    }
}
export declare module UI {
    interface ITemplateShadow {
        setDataContext(data: any): any;
        getDataContext(): any;
    }
    abstract class TemplateShadow extends JControl implements ITemplateShadow {
        abstract setDataContext(data: any): any;
        abstract getDataContext(): any;
        static Create(item: any): ScopicTemplateShadow;
        abstract getScop(): bind.Scop;
        abstract readonly Controller: bind.Controller;
    }
    class ScopicTemplateShadow extends TemplateShadow {
        private scop?;
        readonly Controller: bind.Controller;
        private cnt;
        setDataContext(data: any): void;
        getDataContext(): any;
        constructor(dom: HTMLElement, scop?: bind.Scop, cnt?: UI.JControl);
        initialize(): void;
        Check(c: JControl): boolean;
        readonly Scop: bind.Scop;
        getScop(): bind.Scop;
        Dispose(): void;
    }
    class EScopicTemplateShadow {
        private control;
        private scop?;
        readonly Controller: bind.Controller;
        private cnt;
        setDataContext(data: any): void;
        getDataContext(): any;
        constructor(control: JControl, scop?: bind.Scop);
        initialize(): void;
        Check(c: JControl): boolean;
        readonly Scop: bind.Scop;
        getScop(): bind.Scop;
    }
    interface ITemplate {
        CreateShadow<T>(data: T | bind.Scop, cnt: UI.JControl): TemplateShadow;
    }
    abstract class Template implements ITemplate {
        abstract CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
        static ToTemplate(itemTemplate: conv2template, asTemplate: boolean): Template;
    }
    class HtmlTemplate implements Template {
        dom: HTMLElement;
        private asTemplate;
        constructor(dom: HTMLElement, asTemplate?: boolean);
        CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
    }
    class ScopicTemplate implements Template {
        private template;
        CreateShadow<T>(data?: T | bind.Scop, cnt?: UI.JControl): TemplateShadow;
        constructor(templatePath: string | mvc.ITemplate);
    }
    class TControl<T> extends JControl {
        private data;
        static DPData: bind.DProperty<any, TControl<any>>;
        Data: T;
        static __fields__(): bind.DProperty<any, TControl<any>>[];
        static ctor(): void;
        static Me: any;
        constructor(itemTemplate: mvc.ITemplate | string | Function | Template | HTMLElement, data: T | bind.Scop);
        protected OnFullInitialized(): void;
        private _onTemplateCompiled;
        protected OnCompileEnd(cnt: bind.Controller): void;
        private Shadow;
        getScop(): bind.Scop;
        private _template;
        initialize(): void;
        _onCompiled: bind.EventListener<(s: this, cnt: bind.Controller) => void>;
        private compiled;
        OnCompiled: (s: this) => void;
        readonly IsCompiled: boolean;
        OnDataChanged(e: bind.EventArgs<T, this>): void;
    }
    interface ListAdapterEventArgs<T, P> {
        sender: ListAdapter<T, P>;
        index: number;
        template: TemplateShadow;
        oldIndex?: number;
        oldTemplate?: TemplateShadow;
        Cancel?: boolean;
        Event?: Event;
    }
    class ListAdapter<T, P> extends TControl<P> {
        instantanyInitializeParent(): boolean;
        private garbage;
        static __fields__(): bind.DProperty<any, ListAdapter<any, any>>[];
        static DPSource: bind.DProperty<collection.List<any>, ListAdapter<any, any>>;
        Source: collection.List<T>;
        static DPSelectedIndex: bind.DProperty<number, ListAdapter<any, any>>;
        private __checkSelectedIndex;
        AcceptNullValue: boolean;
        private swap;
        SelectedIndex: number;
        static DPItemStyle: bind.DProperty<string[], ListAdapter<any, any>>;
        ItemStyle: string[];
        static DPTemplate: bind.DProperty<ITemplate, ListAdapter<any, any>>;
        Template: ITemplate;
        OnItemSelected: bind.EventListener<(s: ListAdapter<T, P>, index: number, template: TemplateShadow, oldIndex?: number, oldTemplate?: TemplateShadow) => void>;
        OnItemInserted: bind.EventListener<(s: ListAdapter<T, P>, index: number, data: T, template: TemplateShadow) => void>;
        OnItemRemoved: bind.EventListener<(s: ListAdapter<T, P>, index: number, data: T, template: TemplateShadow) => void>;
        OnChildClicked: bind.EventListener<(e: ListAdapterEventArgs<T, P>) => void>;
        static DPSelectedItem: bind.DProperty<any, ListAdapter<any, any>>;
        private _content;
        readonly Content: Control<TemplateShadow>;
        _selectedItem: TemplateShadow;
        readonly SelectedChild: TemplateShadow;
        SelectedItem: T;
        activateClass: string;
        private OnSelectedIndexChanged;
        private riseItemSelectedEvent;
        Select(t: TemplateShadow): void;
        SelectItem(t: T): void;
        static _getTemplate(template: mvc.ITemplate | string | Function): mvc.ITemplate;
        static _getTemplateShadow(template: mvc.ITemplate | string | Function | HTMLElement): HTMLElement;
        static ctor(): void;
        constructor(template: conv2template, itemTemplate?: conv2template, data?: P | bind.Scop, getSourceFromScop?: boolean);
        private params;
        private initTemplate;
        private static getFirstChild;
        private static getTemplate;
        private sli;
        private getSourceFromScop;
        private CmdExecuter;
        private AttachSelectedItem;
        private CmdAttacheSelectedItemExecuter;
        private RlSourceScop;
        initialize(): void;
        private OnSourceChanged;
        private ReSelect;
        private _scop;
        private readonly Scop;
        BindTo(scop: bind.Scop): void;
        private OnScopValueChanged;
        OnItemClicked(s: TemplateShadow, e: Event, t: ListAdapter<any, any>): void;
        protected getItemShadow(item: T, i: number): TemplateShadow;
        protected disposeItemShadow(item: T, child: TemplateShadow, i: number): TemplateShadow;
        protected disposeItemsShadow(items: T[], child: TemplateShadow[]): void;
        private _insert;
        private _remove;
        private count;
        private OnAdd;
        private OnSet;
        private OnClear;
        private OnRemove;
        private OnReplace;
        private Reset;
        protected clearGarbage(): void;
        private Recycle;
        Dispose(): void;
        Add(child: JControl): this;
        AddRange(children: JControl[]): this;
        Remove(child: JControl, dispose: boolean): boolean;
        RemoveAt(i: number, dispose: boolean): boolean;
        Clear(dispose?: boolean): void;
        Insert(c: JControl, i: number): this;
        CloneChildren(): void;
        Check(c: JControl): boolean;
        OnKeyDown(e: KeyboardEvent): boolean;
    }
    class Spinner extends JControl {
        private container;
        private circle;
        private message;
        constructor(test: any);
        initialize(): void;
        private isStarted;
        Start(logo: string): void;
        Pause(): void;
        Message: string;
        static Default: Spinner;
    }
    class RichMenu<T> extends JControl {
        private menu;
        private adapter;
        private itemTemplate;
        constructor(itemTemplate?: conv2template, data?: T[], parent?: JControl);
        handleEvent(e: any): void;
        initialize(): void;
        private timeout;
        private isOpen;
        private i;
        private toInt;
        Open(e: MouseEvent, callback: basic.ITBindable<(r: RichMenu<T>, si: T) => void>, left: boolean, bottom: boolean): void;
        Close(imediate: boolean): void;
        Data: any[];
    }
    interface IContextMenuItem {
        Title: string;
        Shortcut?: string;
        Icon?: string;
    }
    enum Location {
        Left = 1,
        Top = 2,
        Right = 4,
        Bottom = 8,
        HCenter = 5,
        VCenter = 10,
        Center = 15,
        TopLeft = 3
    }
    interface IContextMenuEventArgs<T> {
        ObjectStat?: any;
        e: MouseEvent;
        x: number;
        y: number;
        selectedItem?: T;
        cancel?: boolean;
        callback(e: IContextMenuEventArgs<T>): any;
    }
    interface IContextMenu<T> {
        getTarget(): JControl;
        OnAttached(e: IContextMenuEventArgs<T>): any;
        OnClosed(result: T, e: IContextMenuEventArgs<T>): boolean;
        getView(): UI.JControl;
    }
    class ExContextMenu extends JControl {
        static DPTitle: bind.DProperty<string, ExContextMenu>;
        static DPItems: bind.DProperty<collection.List<IContextMenuItem>, ExContextMenu>;
        Title: string;
        Items: collection.List<IContextMenuItem>;
        static __fields__(): (bind.DProperty<string, ExContextMenu> | bind.DProperty<collection.List<IContextMenuItem>, ExContextMenu>)[];
        private dic;
        private list;
        private static zIndex;
        static readonly NextZIndex: number;
        constructor(items?: IContextMenuItem[]);
        initialize(): void;
        private OnItemSelected;
        private OnItemInserted;
        private OnItemRemoved;
        private Action;
        OnAction: bind.EventListener<(sender: this, selected: IContextMenuItem) => void>;
        location: Location;
        ShowForTarget(): void;
        Show(x: any, y: any): void;
        private toInt;
        private readonly HorizontalFraction;
        private readonly VerticalFraction;
        handleEvent(e: MouseEvent): void;
        private _OnContextMenu;
        Close(): void;
        Target: JControl | HTMLElement;
        private target;
    }
    class ContextMenu extends JControl {
        private dic;
        Items: collection.List<CItem>;
        constructor(items?: (CItem | string)[]);
        initialize(): void;
        private itemChangedDlg;
        private SourceChanged;
        private add;
        private OnItemSelected;
        OnMenuItemSelected: bind.EventListener<(s: ContextMenu, i: MenuItem) => void>;
        private remove;
        private replace;
        private clear;
        reset(): void;
        Add(j: JControl): this;
        AddRange(citem: JControl[]): this;
        Remove(j: JControl, dispose: boolean): boolean;
        Show(x: any, y: any): void;
        private thrid;
        private dateout;
        handleEvent(e: MouseEvent): void;
        private _OnContextMenu;
        private timeout;
        Target: JControl;
        private target;
    }
    class Gage {
        initialize(): void;
        static deg2str(diam: number, n: number): number;
        static createDashArray(diam: number, degs: number[]): void;
    }
    class CostumizedShadow extends TemplateShadow {
        private data?;
        Controller: any;
        setDataContext(data: any): void;
        getDataContext(): any;
        constructor(dom: HTMLOptionElement, data?: any);
        initialize(): void;
        getScop(): bind.Scop;
    }
    class CostumizedTemplate extends Template {
        constructor();
        CreateShadow(data: any): TemplateShadow;
    }
    class ComboBox extends ListAdapter<any, any> {
        constructor(dom: HTMLSelectElement, DataSource: collection.List<any>);
    }
    class TreeComboBox<T> extends JControl {
        private tree;
        private getString;
        constructor(tree: utils.Tree<T>, getString: (v: T) => string);
        initialize(): void;
        Reset(): void;
        private add;
    }
    module help {
        function createHeader<Owner>(hd: HTMLTableRowElement, cols: IColumnTableDef[], orderBy?: basic.ITBindable<(sender: Owner, orderBy: string, col: IColumnCellHeaderDef, view: HTMLTableHeaderCellElement) => void>): HTMLTableRowElement;
        function createTemplate(cols: IColumnTableDef[], tmp?: HTMLTableRowElement): HTMLTableRowElement;
        function generateCell<T extends HTMLTableHeaderCellElement | HTMLTableDataCellElement>(h: IColumnCellDef<T>, stype: 'th' | 'td'): T;
        interface IAttribute {
            values: string[];
            spliter: string;
        }
        interface IColumnCellDef<T extends HTMLTableHeaderCellElement | HTMLTableDataCellElement> {
            Attributes?: {
                [s: string]: IAttribute | string;
            };
            TdAttributes?: {
                [s: string]: IAttribute | string;
            };
            Content?: string | T | Node;
            ContentAsHtml?: boolean;
        }
        interface IColumnCellHeaderDef extends IColumnCellDef<HTMLTableHeaderCellElement> {
            OrderBy?: string;
        }
        interface IColumnCellDataDef extends IColumnCellDef<HTMLTableDataCellElement> {
        }
        interface IColumnTableDef {
            Header: IColumnCellHeaderDef | string;
            Cell: IColumnCellDataDef;
            editable?: boolean;
        }
    }
    class _Grid {
        constructor();
    }
}
export declare module UI {
}
export declare module UI {
    interface IAutoCompleteBox {
        Box: Input;
        DataSource: collection.List<any>;
        View: HTMLElement;
        IsChanged: boolean;
        Value: any;
        PrintSelection?: boolean;
        AutoPopup: boolean;
        Blur(): any;
        Template: ITemplate;
    }
    class AutoCompleteBox extends ActionText implements IAutoCompleteBox {
        Box: Input;
        View: HTMLElement;
        PrintSelection?: boolean;
        Template: ITemplate;
        AutoPopup: boolean;
        private dataSource;
        IsChanged: boolean;
        DataSource: collection.List<any>;
        constructor(input?: HTMLInputElement);
        initialize(): void;
        Value: any;
        Blur(): void;
    }
    type AutoCompleteCallback<T> = (box: IAutoCompleteBox, oldValue: T, newValue: T) => void;
    class ProxyAutoCompleteBox<T> implements IAutoCompleteBox {
        Box: Input;
        Template: ITemplate;
        PrintSelection?: boolean;
        Blur(): void;
        AutoPopup: boolean;
        private callback;
        private _value;
        DataSource: collection.List<any>;
        OnValueChanged(owner: any, invoke: AutoCompleteCallback<T>): void;
        readonly View: HTMLElement;
        Value: T;
        IsChanged: boolean;
        constructor(Box: Input, source: collection.List<T>);
        initialize(): this;
    }
}
export declare module UI {
    class Paginator<T> extends JControl {
        countPerPage: number;
        private full?;
        static InputScop: bind.Scop;
        private content;
        private paginator;
        private paginationFilter;
        readonly Filter: filters.list.SubListFilter<T>;
        constructor(countPerPage: number, dom?: HTMLElement, full?: boolean);
        initialize(): void;
        Refresh(): void;
        private _cnt;
        Content: JControl;
        private whenIndexChanged;
        OnIndexChanged(ev: (b: bind.PropBinding, e: bind.EventArgs<number, BiPagination>) => void): bind.PropBinding;
        OffIndexChanged(b: bind.PropBinding): boolean;
        Max: number;
        BindMaxToSourceCount(x: collection.List<any>): void;
        UnbindMaxFromSourceCount(x: collection.List<T>): void;
        private bm2sc;
        Next(): void;
        Previous(): void;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
        OnKeyDown(e: KeyboardEvent): any;
        static DPInput: bind.DProperty<collection.List<any>, Paginator<any>>;
        Input: collection.List<T>;
        static DPOutput: bind.DProperty<collection.ExList<any, filters.list.SubListPatent>, Paginator<any>>;
        readonly Output: collection.ExList<T, filters.list.SubListPatent>;
        private bindInputToMax;
        private OnInputChanged;
        private bindScopToInput;
        InputScop: bind.Scop;
        static __fields__(): bind.DProperty<collection.List<any>, Paginator<any>>[];
        static createPaginator<T, P>(adapter: ListAdapter<T, P>, dataSource: collection.List<T>, max?: number): Paginator<T>;
    }
}
export declare module UI {
    class Grid extends UI.JControl {
        initialize(): void;
        private createRule;
    }
}
export declare module UI {
    interface IStrechyButtonItemData {
        Title: string;
        Icon?: string;
    }
    class StrechyButtonItemData extends bind.DObject {
        Title: string;
        static DPTitle: bind.DProperty<string, StrechyButtonItemData>;
        static DPIcon: bind.DProperty<string, StrechyButtonItemData>;
        Icon: string;
        static __fields__(): bind.DProperty<string, StrechyButtonItemData>[];
        constructor(Title: string);
    }
    class StrechyButton extends UI.ListAdapter<IStrechyButtonItemData, collection.List<IStrechyButtonItemData>> {
        private __data?;
        private triggerButton;
        private listDom;
        private itemTemplate;
        private IsOpen;
        constructor(__data?: collection.List<IStrechyButtonItemData>);
        initialize(): void;
        private static EventCloseIsRegistered;
        private static OpenedStrechyButtons;
        private static RegisterEvents;
        static CloseAll(enableEvent: boolean): void;
        Open(): void;
        Close(): void;
        private simpleClose;
        private simpleOpen;
        static handleEvent(event: any): void;
        handleEvent(event: Event): void;
    }
    class UISearch extends UI.JControl {
        inputEl: HTMLInputElement;
        constructor(el: HTMLElement);
        OnSearch: (data: string) => void;
        initialize(): void;
        handleEvent(e: KeyboardEvent): void;
        private validate;
        IsOpen: boolean;
        open(): void;
        close(): void;
    }
    function showSPTooltips(v: boolean): void;
}
export declare module UI.Modals {
    function CreateGlyph(dom: any, icon: any, title: any, type: any, attri: any): any;
    type EModalAction<T extends bind.DObject> = (sender: EModalEditer<T>, e?: ModalEditorEventArgs<T>) => void;
    type EModalEditorHandler<T extends bind.DObject> = basic.ITBindable<EModalAction<T>>;
    type ModalAction<T> = (product: T, isNew: boolean, err?: basic.DataStat, e?: MessageEventArgs) => boolean;
    type ModalEditorResult<T> = basic.ITBindable<ModalAction<T>>;
    type ModalListAction<T> = (s: ModalList<T>, selected: T, result: MessageResult, e: MessageEventArgs) => void;
    class ModalEditorEventArgs<T extends bind.DObject> {
        IsNew: boolean;
        Data: T;
        BackupData: BuckupList<T>;
        Owner?: any;
        CommitOrBackupHandled?: boolean;
        Editor: EModalEditer<T>;
        Error?: basic.DataStat;
        E: MessageEventArgs;
        IsDataChanged: boolean;
    }
    type EModalEditorCallback<T extends bind.DObject> = reflection.Method<void, (s: EModalEditer<T>, e: ModalEditorEventArgs<T>) => void>;
    abstract class BasicModalEditor<T extends bind.DObject> extends UI.Modal {
        static __fields__(): bind.DProperty<boolean, BasicModalEditor<any>>[];
        static DPIsEditable: bind.DProperty<boolean, BasicModalEditor<any>>;
        protected scop: bind.Scop;
        ChangedStatControled: boolean;
        IsEditable: boolean;
        Data: T;
        OnKeyDown(e: KeyboardEvent): any;
    }
    class EModalEditer<T extends bind.DObject> extends BasicModalEditor<T> {
        private templateName;
        allowEditNullVaue: boolean;
        action: reflection.Method<void, (s: this, e: ModalEditorEventArgs<T>) => void>;
        constructor(templateName: string, allowEditNullVaue: boolean);
        initialize(): void;
        private IsNew;
        private backupData;
        private _isOpen;
        edit(data: T, isNew: boolean, action: EModalEditorCallback<T>, editable?: boolean): void;
        Open(): void;
        Close(msg: MessageResult): void;
        NativeClose(msg: MessageResult, commit: boolean): void;
        silentClose(): void;
    }
    class ModalEditer<T extends bind.DObject> extends BasicModalEditor<T> {
        private templateName;
        constructor(templateName: string);
        initialize(): void;
        private IsNew;
        private backupData;
        edit(product: T, isNew: boolean, action: IEditorAction<T>, editable?: boolean): void;
        Open(): void;
        private Action;
    }
    interface IEditorAction<T> {
        OnSuccess?: ModalEditorResult<T>;
        OnError?: ModalEditorResult<T>;
    }
    interface IEEditorAction<T extends bind.DObject> {
        OnSuccess?: EModalEditorHandler<T>;
        OnError?: EModalEditorHandler<T>;
    }
    class EditorAction<T> implements IEditorAction<T> {
        private proxyAction;
        private callback;
        private invoke;
        OnSuccess: ModalEditorResult<T>;
        OnError: ModalEditorResult<T>;
        constructor(proxyAction: IEditorAction<T>, callback: DBCallback<T>);
        onSuccess(p: T, isNew: boolean): boolean;
        onError(p: T, isNew: boolean): boolean;
        Clone(callback: DBCallback<T>): EditorAction<T>;
        static Create<T>(_this: any, onSuccess: ModalAction<T>, onError: ModalAction<T>, defaltCallback?: DBCallback<T>): EditorAction<T>;
    }
    type DBCallback<T> = (data: T, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => void | boolean;
}
export declare module UI.Modals {
    class ModalList<T> extends UI.Modal {
        private source;
        private tableTmplate;
        private itemTemplate;
        private datas?;
        private asScopic?;
        isMatch?: (p: utils.IPatent<T>, item: T) => boolean;
        private paginator;
        private Datacontext;
        constructor(source: collection.List<T>, tableTmplate: string, itemTemplate: string, datas?: any, asScopic?: boolean, isMatch?: (p: utils.IPatent<T>, item: T) => boolean);
        static IsMatch<T>(p: utils.IPatent<T>, item: T): boolean;
        IsMatch: (p: utils.IPatent<T>, item: T) => boolean;
        initialize(): void;
        private static createPaginator;
        SelectedItem: T;
        show(onc: UI.Modals.ModalListAction<T>, list?: collection.List<T>): void;
        Source: collection.List<T>;
        Open(): void;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
        OnKeyDown(e: KeyboardEvent): any;
        Close(msg: any): void;
        private onc;
        _exList: collection.ExList<T, any>;
        private createFilter;
    }
}
export declare module UI {
    interface ITabControlData<OwnerClassType, ContentType> {
        Title: string;
        Content: ContentType;
        OnSelected?(sender: OwnerClassType, item: this): any;
    }
    interface ITabControlItem extends ITabControlData<TabControl, JControl> {
        Title: string;
        Content: JControl;
        OnSelected?(sender: TabControl, item: this): any;
    }
    class TabControl extends UI.NavPanel {
        static DPItems: bind.DProperty<collection.List<ITabControlItem>, TabControl>;
        Items: collection.List<ITabControlItem>;
        private static DPTabNav;
        private TabNav;
        private static DPTabContent;
        private TabContent;
        static DPSelectedItem: bind.DProperty<ITabControlItem, TabControl>;
        SelectedItem: ITabControlItem;
        static __fields__(): any;
        initialize(): void;
        OnBringIntoFront(): void;
        constructor(name: string, caption: string, items: ITabControlItem[]);
        private onSelectedTabChanged;
        private Reslect;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
        OnKeyDown(e: KeyboardEvent): any;
        CloseTab(e: Event, dt: bind.EventData, scopValue: bind.Scop, events: bind.events): void;
    }
    class UniTabControl<T> extends UI.NavPanel {
        private content;
        private onSelectedItemChanged;
        static DPItems: bind.DProperty<collection.List<ITabControlData<UniTabControl<any>, any>>, UniTabControl<any>>;
        Items: collection.List<ITabControlData<this, T>>;
        private static DPTabNav;
        private TabNav;
        private static DPTabContent;
        private TabContent;
        static DPSelectedItem: bind.DProperty<ITabControlData<UniTabControl<any>, any>, UniTabControl<any>>;
        SelectedItem: ITabControlData<this, T>;
        static __fields__(): any;
        initialize(): void;
        constructor(name: string, caption: string, items: collection.List<ITabControlData<UniTabControl<T>, T>>, content: JControl, onSelectedItemChanged: (s: UniTabControl<T>, cnt: JControl, selected: ITabControlData<UniTabControl<T>, T>) => string);
        private onSelectedTabChanged;
        OnKeyCombined(e: keyCominerEvent, v: IKeyCombinerTarget): any;
        OnKeyDown(e: KeyboardEvent): any;
        CloseTab(e: Event, dt: bind.EventData, scopValue: bind.Scop, events: bind.events): void;
        OnTabSelected: bind.EventListener<(e: ITabControlEventArgs<T>) => void>;
        OnTabClosed: bind.EventListener<(e: ITabControlEventArgs<T>) => void>;
        GetLeftBar(): any;
        GetRightBar(): any;
        OnPrint(): any;
        Update(): void;
        OnSearche(oldPatent: string, newPatent: string): void;
        OnDeepSearch(): void;
        readonly HasSearch: SearchActionMode;
    }
    interface ITabControlEventArgs<T> {
        Sender: UniTabControl<T>;
        Cancel: boolean;
        Target: ITabControlData<ITabControlData<UniTabControl<T>, T>, T>;
        Stat: 'opened' | 'closing' | 'closed';
    }
    class TabControlItem<OwnerType, ContentType> extends bind.DObject implements ITabControlData<OwnerType, ContentType> {
        Title: string;
        Content: ContentType;
        static DPTitle: bind.DProperty<string, TabControlItem<any, any>>;
        static DPContent: bind.DProperty<any, TabControlItem<any, any>>;
        static __fields__(): bind.DProperty<any, TabControlItem<any, any>>[];
        constructor(Title: string, Content: ContentType);
    }
}
export declare var LoadDefaultCSS: (callback?: any, onerror?: any) => void;
