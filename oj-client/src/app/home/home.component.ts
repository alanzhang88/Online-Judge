import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProblemService } from "../problem/problem.service";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from "../problem/room.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private problemService: ProblemService, private router: Router, private roomService: RoomService) { }


  ngOnInit() {
    this.problemService.connectionStatus = "host";
    // this.roomService.email = null;
  }

  onSubmit(form:NgForm){
    this.problemService.verifyInviteCode(form.value.email,form.value.inviteCode).subscribe(
      (data) => {
        console.log(data);
        if(data['status'] && data.status === "ok"){
          this.problemService.getProblems(form.value.email);
          this.problemService.connectionStatus = "client";
          this.roomService.email = form.value.email;
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

  getInviteCodeObservable(){
    return this.problemService.inviteCodeObservable;
  }

  getInviteCode(){
    return this.problemService.inviteCode;
  }

  onReset(){
    this.problemService.resetInviteCode();
  }

  ngOnDestroy(){

  }

}
