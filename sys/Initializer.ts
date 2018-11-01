import { bind, Processor, ScopicCommand, mvc, ScopicControl, basic, attributes, Attributes } from "./Corelib";
import { UI } from "./UI";



function initTwoWay(xx: Processor.Tree, p: Processor.Instance) {
    return undefined;
}
function checkTwoWay(xx: Processor.Tree, p: Processor.Instance) {
    if (p.value == 'true') p.value = bind.BindingMode.TwoWay;
    else if (p.value == 'false') p.value = bind.BindingMode.SourceToTarget;
    else p.value = isNaN(Number(p.value)) ? bind.BindingMode[p.value] || bind.BindingMode.SourceToTarget : Number(p.value);
    return true;
}
function processComplicatedAttribute(xx: Processor.Tree, p: Processor.Instance) {
    var dom: Node = xx.e.dom,
        parent: bind.Scop = xx.parent.Scop,
        _scop: bind.Scop = xx.Scop,
        tsm: bind.JobInstance[] = xx.e.Jobs,
        attribute: string = p.value;

    var isCmd;
    var x = attribute.split("->");
    var _bind = x[0] || '';
    var job = x[1] || '';
    if (job.length === 0) return;
    if (job[0] === '#')
        isCmd = true, job = job.substr(1);

    if (job.length === 0) return;
    if (_bind[0] == '.') {
        parent = _scop || parent;
        _bind = _bind.substr(1);
    }
    else if (parent == null) parent = _scop;
    if (_bind.length > 0)
        _scop = bind.Scop.Create(_bind, parent,
            attribute.indexOf('<->') !== -1 ? bind.BindingMode.TwoWay :
                attribute.indexOf('->') ? bind.BindingMode.SourceToTarget : bind.BindingMode.TargetToSource
        );
    if (isCmd) return ScopicCommand.Call(job, dom, _scop);
    var ijob = job == '.' ? _scop.GetJob(job.substring(1)) : bind.GetJob(job);
    var ji = _scop.AddJob(ijob, dom);
    tsm.push(ji);
}
enum bmode {
    '<->' = 3,
    '->' = 1,
    '<-' = 2
}

function bindString(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var scop: bind.Scop = x.Scop, controller: bind.Controller = x.controller;
    var s = "" + p.value;
    for (var i = 3; i > 0; i--) {
        if (s.indexOf(bmode[i]) != -1) {
            var bindMode = i;
            break;
        }
    }
    if (!bindMode) return;
    var x1 = s.split(bmode[bindMode]);
    var s1 = bind.Scop.GenerateScop(x1[0], scop, 3, controller);
    var s2 = bind.Scop.GenerateScop(x1[1], scop, 3, controller);
    if (!s1 || !s2) return;
    var tx = new bind.TwoBind(bindMode , s1, s2, bind.Scop.DPValue, bind.Scop.DPValue);
   
    controller.OnDisposing = (s) => {
        tx.Dispose();
    };
}
function DeclareAttribute(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    (x.parent.Scop || x.Scop) && (x.parent.Scop || x.Scop).setAttribute(p.value, undefined);
    return undefined;
}
function InitTemplate(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var createTemplate = function (templatePath: string, dom: Element): HTMLElement {
        if (templatePath) {
            var template = mvc.MvcDescriptor.Get(templatePath);
            dom = template.Create();
        } else throw "template args not setted";
        return dom as HTMLElement;
    }
    var dom = x.e.dom as Element;
    var ndom = createTemplate(p.value, dom);
    if (dom != ndom) {
        for (var i = 0; i < dom.attributes.length; i++) {
            var c = dom.attributes.item(i);
            if (c.name === 'compiled' || c.name.indexOf('db-') === 0) {
                continue;
            }
            ndom.setAttribute(c.name, c.value);
        }
        dom.parentNode.replaceChild(ndom, dom);
        dom = ndom;
    }
    var e1 = Processor.Compile(x.New(dom));
    if (!e1) stop();
    return { e: e1 || x.e, Break: true };
}


function extraxtScop(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var tw = p.manager.getProcessorByAttribute('db-twoway');
    x.e.Scop = p.value ? bind.Scop.Create(p.value, x.parent.Scop, tw && tw.value, x.controller) || x.parent.Scop : x.parent.Scop;
    x.e.IsNew = x.e.Scop != x.parent.Scop;
    if (!x.e.Scop) x.e.Scop = x.parent.Scop || x.controller.Scop;
    return undefined;
}
function strTemplate(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var c = bind.StringScop.GetStringScop(x.Dom.textContent, x.Scop, x.controller) as bind.StringScop;
    if (typeof c === 'string') return undefined;
    c.AttacheTo(x.Dom);
    x.e.Scop = c;
    x.e.IsNew = true;
    if (!x.e.Scop) x.e.Scop = x.parent.Scop || x.controller.Scop;
    return undefined;
}

function initLocalValues(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    for (var ic in p.value)
        x.Scop.setAttribute(ic, p.value[ic]);
    return undefined;
}
function executeFilter(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var tw = p.manager.getProcessorByAttribute('db-twoway');
    x.e.Scop = bind.CreateFilter(p.value, x.Scop, tw && tw.value || 3);

    return undefined;
}

