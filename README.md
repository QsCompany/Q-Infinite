# QJs Framework
*** QJs is a Core JavaScipt-Framework, without any dependency & fully costumizable with modern technologies

#Technologies Implimented
  - MVVM (Databinding with a new way)
  - JIT (Just In Time execution)
  - OTE (One Time Execution)
  - Filters
  - Template & Derictives
  - Reflectection 
  - module Security
  - Component & Controls
  - Encryption
  - Json (Fully Solution for Recursive Objects -Serialization & Deserialization)
  - Eval Code
  - Api & Commands & Jobs
  - Application Architecture
  - Observable Objects
  - Secure Authentication Over Http
  - Module Loader
  -	Plugins
  -	Dispatcher (Queued Thread)
  -	FormatedString Interpolation (Fast Algo)
  -	Query basics (Memery useless)
  -	


# #Example!
We are Going to Create [2 files][df1]:
  - [Templates.html][df1]
  - [Code.js][df1]

### Code.html
```javascript
    import {bind} from 'js/Corelib';
    export class Person extends bind.DObject{
        static __fields__(){
            this.DPFName=bind.DObject.CreateField("FirstName",String);
            this.DPFName=bind.DObject.CreateField("FirstName",String);
            return [this.DPFName ,this.DPLName];
        }
    }
    
    var myJob = bind.Register({
        Name: "myJob",
        Todo(ji, i) {            
            var value=(ji.Scop.Value||"").trim();
            var d=ji.dom.parent;
            d.style.display= value.length<3 ?'none':  ji.getValue('defaultDisplay');
        },
        OnInitialize(ji, e) {
            ji.addValue('defaultDisplay',ji.dom.parent.style.display);
            this.Todo(ji,e);
        }
    });
```

### Templates.html
```html
    <template name="T1">
        <div class="row">
            <text db-bind="FirstName" db-job="label"></text>
            <span  db-bind="LastName" id='lastNamePanel'>
                <text db-job="label"></text>
                <text style="display:none" db-bind="^.FirstName" db-job="myJob"></text>
            </span>
        </div>
    </template>
````

### How To Execute

in our code we go to impliment this
```JavaScript
    var person=new Person();
    var personView=new UI.TControl('templates.T1',person);
    person.FirstName="Achour";
    // look when I change person.FirstName the view doesn't change until 
    //the view impilmented in document
    personView.OnInitialize=view=>{
        //on this point the view has been implimented into document
        // And the #lastNamePanel is hidden because the fisrtName.length<3
        person.FirstName="Achour";
        //On this Point The #lastNamePanel is visble
        person.LastName="Brahim";
    }
    //***********************************************************
    //***** this bloc of code for testing not Standard code ***** 
    //*************don't use it in your project *****************
    personView.Parent=UI.Desktop.Current;
    document.body.appendChid(personView.View);
    //***********************************************************
    // **********  this is how to impliment your code  **********
    //  parentControl.Add(personView);      
    //**********************************************************
```

# Examplae 2 TodoList

### Code.html
```javascript
    import {bind} from 'js/Corelib';
    export class TodoListModel extends bind.DObject{
		constr
        static __fields__(){
            this.DPFName=bind.DObject.CreateField("FirstName",String);
            this.DPFName=bind.DObject.CreateField("FirstName",String);
            return [this.DPFName ,this.DPLName];
        }
    }
    
    var myJob = bind.Register({
        Name: "myJob",
        Todo(ji, i) {            
            var value=(ji.Scop.Value||"").trim();
            var d=ji.dom.parent;
            d.style.display= value.length<3 ?'none':  ji.getValue('defaultDisplay');
        },
        OnInitialize(ji, e) {
            ji.addValue('defaultDisplay',ji.dom.parent.style.display);
            this.Todo(ji,e);
        }
    });
```

### Templates.html
```html
    <template name="T1">
        <div class="row">
            <text db-bind="FirstName" db-job="label"></text>
            <span  db-bind="LastName" id='lastNamePanel'>
                <text db-job="label"></text>
                <text style="display:none" db-bind="^.FirstName" db-job="myJob"></text>
            </span>
        </div>
    </template>
````



* this is the basic way how to create simple template but there are many way to do that 
