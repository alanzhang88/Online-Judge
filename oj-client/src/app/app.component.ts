import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // title = 'app';
  ngOnInit(){
    firebase.initializeApp({
      apiKey: "AIzaSyCvp6xy4hlWUeM6bbxEtnJrj4UQNZtxztA",
      authDomain: "oj-auth.firebaseapp.com"
    });
  }
}
