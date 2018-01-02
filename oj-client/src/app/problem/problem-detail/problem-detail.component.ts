import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProblemService } from "../problem.service";
import { ActivatedRoute, Params } from "@angular/router";
import { EditorMarkerService } from "./editor-marker.service";
import { EditorUpdateService } from "./editor-update.service";
import { Subscription } from "rxjs/Subscription";

// import ace from 'ace-builds/src-min-noconflict/ace';
declare var ace: any;

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit, OnDestroy {
  index:number;
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

  constructor(private problemService: ProblemService,
              private route: ActivatedRoute,
              private editorMarkerService: EditorMarkerService,
              private editorUpdateService: EditorUpdateService) {

  }

  ngOnInit() {

    this.editor = ace.edit("editor");
    // console.log(this.editor);
    this.editor.setTheme('ace/theme/monokai');
    this.editor.getSession().setMode(`ace/mode/${this.langMapMode[this.editorMode]}`);
    this.editor.$blockScrolling = Infinity;
    this.editor.setValue(this.defaultContent[this.editorMode],-1);
    this.editorMarkerService.setSession(this.editor.getSession());

    this.route.params.subscribe(
      (params: Params) => {
        this.index = +params['index'];
        this.content = this.problemService.getProblemContentByIndex(this.index);
        this.editor.setValue(this.defaultContent[this.editorMode],-1);
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

    this.editor.setValue(this.defaultContent[this.editorMode],-1);
    this.editorUpdateService.updateMode(this.editorMode);



  }

  ngOnDestroy(){
    this.subscriptionOutput.unsubscribe();
    this.subscriptionLang.unsubscribe();
    this.editorUpdateService.endConnection();
    this.editorMarkerService.resetCursor();
  }

}
