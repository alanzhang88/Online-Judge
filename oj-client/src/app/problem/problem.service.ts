
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Problem } from "./problem.model";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../auth/auth.service";
import "rxjs/Rx";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class ProblemService implements OnInit, OnDestroy{
    headers = new Headers({
      'Content-Type': 'application/json'
    });
    problemChange = new Subject<string[]>();
    email: string = null;
    emailSubscription: Subscription;

    connectionStatus = "host";

    inviteCode: string = null;
    private inviteCodeObserver;
    inviteCodeObservable = new Observable((observer)=>{
      this.inviteCodeObserver = observer;
    });

    private problems: Problem[] = [
      // new Problem('Two Sum','Given an array of integers, return indices of the two numbers such that they add up to a specific target.'),
      // new Problem('Reverse Intger', 'Given a 32-bit signed integer, reverse digits of an integer.')
    ];



    constructor(private http: Http, private authService: AuthService){
      this.emailSubscription = this.authService.emailSubject.subscribe(
        (email:string) => {
          console.log("set email", email);
          if(email){
            this.email = email;
            this.getProblems(email);
          }
          else{
            this.email = null;
            this.setProblems([]);
          }
        }
      );
    }

    ngOnInit(){
      // this.getProblems();
      // this.loginSubscription = this.authService.loginSubject.subscribe(
      //   (loginres: boolean) => {
      //     console.log("here");
      //     if(loginres){
      //       this.getProblems(this.authService.email);
      //     }
      //   }
      // );
      // console.log("executed");

    }

    setProblems(problems:Problem[]){
      this.problems = problems;
      this.problemChange.next(this.getProblemsTitle());
    }

    getProblems(email:string){
      this.setProblems([]);
      this.http.post('/api/v1/problems',
      {
        operation: "getProblems",
        email: email
      },
      {
        headers:this.headers
      }).subscribe(
        (response:Response) => {
          let data = response.json();
          console.log("get problems response", data);
          if(data['status'] && data['status'] === "ok"){
            let problems : Problem[] = [];
            for (let problem of data.problems){
              problems.push(new Problem(problem.problemTitle,problem.problemDescription));
            }
            this.setProblems(problems);
            if(this.connectionStatus === "host"){
              this.inviteCode = data.inviteCode;
              this.inviteCodeObserver.next(data.inviteCode);
            }            
          }
        },
        (error) => {
          console.log(error);
        }
      );

    }

    getProblemsTitle(){
      let res:string[] = [];
      for(const problem of this.problems){
        res.push(problem.title);
      }
      return res;
    }

    getProblemContentByIndex(index:number){
      return this.problems[index].content;
    }

    getProblemByIndex(index:number){
      return this.problems[index];
    }

    //need to implement no duplicate problem titles
    appendProblem(problem:Problem){
      this.problems.push(problem);
      this.problemChange.next(this.getProblemsTitle());
      if(this.email){
        this.http.post('/api/v1/problems',
        {
          operation: "appendProblem",
          email: this.email,
          problem: {
            problemTitle: problem.title,
            problemDescription: problem.content
          }
        },
        {
          headers:this.headers
        }).subscribe(
          (response: Response)=>{
            let data = response.json();
            console.log("get problems response", data);
            if(data['status'] && data['status'] === "ok"){
              console.log("Successfully append the problem to the database");
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
    updateProblem(newProblem:Problem,index:number){
      if(this.email){
        this.http.post('/api/v1/problems',
        {
          operation: "updateProblem",
          email: this.email,
          problem: {
            problemTitle: this.problems[index].title
          },
          newProblem: {
            problemTitle: newProblem.title,
            problemDescription: newProblem.content
          }
        },
        {
          headers: this.headers
        }).subscribe(
          (response: Response)=>{
            let data = response.json();
            console.log("get problems response", data);
            if(data['status'] && data['status'] === "ok"){
              console.log("Successfully update the problem to the database");
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
      this.problems[index] = newProblem;
      this.problemChange.next(this.getProblemsTitle());
    }
    deleteProblem(index:number){
      if(this.email){
        this.http.post('/api/v1/problems',
        {
          operation: "deleteProblem",
          email: this.email,
          problem: {
            problemTitle: this.problems[index].title
          }
        },
        {
          headers: this.headers
        }).subscribe(
          (response: Response)=>{
            let data = response.json();
            console.log("get problems response", data);
            if(data['status'] && data['status'] === "ok"){
              console.log("Successfully delete the problem to the database");
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
      this.problems.splice(index,1);
      this.problemChange.next(this.getProblemsTitle());
    }
    resetInviteCode(){
      if(this.email){
        this.http.post('/api/v1/invitecode',
        {
          email: this.email
        },
        {
          headers: this.headers
        }).subscribe(
          (response: Response)=>{
            let data = response.json();
            console.log("get invitecode response", data);
            if(data['status'] && data['status'] === "ok"){
              console.log("Successfully reset invitecode to the database");
              this.inviteCode = data.inviteCode;
              this.inviteCodeObserver.next(data.inviteCode);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
    verifyInviteCode(email:string, inviteCode:string){
      return this.http.post('/api/v1/verify',
      {
        email: email,
        inviteCode: inviteCode
      },{
        headers: this.headers
      }).map(
        (response: Response) => {
          return response.json();
        }
      );
    }

    ngOnDestroy(){
      this.emailSubscription.unsubscribe();
    }
}
