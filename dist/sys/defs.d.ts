import { bind } from './Corelib';
import { UI } from './UI';
export declare module defs {
    namespace $UI {
        interface IPage extends UI.JControl, UI.IService {
            Name: string;
            HasSearch: UI.SearchActionMode;
            OnSearche(o?: string, n?: string): any;
            OnDeepSearche(): any;
            OnContextMenu(e: MouseEvent): any;
            OnPrint(): any;
            OnSelected: bind.EventListener<(p: this) => void>;
            Update(): any;
            OnKeyDown(e: KeyboardEvent): any;
            ContextMenu?: UI.ContextMenu;
        }
        interface IApp extends UI.JControl {
            Name: string;
            SearchBox: UI.ActionText;
            Foot: UI.ServiceNavBar<UI.IItem>;
            Update(): any;
            OnContextMenu(e: MouseEvent): any;
            OnKeyDown(e: KeyboardEvent): any | void;
            OnPrint(): any;
            OnDeepSearche(): any;
            OpenPage(pageNme: string): any;
            Logout(): any;
            Open(page: IPage): any;
            AddPage(child: IPage): any;
            Show(): any;
            SelectedPage: IPage;
            SelectNaxtPage(): any;
            SelectPrevPage(): any;
            CloseModal(m: UI.Modal): any;
            OpenModal(m: UI.Modal): any;
            CurrentModal: UI.Modal;
            IsAuthentication: boolean;
            OpenContextMenu<T>(cm: UI.IContextMenu<T>, e: UI.IContextMenuEventArgs<T>): boolean;
            CloseContextMenu<T>(r?: T): any;
        }
        interface IAuthApp extends IApp {
            IsLogged<T>(callback: (v: boolean, param: T) => void, param: T): any;
            RedirectApp: IApp;
            OnStatStatChanged: bind.EventListener<(auth: this, isLogged: boolean) => void>;
        }
    }
}
