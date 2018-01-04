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
  inviteCode: {
    type: String,
    required: true
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
      },
      hasRestoration:{
        type: Boolean
      },
      restoreLang:{
        type: String
      },
      restoreCode:{
        type: String
      }
    }
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

UserSchema.statics.findUserAndSetRestoration = function(email,problemTitle,restoreLang,restoreCode){
  var User = this;
  return User.findOneAndUpdate({
    email: email,
    "problems.problemTitle": problemTitle
  },{
    $set:{
      "problems.$.hasRestoration": true,
      "problems.$.restoreLang": restoreLang,
      "problems.$.restoreCode": restoreCode
    }
  },{
    new: true
  });
}

UserSchema.statics.findUserAndResetRestoration = function(email,problemTitle){
  var User = this;
  return User.findOneAndUpdate({
    email: email,
    "problems.problemTitle": problemTitle
  },{
    $set:{
      "problems.$.hasRestoration": false,
      "problems.$.restoreLang": "",
      "problems.$.restoreCode": ""
    }
  },{
    new: true
  });
}

UserSchema.statics.findUserAndSetInviteCode = function(email,newInviteCode){
  var User = this;
  return User.findOneAndUpdate({
    email: email
  },{
    $set:{
      inviteCode: newInviteCode
    }
  },{
    new: true
  });
}

var User = mongoose.model("User",UserSchema);

module.exports = { User };
