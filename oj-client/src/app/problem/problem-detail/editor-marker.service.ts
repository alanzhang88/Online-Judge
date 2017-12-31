export class EditorMarkerService{
  session: any;
  cursors: {row:number,column:number,id:string}[] = [];//{row: 1, column: 10, id:"asdasdasd"}
  added = false;

  setSession(session:any){
    this.session = session;
    if(!this.added){
      this.session.addDynamicMarker(this,true);
      this.added = true;
    }
  }

  update(html:any, markerLayer:any, session:any, config:any){
    let start = config.firstRow, end = config.lastRow;
    // let cursors = this.cursors;
    for (var i = 0; i < this.cursors.length; i++) {
        var pos = this.cursors[i];
        if (pos.row < start) {
            continue;
        } else if (pos.row > end) {
            break;
        } else {
            // compute cursor position on screen
            // this code is based on ace/layer/marker.js
            var screenPos = session.documentToScreenPosition(pos.row,pos.column);

            var height = config.lineHeight;
            var width = config.characterWidth;
            var top = markerLayer.$getTop(screenPos.row, config);
            var left = markerLayer.$padding + screenPos.column * width;
            // can add any html here
            html.push(
                "<div class='MyCursorClass' style='",
                "position: absolute;",
                "border-left: 2px solid gold;","height:", height, "px;",
                "top:", top, "px;",
                "left:", left, "px; width:", width, "px'></div>"
            );
        }
    }
  }

  redraw(){
    this.session._signal("changeFrontMarker");
  }

  addCursor(cursor:{row:number,column:number,id:string}){
    this.cursors.push(cursor);
    this.redraw();
  }

  deleteCursor(socket_id:string){
    this.cursors = this.cursors.filter((cursor)=>{
      return cursor.id !== socket_id;
    });
    this.redraw();
  }

  updateCursor(cursor){
    let i = 0;
    for( ; i < this.cursors.length; i++){
      if(this.cursors[i].id === cursor.id){
        this.cursors[i] = cursor;
        break;
      }
    }
    if (i === this.cursors.length){
      this.addCursor(cursor);
    }
    this.redraw();
  }



}
