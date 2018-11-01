import { thread, basic, bind, mvc, reflection, collection, encoding } from './Corelib';
import { sdata } from './System';
import { context } from 'context';

export module db {
    export declare type callback<T> = (iss: boolean, sender: Database, sqlTrans, result?: SQLResultSet<T>) => void;
    declare var openDatabase: (databaseName: string, sqlLiteDBVersion: string, databaseDesc: string, databaseSize: number) => IDatabase;
    var __SUPPORT_OPENDATABASE__ = typeof openDatabase === 'function';
    export interface IExecCmd {
        cmd: string;
        callback: (iss: boolean, sender: Database, sqlTrans, result?) => void;
    }

    export interface IDatabase {
        transaction(callback: (db) => void, onerror: (db, b) => void);
    }

    export interface Command {
        async: boolean;
        result?;
        executed?: boolean;
    }
    export interface ScalCommand extends Command{
        cmd: string;
        callback?: (iss: boolean, sender: Database, sqlTrans, result?: SQLResultSet<any>) => void;
    }
    export interface VectorCommand extends Command{
        cmd: string[];
        callback?: (index: number, iss: boolean, sender: Database, sqlTrans, result?: SQLResultSet<any>) => void;
    }
    export class Database {
        databaseName = "data_store";
        databaseDesc = "Data store";
        sqlLiteDBVersion = "1.0";
        FIVE_MB = 5120;
        tableName = "data-store";
        database: IDatabase;
        private _tables__ = new _Tables__(this);
        public shemas = new DatabaseTable<_Table__>(this, "__tables__", _Table__);
        initialize(): this {
            if (!__SUPPORT_OPENDATABASE__) return this;
            this.database = openDatabase(this.databaseName, this.sqlLiteDBVersion, this.databaseDesc, this.FIVE_MB);
            this._transaction = this._transaction.bind(this);
            this._OnError = this._OnError.bind(this);
            this._OnSuccess = this._OnSuccess.bind(this);
            this.shemas.CreateIfNotExist((ise, s) => {
                this.__info__.CreateIfNotExist((iss, s) => {
                    this.shemas.LoadTableFromDB(this._tables__, (succ) => {
                        this.IsLoaded = true;
                        this.OnLoad.PInvok(0, [this], this);
                    });
                });
            });

            return this;
        }
        public IsLoaded: boolean;
        public OnLoad = new bind.FEventListener<(sb: this) => void>(0, true);
        
        private isExecuting: boolean;
        private queue: (ScalCommand | VectorCommand)[] = [];

        public Push(cmd: ScalCommand | VectorCommand) {
            if (!__SUPPORT_OPENDATABASE__) return;
            if (cmd.async) {
                this.queue.push(cmd);
                if (this.isExecuting) return;
                this.queue = [];
                this.isExecuting = true;
                var oldQuee = this.queue;
                this.database.transaction((db) => {
                    for (var i = 0; i < this.queue.length; i++) {
                        if (typeof this.queue[i].cmd === 'string')
                            this._exeScalSQL(db, this.queue[i] as ScalCommand);
                        else this._exeVectorSQL(db, this.queue[i] as VectorCommand);
                    }
                    this.isExecuting = false;

                }, (err) => {
                    for (var i = 0; i < oldQuee.length; i++) {
                        var q = oldQuee[i];
                        if (typeof q.cmd === 'string')
                            q.callback && (q as ScalCommand).callback(false, this, err);
                        else q.callback && (q as VectorCommand).callback(0, false, this, err);
                    }
                });
            } else {
                this.database.transaction((db) => {
                    if (typeof cmd.cmd === 'string')
                        this._exeScalSQL(db, cmd as ScalCommand);
                    else this._exeVectorSQL(db, cmd as VectorCommand);
                }, (err) => {
                    if (typeof cmd.cmd === 'string')
                        cmd.callback && (cmd as ScalCommand).callback(false, this, err);
                    else cmd.callback && (cmd as VectorCommand).callback(0, false, this, err);
                });
            }
        }

        execute(async: boolean, command: string, callback?: (iss: boolean, sender: this, sqlTrans, result?: SQLResultSet<any>) => void) {
            this.Push({ cmd: command, callback: callback, async: async });
        }

