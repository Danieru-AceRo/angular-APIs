import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { UsersService } from './services/users.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token = '';

  constructor(
    private Authservice: AuthService,
    private UserService: UsersService,
    private filesService: FilesService
  ){

  }

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser(){
    this.UserService.create({
      email: 'daniel@me.com',
      password: '11223344',
      name: 'dany'
    })
    .subscribe(rta => {
      console.log(rta);
    })
  }

  login(){
    this.Authservice.login('daniel@me.com', '11223344')
    .subscribe(rta => {
      this.token = rta.access_token;
    })
  }

  getProfile(){
    this.Authservice.profile(this.token)
    .subscribe(profile => {
      console.log(profile);
      
    })
  }

  dowloadPdf(){
    this.filesService.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
    
  }
}
