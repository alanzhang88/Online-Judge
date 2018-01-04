import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProblemService } from "./problem.service";
import { RoomService } from "./room.service";

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit, OnDestroy {


  constructor(private problemService: ProblemService, private roomService: RoomService) { }

  ngOnInit() {
  }

  ngOnDestroy(){
    if(this.problemService.connectionStatus === "client"){
      this.roomService.email = null;
    }
  }

}
