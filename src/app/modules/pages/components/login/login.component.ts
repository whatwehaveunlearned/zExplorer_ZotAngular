import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
      this.createForm();
   }

  ngOnInit() {
  }

  private createForm():void{
    this.loginForm = this.fb.group({
      email: ['',[Validators.email]],
      password: ['',[Validators.required,Validators.minLength(4)]],
      // zoteroAccount: ['',[Validators.required]]
    })
  }

  private submit():void{
    //TODO call the auth service
    const {email,password} = this.loginForm.value;
    console.log(console.log('Email:'  + email + ', Password:' +password))
  }

}
