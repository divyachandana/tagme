import { Component, OnInit, HostListener } from '@angular/core';
import data from './storeddata.json';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-keytagme',
  templateUrl: './keytagme.component.html',
  styleUrls: ['./keytagme.component.css']
})
export class KeytagmeComponent implements OnInit {
  // ------- variable declarations START ----------
    alphaNumericKeys : any = {
      48 : 0,
      49 : 1,
      50 : 2,
      51 : 3,
      52 : 4,
      53 : 5,
      54 : 6,
      55 : 7,
      56 : 8,
      57 : 9,
      65 : "a",
      66 : "b",
      67 : "c",
      68 : "d",
      69 : "e",
      70 : "f",
      71 : "g",
      72 : "h",
      73 : "i",
      74 : "j",
      75 : "k",
      76 : "l",
      77 : "m",
      78 : "n",
      79 : "o",
      80 : "p",
      81 : "q",
      82 : "r",
      83 : "s",
      84 : "t",
      85 : "u",
      86 : "v",
      87 : "w",
      88 : "x",
      99 : "y",
      90 : "z",
    }

    arrowKeys:any = {
      37 : 'arrow left',
      38 : 'arrow up',
      39 : 'arrow right',
      40 : 'arrow down',
      
    }

    enterKey : any = {
      13 : 'enter'
    }

    jsonData : any = data;
    jsonDataLen = this.jsonData.length;
    imagePrevIndex = -1;
    imageCurrIndex = 0;
    imageNextIndex = 1;

    isMouseHoveredonNotes:boolean = false;
    timerInterval;
    showtxtFileData = [];
    txtFileData = [];
    toggleText : String = 'show';
  // ------- variable declarations END----------


  constructor(public htpclt:HttpClient) {

    this.readtxtFile();

    this.startTimeInterval();

    

   }

   startTimeInterval(){
    this.timerInterval = setInterval(()=>{
      this.jsonData[this.imageCurrIndex].timeSpent +=1;
      // console.log(this.jsonData);
    },1000);
   }

   stopTimeInterval(){
     clearInterval(this.timerInterval);
   }

  @HostListener('window:keyup',['$event'])
  keyEvent(event:KeyboardEvent){

          Object.keys(this.alphaNumericKeys).forEach((value)=>{
            if(parseInt(value) === event.keyCode){
              // alert("You clicked :: " + event.keyCode + ':' + this.alphaNumericKeys[value]);
              if(this.isMouseHoveredonNotes){
                console.log(this.jsonData[this.imageCurrIndex]);
              } else {
                this.jsonData[this.imageCurrIndex].keyTag.push(this.alphaNumericKeys[value]);
                console.log(this.jsonData);
              }
            }
          })

          Object.keys(this.arrowKeys).forEach((value)=>{
            if(parseInt(value) === event.keyCode){
              // alert("You clicked :: " + event.keyCode + ':' + this.arrowKeys[value]);
              if(event.keyCode == 37){
                this.gotoPrev();
              }
              if(event.keyCode == 39){
                this.gotoNext();
              }
            }
          })

          Object.keys(this.enterKey).forEach((value)=>{
            if(parseInt(value) === event.keyCode){
              if(this.isMouseHoveredonNotes){
                console.log(this.jsonData[this.imageCurrIndex]);
              } else {
                this.downloadCSVFile();
                // alert("You clicked :: " + event.keyCode + ':' + this.enterKey[value]);
              }
            }
          })

  }

  // @HostListener('window:mouseup',['$event'])
  mouseHover(e) {
    this.isMouseHoveredonNotes = true;
    // console.log('hovered', e);
  }
  mouseLeave(e){
    this.isMouseHoveredonNotes = false;
    // console.log('leave', e);

  }


  ngOnInit() {

  }

  gotoNext(){

    if(this.imageCurrIndex == this.jsonData.length-1){
      // this.stopTimeInterval();
      alert("Hurray! you have finished");
      // this.imagePrevIndex = -1;
      // this.imageCurrIndex = 0;
      // this.imageNextIndex = 1;
    } else {
      this.imagePrevIndex = this.imageCurrIndex;
      this.imageCurrIndex++;
      this.imageNextIndex = this.imageCurrIndex + 1;
    }

  }

  gotoPrev(){
    if(this.imageCurrIndex == 0){
      alert("Click Next");
    } else {
      this.imageNextIndex = this.imageCurrIndex;
      this.imageCurrIndex--;
      this.imagePrevIndex = this.imageCurrIndex - 1;

    }

  }

  readtxtFile(){
    this.htpclt.get('./assets/tags.txt',{responseType:'text'})
    .subscribe(data=>{
      console.log(typeof(data));
      let fdata = data.split('\n');
      this.showtxtFileData = fdata
      console.log(fdata);
      this.txtFileData = [];
      fdata.forEach(ele=>{
        let fele = ele.split(':')
        let o = {};
        o[fele[0].trim()] = fele[1].trim();
        this.txtFileData.push(o);
      })
      console.log(this.txtFileData);
    }, err => {
      console.log("ERROR", err);
    })
  }

  toggle(){
    this.toggleText = this.toggleText == 'show' ? this.toggleText='hide' : this.toggleText='show';
  }


  downloadCSVFile(){
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(this.jsonData[0]);
    let csv = this.jsonData.map(row => {
      return header.map(fieldname=> {
        let data = fieldname == 'keyTag' ? row[fieldname].join(';') : row[fieldname];
        return JSON.stringify(data,replacer)
      }).join(',')
    });
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    let d = new Date().toDateString();
    let fileName = '' + d + new Date().toTimeString() + '.csv';
    saveAs(blob, fileName);
  }

  

}