        _exeScalSQL(db, cmd: ScalCommand) {
            db.executeSql(cmd.cmd as string, [], cmd.callback ? (s, r) => { cmd.callback(true, this, s, r); cmd.callback = undefined;} : void 0);
        }

        _exeVectorSQL(db, cmd: VectorCommand) {
            var j = -1;
            var _callback = cmd.callback ? (s, r) => {
                j++;                
                cmd.callback && cmd.callback(j, true, this, s, r);
                if (j == commands.length - 1) cmd.callback = undefined;
            } : void 0;
            var commands = cmd.cmd;
            for (var i = 0; i < commands.length; i++)
                db.executeSql(commands[i], [], _callback);
        }
        executes(async: boolean,commands: string[], callback?: (index: number, iss: boolean, sender: this, sqlTrans, result?: SQLResultSet<any>) => void) {
            this.Push({ async: async, cmd: commands, callback: callback });
            //if (!__SUPPORT_OPENDATABASE__) return;
            //var j = -1;
            //function _callback(s,r) {
            //    j++;
            //    callback && callback(j, true, this, s, r);
            //}
            //this.database.transaction((db) => {
            //    for (var i = 0; i < commands.length; i++)
            //        db.executeSql(commands[i], [], _callback);
            //}, callback ? (err) => callback(j, false, this, err) : void 0);
        }
        syncExecute(command, callback?: (iss: boolean, sender: this, sqlTrans, result?) => void) {
            if (!__SUPPORT_OPENDATABASE__) return;
            this._Push({ cmd: command, callback: callback });
        }

        private _commands: IExecCmd[] = [];
        private _current: basic.IRef<IExecCmd> = { value: null };
        private _IsExecuting: boolean = false;

        private _Push(cmd: IExecCmd) {
            this._commands.push(cmd);
            if (!this._IsExecuting) return this._next();
        }
        private _job = thread.Dispatcher.cretaeJob(this._runCmd, [], this, false);
        private _runCmd() {
            this.database.transaction(this._transaction, this._OnError);
        }
        private _transaction(db) {
            db.executeSql(this._current.value.cmd, [], this._OnSuccess);
        }
        private _OnSuccess(sql, rslt) {
            try {
                this._current.value.callback && this._current.value.callback(true, this, sql, rslt);
            } catch (e) {
            }
            this._next();
        }
        private _OnError(sqlE) {
            try {
                this._current.value.callback && this._current.value.callback(false, this, sqlE);
            } catch (e) {
            }
            this._next();
        }
        private _next() {
            if (this._commands.length === 0) {
                this._IsExecuting = false;
                return;
            }
            this._IsExecuting = true;
            this._current.value = this._commands.pop();
            thread.Dispatcher.Push(this._job, [this._current]);
        }
        public CreateTable(name: string, rowType: Function) {
            if (!__SUPPORT_OPENDATABASE__) return this;
            var x = new DatabaseTable(this, name, rowType);

            var tbl: IDBTableInfo = {
                table: x,
                info: this._tables__.gettableByName(name,rowType),
                _dbInfo_: this.shemas
            };
            x.CreateIfNotExist();            
            this._store[name] = tbl;

            return this;
        }
        public Get(tableName: string) {
            return this._store[tableName];
        }
        private _store: { [n: string]: IDBTableInfo } = {};

        public MakeUpdate(tableName: string, date: Date | number) {
            if (!__SUPPORT_OPENDATABASE__) return;
            if (date == null) date = 0;
            if (typeof date !== 'number')
                date = date.valueOf();
            var q = this._store[tableName];
            if (!q) return;
            q.info.LastUpdate = date;
            q._dbInfo_.ExecuteOperation(
                { op: Operation.Update, row: q.info },
                (a, b, c, d) => {

                });
        }
        public __info__ = new DatabaseTable<__ExeInfo__>(this, '__info__', __ExeInfo__);
    }
    export class SQLInstructureBuilder {
        private _key: bind.DProperty<any, bind.DObject>;
        private _map: { [n: string]: Function } = {};
        cretaeCmd: basic.StringCompile;
        insertCmd: basic.StringCompile;
        updateCmd: basic.StringCompile;
        selectCmd: basic.StringCompile;
        deleteCmd: basic.StringCompile;