function execJobs(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var
        e: bind.IJobScop = x.e,
        control: UI.JControl = x.parent.Control,
        parentScop: bind.Scop = x.parent.Scop;

    var tsm: bind.JobInstance[] = e.Jobs;
    var ts = p.value.split('|');
    for (var i = 0, l = ts.length; i < l; i++) {
        var jn = ts[i];
        var job = jn[0] == '.' ? x.Scop.GetJob(jn.substring(1)) : bind.GetJob(ts[i]);
        var ji = x.Scop.AddJob(job, e.dom);
        tsm.push(ji);
        if (!e.Control) {
            if (ji.Control instanceof UI.JControl)
                ji.Control.Parent = control;
            e.Control = ji.Control;
        }
    }

    return undefined;
}
function getFirstChild(dom: Element) {
    var f = dom.firstChild;
    var node: Node;
    while (f) {
        if (f instanceof Element) return f;
        if (!node && f instanceof Node) node = f;
        f = f.nextSibling;
    }
    return node;
}
function createControl(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var
        parentScop: bind.Scop = x.parent.Scop,
        parentControl: UI.JControl = x.parent.Control,
        controller: bind.Controller = x.controller,
        e: bind.IJobScop = x.e;

    var child = getFirstChild(e.dom as Element);
    (e.dom as Element).removeAttribute('db-control');
    var cnt = ScopicControl.create({ name: p.value, dom: child as HTMLElement, currentScop: x.Scop || parentScop, parentScop: parentScop, parentControl: parentControl, controller: controller, e: e });
    e.Control = cnt;
    cnt.Parent = parentControl;
    var parent = e.dom.parentNode || e.dom.parentElement;
    if (parent && child !== e.dom) {
        parent.replaceChild(child, e.dom);
        e.dom = child;
    }
    return undefined;
}

function createList(x: Processor.Tree, p: Processor.Instance): Processor.Result {

    var
        parentScop: bind.Scop = x.parent.Scop,
        parentControl: UI.JControl = x.parent.Control,
        controller: bind.Controller = x.controller,
        e: bind.IJobScop = x.e;
    var tw = p.manager.getProcessorByAttribute('db-twoway');
    var scop = x.Scop || parentScop;
    if (p.value) scop = bind.Scop.Create(p.value, scop, tw && tw.value, controller);

    var cnt = ScopicControl.create({ name: 'foreach', dom: e.dom as HTMLElement, currentScop: scop, parentScop: parentScop, parentControl: parentControl, controller: controller, e: e });
    e.Control = cnt;
    cnt.Parent = parentControl;
    var parent = e.dom.parentNode || e.dom.parentElement;
    return undefined;
}
function _setName(name: string, cnt: UI.JControl, e: bind.IJobScop) {
    var x = <any>cnt;
    while (x) {
        try {
            if (x.setName) {
                if (x.setName(name, e.dom, cnt, e) == false) continue;
                else return true;
            }
        } catch (w) { }
        x = x.Parent;
    }
}

function setName(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var name: string = p.value,
        parentControl: UI.JControl = x.controller.CurrentControl,
        e: bind.IJobScop = x.e;
    _setName(name, e.Control, e) || _setName(name, parentControl, e);
    return undefined;
}


function setProp(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var name: string = p.value,
        parentControl: UI.JControl = x.controller.CurrentControl,
        e: bind.IJobScop = x.e;
    parentControl
    _setName(name, e.Control, e) || _setName(name, parentControl, e);
    return undefined;
}

function Todo(x: Processor.Tree, p: Processor.Instance): Processor.Result {
    var
        parentScop: bind.Scop = x.parent.Scop,
        e: bind.IJobScop = x.e,
        controller: bind.Controller = x.controller;
    var s = bind.Scop.Create(p.value, parentScop, 0, controller);
    s &&
        x.Scop.AddJob(<basic.IJob><any>{
            scopFunction: s,
            Todo: bind.Todo.prototype.Todo,
        }, e.dom);
    return undefined;
}
function executeCommand(x, p): Processor.Result {
    for (var xi of p.value.split('|'))
        ScopicCommand.Call(xi, x.e.dom, x.Scop);
    return undefined;
}

Processor.Register({ name: 'twoway', attribute: 'db-twoway', execute: initTwoWay, check: checkTwoWay, isPrimitive: true });
Processor.Register({ name: 'bind', attribute: 'db-bind', execute: extraxtScop, isPrimitive: true });
Processor.Register({ name: 'str', attribute: 'db-str', execute: strTemplate, isPrimitive: true });
Processor.Register({ name: 'filter', attribute: 'db-filter', execute: executeFilter, isPrimitive: true });
Processor.Register({ name: 'init', attribute: 'db-init', execute: initLocalValues, isPrimitive: true });

Processor.Register({ name: 'dec', attribute: 'db-dec', execute: DeclareAttribute, isPrimitive: true });
Processor.Register({ name: 'set', attribute: 'db-set', execute: bindString, isPrimitive: true });
Processor.Register({ name: 'template', attribute: 'db-template', execute: InitTemplate, isPrimitive: true });


Processor.Register({ name: 'foreach', attribute: 'db-foreach', execute: createList, isPrimitive: true });
Processor.Register({ name: 'control', attribute: 'db-control', execute: createControl, isPrimitive: true });
Processor.Register({ name: 'cmd', attribute: 'db-cmd', execute: executeCommand, isFinalizer: true });
Processor.Register({ name: 'job', attribute: 'db-job', execute: execJobs, isFinalizer: true });

Processor.Register({ name: 'exec', attribute: 'db-exec', execute: processComplicatedAttribute, isFinalizer: true });
Processor.Register({ name: 'todo', attribute: 'db-todo', execute: Todo, isFinalizer: true });


//Processor.Register({ name: 'foreach', attribute: 'db-foreach', execute: createList, isFinalizer: true });
//Processor.Register({ name: 'control', attribute: 'db-control', execute: createControl, isFinalizer: true });

Processor.Register({ name: 'prop', attribute: 'db-prop', execute: setName, isFinalizer: true, priority: 9007199254740991 });
Processor.Register({ name: 'name', attribute: 'db-name', execute: setName, isFinalizer: true, priority: Number.MAX_VALUE });
export module bom {
    export function load() {

    }
}