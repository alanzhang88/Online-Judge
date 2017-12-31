

import { Problem } from "./problem.model";

export class ProblemService{
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
}