        public get Key() {
            return this._key;
        }

        constructor(public tableName, public type: Function) {
            this.init();
        }
        init() {
            var flds = bind.DObject.getFields(this.type);
            for (var i = 0; i < flds.length; i++) {
                var fld = flds[i];
                if (fld.IsKey)
                    this._key = fld;
                this._map[fld.Name] = fld.Type as Function;
            }
            this.cretaeCmd = this.getCreateCmd();
            this.insertCmd = this.getInsertCmd();
            this.updateCmd = this.getUpdateCmd();
            this.selectCmd = this.getSelectCmd();
            this.deleteCmd = this.getDeleteCmd();
        }
        private getSB(s: string) {
            return basic.CompileString(s, this.getDbValue, this);
        }
        getCreateCmd() {
            var flds = bind.DObject.getFields(this.type);
            var s = "CREATE TABLE IF NOT EXISTS [" + this.tableName + "] (";

            for (var i = 0; i < flds.length; i++) {
                var fld = flds[i];
                var type = this.getTypeName(fld.Type as any);
                if (type == undefined) {
                    console.error("Filed [" + fld.Name + "] of table " + this.tableName + " cannot be created");
                    continue;
                }
                if (i !== 0) s += ",";
                s += "[" + fld.Name + "] " + type + ((fld.Attribute & bind.PropertyAttribute.IsKey) === bind.PropertyAttribute.IsKey ? " PRIMARY KEY" : " ");
            }
            s += ")";
            return this.getSB(s);
        }

        getInsertCmd() {
            var flds = bind.DObject.getFields(this.type);
            var names = "", values = "";
            for (var i = 0; i < flds.length; i++) {
                var fld = flds[i];
                if (i !== 0) {
                    names += ","; values += ",";
                }
                names += "[" + fld.Name + "]";
                values += "@" + fld.Name;
            }
            return this.getSB("INSERT INTO [" + this.tableName + "] (" + names + ") VALUES (" + values + ')');
        }

        getUpdateCmd() {
            var flds = bind.DObject.getFields(this.type);
            var inst = "";
            var key: typeof fld = null;
            for (var i = 0; i < flds.length; i++) {
                var fld = flds[i];
                if (i !== 0)
                    inst += ",";
                if (!key && fld.IsKey)
                    key = fld;
                inst += "[" + fld.Name + "] = @" + fld.Name + "";
            }
            inst = "UPDATE [" + this.tableName + "] SET " + inst + " WHERE [" + key.Name + "] = @" + key.Name;
            return this.getSB(inst);
        }

        getSelectCmd() {
            return this.getSB("SELECT * FROM [" + this.tableName + "] WHERE [" + this._key.Name + "] = @" + this._key.Name + " LIMIT 1");
        }

        getDeleteCmd() {
            return this.getSB("DELETE FROM [" + this.tableName + "] WHERE [" + this._key.Name + "] = @" + this._key.Name);
        }

        private getTypeName(type: Function) {
            if (type === String) return 'TEXT';
            if (type === Number || type === Date) return 'Number';
            if (type === Boolean) return 'Boolean';
            if (reflection.IsInstanceOf(type, sdata.DataRow))
                return 'number';

            if (reflection.IsInstanceOf(type, sdata.DataTable))
                return undefined;
            console.error("Unresolved Type = " + type, type);
            throw "unresolved type";
        }

