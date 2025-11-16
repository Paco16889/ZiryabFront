import { Injectable, signal } from '@angular/core';

import { HttpResponse } from '@angular/common/http';
import { Credentials, RegisterInfo } from '../models/credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    public user: any | null;
  constructor() { 
    this.user = signal<any>(null);
  }

  login(credentials: Credentials):Promise<HttpResponse<any>> {
    return new Promise((resolve, reject)=>{
      let users: RegisterInfo[] | null =
        localStorage.getItem('USERS') != null
          ? JSON.parse(localStorage.getItem('USERS')!)
          : null;
      if (
        users != null &&
        users.find(
          u=>
            u.email == credentials.email &&
            u.password == credentials.password
        )!=undefined
      ) {
        localStorage.setItem('AUTHENTICATION', JSON.stringify(credentials));
        this.user.set(credentials);
        resolve(new HttpResponse({'status':200, 'statusText':'User signed in'}));
      }
      else
        reject(new HttpResponse({'status':401, 'statusText':'Unauthorized'}))
    });
  }
}


