import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProblemService } from "../problem/problem.service";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private problemService: ProblemService, private router: Router) { }


  ngOnInit() {
    this.problemService.connectionStatus = "host";
  }

  onSubmit(form:NgForm){
    this.problemService.verifyInviteCode(form.value.email,form.value.inviteCode).subscribe(
      (data) => {
        console.log(data);
        if(data['status'] && data.status === "ok"){
          this.problemService.getProblems(form.value.email);
          this.problemService.connectionStatus = "client";
          this.router.navigate(['/problems']);
        }
        else{
          alert(data.errorMessage);
        }
      }
    );

  }

  isSignedIn(){
    return this.problemService.email != null;
  }

  getInviteCodeSubject(){
    return this.problemService.inviteCodeObservable;
  }

  onReset(){
    this.problemService.resetInviteCode();
  }

  ngOnDestroy(){

  }

}
