import { Component,OnInit } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'showin';

  ngOnInit(): void {
    var firebaseConfig = {
      apiKey: "AIzaSyAS6S9IFlCwzzinMmkUf04G6ktCJMs_zO8",
      authDomain: "babysculture.firebaseapp.com",
      databaseURL: "https://babysculture.firebaseio.com",
      projectId: "babysculture",
      storageBucket: "babysculture.appspot.com",
      messagingSenderId: "1090773467104",
      appId: "1:1090773467104:web:0ca2a3cdd875f536433585",
      measurementId: "G-NTT1YPMNT0"
    }
    firebase.initializeApp(firebaseConfig)
    firebase.analytics()
  }
}
