
import { Injectable, OnInit } from '@angular/core';
import { EditorMarkerService } from "./editor-marker.service";
import { Subject } from "rxjs/Subject";
import { RoomService } from "../room.service";

declare var io: any;
// declare var ace: any;

@Injectable()
export class EditorUpdateService implements OnInit{
  editor: any;
  socket: any = null;
  outputSubject = new Subject<string>();
  langSubject = new Subject<string>();
  newUser = true;

  constructor(private editorMarkerService:EditorMarkerService, private roomService: RoomService){

  }

  init(editor:any){
    if(this.socket != null)return;
    this.socket = io();
    this.editor = editor;
    this.editorMarkerService.setSession(editor.getSession());

    let self = this;
    let localPatch = self.patch.bind(self);

    editor.session.selection.on("changeCursor",function(){
      console.log("new cursor pos",editor.getCursorPosition());
      let msg = editor.getCursorPosition();
      msg['id'] = self.socket.id;
      self.socket.emit("newCursorPos",msg);
    });



    editor.on("change",localPatch);

    this.socket.on("connect",function(){
      console.log("Connected to server");
      self.socket.emit("joinRoom",self.roomService.email);
    });

    this.socket.on("patchText",function(e){
      console.log("Recv a patch from other client");
      editor.off("change",localPatch);
      editor.session.doc.applyDelta(e);
      editor.on("change",localPatch);
    });

    this.socket.on("cursorPosUpdate",function(msg){
      self.editorMarkerService.updateCursor(msg);
    });

    this.socket.on("newuserJoin",function(msg){
      console.log("Recv new user");
      // var msg = {
      //   text: editor.getValue(),
      //   cursorPosition: editor.getCursorPosition()
      // };

      msg.text = editor.getValue();
      msg.cursorPosition = editor.getCursorPosition();
      msg.cursorPosition['id'] = self.socket.id;
      console.log("Sending new user info", msg);
      self.socket.emit("newuserInfo",msg);
    });

    this.socket.on("newuserSync",function(msg){
      console.log("Recv sync info from other client",msg);
      if(self.newUser){
        editor.off("change",localPatch);
        editor.setValue(msg.text,-1);
        editor.on("change",localPatch);
        self.newUser = false;
      }
      self.editorMarkerService.addCursor({row:msg.cursorPosition.row,column:msg.cursorPosition.column,id:msg.cursorPosition.id});
    });

    this.socket.on("userdisconnect",function(msg){
      console.log(`user ${msg.id} Disconnected`);
      self.editorMarkerService.deleteCursor(msg.id);
    });

    this.socket.on("codeResult",function(result){
      console.log("Recv code result",result);
      // jQuery("#result").text(`Output: \n${result.output}`);
      self.outputSubject.next(`Output: \n${result.output}`);
    });

    this.socket.on("setLang",(msg)=>{
      console.log("Recv new lang", msg);
      self.langSubject.next(msg);

    });

    this.socket.on("disconnect",function(){
      console.log("Disconnected from server");
    });

  }

  patch(e){
      console.log("Change in text",e);
      this.socket.emit("newPatch",e);
  }

  sendCode(msg:any){
      this.socket.emit("codeToRun",msg);
  }

  updateMode(msg:any){
    this.socket.emit("newLang",msg);
  }

  endConnection(){
    this.socket.emit("end",this.roomService.email);
    this.socket = null;
    this.newUser = true;
  }

  ngOnInit(){

  }
}
