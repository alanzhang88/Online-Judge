import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers} from '@angular/http';
import { Subject } from "rxjs/Subject";
// import "rxjs/Rx";
import { Problem } from "../problem/problem.model";
import { RoomService } from "../problem/room.service";

@Injectable()
export class AuthService{
    token: string;
    email: string
    // problemSubject = new Subject<Problem[]>();
    emailSubject = new Subject<string>();
    headers = new Headers({
      'Content-Type': 'application/json'
    });
    constructor(private router:Router, private http:Http, private roomService: RoomService){

    }

    signupUser(email:string, password:string){
      firebase.auth().createUserWithEmailAndPassword(email,password)
      .then(
        (response)=>{
          console.log(response);
          this.registerToDataBase(email);
          alert("Successfully signing up. Please login");
          this.router.navigate(['/signin']);
        }
      )
      .catch((error)=>{
        console.log(error);
      });
    }

    registerToDataBase(email:string){

      this.http.post('/api/v1/users',{
        email: email
      },{headers: this.headers}).subscribe((response:Response)=>{
        console.log(response);
      });

    }

    signinUser(email:string, password:string){
      firebase.auth().signInWithEmailAndPassword(email,password)
      .then(
        (response)=>{
          console.log(response);

          this.router.navigate(['/']);
          this.email = response.email;
          // this.loginSubject.next(true);
          this.emailSubject.next(response.email);
          this.roomService.email = response.email;

          firebase.auth().currentUser.getToken().then(
            (token:string) =>{
              this.token = token;
            }
          );
        }
      ).catch(
        (error) => {console.log(error);}
      );
    }

    logout(){
      firebase.auth().signOut();
      this.token = null;
      this.email = null;
      this.emailSubject.next();
    }

    getToken(){
      firebase.auth().currentUser.getToken().then(
        (token:string) =>{
          this.token = token;
        }
      );
      return this.token;
    }

    isAuthenticated(){
      return this.token != null;
    }
}
