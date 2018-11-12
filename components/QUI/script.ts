
import { $$, query, basic, bind, collection, reflection, ScopicCommand } from "./../../sys/Corelib";
import { UI } from './../../sys/UI';
import { context } from 'context';
import { Material as side } from './../QSidebar/script';
import { Material as c3D } from '../Canvas3D/script';
import { defs } from '../../sys/defs';

import * as tmpl from 'template|../../assets/Components/QUI/dom.html';
ValidateImport(tmpl);


declare var require;
declare var $: (s: string, dom?: any) => HTMLElement;

///https://codyhouse.co/demo/3d-rotating-navigation/index.html#0
///https://codyhouse.co/gem/side-shopping-cart/
export module Material {
    export interface IMenuitem {
        Title: string;
        Data: any;
    }
    export interface ICard extends IMenuitem {
        Icon?: string;
    }

    export class App extends UI.Layout<UI.Page> {
        public get IsAuthentication(): boolean { return false; }
        private Controller: bind.Controller;
        public Foot: UI.ServiceNavBar<UI.IItem>;
        public SearchBox: UI.ActionText;
        protected showPage(page: UI.Page) {
            this.Content = page;
        }
        public OnKeyDown(e: KeyboardEvent) {
            var s = this.SelectedPage as any;
            if (s) (s as any).OnKeyDown(e);
        }
        protected Check(child: UI.Page) {
            return child as any === this.Foot || child instanceof UI.Page;
        }
        private _getView(data?) {
            var tmp = UI.Template.ToTemplate('templates.qui-app', false);
            var Shadow = tmp.CreateShadow();
            Shadow.Parent = this;
            return Shadow;
        }
        private static _getView() {
            return UI.ListAdapter._getTemplateShadow('templates.qui-app');
        }
        constructor() {
            super(App._getView());
            this.Controller = bind.Controller.Attach(this, this);
            this.Controller.OnCompiled = {
                Invoke: this.OnCompileEnd, Owner: this
            };
        }

        private _sideMenu: HTMLDivElement;
        private _body: HTMLDivElement;
        public static DPCategories: bind.DProperty<App, collection.List<IMenuitem>>;
        public static DPFastLinks: bind.DProperty<App, collection.List<IMenuitem>>;
        public static DPSuggestions: bind.DProperty<App, collection.List<ICard>>;
        public static DPLogo: bind.DProperty<App, string>;
        private _pages: UI.ListAdapter<UI.Page, any>;
        private _txt_search: HTMLInputElement;
        private _navigationWrapper: HTMLElement;
        private _navigation: HTMLElement;
        private _searchForm: HTMLElement;
        private _closeSuggetions: HTMLElement;
        private _pageContent: HTMLElement;
        private _searchTrigger: HTMLElement;
        private _coverLayer: HTMLElement;
        private _navigationTrigger: HTMLElement;
        private _mainHeader: HTMLElement;

        private searchWrapper = (() => { var t = document.createElement('li'); t.classList.add('cd-serch-wrapper'); return t; })();
        private Suggestions: collection.List<ICard>;
        private appTemplate: UI.TControl<this>;
        private _content: UI.JControl;
        private _menu: side.SideNav;
        private IsCompiled() { return this.Controller.getStat() >= 2; }
        public set Content(v: UI.JControl) {
            if (v === this._content) return;
            if (this.IsCompiled && this._content) {
                this._content.Parent = null;
                this._content.View.remove();
            }
            if (v)
                this.Controller.OnCompiled = {
                    Invoke: t => {
                        if (v.Parent)
                            throw new Error('The Control has connection with other Control');
                        this._pageContent.appendChild(v.View);
                        v.Parent = this;
                        this._content = v;
                    }, Owner: this
                }
            else
                this._content = v;
        }
        private setContent(t: this) {

        }
        public get Content() { return this._content; }

        public set Menu(v: side.SideNav) {
            if (v === this._menu) return;
            if (this._menu) {
                this._menu.Parent = null;
            }
            if (v) this.Controller.OnCompiled = {
                Invoke: t => {
                    this._sideMenu.appendChild(v.View);
                    v.Parent = this;
                    this._menu = v;
                }, Owner: this
            }
            else this._menu = v;

        }
        public get Menu() { return this._menu; }
        
