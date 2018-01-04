import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RoomService } from "./room.service";

@Injectable()
export class ProblemGuard implements CanActivate{
  constructor(private roomService: RoomService, private router: Router){

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    if(this.roomService.email != null){
      return true;
    }
    else{
      this.router.navigate(['/']);
      return false;
    }
  }
}
