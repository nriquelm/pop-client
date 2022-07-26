import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';


export class Pop {

  public id!: number;
  public name!: string;
  public quantity!: number;
  public cost!: number;
  public series!: string;
  public status!: string;
  public !: string;

}

@Component({
  selector: 'app-pop-dashboard',
  templateUrl: './pop-dashboard.component.html',
  styleUrls: ['./pop-dashboard.component.css']
})
export class PopDashboardComponent implements OnInit {

  closeResult!: string;
  pops!: Pop[];
  pop!: Pop;
  editForm!: FormGroup;
  private deleteId!: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.findAll();

    this.editForm = this.fb.group({
      id: [''],
      name: [''],
      quantity: [''],
      cost: [''],
      series: [''],
      status: ['']
    });
  
  }

  url = 'http://localhost:8080/pop-warehouse/pops/';
  findAll(){
    this.httpClient.get<any>(this.url).subscribe( response => {
      console.log(response);
      this.pops = response;
    })
  }

  open(content: any){
    this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons. BACKDROP_CLICK){
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
  onSubmit(f: NgForm){
    
    this.httpClient.post(this.url, f.value).subscribe((result) => {
      this.ngOnInit();
    });
    this.modalService.dismissAll();
  }

  openEdit(targetModal: any, pop: Pop){
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue({
      id: pop.id,
      name: pop.name,
      quantity: pop.quantity,
      cost: pop.cost,
      series: pop.series,
      status: pop.status
    });
  }

  onSave(){
    const editUrl = this.url + this.editForm.value.id;
    this.httpClient.put(editUrl, this.editForm.value).subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
  }

  openDelete(targetModal: any, pop: Pop){
    this.deleteId = pop.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete(){
    const deleteUrl = this.url + this.deleteId;
    this.httpClient.delete(deleteUrl).subscribe((result) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    })
  }
}
