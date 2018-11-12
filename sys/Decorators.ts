import { Controller } from "./System";
import { attributes, reflection, Api } from "./corelib";

export function AsAPI(apiName: string, __prototype__?: (trigger: Api.IApiTrigger, callback: Api.IApiCallback, params: Api.IApiParam) => void) {
    return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor): any {
        target = target[propertyKey];
        if (!reflection.IsPrototype(target)) throw 'Invalid Implimentation of property Attribute';
        if (reflection.IsClass(target)) throw "invalid params type";
        if (typeof target !== 'function') throw "invalid params type";
        Api.RegisterApiCallback({
            Name: apiName,
            DoApiCallback: target,
        });
    };
}