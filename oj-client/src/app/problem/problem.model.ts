export class Problem{
  public title: string;
  public content: string;
  public hasRestoration: boolean;
  public restoreLang: string;
  public restoreCode: string;

  constructor(title:string, content: string){
    this.title = title;
    this.content = content;
    this.hasRestoration = false;
    this.restoreLang = null;
    this.restoreCode = null;
  }

  setRestoration(restoreLang:string,restoreCode:string){
    this.hasRestoration = true;
    this.restoreLang = restoreLang;
    this.restoreCode = restoreCode;
  }

  resetRestoration(){
    this.hasRestoration = false;
    this.restoreLang = null;
    this.restoreCode = null;
  }
}
