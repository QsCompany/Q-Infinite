import { Api } from "./corelib";
export declare function AsAPI(apiName: string, __prototype__?: (trigger: Api.IApiTrigger, callback: Api.IApiCallback, params: Api.IApiParam) => void): (target: any, propertyKey: string, descriptor?: PropertyDescriptor) => any;
