import { Injectable } from '@angular/core';
import {Subject} from 'rxjs'

import { Collection_Item } from '@app/shared/classes/collections';
import { Paper_Item } from '@app/shared/classes/paper';
import { Author } from '@app/shared/classes/author';
import { Word } from '@app/shared/classes/word';

import {DocumentSection} from '@app/shared/classes/document-section';

import { Topic } from '@app/shared/classes/topic'

import {entries} from 'd3-collection'

import * as d3 from 'd3';


@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
 
  
  public socket:WebSocket;
  private response;
  
  //Zotero Importer Collections
  public active_collections: Subject<Array<Collection_Item>> =  new Subject<Array<Collection_Item>>();
  public papers_in_active_collections_updated: Subject<Array<Paper_Item>>;
  public collections: Subject<Array<Collection_Item>>;
  private collection_items = []
  private papers_in_active_collections = []

  public papers_to_add_to_session_updated: Subject<Array<Paper_Item>>
  private papers_to_add_to_session = []

  //Dashboard Collections
  public papers_in_session_updated: Subject<Array<Paper_Item>>
  private papers_in_session = []

  public authors_in_session_updated : Subject<Array<Author>>
  private authors_in_session = []

  public topics_in_session_updated : Subject<Array<Topic>>
  private topics_in_session = []

  public words_in_session_updated : Subject<Array<Word>>
  private words_in_session = []

  public sections_in_session_updated : Subject<Array<DocumentSection>>
  private sections_in_session = []
  

  constructor() {
    //Initialize the Subjects
    this.collections = new Subject<Array<Collection_Item>>()
    this.papers_in_active_collections_updated = new Subject<Array<Paper_Item>>()
    this.papers_to_add_to_session_updated = new Subject<Array<Paper_Item>>()
    this.papers_in_session_updated = new Subject<Array<Paper_Item>>()
    this.authors_in_session_updated = new Subject<Array<Author>>()
    this.topics_in_session_updated = new Subject<Array<Topic>>();
    this.words_in_session_updated = new Subject<Array<Word>>();

    this.sections_in_session_updated = new Subject<Array<DocumentSection>>();
    //Create the communication socket
    // this.socket = new WebSocket("ws://" + window.location.hostname + ":3000");
    this.socket = new WebSocket("ws://" + "0.0.0.0" + ":3000")
    this.socket.onmessage = ((event) => {
      //If we get data  
      this.recieved_data(event)
    })
    this.active_collections.subscribe(selectedCollection =>{
      console.log(this.active_collections)
      let message = {
        'msg':selectedCollection[0].key,
        'type':'collections'
      }
      this.socket.send(JSON.stringify(message))
    })

   }

  addCollection(key:string,name:string,parentCollection:string){
    this.collection_items.push(new Collection_Item (key,name,parentCollection))
  }

  addPapersToAddToSession(paper_list){
    paper_list.forEach((element)=>{
      let data = element
      this.papers_to_add_to_session.push(element)
      this.papers_to_add_to_session_updated.next(this.papers_to_add_to_session);
    })
  }

  addPaperToSession(paper_list){
    paper_list.forEach((element)=>{
      let data = element
      this.papers_in_session.push(element)
      this.papers_in_session_updated.next(this.papers_in_session);
    })
    let message = {
      'msg':paper_list,
      'type':'add_papers'
    }
    this.socket.send(JSON.stringify(message))
  }

  isPaperInSession(ID){
    let this_paper = this.papers_in_session.filter(papers => papers.key === ID)[0]
    if (this_paper) return this_paper
    else return false
  }

  getPapersToAddToSession(){
    return [...this.papers_to_add_to_session]
  }

  getCollections(){
    return [...this.collection_items]
  }

  getPapersActiveCollections(){
    return [...this.papers_in_active_collections]
  }

  getAuthorsInSession(){
    return [...this.authors_in_session]
  }

  processPapers(documents_msg,topics){
    //Processed papers we highlight them and add the projected positions
    let document_collection = JSON.parse(documents_msg)
    let listOfPapers = Object.keys(document_collection['topics'])
    for(let i=0; i < listOfPapers.length; i++){
      //If paper is Paper in session
      let this_paper = this.isPaperInSession(listOfPapers[i])
      if(this_paper){
        this_paper.x = eval(document_collection['vec_2d'][listOfPapers[i]])[0];
        this_paper.y = eval(document_collection['vec_2d'][listOfPapers[i]])[1];
        this_paper.abstract_text = document_collection['abstract'][listOfPapers[i]].split(' ').slice(1).join(' ')//Remove the word abstract:
        this_paper.topics = topics[listOfPapers[i]]
      }else{
        let new_paper = new Paper_Item (document_collection['globalID'][listOfPapers[i]],document_collection['title'][listOfPapers[i]],'paper',document_collection['author'][listOfPapers[i]],document_collection['year'][listOfPapers[i]],'data.dateAdded','data.dateModified',document_collection['pdf_file'][listOfPapers[i]],'data.itemType', 'data.linkMode', 'data.md5', 'data.note_x', 'data.note_y', 'data.parentItem_x', 'data.parentItem_y',' data.pdf_file',document_collection['tags'][listOfPapers[i]],'data.tags_y')
        new_paper.x = eval(document_collection['vec_2d'][listOfPapers[i]])[0];
        new_paper.y = eval(document_collection['vec_2d'][listOfPapers[i]])[1];
        new_paper.abstract_text = document_collection['abstract'][listOfPapers[i]].split(' ').slice(1).join(' ') //Remove the word abstract:
        new_paper.topics = topics[listOfPapers[i]]
        new_paper.new = true
        this.papers_in_session.push(new_paper)
      }
    }
    //Update papers Subject
    this.papers_in_session_updated.next(this.papers_in_session);
  }

  //Update Subjects
  updateSubjects(){
    //Update Subjects
    this.topics_in_session_updated.next(this.topics_in_session)
    this.papers_in_session_updated.next(this.papers_in_session)
    this.words_in_session_updated.next(this.words_in_session)
  }

  recieved_data(event){
    this.response = JSON.parse(event.data);
    if(this.response.type==='collections'){
      this.response.message.forEach((element)=>{
        let data = element.data
        this.addCollection(data.key,data.name,data.parentCollection)
        this.collections.next(this.collection_items)
      })
    }else if(this.response.type==='collection_items'){
      JSON.parse(this.response.message).forEach((element)=>{
        let data = element
        this.papers_in_active_collections.push(new Paper_Item (data.key,data.name,data.contentType,data.creators,data.date,data.dateAdded,data.dateModified,data.fileName,data.itemType, data.linkMode, data.md5, data.note_x, data.note_y, data.parentItem_x, data.parentItem_y, data.pdf_file,data.tags_x,data.tags_y))
        this.papers_in_active_collections_updated.next(this.papers_in_active_collections)
      })
		}else if(this.response.type==='sageBrain_data'){
      //Parse Topic Message
      let topic_message = JSON.parse(this.response.message.doc_topics.topic_params)

      //Process Papers
      this.processPapers(this.response.message.documents,topic_message)      
      
      // //Update sections Subject
      // this.sections_in_session_updated.next(this.sections_in_session);
      
      //Update Topics
      let collection_topics_order = this.response.message.doc_topics.order;
      let collection_topics = JSON.parse(this.response.message.doc_topics.topics);
      let topic_weigts = topic_message["weight"];
      let response_topics_length = collection_topics_order.length - 1;
      //Store previous topics to update the ones that stay with the new words
      let topics_previous = this.topics_in_session;
      //Clear topics
      this.topics_in_session = [];
      collection_topics_order.forEach((position,index)=>{
        if(position!== "pos"){
          let data:Array<any> = Object.values(collection_topics[position]).filter(word => word !== null);
          let topic_exemplar = [];
          //Get first exemplar to check
          for(let word_topic_index=0 ; word_topic_index < data.length;word_topic_index++){
            if (data[word_topic_index].split('*').length > 1){
              if(topic_exemplar.length === 0) topic_exemplar.push(data[word_topic_index].split('*')[0])
            }
          }
          this.topics_in_session.push(new Topic(index, position, collection_topics[position], topic_weigts[index]));
          //Push data to subject once its completely uploaded
          if(response_topics_length === index){
            this.topics_in_session_updated.next(this.topics_in_session);
          } 
        }

      })
      let collection_words = JSON.parse(this.response.message.doc_topics.words)
      let response_length = collection_words.length - 1
      collection_words.forEach((element,index)=>{
        let data = element
        //Check  if word is already in session
        let word_in_collection = this.words_in_session.filter(words => words.word === data.word)
        if(word_in_collection.length > 0){
          //Update word in session
          word_in_collection[0].C = data.C
          word_in_collection[0].count = data.count
          word_in_collection[0].exemplar = data.exemplar
          word_in_collection[0].pos = data.pos
          word_in_collection[0].sigma_nor = data.sigma_nor
          word_in_collection[0].topic = data.topic
          word_in_collection[0].vector = data.vector
          word_in_collection[0].vocab_index = data.vocab_index
          word_in_collection[0].x = data.x2D
          word_in_collection[0].y = data.y2D
        }else{
          //add word to session
          this.words_in_session.push(new Word(data.C,data.count,data.exemplar,data.pos,data.sigma_nor,data.topic,data.vector,data.vocab_index,data.word,data.x2D,data.y2D,data.threshold));
        }
      })

      //Here I need to Add the Authors, Years and Topics
      // this.papers_in_session = this.papers_to_add_to_session;
      // this.papers_in_session.next(this.papers_to_add_to_session)

      //Map the papers to the specific session topics
      this.mapTopicsToPapersNewData();
      console.log('order Topics by importance')
      this.orderByImportance(this.topics_in_session);
      console.log('order Papers by importance')
      // this.orderByImportance(this.papers_in_session);
      this.updateSubjects()
    }else if(this.response.type==='update_model'){
      //Process Papers
      this.processPapers(this.response.message.documents,this.topics_in_session);
      this.updateSubjects()
    }
  }

  recalculateWeights(){
    let collection = this;
    console.log('here')
    //Set all weights to 0 first
    for(let paper_index=0; paper_index < this.papers_in_session.length; paper_index++){
      this.papers_in_session[paper_index].weight = 0
    }
    //Loop oper topics and assign weights back to papers
    for(let topic_index=0; topic_index < this.topics_in_session.length; topic_index++){
      let papers_in_topic = this.topics_in_session[topic_index].papers
      //Loop over papers in each topic
      for (let paper_in_topic_index=0; paper_in_topic_index < papers_in_topic.length; paper_in_topic_index++){
        let paper = this.papers_in_session.filter(papers => papers.key === papers_in_topic[paper_in_topic_index].id)[0]
        //If weight was not cero
        if( papers_in_topic[paper_in_topic_index].weight!==0){
          paper['weight'] = paper['weight'] + this.topics_in_session[topic_index].weight;
        }
        // }else{
        //   paper['weight'] = paper['weight'] + papers_in_topic[paper_in_topic_index].weight
        // }
      }
    }
    this.papers_in_session_updated.next(this.papers_in_session)
  }

  mapTopicsToPapersNewData(){
    console.log()
    let topic_params = JSON.parse(this.response.message.doc_topics.topic_params);
    let document_collection = JSON.parse(this.response.message.documents)
    for (let paper_index=0; paper_index < this.papers_in_session.length; paper_index++){
      let PaperID = this.papers_in_session[paper_index].key;
      let dictionary = topic_params[this.papers_in_session[paper_index].key]
      let dictionary_keys = Object.keys(dictionary)
      let weight_values = dictionary_keys.map(function(key){
          return dictionary[key];
      });
      this.papers_in_session[paper_index].weight = weight_values.reduce((a,b)=>a +b,0);
      for(let i=0; i< dictionary_keys.length;i++){
        let paper_topic_obj = {
          'id':PaperID,
          'weight':dictionary[dictionary_keys[i]]
        }
        this.topics_in_session[dictionary_keys[i]].papers.push(paper_topic_obj)
      }
      // this.papers_in_session[paper_index].topics = Object.keys(topic_params[this.papers_in_session[paper_index].key]);
      this.papers_in_session[paper_index].topics = dictionary
    }
  }

  //Storts topics or papers by importance based on the weight calculated from sigma_nor values
  orderByImportance(object_to_order){
    object_to_order.sort(function(a,b){return (a.weight-b.weight) * -1}) //We use the -1 to inverse and get max to min
  }

  //Affects the sigma nor of the words based on the interactions performed
  changeImportance(topic,type,topic_index){
    let previous_position_weight;
    let next_position_weight;
    let new_topic_weight;
    if(type=='drop'){
      if( topic_index === this.topics_in_session.length-1){//If we move to last
        console.log('To last')
        // next_position_weight = 0.1;
        previous_position_weight = this.topics_in_session[this.topics_in_session.length-1].weight
      } else if(topic_index === 0){ //We move to first
        console.log('To first')
        // next_position_weight = this.topics_in_session[topic_index + 1].weight
        previous_position_weight = this.topics_in_session[0].weight + 0.1
      } else{ //We move anywhere else
        console.log('To: ' + topic_index)
        // next_position_weight = this.topics_in_session[topic_index + 1].weight
        previous_position_weight = this.topics_in_session[topic_index - 1].weight
      }
      //Get all the other topics
      this.topics_in_session = this.topics_in_session.filter(topics => topics.id !== topic.id)
      //Set new weight for topic
      let words_in_topic = topic.words.map(topics => topics.word)
      // new_topic_weight = previous_position_weight +( (previous_position_weight - next_position_weight)/2 )
      new_topic_weight = previous_position_weight;
      topic.weight = new_topic_weight;
      //push topic to proper position
      this.topics_in_session.splice(topic_index, 0, topic);
      // //Get old words weights in topic
      // let test_words_in_session = this.words_in_session
      // let new_weights = []
      // let words_object_from_session = []
      // for(let word_index=0; word_index < words_in_topic.length; word_index++){
      //   let selected_word = this.words_in_session.filter(words => words.word === words_in_topic[word_index])[0];
      //   words_object_from_session.push(selected_word)
      //   new_weights.push(selected_word.sigma_nor)
      // }
      // //Reasign new weights for words in topic
      // this.reasign_weights(words_object_from_session,new_weights, new_topic_weight);
      // //Recalculate topic weights
      // // this.calculateTopicWeight()
    }else if(type=='cross'){
      //Delete topic from session
      this.topics_in_session = this.topics_in_session.filter(topics => topics.id !== topic.id)
    }else if(type=='increase'){
      topic.weight = topic.weight + 1;
    }else if(type=='decrease'){
      if(topic.weight!==0) topic.weight = topic.weight - 1;
    }
    //ReAssign topics to papers with new weights
    this.recalculateWeights();
    //Reorder again Might be causing the problem replotting everythin
    // this.orderByImportance(this.papers_in_session);
    this.orderByImportance(this.topics_in_session);
    //Update Subjects
    this.topics_in_session_updated.next(this.topics_in_session)
    this.papers_in_session_updated.next(this.papers_in_session)
    this.words_in_session_updated.next(this.words_in_session)
    console.log('Change importance')
  }

  reasign_weights(words, word_weights, new_topic_weight){
    //get max
    let max = Math.max.apply(null,word_weights)
    //get min
    let min = Math.min.apply(null,word_weights)
    //Scale 0-1 and Multiply by new_topic_weight and divide by length so sum is = to new_topic_weight
    for(let weight_index=0; weight_index < word_weights.length; weight_index++){
      // words[weight_index].sigma_nor = ( (word_weights[weight_index] - min) / (max - min) ) * new_topic_weight/word_weights.length;
      words[weight_index].sigma_nor = ( (word_weights[weight_index] - min) / (max - min) ) * new_topic_weight;
    }
    console.log('here')
  }

  update_position(data,new_x,new_y){
    // for( let i=0; i<this.papers_in_session.length; i++ ){

    //   if ( this.papers_in_session[i].key === data.key ){
    //     this.papers_in_session[i].x = new_x
    //     this.papers_in_session[i].y = new_y
    //   }
    // }
    let paper = this.papers_in_session.filter(papers => papers.key === data.key)[0]
    this.papers_in_session = this.papers_in_session.filter(papers => papers.key !== data.key)
    paper.x = new_x
    paper.y = new_y
    this.papers_in_session.push(paper)
    // this.papers_in_session_updated.next(this.papers_in_session)
  }

  search_arxiv(){
    //Function to search additional papers in arxiv from sageBrain session
    let message = {
      'msg':{'papers':this.papers_in_session, 'topics':this.topics_in_session},
      'type':'search_arxiv'
    }
    this.socket.send(JSON.stringify(message))
  }

  update_model(){
    //Function to update model using Encoder in sageBrain session to mimic user input
    let message = {
      'msg':{'papers':this.papers_in_session},
      'type':'update_model'
    }
    this.socket.send(JSON.stringify(message))
  }
  

  //Get Session Data
  getSessionPapers():Array<Paper_Item>{
    return [...this.papers_in_session]; //Returns a new array of paper Items protects the internal array
  }
  getSessionTopics():Array<Topic>{
    return [...this.topics_in_session]; //Returns a new array of topic Items protects the internal array
  }
  getSessionWords():Array<Word>{
    return [...this.words_in_session]; //Returns a new array of word Items protects the internal array
  }
  getSessionSections():Array<DocumentSection>{
    return [...this.sections_in_session]; //Returns a new array of section Items protects the internal array
  }
}