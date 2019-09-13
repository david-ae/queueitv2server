import { Component, OnInit } from '@angular/core';
import { StatusFacade } from 'src/app/services/admin/statusfacade';
import { GeneralService } from '../services/general.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Status } from 'src/app/domainmodel/status';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/_services';

@Component({
  selector: 'app-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  buttonName: string = "Add Status";
  statusForm: FormGroup;

  p: number = 1;
  collection: any[] = this.statusFacade.statusList;

  constructor(public statusFacade: StatusFacade, private _generalService: GeneralService,
    private spinner: NgxSpinnerService, private alertService: AlertService) { 
    this.statusForm = new FormGroup({
      statusname: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  addStatus(){
    this.spinner.show();
    let statusname = this.statusForm.get("statusname").value;
    this._generalService.addStatus(statusname)
        .subscribe((data: Status) => {
          this.spinner.hide();
            this.statusFacade.statusList.push(data);
            this.alertService.success(statusname.toUpperCase() + " Successfully Added as a Status.")
        },
        (err: HttpErrorResponse) => {
          console.log("Error: " + err);
          this.alertService.error("New Status Addition Failed. Please try again.")
      }
        );
  }

  editStatus(id: string){
    this.statusFacade.status = this.statusFacade.getStatus(id);
    this.statusForm.setValue({
       statusname: this.statusFacade.status.name
    });
    this.buttonName = "Update Status";
  }

  updateStatus(){
    this.spinner.show();
    let status = new Status();
    status.id = this.statusFacade.status.id;
    status.name = this.statusForm.get("statusname").value;
    this._generalService.updateStatus(status)
      .subscribe((data: Status) => {
        this.spinner.hide();
        this.statusFacade.updateStatus(data);
        this.alertService.success("Status Update Successful.");
      },
          (err: HttpErrorResponse) => {
              console.log("Error: " + err);
              this.alertService.error("Status Update Failed. Please try again");
          }
      );    
      this.statusForm.reset();
    this.buttonName = "Add Status";
  }
}
