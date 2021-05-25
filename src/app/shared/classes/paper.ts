import { Word } from '@app/shared/classes/word';

export class Paper_Item {
    key:string;
    title:string;
    contentType:string;
    creators:Array<string>;
    date:number;
    dateAdded:string;
    dateModified:string;
    filename:string;
    itemType:string;
    linkMode:string;
    md5:string;
    note_x:string;
    note_y:string;
    parentItem_x:string;
    parentItem_y:string;
    pdf_file:string;
    tags_x:string;
    tags_y:string;
    top_words:Array<Word>;
    is_selected:boolean;
    topics:Array<any>;
    new:boolean = false;
    weight:number;
    x:number;
    y:number;
    abstract_text:string;
    abstract_x:number;
    abstract_y:number;
    conclusion_x:number;
    conclusion_y:number;
    author1:string;
    author2:string;
    author3:string;
    color:string;
    cluster:string;
    default_color:string;
    xUmap:number;
    yUmap:number;
    distance_moved:number = 0;
    originalX:number = 0;
    originalY:number = 0;
    constructor(
        key,
        title,
        contentType,
        creators,
        year,
        dateAdded,
        dateModified,
        filename,
        itemType,
        linkMode,
        md5,
        note_x,
        note_y,
        parentItem_x,
        parentItem_y,
        pdf_file,
        tags_x,
        tags_y,
        )
        {
        if (year){
            year = year.toString()
        }else{
            year = '';
        }
        this.key = key;
        this.title = title;
        this.contentType = contentType;
        this.creators = creators;
        if (this.creators && this.creators.length>0){
            if (creators[0]) this.author1 = creators[0].firstName[0] + '. ' + creators[0].lastName;
            else this.author1 = '-'
            if (creators[1]) this.author2 = creators[1].firstName[0] + '. ' + creators[1].lastName;
            else this.author2 = '-'
            if (creators[2]) this.author3 = creators[2].firstName[0] + '. ' + creators[2].lastName;
            else this.author3 = '-'
        }else{
            this.author1 = '-'
            this.author2 = '-'
            this.author3 = '-'  
        }
        if (year.split('/').length > 1 ) this.date = new Date(year.split('/')[year.split('/').length-1]).getFullYear();
        else this.date = new Date(year).getFullYear();
        this.dateAdded = dateAdded;
        this.dateModified = dateModified;
        this.filename = filename;
        this.itemType = itemType;
        this.linkMode = linkMode;
        this.md5 = md5;
        this.note_x = note_x;
        this.note_y = note_y;
        this.parentItem_x = parentItem_x;
        this.parentItem_y = parentItem_y;
        this.pdf_file = pdf_file;
        this.tags_x = tags_x;
        this.tags_y = tags_y;
        this.top_words = [];
        this.is_selected = false;
        this.topics = [];
        this.weight = 2;
        this.x = -1000000;
        this.y = -1000000;
        this.default_color = '#43EFC4';
        this.color = this.default_color;
        this.cluster = "";
        // if (this.new) this.color = '#FD5F00';
    }
}