        public handleEvent(event: Event) {
            var src = event.srcElement;
            var name = src.getAttribute('db-name');
            switch (name) {
                case 'coverLayer':
                case 'closeSuggetions':
                    this.toggleSearchForm(true);
                    break;
                case 'searchTrigger':
                    event.preventDefault();
                    if (!this.toggleSearchForm())
                        this.onSearch();
                    break;
                case 'navigationTrigger':
                    event.preventDefault();
                    $$([this._mainHeader, this._navigation, this._pageContent]).toggleClass('nav-is-visible');
                    break;
                default:
            }
        }
        public setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
            this['_'.concat(name)] = dom;
            if (name === 'searchTrigger')
                this._searchTrigger.addEventListener('click', this);
            if (name === 'navigationWrapper')
                this._pages = e.IsNew ? e.Control as any : null;
        }
        private onSearch() {
            var c = this._txt_search.value;
            if (c && c.length > 5)
                this.Suggestions.Add({ Data: "Iam", Title: c });
        }
        toggleSearchForm(close?: boolean) {
            close = close === undefined ? this._searchTrigger.classList.contains('search-form-visible') : close;
            if (close) {
                this._searchTrigger.classList.remove('search-form-visible');
                this._searchForm.classList.remove('is-visible');
                this._coverLayer.classList.remove('search-form-visible');
                return false;
            }
            else {
                this._searchTrigger.classList.add('search-form-visible');
                this._coverLayer.classList.add('search-form-visible');
                this._searchForm.classList.add('is-visible');
                return true;
            }
        }
        static navbarFixedBottomHeightName = '--navbar-fixed-bottom-height';
        private mainRule
        private set NFBHeight(v: number) {
            if (!App.BlackAppRule) {
                var t = App.links[1].sheet as CSSStyleSheet;
                var rls = t.cssRules || t.rules;
                for (var i = 0; i < rls.length; i++) {
                    var y = rls[i] as CSSStyleRule;
                    if (y.selectorText === '.BlackApp') { App.BlackAppRule = y; break; }
                }
            }
            if (App.BlackAppRule)
                App.BlackAppRule.style.setProperty(App.navbarFixedBottomHeightName, v + 'px');
            else
                document.documentElement.style.setProperty(App.navbarFixedBottomHeightName, v + 'px');
        }

        css(el:Element) {
            var sheets = document.styleSheets, ret = [];
            el.matches = el.matches || el.webkitMatchesSelector || (el as any).msMatchesSelector;
            
            return ret;
        }
        static links: HTMLLinkElement[];
        static BlackAppRule: CSSStyleRule;
        initialize() {
            window['k'] = this;
            super.initialize();
            this.applyStyle('BlackApp');

            var app = UI.Desktop.Current.CurrentApp;
            this.Foot = new UI.ServiceNavBar<UI.IItem>(this, false);
            var pcon = new c3D.Canvas3D();
            var page = new UI.Page(this as any, "Canvas 3D", "Canvas 3D");
            page.Add(pcon);

            this.Pages = new collection.List<UI.Page>(Object, []);
            this.Suggestions = new collection.List<ICard>(Object, [{ Data: "Iam", Title: "Test Title then if you see this then you are ok" }]);
            if (!App.links) {
                App.links = [UI.JControl.LoadCss(context.GetPath('Reset.css')), UI.JControl.LoadCss(context.GetPath('style.css'))];
            } else {
                for (var i = 0; i < App.links.length; i++) {
                    var l = App.links[i];
                    if (l.parentNode == null) document.head.appendChild(l);
                }
            }
            this.moveNavigation = this.moveNavigation.bind(this);
            window.addEventListener('resize', (e) => this.checkResize());
            this.Add(this.Foot as any);
        }
        
        protected OnCompileEnd(cnt: bind.Controller) {
            this._navigationTrigger.addEventListener('click', this);
            this._closeSuggetions.addEventListener('click', this);
            this._closeSuggetions.addEventListener('click', this);
            this.checkResize();
            this._pages.OnItemSelected.On = (a, b, c, d, f) => this.SelectedPage = this.Pages.Get(b);
            
        }
        checkResize() {
            if (!this.resizing) {
                this.resizing = true;
                (!window.requestAnimationFrame) ? setTimeout(this.moveNavigation, 300) : window.requestAnimationFrame(this.moveNavigation);
            }
        }
        checkWindowWidth() {
            var mq = window.getComputedStyle(this._mainHeader, '::before').getPropertyValue('content').replace(/"/g, '').replace(/'/g, "");
            return mq;
        }
        moveNavigation() {
            var screenSize = this.checkWindowWidth();
            if (screenSize == 'desktop' && ($$(this._navigationTrigger).siblings(query.hasClass, 'cd-main-search').length == 0)) {
                $$(this._searchForm).detach().insertBefore(this._navigationTrigger);
                $$(this._navigationWrapper).detach().insertBefore(this._searchForm);
                this.searchWrapper.remove();
            } else if (screenSize == 'mobile' && !($$(this._mainHeader).children(query.hasClass, 'cd-main-nav-wrapper').length == 0)) {
                $$(this._navigationWrapper).detach().insertAfter(this._pageContent);
                var newListItem = this.searchWrapper;
                $$(this._searchForm).detach().appendTo(newListItem);
                this._navigation.appendChild(this.searchWrapper);
            }
            this.resizing = false;
        }

        resizing = false;
        static ctor() {
            this.DPCategories = App.CreateField<App, collection.List<IMenuitem>>("Categories", collection.List);
            this.DPFastLinks = App.CreateField<App, collection.List<IMenuitem>>("FastLinks", collection.List);
            this.DPSuggestions = App.CreateField<App, collection.List<IMenuitem>>("Suggestions", collection.List);
            this.DPLogo = App.CreateField<App, string>("Logo", String);
            require('style|./../../assets/Components/QUI/style.css');
            require('style|./../../assets/Components/QUI/Reset.css');
        }
        public CloseMenu() { this._body.classList.add('hide-menu'); }
        public OpenMenu() { this._body.classList.remove('hide-menu'); }
        public get IsMenuOpen() { return this._body.classList.contains('hide-menu'); }
        static __fields__() { return [/*this.DPPages,*/ this.DPCategories, this.DPFastLinks, this.DPSuggestions, this.DPLogo] as any; }
    }
}