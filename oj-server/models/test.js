// var { User } = require("./user");
// const uniqid = require("uniqid");
const shortid = require("shortid");

var { UserToRoom, Room } = require("../service/room");

// var user = new User({email:"test3@test.com",inviteCode: uniqid.time() ,problems:[
//   {problemTitle:'Two Sum',problemDescription:'Given an array of integers, return indices of the two numbers such that they add up to a specific target.'},
//   {problemTitle:'Reverse Intger', problemDescription:'Given a 32-bit signed integer, reverse digits of an integer.'}
// ],sessions:[]});
// user.save().then((user)=>{
//   console.log(user);
// });

// User.findUserAndAddProblem("test@test.com",{
//   problemTitle: "TestProblem",
//   problemDescription: "TestProblem"
// }).then((res)=>console.log(res));

// User.findUserAndRemoveProblem("test@test.com",{
//   problemTitle: "Two Sum"
// }).then((res)=>console.log(res));

// User.findUserAndUpdateProblem("test@test.com",{
//   problemTitle: "TestProblem",
// },{
//   problemTitle: "TestProblem1",
//   problemDescription: "TestProblem1",
// }).then((res)=>console.log(res));

// User.findUserAndSetInviteCode("test3@test.com",shortid.generate()).then((res)=>console.log(res));

Room.generate("test@test.com");
UserToRoom.addUser("sadasdqweqwe",Room.getRoomName("test@test.com"));

console.log(Room);
console.log(UserToRoom);
console.log(Room.exist("test@test.com"));
// process.exit();
