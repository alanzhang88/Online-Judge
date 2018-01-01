

import { Problem } from "./problem.model";
import { Subject } from "rxjs/Subject";

export class ProblemService{

    problemChange = new Subject<string[]>();
    private problems: Problem[] = [
      new Problem('Two Sum','Given an array of integers, return indices of the two numbers such that they add up to a specific target.'),
      new Problem('Reverse Intger', 'Given a 32-bit signed integer, reverse digits of an integer.')
    ];

    getProblemsTitle(){
      let res:string[] = [];
      for(const problem of this.problems){
        res.push(problem.title);
      }
      return res;
    }

    getProblemContentByIndex(index:number){
      return this.problems[index].content;
    }

    getProblemByIndex(index:number){
      return this.problems[index];
    }

    appendProblem(problem:Problem){
      this.problems.push(problem);
      this.problemChange.next(this.getProblemsTitle());
    }
    updateProblem(newProblem:Problem,index:number){
      this.problems[index] = newProblem;
      this.problemChange.next(this.getProblemsTitle());
    }
    deleteProblem(index:number){
      this.problems.splice(index,1);
      this.problemChange.next(this.getProblemsTitle());
    }
}
