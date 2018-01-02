import { Component, OnInit } from '@angular/core';
import { ProblemService } from "../problem.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

  problemsTitle: string[];
  problemEdit = false;
  problemChangeSubscription: Subscription;
  constructor(private problemService: ProblemService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.problemsTitle = this.problemService.getProblemsTitle();
    this.problemChangeSubscription = this.problemService.problemChange.subscribe(
      (newProblemTitle:string[])=>{
        this.problemsTitle = newProblemTitle;
      }
    );
    // console.log(this.problemsTitle);
  }

  onManage(){
    this.problemEdit = true;
  }

  onBack(){
    this.problemEdit = false;
    this.router.navigate(['/problems']);
  }

  getAuthenticatStatus(){
    return this.authService.isAuthenticated();
  }
}
