import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { ProblemService } from "../problem/problem.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService:AuthService, private problemService: ProblemService) { }

  ngOnInit() {

  }

  getAuthenticatStatus(){
    return this.authService.isAuthenticated();
  }

  getUserEmail(){
    return this.authService.email;
  }

  onSignout(){
    this.authService.logout();
  }

}
