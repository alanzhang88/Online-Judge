import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { ProblemService } from "../problem/problem.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isIn: boolean = false;

  constructor(private authService:AuthService, private problemService: ProblemService) { }

  ngOnInit() {

  }

  toggleState(){
    this.isIn = this.isIn === false ? true : false;
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

  getConnectionStatus(){
    return this.problemService.connectionStatus;
  }

}
