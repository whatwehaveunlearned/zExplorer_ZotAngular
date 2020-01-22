export class Topic {
    id:number; //Unique identifier for full session
    index:number; //Identifier for each import used to map papers and topics
    order:number;
    words:Array<any> = [];
    isSelected:boolean;
    isLabelBeingEdited:false;
    labels = []; //Stores topic labels
    visibility:String = 'visible'; //I dont know if I use this anymore
    papers:Array<any>
    weight:number;//Represents the importance of the topic based on sigma values

    constructor(index,order,topic_words_dic, weight){
        this.id = Math.random() * 1000000000000000000; //Give it a random id. Because Its used as selector it can not have decimals
        this.index = index;
        this.isSelected = false;
        this.order = parseInt(order);
        this.papers = [];
        this.update_words(topic_words_dic)
        this.weight = weight
    }

    update_words(dictionary_of_words){
        this.words = [];
        let exemplar;
        for (let key in dictionary_of_words) {
            if (key !=='NAN'){
                if(dictionary_of_words[key]!==null){
                    if (dictionary_of_words[key][dictionary_of_words[key].length-1]==='*'){
                        dictionary_of_words[key] = dictionary_of_words[key].substring(0, dictionary_of_words[key].length-1)
                        exemplar = true;
                        //We add the first exemplar as label
                        if (this.labels.length < 1) this.labels.push({name:dictionary_of_words[key]})
                    }else{
                        exemplar = false;
                    }
                    let this_word = {
                        'word':dictionary_of_words[key],
                        'exemplar':exemplar, 
                    }
                    this.words.push(this_word);
                }
            }
        }
    }
}
