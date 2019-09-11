let mongoose =require('mongoose'); 
let express=require('express');
let app=express();
let bodyParser=require('body-parser');


let Developer=require('./models/developers'); //reference to the schema/module 
let Task=require('./models/tasks');
                                    //DB name
//let url = "mongodb://localhost:27017/week6lab";
let  url = "mongodb://" + process.argv[2] +  ":27017/";


let viewsPath=__dirname+"/views/";

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('views'));   //[set static assets]  
app.engine('html',require('ejs').renderFile); /*express should be 
                                able to render ejs templates, ejs: embed js into html*/ 
app.set('view engine','html');



mongoose.connect(url, function (err) {
    if(err) {throw err};
    console.log("connected");
});

app.get('/',function(req,res){   
    res.sendFile(viewsPath + "index.html"); 
});


app.post('/insertnewdeveloper', function (req, res) {
    
    let develDetail = req.body;
  
   let developer = new Developer({  //attributes and values
      _id: new mongoose.Types.ObjectId(),
      name:{
        firstName:develDetail.fname,
        lastName:develDetail.lname
      },
      level:  develDetail.level,
      address:{     
        State:develDetail.state,
        Suburb:develDetail.suburb,
        Street:develDetail.street,
        Unit: parseInt(develDetail.unit) 
       }
    });
    developer.save(function(err){
        if(err) console.log(err);
        else console.log("developer saved");
    }); 
    res.redirect('/getDeveloper');
    
});

app.post('/insertnewtask', function (req, res) {
    
    let taskDetails = req.body;
        taskDetails.newId= Math.round(Math.random()*100);

        let task =new Task({
            taskID: taskDetails.newId,
            taskName: taskDetails.tname,
            assignTo:mongoose.Types.ObjectId(taskDetails.assignto),
            dueDate:new Date(taskDetails.duedate),
            taskStatus: taskDetails.taskstatus,
            taskDescp: taskDetails.taskdescr
        });
        task.save(function(err){
            if(err) console.log(err);
            else console.log("task saved");
        }); 
        res.redirect('/getTask');
    
});


app.get('/getDeveloper',function(req,res){
    Developer.find().exec(function(err,data){  //chain of methods
        res.render(viewsPath +'getDevel.html', { developDb: data })
    });
});

app.get('/getTask',function(req,res){
  
            //populate: need to specify which fields
    Task.find().populate('assignTo').exec(function(err,data){  //chain of methods
        console.log(data);
        res.render(viewsPath +'getTask.html', { taskDb: data });  
    });
});

app.get('/deleteTask', function (req, res) {
    res.sendFile(viewsPath + 'deleteTask.html');
});

app.post('/deletetaskdata', function (req, res) {
    let deleteDetails =  req.body;
    let query = { taskID: parseInt(deleteDetails.taskid) };
    
    Task.deleteOne(query,function(err,obj){
        res.redirect('/getTask');    
    
    }); 
   
});

app.post('/deleteCompleted',function(req,res){
    Task.deleteMany({taskStatus:"Complete" },function(err,obj){
        res.redirect('/getTask');       
    });  
       
});

app.get('/updateTaskStatus', function (req, res) {
    res.sendFile(viewsPath + 'updateTask.html');
});

app.post('/updatetaskdata', function (req, res) {
    let taskDetails =  req.body;   
    let filter = { taskID: parseInt(taskDetails.taskid) }; 
    let theUpdate = { $set: { taskStatus: taskDetails.taskstatus } };
    Task.updateOne(filter, theUpdate,
     { upsert: true }, function (err, result) {
    });    
    res.redirect('/getTask'); // redirect the client to get all tasks page    
});

app.listen(8080);



