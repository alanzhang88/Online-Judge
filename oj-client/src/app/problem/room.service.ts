import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable()
export class RoomService{
  email: string = null;
  headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: Http){}

  setRestorationToDB(problemTitle:string, restoreLang: string, restoreCode: string){
    if(this.email){
      this.http.post('/api/v1/problems',
      {
        operation: "setRestoration",
        email: this.email,
        problemTitle: problemTitle,
        restoreLang: restoreLang,
        restoreCode: restoreCode
      },
      {
        headers: this.headers
      }).subscribe(
        (response: Response) => {
          let data = response.json();
          if(data['status'] && data['status'] === "ok"){
            console.log("Successfully set the restoration to the database");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  resetRestorationToDB(problemTitle:string){
    if(this.email){
      this.http.post('/api/v1/problems',
      {
        operation: "resetRestoration",
        email: this.email,
        problemTitle: problemTitle
      },
      {
        headers: this.headers
      }).subscribe(
        (response: Response) => {
          let data = response.json();
          if(data['status'] && data['status'] === "ok"){
            console.log("Successfully reset the restoration to the database");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