        private getDbValue(name, v) {
            if (v == null) return 'null';
            var _this = (this as any as basic.StringCompile).params as this;
            var type = _this._map[name] as Function;
            switch (type) {
                case String:
                    return v == null ? "null" : "'" + v + "'";
                case Number:
                    return _this.getNumber(v);
                case Boolean:
                    return v == undefined ? 'null' : v ? '1' : '0';
                case Date:
                    return _this.getNumber(v && (v as Date).valueOf());
                default:
                    if (reflection.IsInstanceOf(type, sdata.DataRow)) {
                        var id = v && v.Id;
                        if (id == null) return 'null';
                        return String(id);
                    }
                    else return undefined;
            }
        }
        getNumber(v) {
            return v == null || isNaN(v) ? 'null' : String(Math.abs(v) > Number.MAX_VALUE ? Number.MAX_VALUE : v);
        }
        static emptyDate = new Date(0);
        private static parseBool(v) {
            if (v == null) return null;
            switch (typeof v) {
                case 'string':
                    if (v === 'true') return true;
                    if (v === 'false') return false;
                    v = parseFloat(v);
                    return !!v;
                case 'number':
                    break;
                case 'boolean':
                    return v;
                default:
                    return !!v;
            }
        }
        private getJsValue(name, v) {
            var _this = (this as any as basic.StringCompile).params as this;
            var type = _this._map[name] as Function;
            switch (type) {
                case String:
                    return v;
                case Number:
                    return typeof v === 'string' ? parseFloat(v) : v;
                case Boolean:
                    return SQLInstructureBuilder.parseBool(v);
                case Date:
                    return v === null ? SQLInstructureBuilder.emptyDate : new Date(typeof v === 'string' ? parseInt(v) : v);
                default:
                    if (reflection.IsInstanceOf(type, sdata.DataRow)) {
                        var id = v && v.Id;
                        if (id == null) return 'null';
                        return String(id);
                    }
                    else return undefined;
            }
        }

        public getAvaibleCmd(extCols: string | string[]) {
            if (extCols == null) extCols = "[" + this._key.Name + "]";
            else if (extCols == '*') extCols = "*";
            else if (typeof extCols !== 'string') extCols = this.jointCols(extCols);
            return "SELECT " + extCols + " FROM [" + this.tableName + "]";
        }
        public jointCols(cols: string[]) {
            if (cols.length == 0) return "";
            if (cols.length == 1) return "[" + cols[0] + "]";
            return "[" + cols.join("],[") + "]";
        }
    }
    export class DatabaseTable<T extends sdata.DataRow> {
        public builder: SQLInstructureBuilder;
        constructor(public database: Database, tableName: string, type: Function) {
            if (!reflection.IsInstanceOf(type, bind.DObject)) throw "Type not implimented";
            this.builder = new SQLInstructureBuilder(tableName, type);
        }
        public Insert(row: T, callback: (iss: boolean, sender: Database, sqlTrans, result) => void) {
            this.database.syncExecute(this.builder.insertCmd.apply(row), callback);
        }
        public Delete(row: T, callback: (iss: boolean, sender: Database, sqlTrans, result) => void) {
            this.database.syncExecute(this.builder.deleteCmd.apply(row), callback);
        }
        public Update(row: T, callback: (iss: boolean, sender: Database, sqlTrans, result) => void) {
            this.database.syncExecute(this.builder.updateCmd.apply(row), callback);
        }
        public Select(row: T, callback: (iss: boolean, sender: Database, sqlTrans, result) => void) {
            this.database.syncExecute(this.builder.selectCmd.apply(row), callback);
        }
        public Create(callback: (iss: boolean, sender: Database, sqlTrans, result) => void) {
            this.database.syncExecute(this.builder.cretaeCmd.apply({}), callback);
        }

        public ExecuteOperation(cm: IOperation,callback?:db.callback<T>) {
            var cmd = this.getCmd(cm);
            var reExec;
            this.database.execute(false,cmd, reExec = (iss, sb, sql, rslt: SQLResultSet<T>) => {
                iss = iss && !((cm.op == Operation.Update || cm.op == Operation.UpdateOnly) && rslt.rowsAffected == 0);
                if (!iss) do {
                    if (cm.op == 2)
                        cm = { op: 4, row: cm.row };
                    else if (cm.op == 1)
                        cm = { op: 5, row: cm.row };
                    else break;
                    return this.database.execute(false,this.getCmd(cm), reExec);
                } while (false);
                if(cm)
                callback && callback(iss , sb, sql, rslt);
            });
        }

        public getAvaible(exCols?: string | string[], callback?: (iss: boolean, sender: Database, sqlTrans, result?) => void) {
            this.database.execute(false,this.builder.getAvaibleCmd(exCols), callback);
        }

