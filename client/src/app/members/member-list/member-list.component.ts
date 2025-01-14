import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];
  skills : string[] = [];
  cityList: string[] = [];
  

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  // loadMembers() {
  //   this,this.memberService.setUserParams(this.userParams);
  //   this.memberService.getMembers(this.userParams).subscribe(response => {
  //     this.members = response.result;
  //     this.pagination = response.pagination;
  //   })
  // }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      // console.log(this.members);      
      
      this.members.forEach(member => {
        if (!this.cityList.includes(member.city)) {
          this.cityList.push(member.city);
        }        

        //To Do: seed data in interests string must NOT have ',and' else parsing will not work
        member.interests.replace(/and/g, ",");
        
        //breaks he interests into single skills and psh it to the ordered list
        //let pattern = new RegExp("\b(?!and\b)\w+"); 
        member.interests.split(',').forEach(skill=>{          
          if(!this.skills.includes(skill)){
            this.skills.push(skill);
          }
        }) 
        this.skills.sort();       
      });
      // console.log(this.cityList);
      this.pagination = response.pagination;
    });
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
