import { Component, OnInit, HostListener, NgZone } from '@angular/core';
// import data from './storeddata.json';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { UploadService } from '../services/upload.service';
import S3 from 'aws-sdk/clients/s3';
// import {AngularFireModule} from 'angularfire2';
// for auth    
// import {AngularFireAuthModule} from 'angularfire2/auth';
// for database
import { AngularFireDatabase } from '@angular/fire/database';

import {AngularFireList} from 'angularfire2/database';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewChild,ElementRef } from '@angular/core'

// class myTags {
//   constructor(public title) { }
// }
@Component({
  selector: 'app-keytagme',
  templateUrl: './keytagme.component.html',
  styleUrls: ['./keytagme.component.css']
})
export class KeytagmeComponent implements OnInit {
  selectedFiles: any;

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

    jsonDataLen = 0;
    imagePrevIndex = -1;
    imageCurrIndex = 0;
    imageNextIndex = 1;

    isMouseHoveredonNotes:boolean = false;
    timerInterval;
    showtxtFileData = [];
    txtFileData = [];
    toggleText : String = 'show';
    checked : boolean = true;
    allowMultiTags : boolean = true;
    isclear : boolean = false;
  //   dummyData : any = [
  //     {"imageUrl" : "./assets/1.jpg", "keyTag":[2,3,4], "notes":"" ,"timeSpent":0,"multiTag":false},
  //     {"imageUrl" : "./assets/2.jpeg", "keyTag":[], "notes":"" ,"timeSpent":0,"multiTag":false},
  //     {"imageUrl" : "./assets/3.jpg", "keyTag":[], "notes":"" ,"timeSpent":0,"multiTag":false},
  //     // {"imageUrl" : "./assets/4.jpeg", "keyTag":[], "notes":"" ,"timeSpent":0,"multiTag":false}
  // ]
  // ------- variable declarations END----------

  tags: any = [];
  itemsRef: AngularFireList<any>;
  courses$: Observable<any[]>;
  @ViewChild("myInput", {static: false}) private _inputElement: ElementRef;


  constructor(public htpclt:HttpClient, 
    public cdref:ChangeDetectorRef, 
    public ngzone:NgZone,
    private uploadService: UploadService,
    db: AngularFireDatabase) 
    {
      this.itemsRef = db.list('tags');
      this.courses$ = this.itemsRef.snapshotChanges()
      .pipe(map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() 
        }));
      }));

      let that  = this
      this.courses$.subscribe(data=>{ 
        data.forEach((item) => {
          if(item['keyTagStr'].length >0){
            item['keyTag'] = item['keyTagStr'].split(';')
          } else {
            item['keyTag'] = []
          }
        })
        this.tags = data;
        // console.log(this.tags)
        that.jsonDataLen = data.length

      })
      that.assignDataInit();
      that.readtxtFile();
      that.startTimeInterval();
// debugger
      


   }


addItem(data) {
  this.itemsRef.push(data);
}

updateItem(key: string, dataObj) {
  this.itemsRef.update(key, dataObj);
}

deleteItem(key: string) {
  this.itemsRef.remove(key);
}

deleteEverything() {
  this.itemsRef.remove();
}

focusOnNotes(){
  this._inputElement.nativeElement.focus();
}

