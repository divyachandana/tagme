import { Component, OnInit, HostListener, NgZone } from '@angular/core';
// import data from './storeddata.json';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
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

    jsonData : any = [];
    jsonDataLen = 0;
    imagePrevIndex = -1;
    imageCurrIndex = 0;
    imageNextIndex = 1;

    isMouseHoveredonNotes:boolean = false;
    timerInterval;
    showtxtFileData = [];
    txtFileData = [];
    csvData = [];
    toggleText : String = 'show';
    checked : boolean = true;
    allowMultiTags : boolean = true;
    dummyData : any = [
      {"imageUrl" : "./assets/1.jpg", "keyTag":[2,3,4], "notes":"" ,"timeSpent":0,"multiTag":false},
      {"imageUrl" : "./assets/2.jpeg", "keyTag":[], "notes":"" ,"timeSpent":0,"multiTag":false},
      {"imageUrl" : "./assets/3.jpg", "keyTag":[], "notes":"" ,"timeSpent":0,"multiTag":false},
      // {"imageUrl" : "./assets/4.jpeg", "keyTag":[], "notes":"" ,"timeSpent":0,"multiTag":false}
  ]
  // ------- variable declarations END----------


  constructor(public htpclt:HttpClient, public cdref:ChangeDetectorRef, public ngzone:NgZone) {
    this.readCsvData();
   }

   assignDataInit(myData){
    this.jsonData = myData.length >0 ? myData : this.dummyData;
    this.jsonDataLen = this.jsonData.length;
    if(this.jsonData.length>0){
      for(let i=0;i<this.jsonData.length;i++){
        if(this.jsonData[i].keyTag.length == 0) {
          // special cases for first image
          if(i==0) break

          this.imagePrevIndex = i-1;
          this.imageCurrIndex = i;
          this.imageNextIndex = i+1;
          break
        }
      }

      // if()
    }
   }

   startTimeInterval(){
    this.timerInterval = setInterval(()=>{
      if(!this.jsonData[this.imageCurrIndex].timeSpent) this.jsonData[this.imageCurrIndex].timeSpent = 0
      this.jsonData[this.imageCurrIndex].timeSpent += 1;
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
                // let index = this.txtFileData.map((x)=>x.key).indexOf(this.alphaNumericKeys[value]);
                let isexists = ""
                for(let i=0;i<this.txtFileData.length;i++){
                  if(this.txtFileData[i][this.alphaNumericKeys[value]]) {
                    this.ngzone.run( () => {
                    // this.cdref.detectChanges();
                    // setTimeout(()=>{
                      if(!this.jsonData[this.imageCurrIndex].multiTag){
                        this.jsonData[this.imageCurrIndex].keyTag = []
                      }
                      this.jsonData[this.imageCurrIndex].keyTag.push(this.txtFileData[i][this.alphaNumericKeys[value]])

                    // },100)
                    isexists = this.txtFileData[i][this.alphaNumericKeys[value]]
                    })
                    break
                  }
                }
                if(!isexists){
                  this.ngzone.run( () => {
                  // this.cdref.detectChanges();
                  // setTimeout(()=>{
                    if(!this.jsonData[this.imageCurrIndex].multiTag){
                      this.jsonData[this.imageCurrIndex].keyTag = []
                    }
                    this.jsonData[this.imageCurrIndex].keyTag.push(this.alphaNumericKeys[value]);

                  // })
                  })
                }


                  // console.log(this.jsonData);
                // })
                if(this.checked){ 
                  // debugger
                  if(this.jsonData[this.imageCurrIndex].multiTag){                    
                  } else {                    
                    setTimeout(()=>{
                      this.gotoNext();},100)
                  }                 
                }

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


  navigate(i,id){
    this.imagePrevIndex = i<=0 ? -1 : i-1
    this.imageNextIndex = i+1
    this.imageCurrIndex = i;
    // let el = document.getElementById(id);
    // el.scrollIntoView({behavior: 'smooth'});
    // debugger
    
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

  delete(i){
    this.jsonData[this.imageCurrIndex].keyTag.splice(i,1);
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
    let fileName = 'sample.csv';
    saveAs(blob, fileName);
  }


  readCsvData () {
    this.htpclt.get('./assets/sample.csv',{responseType:'text'})
    .subscribe(data=>{

      // ---------------------- 
      let csvData = data;
      let allTextLines = csvData.split(/\r\n|\n/);
      let headers = allTextLines[0].split(',');
      let lines = [];
  
      for ( let i = 0; i < allTextLines.length; i++) {
          // split content based on comma
          if(i==0) continue;
          let data = allTextLines[i].split(',');
          let tarr = [];
          // if (data.length == headers.length) {
              let aObj = {};
              for ( let j = 0; j < headers.length; j++) {
                  let removeExtraQuotes = data[j] ?  data[j].replace(/"/g,'') : data[j]
                  if(headers[j]== 'keyTag'){
                    if(!removeExtraQuotes) {
                      aObj[headers[j].replace(/"/,'')] = []
                    } else {
                      aObj[headers[j].replace(/"/,'')] = data[j].replace(/"/g,'').split(';')
                    }
                  } else {
                    aObj[headers[j].replace(/"/,'')] = data[j] ? data[j].replace(/"/g,'') : data[j]
                  }
              }
              // tarr.push(aObj);

          // }
          lines.push(aObj);

      }
      console.log(lines);
      this.csvData = lines;
      this.assignDataInit(this.csvData);
      this.readtxtFile();
      this.startTimeInterval();
      // ----------------------

    }, err => {
      console.log("ERROR", err);
    })
  }

  
}
