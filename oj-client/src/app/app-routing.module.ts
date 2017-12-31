import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProblemComponent } from "./problem/problem.component";
import { ProblemStartComponent } from "./problem/problem-start/problem-start.component";
import { ProblemDetailComponent } from "./problem/problem-detail/problem-detail.component";

const appRoutes: Routes = [
  {'path': '', redirectTo: '/problems', pathMatch: 'full' },
  {'path': 'problems', component: ProblemComponent, children:[
    {'path': '', component: ProblemStartComponent, pathMatch: 'full'},
    {'path': ':index', component: ProblemDetailComponent}
  ]}
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule{}
