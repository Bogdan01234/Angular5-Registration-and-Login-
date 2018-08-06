import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { Router } from '@angular/router';
import { HexBase64Latin1Encoding } from 'crypto';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    // styleUrls: ['home.component.css']
})


export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    controller : string[] = [];

    checked = false;
    disabled = false;

    constructor(private userService: UserService, private router: Router) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    checkAll(checked: boolean){
        if(checked){
            console.log("aaa")
            this.controller.push(...(this.users.map((i) => i._id)));      
        }else{
            this.controller.splice(0);            
        }
        console.log(this.controller); 
    }

    check(checkbox: any, checked: boolean){

        var ind = this.controller.indexOf(checkbox.value);

        if(checked){
            this.controller.push(checkbox.value);      
        }else{
            this.controller.splice(ind, 1);            
        }
        console.log(this.controller); 
    }

    ngOnInit() {
        this.loadAllUsers();
        console.log(this.currentUser)
    }
    blocking(){
        for (let user of this.controller){
            this.userService.blocking(user).subscribe((response) => {
                 if (response.deleteSelf) {
                    localStorage.removeItem('currentUser');
                    this.router.navigate(['/login']);
                 } else {
                    this.loadAllUsers()
                 }
                });
        }
        this.controller.splice(0);
    }

    unblock(){
        for (let user of this.controller){
            this.userService.unblock(user).subscribe(() => { this.loadAllUsers() });
            }
        this.controller.splice(0);
    }

    deleteUser() {
        for (let user of this.controller){
        this.userService.delete(user).subscribe((response) => {
            if (response.deleteSelf) {
                localStorage.removeItem('currentUser');
                this.router.navigate(['/login']);
            }else {
                this.loadAllUsers();
            } 
        });

        }
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }

    
}