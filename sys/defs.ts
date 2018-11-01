import { basic, bind } from './Corelib';
import { UI as _UI } from './UI';
export module defs {
    export namespace UI {
        export interface IPage extends _UI.JControl, _UI.IService {
            Name: string;
            HasSearch: _UI.SearchActionMode;
            OnSearche(o?: string, n?: string);
            OnDeepSearche();
            OnContextMenu(e: MouseEvent);
            OnPrint();
            OnSelected: bind.EventListener<(p: this) => void>;
            Update();
            OnKeyDown(e: KeyboardEvent);
            ContextMenu?: _UI.ContextMenu;
        }

        export interface IApp extends _UI.JControl {
            Name: string;
            SearchBox: _UI.ActionText;
            Foot: _UI.ServiceNavBar<_UI.IItem>;
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
            CloseModal(m: _UI.Modal);
            OpenModal(m: _UI.Modal);
            CurrentModal: _UI.Modal;
            IsAuthentication: boolean;
            OpenContextMenu<T>(cm: _UI.IContextMenu<T>, e: _UI.IContextMenuEventArgs<T>): boolean;
            CloseContextMenu<T>(r?: T);
        }
        export interface IAuthApp extends IApp {
            IsLogged<T>(callback: (v: boolean, param: T) => void, param: T);
            RedirectApp: IApp;
            OnStatStatChanged: bind.EventListener<(auth: this, isLogged: boolean) => void>;
        }
    }
}