assignDataInit(){
    // this.jsonData = myData.length >0 ? myData : [];
    // this.jsonDataLen = this.jsonData.length;
    // this.getTagsLen()
    // let that = this;
    if(this.jsonDataLen>0){
      // this.tags.subscribe(result =>{
        // debugger
          for(let i=0;i<this.jsonDataLen;i++){
            if(this.tags[i].keyTag.length == 0) {
              // special cases for first image
              if(i==0) break
    
              this.imagePrevIndex = i-1;
              this.imageCurrIndex = i;
              this.imageNextIndex = i+1;
              break
            }
          }

      // })


    }
   }

   getTagsLen(){
     this.jsonDataLen = this.tags.length;
   }

   startTimeInterval(){
     if(this.jsonDataLen >0){
      this.timerInterval = setInterval(()=>{
      // if(this.tags[this.imageCurrIndex].timeSpent <=0) this.tags[this.imageCurrIndex].timeSpent = 0
      this.tags[this.imageCurrIndex].timeSpent += 10;
      let k = this.tags[this.imageCurrIndex].key;
      let obj = {timeSpent : this.tags[this.imageCurrIndex].timeSpent}
      this.updateItem(k,obj)
      // let currKey = this.tags[this.imageCurrIndex].key;
      // this.tags[]
      // console.log(this.jsonData);
    },10000);
  }
   }

   stopTimeInterval(){
     clearInterval(this.timerInterval);
   }

  @HostListener('window:keyup',['$event'])
  keyEvent(event:KeyboardEvent){

          Object.keys(this.alphaNumericKeys).forEach((value)=>{
            if(parseInt(value) === event.keyCode){
              if(this.isMouseHoveredonNotes){
                console.log(this.tags[this.imageCurrIndex]);
              } else {
                // let index = this.txtFileData.map((x)=>x.key).indexOf(this.alphaNumericKeys[value]);
                let isexists = ""
                for(let i=0;i<this.txtFileData.length;i++){
                  if(this.txtFileData[i][this.alphaNumericKeys[value]]) {
                    this.ngzone.run( () => {
                    // this.cdref.detectChanges();
                    // setTimeout(()=>{
                      if(!this.tags[this.imageCurrIndex].multiTag){
                        this.tags[this.imageCurrIndex].keyTag = []
                        this.tags[this.imageCurrIndex].keyTagStr = ""
                        let obj = {keyTagStr: ""}
                        this.updateItem(this.tags[this.imageCurrIndex].key,obj)
                      }
                      this.tags[this.imageCurrIndex].keyTag.push(this.txtFileData[i][this.alphaNumericKeys[value]])
                      this.tags[this.imageCurrIndex].keyTagStr = this.tags[this.imageCurrIndex].keyTag.join(';')
                      let obj = {keyTagStr: this.tags[this.imageCurrIndex].keyTagStr}
                      this.updateItem(this.tags[this.imageCurrIndex].key,obj)
                      // localStorage.setItem("tagMeData",JSON.stringify(this.jsonData))

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
                    if(!this.tags[this.imageCurrIndex].multiTag){
                      this.tags[this.imageCurrIndex].keyTag = []
                      this.tags[this.imageCurrIndex].keyTagStr = ""
                      let obj = {keyTagStr: ""}
                      this.updateItem(this.tags[this.imageCurrIndex].key,obj)
                    }
                    this.tags[this.imageCurrIndex].keyTag.push(this.alphaNumericKeys[value]);
                    this.tags[this.imageCurrIndex].keyTagStr = this.tags[this.imageCurrIndex].keyTag.join(';')
                    let obj = {keyTagStr: this.tags[this.imageCurrIndex].keyTagStr}
                    this.updateItem(this.tags[this.imageCurrIndex].key,obj)
                    // localStorage.setItem("tagMeData",JSON.stringify(this.jsonData))


                  // })
                  })
                }


                  // console.log(this.jsonData);
                // })
                if(this.checked){ 
                  // debugger
                  if(this.tags[this.imageCurrIndex].multiTag){                    
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
                // console.log(this.jsonData[this.imageCurrIndex]);
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
    let obj = {notes: this.tags[this.imageCurrIndex].notes}
    this.updateItem(this.tags[this.imageCurrIndex].key,obj)

  }

  ngOnInit() {}

  gotoNext(){
    // this.updateTime();

    if(this.imageCurrIndex == this.jsonDataLen-1){
      alert("Hurray! you have finished");
    } else {
      this.imagePrevIndex = this.imageCurrIndex;
      this.imageCurrIndex++;
      this.imageNextIndex = this.imageCurrIndex + 1;
    }
  }

  gotoPrev(){
    // this.updateTime();
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
  }

  // updateTime(){
  //   let k = this.tags[this.imageCurrIndex].key;
  //   let obj = {timeSpent : this.tags[this.imageCurrIndex].timeSpent}
  //   this.updateItem(k,obj)
  // }

  toggle(){
    this.toggleText = this.toggleText == 'show' ? this.toggleText='hide' : this.toggleText='show';
  }

  delete(i){
    this.tags[this.imageCurrIndex].keyTag.splice(i,1);
    this.tags[this.imageCurrIndex].keyTagStr = this.tags[this.imageCurrIndex].keyTag.join(";")
    let k = this.tags[this.imageCurrIndex].key
    let obj = {keyTagStr : this.tags[this.imageCurrIndex].keyTagStr}
    this.updateItem(k,obj)
  }


  onNativeChange(e) { // here e is a native event
    let k = this.tags[this.imageCurrIndex].key
    let obj = {multiTag : e.target.checked}
    this.updateItem(k, obj)
  }

  downloadCSVFile(){
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    let header_all = Object.keys(this.tags[0]);
    // header.splice(0,1)
    let header = header_all.filter(e => e !== 'key')
     header = header.filter(e => e !== 'keyTagStr')

    let csv = this.tags.map(row => {
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

  upload() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.uploadService.uploadFile( this.selectedFiles[i]);
      let d_obj = {}
            let f_name = "https://s3.amazonaws.com/tagmeimages/"+ this.selectedFiles[i].name
            d_obj['imageUrl'] = f_name
            d_obj['keyTag'] = []
            d_obj['keyTagStr'] = ""
            d_obj['notes'] = ""
            d_obj['timeSpent'] = 0
            d_obj['multiTag'] = false
            this.addItem(d_obj)
    }
      this.getTagsLen()
  }
    
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }


  readtxtFile(){
      this.htpclt.get('./assets/tags.txt',{responseType:'text'})
      .subscribe(data=>{
        // console.log(typeof(data));
        let fdata = data.split('\n');
        this.showtxtFileData = fdata
        // console.log(fdata);
        this.txtFileData = [];
        fdata.forEach(ele=>{
          let fele = ele.split(':')
          let o = {};
          o[fele[0].trim()] = fele[1].trim();
          this.txtFileData.push(o);
        })
        // console.log(this.txtFileData);
      }, err => {
        console.log("ERROR", err);
      })
    }
  
}

  // readCsvData () {
  //   this.htpclt.get('./assets/sample.csv',{responseType:'text'})
  //   .subscribe(data=>{

  //     // ---------------------- 
  //     let csvData = data;
  //     let allTextLines = csvData.split(/\r\n|\n/);
  //     let headers = allTextLines[0].split(',');
  //     let lines = [];
  
  //     for ( let i = 0; i < allTextLines.length; i++) {
  //         // split content based on comma
  //         if(i==0) continue;
  //         let data = allTextLines[i].split(',');
  //         let tarr = [];
  //         // if (data.length == headers.length) {
  //             let aObj = {};
  //             for ( let j = 0; j < headers.length; j++) {
  //                 let removeExtraQuotes = data[j] ?  data[j].replace(/"/g,'') : data[j]
  //                 if(headers[j]== 'keyTag'){
  //                   if(!removeExtraQuotes) {
  //                     aObj[headers[j].replace(/"/,'')] = []
  //                   } else {
  //                     aObj[headers[j].replace(/"/,'')] = data[j].replace(/"/g,'').split(';')
  //                   }
  //                 } else {
  //                   aObj[headers[j].replace(/"/,'')] = data[j] ? data[j].replace(/"/g,'') : data[j]
  //                 }
  //             }
  //             // tarr.push(aObj);

  //         // }
  //         lines.push(aObj);

  //     }
  //     console.log(lines);
  //     this.csvData = lines;
  //     this.assignDataInit(this.csvData);
  //     this.readtxtFile();
  //     this.startTimeInterval();
  //     // ----------------------

  //   }, err => {
  //     console.log("ERROR", err);
  //   })
  // }


  // clearStorage(){
  //   if(this.isclear) {
  //     localStorage.removeItem('tagMeData');
  //     location.reload();
  //   }
  // }


  // getFiles() {
    //   let that = this
    //   let imageList = []
    //   console.log(imageList)
    //   const bucket = new S3(
    //       {
    //           accessKeyId: 'xxx',
    //           secretAccessKey: 'xxx',
    //           region: 'us-east-1'
    //       }
    //       );
    //   const params = {
    //       Bucket: 'tagmeimages',
    //       // Prefix: this.FOLDER
    //   };
   
    //   bucket.listObjects(params, function (err, data) {
    //     if (err) {
    //       console.log('There was an error getting your files: ' + err);
    //       return;
    //     }
   
    //     console.log('Successfully get files.', data);
   
    //     const fileDatas = data.Contents;
    //     let lines = []

    //     fileDatas.forEach(function (file) {
    //         let d_obj = {}
    //         let f_name = "https://s3.amazonaws.com/tagmeimages/"+ file.Key
    //         d_obj['imageUrl'] = f_name
    //         d_obj['keyTag'] = []
    //         d_obj['notes'] = ""
    //         d_obj['timeSpent'] = 0
    //         d_obj['multiTag'] = false
    //         lines.push(d_obj);
    //     });
    //     // console.log(lines);
    //     that.csvData = lines;
    //     that.assignDataInit(lines)
    //     that.readtxtFile();
    //     that.startTimeInterval();
    //   });

    // }


    

