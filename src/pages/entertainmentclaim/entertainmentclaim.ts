import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SpeakerListPage } from '../home/home';

/**
 * Generated class for the EntertainmentclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-entertainmentclaim',
  templateUrl: 'entertainmentclaim.html',
})
export class EntertainmentclaimPage {
  Entertainmentform: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder) {
    
    this.Entertainmentform = fb.group({

      entertainmentname: '',

    });
  }
  public CloseEntertainClick() {
    
       
    this.navCtrl.push(SpeakerListPage)
      }
      
  ionViewDidLoad() {
    console.log('ionViewDidLoad EntertainmentclaimPage');
  }

}
