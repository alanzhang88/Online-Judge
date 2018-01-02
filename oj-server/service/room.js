const shortid = require("shortid");

// the following should be implemented using redis
var Room = {
  room: {}
}; //key is host email, value is an object with room name(string) and number of people in the room (number)
var UserToRoom = {
  mapping: {}
}; //key is socketid, value is room name (string)

UserToRoom.addUser = function(userSocketID, roomName){
  this.mapping[userSocketID] = roomName;
}

UserToRoom.removeUser = function(userSocketID){
  delete this.mapping[userSocketID];
}

Room.exist = function(email){
  return this.room[email] != null;
}

Room.generate = function(email){
  this.room[email] = {
                  name: email+"-"+shortid.generate(),
                  peopleNum: 1
                };
}

Room.getRoomName = function(email){
  return this.room[email].name;
}

Room.getPeopleNum = function(email){
  return this.room[email].peopleNum;
}

Room.incPeopleNum = function(email){
  this.room[email].peopleNum++;
}

Room.decPeopleNum = function(email){
  this.room[email].peopleNum--;
}

Room.removeRoom = function(email){
  delete this.room[email];
}

module.exports = { Room, UserToRoom };
