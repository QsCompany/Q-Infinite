///// <reference path="../../dts/facebook.d.ts" />
import { query, basic, mvc, bind, collection, $$, ScopicControl, reflection, ScopicCommand } from "./../../sys/Corelib";
import { UI } from '../../sys/UI';
import { context } from 'context';
import { Material as Qui } from '../QUI/script';
import { Material as C3D } from '../Canvas3D/script';
//import * as css from 'style|style.css';
import * as tmpl from 'template|../../assets/Components/QSidebar/dom.html';
ValidateImport(tmpl);
declare var require;
declare var FB;
declare var $: (s: string, dom?: any) => HTMLElement;
if (typeof FB !== 'undefined') {
    FB.getLoginStatus(function (response) {
        switch (response.status) {
            case 'connected':
                break;
            case 'not_authorized':
                break;
            case 'unknown':
                break;
        }
    });
    var callback = (resp) => {
        stop();
    }

    FB.login(callback, {

    })
}
export module Material {   

    export interface INavItem {
        Title: string;
        Badge: string | number;
        Icon?: string;
        Data?: any
    }
    export interface IGroupNavItem extends INavItem {
        mode?: 'pop' | 'sub';
        Children: INavItem[];
    }

    export abstract class SideNavItem extends UI.JControl {
        private anchore: HTMLAnchorElement;
        private badge: HTMLSpanElement;
        private children: UI.Dom;
        protected initialize() {
            this.anchore = document.createElement('a');
            if (this.item.Icon) this._view.classList.add(this.item.Icon);
            this.anchore.innerText = this.item.Title;
            this.buildBadge();
            this.View.appendChild(this.anchore);
            this.buildChildren();
        }
        static ctor() {
            require('style|../../assets/Components/QSidebar/style.css');
        }
        constructor(public item: INavItem) {
            super(document.createElement('li'));
        }
        private buildBadge() {
            var badge = this.item.Badge;
            if (badge == null || badge == '') {
                this.badge && this.badge.remove();
                return;
            }
            if (!this.badge) {
                this.badge = document.createElement('span');
                this.badge.classList.add('count');
            }
            if (this.badge.parentNode == null)
                this.anchore.appendChild(this.badge);
            this.badge.innerText = String(badge);
        }
        private buildChildren() {
            var children = (this.item as IGroupNavItem).Children;
            if (children) {
                this.applyStyle('has-children');
                this.children = new UI.Dom('ul');
                this.Add(this.children);
                for (var i = 0; i < children.length; i++)
                    this.children.Add(new SubsSideNavItem(children[i], this));
            }
            if ((this.item as IGroupNavItem).mode === 'pop') {
                this.anchore.addEventListener('mouseenter', this);
                this._view.addEventListener('mouseleave', this);
                return;
            }
            this.anchore.addEventListener('click', this);
        }
        public OnSelected: basic.ITBindable<(snItems: SideNavItem[]) => void>;
        public abstract OnChildSelected(nitems: SideNavItem[]);
        handleEvent(e: Event) {
            if ((this.item as IGroupNavItem).mode === 'pop')
                switch (e.type) {
                    case 'mouseenter':
                        if ((this.item as IGroupNavItem).mode === 'pop' && e.currentTarget === this.anchore)
                            return this.IsActive = true;
                    case 'mouseleave':
                        if ((this.item as IGroupNavItem).mode === 'pop' && e.currentTarget === this._view)
                            return this.IsActive = false;
                    default: return super.handleEvent(e);
                }
            else if (e.type === 'click' && e.currentTarget === this.anchore)
                if (!this.IsActive) {
                    $$(this._view).toggleClass('active');
                    if (this.IsActive) {
                        var args = [this];
                        this.OnChildSelected(args);
                        this.OnSelected && this.OnSelected.Invoke.call(this.OnSelected.Owner, args);
                    }
                }
            else super.handleEvent(e);
        }
        private _isActive: boolean;
        set IsActive(v: boolean) {
            this._view.classList[v ? 'add' : 'remove']((this.item as IGroupNavItem).mode === 'pop' ? 'hover' : 'active');
        }
        get IsActive(): boolean {
            return this._view.classList.contains('active') || this._view.classList.contains('hover');
        }
    }

    class SubsSideNavItem extends SideNavItem {
        constructor(item: INavItem, private ParentNavItem: SideNavItem) {
            super(item);
        }
        public OnChildSelected(nitems: SideNavItem[]) {
            var p = this.ParentNavItem;
            if (!p) return;
            nitems.push(p);
            p.OnChildSelected(nitems);
        }
    }
    class MainSideNavItem extends SideNavItem {
        constructor(item: INavItem, private ParentNav: SideNav) {
            super(item);
        }
        public OnChildSelected(nitems: SideNavItem[]) {            
            this.ParentNav.OnChildSelected(nitems);
        }
    }
    export interface ISideNavData {
        Title: string;
        Items: INavItem[];
        Data?: any
    }

    export class SideNav extends UI.JControl {
        constructor(private data: ISideNavData[]) {
            super(document.createElement('nav'))
        }
        public initialize() {
            //UI.JControl.LoadCss(context.GetPath('style.css'));
            this.applyStyle('cd-side-nav');
            for (var i = 0; i < this.data.length; i++)
                this.buildChild(this.data[i]);            
        }
        public OnChildSelected(nitems: SideNavItem[]) {
            this.OnItemSelected(nitems);
        }
        private buildChild(data: ISideNavData) {
            var v = new UI.Dom(document.createElement('ul'));
            var title = document.createElement('li');
            title.classList.add('cd-label');
            title.innerText = data.Title;
            v.View.appendChild(title);
            for (var i = 0; i < data.Items.length; i++) {
                var l = data.Items[i];
                var c = new MainSideNavItem(l, this);
                v.Add(c);
            }
            this.Add(v);
        }
        private currentItems: SideNavItem[];
        private OnItemSelected(items: SideNavItem[]) {
            if (this.currentItems) {
                for (var i = 0; i < this.currentItems.length; i++) {
                    var c = this.currentItems[i];
                    c.IsActive = false;
                }
            }
            for (var i = 0; i < items.length; i++) {
                var c = items[i];
                var t = c.item as IGroupNavItem;
                if (t.mode !== 'pop') c.IsActive = true;
            }
            this.currentItems = items;
        }
    }
}
var data: Material.ISideNavData = <Material.ISideNavData>{
    Title: "Main Menu",
    Items: [
        { Title: "Overview", Badge: '1' ,Icon:'overview'},
        <Material.IGroupNavItem>{
            Title: 'Menu', Badge: '2', Icon:'comments',
            Children: [
                {
                    Title: 'Item 1',
                },
                {
                    Title: 'Item 3',
                },
                {
                    Title: 'Item 2',
                }
            ], mode: 'pop'
        },
        <Material.IGroupNavItem>{
            Title: 'Menu', Badge: '2', Icon:'notifications',
            Children: [
                {
                    Title: 'Item 1',
                },
                {
                    Title: 'Item 3',
                },
                {
                    Title: 'Item 2',
                }
            ], mode: 'sub'
        }
    ]
};
export var counter = 0;
export function test() {
    var app = new Qui.App();
    
    document.body.innerHTML = '';
    document.body.appendChild(app.View);

    var c = new UI.Dom('div');
    app.OnInitialized = app => {
        ret.menu = new Material.SideNav([data]);
        app.Menu = ret.menu;
    }
    var ret = { app: app, container: c, menu: undefined, canvas: undefined };
    app.Parent = UI.Desktop.Current;
    return ret;
}
