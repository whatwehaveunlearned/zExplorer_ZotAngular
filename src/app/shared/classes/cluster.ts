import { Paper_Item } from '@app/shared/classes/paper';
import {Subject} from 'rxjs'

export class Cluster {
    key: string;
    name: string;
    papers: Array<Paper_Item>;
    papers_updated: Subject<Array<Paper_Item>>;
    color: string;

    constructor(
        // key,
        name,
        papers,
        color,
        )
    {
        this.key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);;
        this.name = name;
        this.papers_updated = new Subject<Array<Paper_Item>>()
        this.papers = papers;
        this.color = color;
        this.papers_updated.next(this.papers)
    }

    lablePosition(){
        let x = 0;
        let y = 0;
        for(let i=0; i<this.papers.length; i++){
             x = x + this.papers[i].x;
             y = y + this.papers[i].y;
        }
        x = x/this.papers.length;
        y = y/this.papers.length;
        return [x,y]
    }

    subscribe(){
        this.papers_updated.subscribe(newData =>{
            this.lablePosition()
          })
    }
}
