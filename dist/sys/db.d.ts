import { basic, bind, collection } from './Corelib';
import { sdata } from './System';
export declare module db {
    type callback<T> = (iss: boolean, sender: Database, sqlTrans: any, result?: SQLResultSet<T>) => void;
    interface IExecCmd {
        cmd: string;
        callback: (iss: boolean, sender: Database, sqlTrans: any, result?: any) => void;
    }
    interface IDatabase {
        transaction(callback: (db: any) => void, onerror: (db: any, b: any) => void): any;
    }
    interface Command {
        async: boolean;
        result?: any;
        executed?: boolean;
    }
    interface ScalCommand extends Command {
        cmd: string;
        callback?: (iss: boolean, sender: Database, sqlTrans: any, result?: SQLResultSet<any>) => void;
    }
    interface VectorCommand extends Command {
        cmd: string[];
        callback?: (index: number, iss: boolean, sender: Database, sqlTrans: any, result?: SQLResultSet<any>) => void;
    }
    class Database {
        databaseName: string;
        databaseDesc: string;
        sqlLiteDBVersion: string;
        FIVE_MB: number;
        tableName: string;
        database: IDatabase;
        private _tables__;
        shemas: DatabaseTable<_Table__>;
        initialize(): this;
        IsLoaded: boolean;
        OnLoad: bind.FEventListener<(sb: this) => void>;
        private isExecuting;
        private queue;
        Push(cmd: ScalCommand | VectorCommand): void;
        execute(async: boolean, command: string, callback?: (iss: boolean, sender: this, sqlTrans: any, result?: SQLResultSet<any>) => void): void;
        _exeScalSQL(db: any, cmd: ScalCommand): void;
        _exeVectorSQL(db: any, cmd: VectorCommand): void;
        executes(async: boolean, commands: string[], callback?: (index: number, iss: boolean, sender: this, sqlTrans: any, result?: SQLResultSet<any>) => void): void;
        syncExecute(command: any, callback?: (iss: boolean, sender: this, sqlTrans: any, result?: any) => void): void;
        private _commands;
        private _current;
        private _IsExecuting;
        private _Push;
        private _job;
        private _runCmd;
        private _transaction;
        private _OnSuccess;
        private _OnError;
        private _next;
        CreateTable(name: string, rowType: Function): this;
        Get(tableName: string): IDBTableInfo;
        private _store;
        MakeUpdate(tableName: string, date: Date | number): void;
        __info__: DatabaseTable<__ExeInfo__>;
    }
    class SQLInstructureBuilder {
        tableName: any;
        type: Function;
        private _key;
        private _map;
        cretaeCmd: basic.StringCompile;
        insertCmd: basic.StringCompile;
        updateCmd: basic.StringCompile;
        selectCmd: basic.StringCompile;
        deleteCmd: basic.StringCompile;
        readonly Key: bind.DProperty<any, bind.DObject>;
        constructor(tableName: any, type: Function);
        init(): void;
        private getSB;
        getCreateCmd(): basic.StringCompile;
        getInsertCmd(): basic.StringCompile;
        getUpdateCmd(): basic.StringCompile;
        getSelectCmd(): basic.StringCompile;
        getDeleteCmd(): basic.StringCompile;
        private getTypeName;
        private getDbValue;
        getNumber(v: any): string;
        static emptyDate: Date;
        private static parseBool;
        private getJsValue;
        getAvaibleCmd(extCols: string | string[]): string;
        jointCols(cols: string[]): string;
    }
    class DatabaseTable<T extends sdata.DataRow> {
        database: Database;
        builder: SQLInstructureBuilder;
        constructor(database: Database, tableName: string, type: Function);
        Insert(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
        Delete(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
        Update(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
        Select(row: T, callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
        Create(callback: (iss: boolean, sender: Database, sqlTrans: any, result: any) => void): void;
        ExecuteOperation(cm: IOperation, callback?: db.callback<T>): void;
        getAvaible(exCols?: string | string[], callback?: (iss: boolean, sender: Database, sqlTrans: any, result?: any) => void): void;
        ExecuteOperations(ops: IOperation[], callback: (succ: boolean, nfail: number) => void): void;
        static __count: number;
        ExecuteOperations1(ops: IOperation[], callback: (succ: boolean, nfail: number) => void): void;
        UpdateTableToDB(tbl: sdata.DataTable<T> | T[], callback: (succ: boolean, nfail: number) => void, full?: boolean): void;
        LoadTableFromDB(tbl: sdata.DataTable<T>, callback?: (succ: boolean) => void): void;
        getCmd(op: IOperation): string;
        MakeUpdate(date: Date | number): void;
        IsExist(callback: (isExist: boolean) => void): void;
        CreateIfNotExist(callback?: (isExist: boolean, sender: this) => void): void;
        Created: boolean;
    }
    class _Table__ extends sdata.QShopRow {
        table: DatabaseTable<any>;
        private static store;
        protected getStore(): collection.Dictionary<number, this>;
        static DPTableName: bind.DProperty<string, _Table__>;
        TableName: string;
        static DPType: bind.DProperty<string, _Table__>;
        Type: string;
        static DPLastUpdate: bind.DProperty<number, _Table__>;
        LastUpdate: number;
        static __fields__(): (bind.DProperty<string, _Table__> | bind.DProperty<number, _Table__>)[];
        onPropertyChanged(ev: bind.EventArgs<any, any>): void;
        constructor(table: DatabaseTable<any>);
    }
    class _Tables__ extends sdata.DataTable<_Table__> {
        database: Database;
        constructor(database: Database);
        gettableByName(name: string, type?: Function): _Table__;
    }
    class __ExeInfo__ extends sdata.DataRow {
        static DPCount: bind.DProperty<number, __ExeInfo__>;
        Count: number;
        static __fields__(): bind.DProperty<number, __ExeInfo__>[];
        protected getStore(): collection.Dictionary<number, this>;
        Update(): void;
        Upload(): void;
    }
    interface IDBTableInfo {
        table: db.DatabaseTable<any>;
        info: _Table__;
        _dbInfo_: db.DatabaseTable<_Table__>;
    }
    interface IOperation {
        op: Operation;
        row: sdata.DataRow;
    }
    enum Operation {
        None = 0,
        Update = 1,
        Insert = 2,
        Delete = 3,
        UpdateOnly = 4,
        InsertOnly = 5
    }
    interface SQLResultSet<T> {
        rows: T[];
        rowsAffected: number;
        insertId: number;
    }
}
