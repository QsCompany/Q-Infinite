import { basic, bind } from './Corelib';
import { UI } from './UI';
export module defs {
    export namespace $UI {
        export interface IPage extends UI.JControl, UI.IService {
            Name: string;
            HasSearch: UI.SearchActionMode;
            OnSearche(o?: string, n?: string);
            OnDeepSearche();
            OnContextMenu(e: MouseEvent);
            OnPrint();
            OnSelected: bind.EventListener<(p: this) => void>;
            Update();
            OnKeyDown(e: KeyboardEvent);
            ContextMenu?: UI.ContextMenu;
        }

        export interface IApp extends UI.JControl {
            Name: string;
            SearchBox: UI.ActionText;
            Foot: UI.ServiceNavBar<UI.IItem>;
            Update();
            OnContextMenu(e: MouseEvent);
            OnKeyDown(e: KeyboardEvent): any | void;
            OnPrint(): any;
            OnDeepSearche();
            OpenPage(pageNme: string);
            Logout();
            //OnPageSelected: bind.EventListener<(s: this, p: IPage) => void>;
            Open(page: IPage);
            AddPage(child: IPage);
            Show();
            SelectedPage: IPage;
            SelectNaxtPage();
            SelectPrevPage();
            CloseModal(m: UI.Modal);
            OpenModal(m: UI.Modal);
            CurrentModal: UI.Modal;
            IsAuthentication: boolean;
            OpenContextMenu<T>(cm: UI.IContextMenu<T>, e: UI.IContextMenuEventArgs<T>): boolean;
            CloseContextMenu<T>(r?: T);
        }
        export interface IAuthApp extends IApp {
            IsLogged<T>(callback: (v: boolean, param: T) => void, param: T);
            RedirectApp: IApp;
            OnStatStatChanged: bind.EventListener<(auth: this, isLogged: boolean) => void>;
        }
    }
}
