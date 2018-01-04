import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProblemComponent } from "./problem/problem.component";
import { ProblemStartComponent } from "./problem/problem-start/problem-start.component";
import { ProblemDetailComponent } from "./problem/problem-detail/problem-detail.component";
import { ProblemEditComponent } from "./problem/problem-edit/problem-edit.component";
import { ProblemEditFormComponent } from "./problem/problem-edit/problem-edit-form/problem-edit-form.component";
import { HomeComponent } from "./home/home.component";
import { ProblemGuard } from "./problem/problem-guard-service";

const appRoutes: Routes = [
  {'path': '', component: HomeComponent },
  {'path': 'problems', component: ProblemComponent, canActivate:[ProblemGuard], children:[
    {'path': '', component: ProblemStartComponent, pathMatch: 'full'},
    {'path': 'edit', component: ProblemEditComponent},
    {'path': 'edit/new', component: ProblemEditFormComponent},
    {'path': 'edit/:index', component: ProblemEditFormComponent},
    {'path': ':index', component: ProblemDetailComponent}
  ]}
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule{}