        public ExecuteOperations(ops: IOperation[], callback: (succ: boolean, nfail: number) => void) {
            if (ops.length == 0)
                return callback && callback(true, 0);
            var ccmds = 0;
            var nfails = 0;
            var reExec;
            this.ExecuteOperation(ops[ccmds], reExec = (iss, db, sql, rslt) => {
                if (!iss) nfails++;
                ccmds++;
                if (ops.length == ccmds)
                    return callback && callback(nfails == 0, nfails);
                else this.ExecuteOperation(ops[ccmds], reExec);
            });
        }
        static __count = 1;
         
        public ExecuteOperations1(ops: IOperation[], callback: (succ: boolean, nfail: number) => void) {
            var id = DatabaseTable.__count;
            if (ops.length == 0)
                return callback && callback(true, 0);
            for (var i = 0; i < ops.length; i++) {
                ops[i] = this.getCmd(ops[i]) as any;
            }
            var nsuccess: IOperation[] = [];
            var reExec;
            this.database.executes(false,ops as any, reExec = (j, iss, sb, sql, rslt: SQLResultSet<T>) => {
                if (!iss)
                    nsuccess.push(ops[j]);
                if (j == ops.length - 1) return callback && callback(nsuccess.length != 0, nsuccess.length);
            });

        }
        public UpdateTableToDB(tbl: sdata.DataTable<T>|T[], callback: (succ: boolean,nfail:number) => void,full?:boolean) {
            var tbls = tbl instanceof sdata.DataTable ? tbl.AsList() : tbl;            
            var toInsert = tbls.slice(0);
            var eI = toInsert.map((c) => c.Id);
            var cmds: IOperation[] = [];
            var toSkip = 0;
            if (!full && !eI.length) return;
            this.getAvaible(["Id", "LastModified"], (iss, s, sql, rslt: SQLResultSet<T>) => {
                if (rslt == null) return console.error('HardError');
                var rs = rslt.rows;
                for (var i = 0; i < rs.length; i++) {
                    var dbRow = rs[i];
                    var j = eI.indexOf(dbRow.Id);
                    if (j == -1) {
                        if (full)
                            cmds.push({ row: srcRow, op: 3 });
                    }
                    else {
                        var lm = dbRow.LastModified || 0;
                        var srcRow = tbls[j];
                        if (dbRow.LastModified < srcRow.LastModified) {
                            cmds.push({ row: srcRow, op: 1 });
                        }
                    }
                    var x;
                    while ((x = toInsert.indexOf(srcRow as any as T)) != -1) toInsert.splice(x, 1);
                }
                for (var i = 0; i < toInsert.length; i++)
                    cmds.push({ row: toInsert[i], op: 2 });
                this.ExecuteOperations1(cmds, callback);
            });
        }

        public LoadTableFromDB(tbl: sdata.DataTable<T>, callback?: (succ: boolean) => void) {
            var x = new encoding.SerializationContext(true);
            this.getAvaible('*', (iss, s, sql, rslt: SQLResultSet<T>) => {
                if (iss) {
                    var rs = rslt.rows;
                    var i = 0;
                    var async = function (this: &DatabaseTable<T>) {
                        var l = i + 100;
                        if (l > rs.length) l = rs.length;
                        for (; i < l; i++) {
                            var dbRow = rs[i];
                            tbl.Add(tbl.CreateNewItem(dbRow.Id).FromJson(dbRow, x));
                        }
                        if (l < rs.length) thread.Dispatcher.call(this, async);
                        else callback && callback(iss);
                    };
                    thread.Dispatcher.call(this, async);
                    //for (var i = 0; i < rs.length; i++) {
                    //    var dbRow = rs[i];
                    //    tbl.Add(tbl.CreateNewItem(dbRow.Id).FromJson(dbRow, l));
                    //}
                } else callback && callback(iss);
                
            });
        }

        public getCmd(op: IOperation) {
            switch (op.op) {
                case 0:
                    return null;
                case 1:
                case 4:
                    return this.builder.updateCmd.apply(op.row);
                case 2:
                case 5:
                    return this.builder.insertCmd.apply(op.row);
                case 3:
                    return this.builder.deleteCmd.apply(op.row);
                default:
            }
        }

