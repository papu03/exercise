import { Component, OnInit,Input } from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { ShiftPropertyBase } from '../shift-property-base';
import {ShiftPropertyControlService} from '../shift-form-services/shift-property-control.service';
import {CrewMemberService} from '../shift-form-services/crew-member.service'
import { DropdownShift } from '../shift-dropdown'
import {ShiftService} from '../shift.service'
import { Shift, CrewMember, WeekDay,ShiftDTO} from '../app.shift';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/common'; 

@Component({
  selector: 'app-dynamic-shift-form',
  templateUrl: './dynamic-shift-form.component.html',
  styleUrls: ['./dynamic-shift-form.component.css'],
  providers: [ ShiftPropertyControlService ]
})
export class DynamicShiftFormComponent implements OnInit {

  @Input() properties: ShiftPropertyBase<any>[] = [];
  @Input() update:boolean
  @Input() shift:Shift

  members:CrewMember[]
  form: FormGroup;
  JSONMembers :  DropdownShift
  validUpdate: boolean

  constructor(private spcs: ShiftPropertyControlService,
              private crewMemberService:CrewMemberService, 
              private shiftService:ShiftService,
              private location: Location ) { 

  }

  ngOnInit() {

    this.form = this.spcs.toFormGroup(this.properties)
    this.validUpdate=false

    this.crewMemberService.getMembers().subscribe(

      members => {
        
        this.members=members

        for (let member of this.members){

            this.JSONMembers=this.properties.filter(idx=>idx.key=="crewMember")[0] as DropdownShift
            this.JSONMembers.options.push({key:member.id,value:member.name})
        }
        
        if(this.update==true){
          
          this.form.get('duration').setValue(this.shift.duration)
          this.form.get('crewMember').setValue(this.shift.crewMember.id)
          this.form.get('weekday').setValue(this.shift.weekDay.name)
          this.form.disable()
        }
        
      })

    // this.logNameChange();
  }
 
  logNameChange() {
    const nameControl = this.form.get('duration');
    nameControl.valueChanges.forEach(
      (value: string) => console.log(value)
    );
  }

  
  addShift() {

    this.shiftService.addShift( {weekDay:this.form.value.weekday as string,
                                duration:this.form.value.duration as number,
                                crewMemberId:this.form.value.crewMember as number} as ShiftDTO).subscribe(() => this.goBack());
  
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(){
  }

  toChangeEnable(){

    if(this.form.enabled){
      this.form.disable()
      document.getElementById('toChangeEnable').textContent="Enable Update"
      this.validUpdate=false
    }else{
      this.form.enable()
      document.getElementById('toChangeEnable').textContent="Disable Update"
      document.getElementById('update')
      this.validUpdate=true

    }
  }

  updateShift(){

    this.shiftService.updateShift( this.shift.shiftId ,
                                    {weekDay:this.form.value.weekday as string,
                                    duration:this.form.value.duration as number,
                                    crewMemberId:this.form.value.crewMember as number} as ShiftDTO).subscribe(() => this.goBack());


  }
  

 




}
