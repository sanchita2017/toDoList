import { LightningElement ,track} from 'lwc';
import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';


export default class ToDoManager extends LightningElement {
   @track time="11:37 PM";
   @track greeting="Good Morning";

   @track todos=[];
//gets called as soon as component is initialised
    connectedCallback(){
        this.getTime();
        //this.populateToDo();
        this.fetchTodos();
        setInterval(()=>{
            this.getTime();

        },1000*60);
    }

    
    getTime(){
        const date=new Date();
        const hour=date.getHours();
        const min=date.getMinutes();
        this.time=this.getHour(hour)+':'+this.getDoubleDigit(min)+' '+ this.getMidDay(hour);
        this.setGreeting(hour);
    }
    getHour(hour){
        
        if(hour===0){
            hour="12";
        }else if(hour>12){
            hour=hour-12;
        }else{
            hour=hour;
        }
        return hour;

    }

    getMidDay(hour){
        
        if(hour>=12){
            hour="PM";
        }else{
            hour="AM";
        }
        return hour;
    }

    getDoubleDigit(digit){
        
        if(digit<10){
            digit=0+digit;
        }else{
            digit=digit;
        }
        return digit;
    }
    setGreeting(hour){
        if(hour<12){
            this.greeting="Good Morning";
        }else if(hour>=12 &&hour<17){
            this.greeting="Good Afternoon";
        }else{
            this.greeting="Good Evening";
        }
    }


    addToHandler(){
        const inputBox=this.template.querySelector("lightning-input");
        const todo={
           
            todoName:inputBox.value,
            done:false
           
        };
        console.log('todo--->',todo);
        console.log('JSON.stringify(todo)-->',JSON.stringify(todo));
        addTodo({payload : JSON.stringify(todo)}).then(response=>{
            console.log(response);
            console.log('item inserted');
            this.fetchTodos();
        }).catch(error =>{
            
            console.error('error encountered'+error);
        });
        //this.todos.push   (todo);
        inputBox.value="";
    }

    fetchTodos(){
        getCurrentTodos().then(result=>{
            if(result!=undefined)
            console.log('result size',result.length);
            this.todos=result;
        }).catch(error =>{
            console.error('error encountered'+error);
        });
    }

    get upcomingTask(){
        if(this.todos&&this.todos.length){
            return this.todos.filter(todo=>!todo.done)
        }else{
            return [];
        }
    }

    get completedTask(){
        if(this.todos&&this.todos.length){
            return this.todos.filter(todo=>todo.done)
        }else{
            return [];
        }
    }

    populateToDo(){
        const todos=[
            {
            todoId:0,
            todoName:"Catch the fish",
            done:false,
            todoDate:new Date()
            },
            {
                todoId:1,
                todoName:"wash the fish",
                done:false,
                todoDate:new Date()
                },
                {
                    todoId:2,
                    todoName:"Cook the fish",
                    done:true,
                    todoDate:new Date()
                    }

        ];
        this.todos=todos;
    }

    updateHandler(){
        this.fetchTodos();
    }
    deleteHandler(){
        this.fetchTodos();
    }

}