        public MakeUpdate(date: Date | number) {
            this.database.MakeUpdate(this.builder.tableName, date);
            
        }

        IsExist(callback: (isExist: boolean) => void) {
            this.database.execute(false, "SELECT * FROM [" + this.builder.tableName + "] limit 0", (iss, db) => {
                callback && callback(iss);
            });
        }

        CreateIfNotExist(callback?: (isExist: boolean, sender: this) => void) {
            this.IsExist((exist) => {
                if (exist) {
                    this.Created = true;
                    return callback && callback(true, this);
                }
                this.Create((iss, db, sql) => {
                    this.Created = iss;
                    return callback && callback(iss, this);
                });
            });
        }

        public Created: boolean;
        
    }


    export class _Table__ extends sdata.QShopRow {
        private static store = new collection.Dictionary<number, any>("_Table__");
        protected getStore(): collection.Dictionary<number, this> {
            return _Table__.store;
        }

        public static DPTableName = bind.DObject.CreateField<string, _Table__>("TableName", String);
        public TableName: string; 

        public static DPType = bind.DObject.CreateField<string, _Table__>("Type", String);
        public Type: string; 

        public static DPLastUpdate = bind.DObject.CreateField<number, _Table__>("LastUpdate", Number);
        public LastUpdate: number;

        static __fields__() { return [this.DPTableName, this.DPType, this.DPLastUpdate]; }

        onPropertyChanged(ev: bind.EventArgs<any, any>) {
        }

        constructor(public table: DatabaseTable<any>) {
            super(basic.New());
            if (table) {
                this.Type = context.NameOf(table.builder.type);
                this.TableName = table.builder.tableName;
            }
        }
    }
    export class _Tables__ extends sdata.DataTable<_Table__> {
        
        constructor(public database: Database) {
            super(null, _Table__, (id) => { return new _Table__(null); });
        }
        gettableByName(name: string,type?:Function) {
            for (var i = 0; i < this._list.length; i++) {
                if (this._list[i].TableName == name) return this._list[i];
            }
            var tbl = new _Table__(this.database.shemas);
            tbl.Id = basic.New();
            tbl.Type = context.NameOf(type);
            tbl.TableName = name;
            tbl.LastUpdate = 1;
            tbl.LastModified = new Date(0);
            this.Add(tbl);
            this.database.shemas.ExecuteOperation({ op: Operation.Insert, row: tbl });
            return tbl;
        }
    }
    export class __ExeInfo__ extends sdata.DataRow {
        public static DPCount = bind.DObject.CreateField<number, __ExeInfo__>("Count", Number);
        public Count: number;
        static __fields__() { return [this.DPCount]; }
        protected getStore(): collection.Dictionary<number, this> {
            return null;
        }
        Update() {
            throw new Error("Method not implemented.");
        }
        Upload() {
            throw new Error("Method not implemented.");
        }

    }
    class __Info__ extends sdata.DataTable<__ExeInfo__>{
        c() {
        }
    }
    export interface IDBTableInfo {
        table: db.DatabaseTable<any>;
        info: _Table__;
        _dbInfo_: db.DatabaseTable<_Table__>
    }

    export interface IOperation {
        op: Operation;
        row: sdata.DataRow;
    }
    export enum Operation {
        None = 0,
        Update = 1,
        Insert = 2,
        Delete = 3,
        UpdateOnly = 4,
        InsertOnly = 5

    }
    export interface SQLResultSet<T> {
        rows: T[];
        rowsAffected: number;
        insertId: number;

    }
}




//window['test'] = () => {
//    var _db = new db.Database();
//    _db.initialize();
//    var tbl = new db.DatabaseTable(_db, 'Product', models.Product);
//    tbl.Create((iss, db, sql, rslt) => {
//        if (iss) {
//            var vls = window["__data"].Products._list as models.Product[];
//            tbl.Insert(vls[2220], (iss, db, sql, rslt) => {
//            });
//        } else {

//        }
//    });
//}