import { Component, OnInit } from '@angular/core';
import { ProblemService } from "../problem/problem.service";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private problemService: ProblemService, private router: Router) { }

  ngOnInit() {
    this.problemService.connectionStatus = "host";
  }

  onSubmit(form:NgForm){
    this.problemService.getProblems(form.value.email);
    this.problemService.connectionStatus = "client";
    this.router.navigate(['/problems']);
  }

  isSignedIn(){
    return this.problemService.email != null;
  }

}
