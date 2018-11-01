import { UI } from "../../sys/UI";
import { sdata } from "../../sys/System";
import { collection, bind } from "../../sys/Corelib";


export namespace components {
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