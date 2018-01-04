import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Problem } from "../../problem.model";
import { ProblemService } from "../../problem.service";

@Component({
  selector: 'app-problem-edit-form',
  templateUrl: './problem-edit-form.component.html',
  styleUrls: ['./problem-edit-form.component.css']
})
export class ProblemEditFormComponent implements OnInit {

  problem = new Problem('','');

  @ViewChild('f') problemForm: NgForm;
  constructor(private route: ActivatedRoute, private router: Router, private problemService: ProblemService) { }

  ngOnInit() {
    if(this.route.snapshot.params['index']){
      this.problem = this.problemService.getProblemByIndex(+this.route.snapshot.params['index']);

      // console.log(this.problemForm.controls);

    }
    this.route.params.subscribe(
      (params:Params)=>{
        if(params['index']){
          this.problem = this.problemService.getProblemByIndex(+params['index']);

        }
        else {
          this.problem = new Problem('','');

        }
      }
    );
  }

  onCancel(){
    // console.log(this.route);
    this.problemForm.reset();
    this.problem = new Problem('','');
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  onSubmit(form:NgForm){
    // console.log(form);
    let newProblem = new Problem(form.value.title,form.value.description);
    if(this.problem.hasRestoration){
      newProblem.setRestoration(this.problem.restoreLang,this.problem.restoreCode);
    }
    if(this.route.snapshot.params['index']){
      this.problemService.updateProblem(newProblem,+this.route.snapshot.params['index']);
    }
    else{
      this.problemService.appendProblem(newProblem);
    }
    this.onCancel();
  }

  isNew(){
    if(this.route.snapshot.params['index'])return false;
    else return true;
  }

  onDelete(){
    this.problemService.deleteProblem(+this.route.snapshot.params['index']);
    this.onCancel();
  }

}
