import { context } from 'context';
export module Resources {
    var stat: boolean = void 0;
    var stack: ((success: boolean) => void)[] = [];
    export var result: {
        heavyTable: ITemplateExport;
        uiTemplate: ITemplateExport;
        components: ITemplateExport;
        strechyButton: ITemplateExport;
    } = <any>{};

    var resources = {
        uiTemplate: 'template|../assets/templates/UITemplates.html',
        components: "template|../assets/templates/Components.html",
        heavyTable: "template|../assets/Components/HeavyTable/dom.htm",
        strechyButton: 'template|../../assets/Components/StrechyButton/dom.html'
    };
    export function OnInitalized(callback: (success: boolean) => void) {
        if (stat === void 0)
            return stack.push(callback);
        return callback(stat);
    }

    export function Initialize() {
        var _res = clone(resources);
        for (const res in _res)
            iter(_res[res]);
    }
    function iter(res: string) {
        function p(r) {
            check(res, r);
        }
        require(res, p, p);
    }
    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    function keyOf(value) {
        for (var x in resources)
            if (resources[x] === value) return x;
        return void 0;
    }
    function check(res: string, r: ITemplateExport) {
        var key = keyOf(res);
        if (key !== void 0) {
            result[key] = r;
            delete resources[key];
        }
        if (isEmpty(resources)) {
            for (const cll of stack) {
                try {
                    cll(true);
                } catch (e) {
                }
            }
            stat = true
            stack = void 0;
            resources = void 0;
            context.ExecuteModule(true);
        }
    }
    context.HandleExecution();
    Initialize();
}