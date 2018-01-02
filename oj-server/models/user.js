const {mongoose} = require("../db/mongoose");
const valid = require("validator");

var UserSchema = new mongoose.Schema({
  email:{
    required: true,
    type: String,
    unique: true,
    validate:{
      isAsync: false,
      validator: valid.isEmail,
      message: "It is not a valid Email"
    }
  },
  problems:[
    {
      problemTitle:{
        type: String,
        required: true
      },
      problemDescription:{
        type: String,
        required: true
      }
    }
  ],
  sessions:[
    String
  ]
});





UserSchema.statics.findUserAndAddProblem = function(email,problem){
  //problem will be a problem object with the two properties, problemTitle and problemDescription
  var User = this;
  return User.findOneAndUpdate({
    email
  },{
    $push:{
      problems: problem
    }
  },{
    new: true
  });
  
}

UserSchema.statics.findUserAndRemoveProblem = function(email,problem){
  var User = this;
  return User.findOneAndUpdate({
    email
  },{
    $pull:{
      problems:
        {
          problemTitle: problem.problemTitle
        }
    }
  },{
    new:true
  });

}

UserSchema.statics.findUserAndUpdateProblem = function(email,oldProblem,newProblem){
  var User = this;
  return User.findOneAndUpdate({
    email: email,
    "problems.problemTitle": oldProblem.problemTitle
  },{
    $set:{
      "problems.$": newProblem
    }
  },{
    new: true
  });

}

var User = mongoose.model("User",UserSchema);

module.exports = { User };
