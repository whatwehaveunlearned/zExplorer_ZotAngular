import { Paper_Item } from '@app/shared/classes/paper';

export class DocumentSection {
    key:string;
    document:string;
    title:string;
    content:string;
    x:number;
    y:number;
    type:string;
    weight:number

    constructor(
        key,
        title,
        content,
        x,
        y,
        type
        )
        {
        this.key = key + '_' + type;
        this.document = key; 
        this.title = title;
        this.content = content;
        this.x = x;
        this.y = y;
        this.weight = 5;
        this.type=type;
    }
}
