import { query, basic, mvc, bind, collection, $$, ScopicControl, reflection, ScopicCommand } from "./../../sys/Corelib";
import { UI } from '../../sys/UI';
import { context } from 'context';
import { Material as mtr } from '../QUI/script';

//import * as css from 'style|style.css';
import * as tmpl from 'template|../../assets/Components/Canvas3D/dom.html';
ValidateImport(tmpl);
declare var require;
declare var $: (s: string, dom?: any) => HTMLElement;


export module Material {
    var c = { Title: "Achour", Data: null, Icon: null };
    var _template: Template;
    var _stemplate: mvc.ITemplate;
    function getTemplate() {
        return _template || (_template = new Template());
    }
    function getSTemplate() {
        return _stemplate || (_stemplate = tmpl.template["qui-3ditem"]);
    }
    export class Canvas3D extends UI.TControl<Canvas3D> {
        public Items = new collection.List<mtr.ICard>(Object, [c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c]);
        private cnt_galleryItems: UI.ListAdapter<any, any>;
        private galleryItems: HTMLUListElement;
        constructor() {
            super(tmpl.template["qui-Canvas3D"], UI.TControl.Me as any);
        }
        private count = 0;

        public setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
            this[name] = dom;
            if (name === 'galleryItems') {
                this.cnt_galleryItems = cnt as any;
                this.cnt_galleryItems.Template = getTemplate();
            }
        }
        initialize() {
            super.initialize();

            //UI.JControl.LoadCss(context.GetPath('style.css'));
        }
        static ctor() {
            debugger;
            var df = tmpl.template;
            require('style|../../assets/Components/Canvas3D/style.css');
        }
    }

    var _classes = [["move-right", "hidden"], ["cd-item-front"], ["cd-item-middle"], ["cd-item-back"], ["cd-item-out"], []];
    var _sclasses = ["move-right", "hidden", "cd-item-front", "cd-item-middle", "cd-item-back", "cd-item-out"];
    export class GalleryItem extends UI.ScopicTemplateShadow {
        private selectedIndex: number = 0;
        static _template: mvc.ITemplate;
        private itemsWrapper: HTMLUListElement;
        private visionTrigger: HTMLAnchorElement;
        private Next: HTMLAnchorElement;
        private Prev: HTMLAnchorElement;
        private items: HTMLLIElement[] = [];

        static _createScop(item) {
            var isscop = item instanceof bind.Scop;
            return isscop ? item : new bind.ValueScop(item)
        }
        constructor(private data?: any | bind.Scop, dom?: HTMLElement) {
            super(dom || getSTemplate().Create(), GalleryItem._createScop(data));
        }
        public setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
            this[name] = dom;
            if (name === 'visionTrigger')
                this.visionTrigger.addEventListener('click', this);
            else if (name === 'Next')
                this.Next.addEventListener('click', this);
            else if (name === 'Prev')
                this.Prev.addEventListener('click', this);
            else if (name === 'itemsWrapper') {
                for (var i = 0; i < dom.children.length; i++) {
                    var c = dom.children[i] as HTMLLIElement;
                    this.items.push(c);
                }
            }
        }
        public handleEvent(e: Event) {
            var src = e.srcElement;
            var name = src.getAttribute('db-name');
            switch (name) {
                case 'visionTrigger':
                    return this.onVisionTriggerClick(e);
                case 'Next':
                    this.GoNext();
                    break;
                case 'Prev':
                    this.GoPrev();
                    break;
                default:
            }
        }
        private onVisionTriggerClick(e: Event) {
            if (this._view.classList.contains('active')) {
                this.View.classList.remove('active');
                this.hideNavigation();
            } else {
                this.View.classList.add('active');
                this.updateNavigation();
            }
        }
        hideNavigation() {
            this.Next.classList.remove('visible');
            this.Prev.classList.remove('visible');
        }
        updateNavigation() {
            this.ActiveNext = this.IsNextActive;
            this.ActivePrev = this.IsPrevActive;
        }
        public set ActiveNext(v: boolean) {
            this.Next.classList[v ? 'add' : 'remove']('visible');
        }
        public set ActivePrev(v: boolean) {
            this.Prev.classList[v ? 'add' : 'remove']('visible');
        }
        public get IsPrevActive() {
            return this.selectedIndex > 0;
        }
        public get IsNextActive() {
            return this.selectedIndex < this.items.length - 1;
        }
        public get SelectedIndex() {
            return this.selectedIndex;
        }
        public set SelectedIndex(v: number) {
            if (v <= 0) this.selectedIndex = 0;
            else if (v >= this.items.length) this.selectedIndex = this.items.length - 1;
            else this.selectedIndex = v;
        }
        private Update() {
            var items = this.items;
            var osi = this.SelectedIndex;
            var si = osi + 1;
            for (var i = 0; i < items.length; i++) {
                var ci = items[i];
                ci.classList.remove("cd-item-front", "cd-item-middle", "cd-item-back", "cd-item-out", "move-right", "hidden");
                if (i < si)
                    ci.classList.add('move-right', 'hidden');
                else if (i === si)
                    ci.classList.add('cd-item-front');
                else if (i === si + 1)
                    ci.classList.add('cd-item-middle');
            }
        }
        public GoNext() {
            var items = this.items;
            var osi = this.SelectedIndex;
            var csi = ++this.SelectedIndex;
            if (osi === csi || csi >= this.items.length) return this.ActiveNext = false;
            this.showNextSlide(items[osi], items[osi + 1], items[osi + 2], items[osi + 3]);
            //if (0 === Math.sin(3))
            //    for (var i = 0; i < 4; i++) {
            //        this.updateCss(osi + i, _classes[1 + i], _classes[i]);  //front
            //    }
            if (osi + 1 >= this.items.length - 1) this.ActiveNext = false;
            if (osi >= 0) this.ActivePrev = true;
        }

        public GoPrev() {

            var items = this.items;
            var osi = this.SelectedIndex;
            var csi = --this.SelectedIndex;
            if (osi === csi || osi <= 0) return this.ActivePrev = false;

            this.showPreviousSlide(items[osi], items[osi + 1], items[csi], items[osi + 2]);

            //if (0 === Math.sin(566))
            //    for (var i = 0; i < 4; i++) {
            //        this.updateCss(csi + i, _classes[i], _classes[i + 1]);  //front
            //    }

            if (csi <= 0) this.ActivePrev = false;
            if (csi < items.length) this.ActiveNext = true;
        }

        private updateCss(index, remove: string[], add: string[]) {
            var i = this.items[index];
            if (!i) return;
            if (add) i.classList.add.apply(i.classList, add);
            if (remove) i.classList.remove.apply(i.classList, remove);
        }
        private showNextSlide(itemToHide: HTMLLIElement, itemToShow: HTMLLIElement, itemMiddle: HTMLLIElement, itemToBack: HTMLLIElement) {
            if (itemToHide)
                itemToHide.classList.add('move-right'), itemToHide.classList.remove('cd-item-front'),
                    this.createEvent(itemToHide, 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'.split(' '), (e, d) => { d.itemToHide.classList.add('hidden'); d.data.swap(); }, this);
            if (itemToShow) itemToShow.classList.add('cd-item-front'), itemToShow.classList.remove('cd-item-middle');
            if (itemMiddle) itemMiddle.classList.add('cd-item-middle'), itemMiddle.classList.remove('cd-item-back');
            if (itemToBack) itemToBack.classList.add('cd-item-back'), itemToBack.classList.remove('cd-item-out');
        }

        private showPreviousSlide(itemToMiddle: HTMLLIElement, itemToBack: HTMLLIElement, itemToShow: HTMLLIElement, itemToOut: HTMLLIElement) {
            if (itemToShow) itemToShow.classList.remove('hidden'), itemToShow.classList.add('cd-item-front');
            if (itemToMiddle) itemToMiddle.classList.remove('cd-item-front'), itemToMiddle.classList.add('cd-item-middle');
            if (itemToBack) itemToBack.classList.remove('cd-item-middle'), itemToBack.classList.add('cd-item-back');
            if (itemToOut) itemToOut.classList.remove('cd-item-back'), itemToOut.classList.add('cd-item-out');

            if (itemToShow) {
                var r = { stop: 0, t: this };
                r.stop = setInterval(this.myTimer, 100, itemToShow, r);
            }
        }
        private myTimer(itemToShow, stop: any) {
            if (!itemToShow.classList.contains('hidden')) {
                itemToShow.classList.remove('move-right');
                window.clearInterval(stop.stop);
                stop.t.swap();
            }
        }

        private createEvent<T>(itemToHide: Element, events: string[], callback: (e: Event, data: IOneEvent<T>) => void, data: T) {
            if (!itemToHide) return;
            var x: IOneEvent<T> = {
                callback: callback,
                events: events,
                itemToHide: itemToHide,
                handleEvent: one, data: data
            }
            for (var i = 0; i < events.length; i++) {
                itemToHide.addEventListener(events[i], x);
            }
        }

        private swap() {
            if (0 === 0)
                return;
            var si = this.SelectedIndex;
            var esi = si + 2;
            for (var i = 0; i < this.items.length; i++) {
                var t = this.items[i];
                if (i < si) t.classList.remove("move-right", "hidden", "cd-item-front", "cd-item-middle", "cd-item-back", "cd-item-out"), t.classList.add("move-right", "hidden")
                if (i > esi) t.classList.remove("move-right", "hidden", "cd-item-front", "cd-item-middle", "cd-item-back", "cd-item-out"), t.classList.add("cd-item-out");
            }
        }
    }

    interface IOneEvent<T> {
        callback: (e: Event, stat: IOneEvent<T>) => void;
        events: string[];
        itemToHide: Element;
        handleEvent: (e: Event) => void;
        data: T;
    }

    function one(e: Event) {
        if (!this.events) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        try {
            this.callback(e, this);
        } catch (e) {
        }

        for (var i = 0; i < this.events.length; i++)
            (this.itemToHide as Element).removeEventListener(this.events[i], this);

        delete this.events;
        delete this.itemToHide;
        delete this.handleEvent;

    }

    export class Template extends UI.Template {
        CreateShadow<T>(data?: T | bind.Scop): UI.TemplateShadow {
            return new GalleryItem(data);
        }
    }

}

ScopicControl.register("Material.Canvas3D", (e) => {
    return e.Result = new Material.Canvas3D();
});
ScopicControl.register("Material.GalleryItem", (e) => {
    return e.Result = new Material.GalleryItem(e.currentScop || e.parentScop, e.dom);
});
window["C3D"] = () => {
    setTimeout(() => {
        var app: mtr.App = window['app'];
        var c3d = new Material.Canvas3D();
        window['c3d'] = c3d;
        c3d.Parent = UI.Desktop.Current;
        document.body.appendChild(c3d.View);
    }, 2000);
}
