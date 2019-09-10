let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    taskID: Number,
    taskName: String, 

    assignTo:{  //each user has a unique id, user is a obj
        type: mongoose.Schema.Types.ObjectId, //TYPE: objid
        ref: 'DeveloperCol'
    },

    dueDate:Date,

    taskStatus: {
        type:String,
        validate: { //validate is an obj
            validator: function (value) {
                if (value  === 'InProgress'|| value  === 'Complete')
                    return true;
                else
                    return false;
            },
            message: 'Should be be either InProgress or Complete'
        },       
        required: true
    },
    
    taskDescp: String    
       
});

let taskModel = mongoose.model("TaskCol", taskSchema);
module.exports = taskModel;
