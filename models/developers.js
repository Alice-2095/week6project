let mongoose = require('mongoose');

let deveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
        type: String, 
        required: true
        },
        lastName:String
    },

    level: {
        type:String,
        validate: { //validate is an obj
            validator: function (value) {
                if (value  === 'Beginner'|| value  === 'Expert')
                    return true;
                else
                    return false;
            },
            message: 'Should be be either Beginner or Expert'
        },       
        required: true
    },
    
    address:     
        { State: String,
          Suburb: String,
          Street: String,
          Unit: Number 
            },

});

let deveModel = mongoose.model("DeveloperCol", deveSchema);
module.exports = deveModel;











