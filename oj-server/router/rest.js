const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
var { User } = require("../models/user");

router.use(bodyParser.json());//parse the body to json

//create user in the database
router.post("/users", function(req,res){
  var user = new User({
    email: req.body.email,
    problems: [],
    sessions: []
  });
  user.save().then(
    (dbres)=>{
      res.status(200).send({
        email:dbres.email,
        status: "ok"
      });
    }
  ).catch((e)=>{
    res.status(400).send(e);
  });
});

//sending message should be {operation: , email: , problem:(optional), newProblem(optional)}
router.post("/problems",function(req,res){
  if(req.body.operation === "getProblems"){
    User.findOne({
      email: req.body.email
    }).then(
      (dbres)=>{
        if(!dbres){
          res.status(400).send({
            errorMessage: "User does not exist"
          });
        } else{
          res.status(200).send({
            email: dbres.email,
            problems: dbres.problems,
            status: "ok"
          });
        }
      }
    ).catch(
      (e)=>{
        res.status(400).send(e);
      }
    );
  }
  else if(req.body.operation === "appendProblem"){
    User.findUserAndAddProblem(req.body.email,req.body.problem).then(
      (dbres)=>{
        res.status(200).send({
          email: dbres.email,
          status: "ok"
        });
      }
    ).catch((e)=>{
      res.status(400).send(e);
    });
  }
  else if(req.body.operation === "deleteProblem"){
    User.findUserAndRemoveProblem(req.body.email,req.body.problem).then(
      (dbres)=>{
        res.status(200).send({
          email: dbres.email,
          status: "ok"
        });
      }
    ).catch((e)=>{
      res.status(400).send(e);
    });
  }
  else if(req.body.operation === "updateProblem"){
    User.findUserAndUpdateProblem(req.body.email,req.body.problem,req.body.newProblem).then(
      (dbres)=>{
        res.status(200).send({
          email: dbres.email,
          status: "ok"
        });
      }
    ).catch((e)=>{
      res.status(400).send(e);
    });
  }
  else {
    res.status(400).send({
      errorMessage: "Unknown operation!"
    });
  }
});


module.exports = { router };
