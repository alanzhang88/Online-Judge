import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProblemService } from "../problem.service";
import { ActivatedRoute, Params } from "@angular/router";
import { EditorMarkerService } from "./editor-marker.service";
import { EditorUpdateService } from "./editor-update.service";
import { Subscription } from "rxjs/Subscription";
import { RoomService } from "../room.service";

// import ace from 'ace-builds/src-min-noconflict/ace';
declare var ace: any;

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit, OnDestroy {
  index:number;
  title:string;
  content:string;
  editor: any;
  editorMode: string = 'C++';
  langMapMode = {
    "C++":"c_cpp",
    "C":"c_cpp",
    "Java":"java",
    "Python2.7":"python"
  };

  subscriptionOutput: Subscription;
  subscriptionLang: Subscription;
  subscriptionRestoration: Subscription;

  output: string = 'Output:';

  defaultContent = {
    'Java':
    `public class Solution {\n\tpublic static void main(String[] args) {\n\t\t// Type your Java code here\n\t}\n}`,
    'C++':
    `#include <iostream>\nusing namespace std;\n\nint main() {\n\t// Type your C++ code here\n}`,
    'Python2.7':
    `# Write your Python code here`,
    'C':
    `#include <stdio.h>\n\nint main() {\n\t//Type your C code here\n}`
  };

  submitted = false;

  // editorMarkerService: EditorMarkerService;

  constructor(private roomService: RoomService,
              private problemService: ProblemService,
              private route: ActivatedRoute,
              private editorMarkerService: EditorMarkerService,
              private editorUpdateService: EditorUpdateService) {

  }

  ngOnInit() {

    let params = this.route.snapshot.params;
    this.index = +params['index'];
    this.title = this.problemService.getProblemTitleByIndex(this.index);
    this.content = this.problemService.getProblemContentByIndex(this.index);

    this.editor = ace.edit("editor");
    // console.log(this.editor);
    this.editor.setTheme('ace/theme/monokai');
    this.editor.$blockScrolling = Infinity;
    if(this.problemService.hasProblemRestorationByIndex(this.index)){
      this.editorMode = this.problemService.getProblemRestoreLangByIndex(this.index);
      this.editor.getSession().setMode(`ace/mode/${this.langMapMode[this.editorMode]}`);
      this.editor.setValue(this.problemService.getProblemRestoreCodeByIndex(this.index),-1);
    }
    else{
      this.editor.getSession().setMode(`ace/mode/${this.langMapMode[this.editorMode]}`);
      this.editor.setValue(this.defaultContent[this.editorMode],-1);
    }
    this.editorMarkerService.setSession(this.editor.getSession());

    this.route.params.subscribe(
      (params: Params) => {
        this.index = +params['index'];
        this.content = this.problemService.getProblemContentByIndex(this.index);
        this.title = this.problemService.getProblemTitleByIndex(this.index);
        if(this.problemService.hasProblemRestorationByIndex(this.index)){
          let lang = this.problemService.getProblemRestoreLangByIndex(this.index);
          if(this.editorMode !== lang){
            this.editorMode = lang;
            this.editor.getSession().setMode(`ace/mode/${this.langMapMode[this.editorMode]}`);
          }
          this.editor.setValue(this.problemService.getProblemRestoreCodeByIndex(this.index),-1);
        }
        else{
          this.editor.setValue(this.defaultContent[this.editorMode],-1);
        }
        this.output = 'Output:';
      }
    );

    this.editorUpdateService.init(this.editor);

    this.subscriptionOutput = this.editorUpdateService.outputSubject.subscribe(
      (output:string) => {
        this.output = output;
        this.submitted = false;
      }
    );

    this.subscriptionLang = this.editorUpdateService.langSubject.subscribe(
      (lang:string) => {

        this.editorMode = lang;
        this.editor.getSession().setMode(`ace/mode/${this.langMapMode[this.editorMode]}`);
      }
    );

    this.subscriptionRestoration = this.editorUpdateService.restoreSubject.subscribe(
      (hasRestoration: boolean) => {
        console.log("recv a hasRestoration update");
        if(hasRestoration){
          this.problemService.setProblemRestorationByIndex(this.index,this.editorMode,this.editor.getValue());
        }
        else{
          this.problemService.resetProblemRestorationByIndex(this.index);
        }
      }
    );
  }

  onSubmit(){
    let msg = {langType:this.editorMode,codes:this.editor.getValue()};
    console.log("Code to compile");
    console.log(msg);
    this.editorUpdateService.sendCode(msg);
    this.submitted = true;
  }

  onChange(){
    console.log('editor lang change', this.editorMode);
    this.editor.getSession().setMode(`ace/mode/${this.langMapMode[this.editorMode]}`);
    if(this.problemService.hasProblemRestorationByIndex(this.index) && this.problemService.getProblemRestoreLangByIndex(this.index) === this.editorMode){
      this.editor.setValue(this.problemService.getProblemRestoreCodeByIndex(this.index),-1);
    }
    else{
      this.editor.setValue(this.defaultContent[this.editorMode],-1);
    }
    this.editorUpdateService.updateMode(this.editorMode);

  }

  onSave(){
    this.problemService.setProblemRestorationByIndex(this.index,this.editorMode,this.editor.getValue());
    this.roomService.setRestorationToDB(this.title,this.editorMode,this.editor.getValue());
    this.editorUpdateService.updateLocalCache(true);
  }

  onReset(){
    this.problemService.resetProblemRestorationByIndex(this.index);
    this.roomService.resetRestorationToDB(this.title);
    this.editor.setValue(this.defaultContent[this.editorMode],-1);
    this.editorUpdateService.updateLocalCache(false);
  }

  ngOnDestroy(){
    this.subscriptionOutput.unsubscribe();
    this.subscriptionLang.unsubscribe();
    this.editorUpdateService.endConnection();
    this.editorMarkerService.resetCursor();
  }

}
