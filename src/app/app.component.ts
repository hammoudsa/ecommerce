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
      apiKey: "AIzaSyAPkC0zsgrvFqvpqmUajp-v8zn0ucykdRA",
      authDomain: "showin-db.firebaseapp.com",
      databaseURL: "https://showin-db.firebaseio.com",
      projectId: "showin-db",
      storageBucket: "gs://showin-db.appspot.com/",
      messagingSenderId: "35860468334",
      appId: "1:35860468334:web:2117d275a436a0eb1acc7f",
      measurementId: "G-HHKN4Q73GP"
    }
    firebase.initializeApp(firebaseConfig)
    firebase.analytics()
  }
}
