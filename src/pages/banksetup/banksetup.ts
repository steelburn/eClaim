import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BankSetup_Model } from '../../models/banksetup_model';
import { BankSetup_Service } from '../../services/banksetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the BanksetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-banksetup',
  templateUrl: 'banksetup.html', providers: [BankSetup_Service, BaseHttpService]
})
export class BanksetupPage {
  bank_entry: BankSetup_Model = new BankSetup_Model();
  Bankform: FormGroup;
  bank: BankSetup_Model = new BankSetup_Model();
  current_bankGUID: string = '';

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/bank_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
	baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  
  public banks: BankSetup_Model[] = [];

  public AddBanksClicked: boolean = false; public EditBanksClicked: boolean = false; 
   
    public AddBanksClick() {

        this.AddBanksClicked = true;
    }

    public CloseBanksClick() {
      if (this.AddBanksClicked == true) {
        this.AddBanksClicked = false;
      }
      if (this.EditBanksClicked == true) {
        this.EditBanksClicked = false;
      } 
    }

    public EditClick(BANK_GUID:any){      
      this.EditBanksClicked = true;

      this.current_bankGUID = BANK_GUID;        
      var self = this;

      this.banksetupservice
        .get(BANK_GUID)
        .subscribe((bank) => self.bank = bank);
        return self.bank;
    }

    public DeleteClick(BANK_GUID:any){
        let alert = this.alertCtrl.create({
        title: 'Remove Confirmation',
        message: 'Do you want to remove ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'OK',
            handler: () => {
              console.log('OK clicked');
              var self = this;
              this.banksetupservice.remove(BANK_GUID)
                  .subscribe(() => {
                      self.banks = self.banks.filter((item) => {
                          return item.BANK_GUID != BANK_GUID
                      });
                  });        
              //this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          }
        ]
      });alert.present();
    }

  constructor(private fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService, private banksetupservice: BankSetup_Service, private alertCtrl: AlertController) 
  {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.banks = data.resource;
      });
     //this.getBankList();

    this.Bankform = fb.group({      
      NAME: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BanksetupPage');
  }  
    
  Save_Bank() {
    if (this.Bankform.valid) 
    {
      this.bank_entry.BANK_GUID = UUID.UUID(); 
      this.bank_entry.TENANT_GUID = UUID.UUID();      
      this.bank_entry.DESCRIPTION = 'Savings';      
      this.bank_entry.CREATION_TS = new Date().toISOString();
      this.bank_entry.CREATION_USER_GUID ='1';
      
      this.bank_entry.UPDATE_TS = new Date().toISOString();
      this.bank_entry.UPDATE_USER_GUID = "";
            
      //alert(JSON.stringify(this.bank_entry));     

      this.banksetupservice.save_bank(this.bank_entry)
        .subscribe((response) => {
          if (response.status == 200) 
          {
            alert('Bank Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

  getBankList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();    
    self.banksetupservice.get_bank(params)
      .subscribe((banks: BankSetup_Model[]) => {
        self.banks = banks;
      });
  } 
  
  Update_Bank(BANK_GUID:any){
    if (this.Bankform.valid) 
    { 
      this.bank_entry.DESCRIPTION = this.bank.DESCRIPTION;
      this.bank_entry.TENANT_GUID = this.bank.TENANT_GUID;
      this.bank_entry.CREATION_TS = this.bank.CREATION_TS;
      this.bank_entry.CREATION_USER_GUID = this.bank.CREATION_USER_GUID;      
      
      this.bank_entry.BANK_GUID = BANK_GUID;
      // this.bank_entry.DESCRIPTION = 'Savings';
      // this.bank_entry.TENANT_GUID = '1';
      // this.bank_entry.CREATION_TS = new Date().toISOString();
      // this.bank_entry.CREATION_USER_GUID ='1';
      this.bank_entry.UPDATE_TS = new Date().toISOString();
      this.bank_entry.UPDATE_USER_GUID = '1';      
            
      // alert(JSON.stringify(this.bank_entry));     

      this.banksetupservice.update_bank(this.bank_entry)
        .subscribe((response) => {
          if (response.status == 200) 
          {
            alert('Bank updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
}