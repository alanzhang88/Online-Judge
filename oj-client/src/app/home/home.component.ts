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
  }

  onSubmit(form:NgForm){
    this.problemService.getProblems(form.value.email);
    this.router.navigate(['/problems']);
  }

  isSignedIn(){
    return this.problemService.email != null;
  }

}
