import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
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

  pops!: Pop[];

  closeResult!: string;
  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  url = 'http://localhost:8080/pop-warehouse/pops/';
  findAll(){
    this.httpClient.get<any>(this.url).subscribe( response => {
      console.log(response);
      this.pops = response;
    })
  }

  open(content: any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
/*
  findAll(): Observable<Pop[]>{
    return this.httpClient.get<Pop[]>(this.url);
  }


  save(pop: Pop): Observable<Pop>{
    return this.httpClient.post<Pop>(this.url, pop);
  }


  findById(id:number): Observable<any> {
    return this.httpClient.get(this.url + id);
  }

  findByName(name: string): Observable<any> {
    return this.httpClient.get(this.url + name);
  }
  
  updatePrice(id: number, cost: number): Observable<Pop>{
    return this.httpClient.put<Pop>(this.url + id, cost);
  }
  

  deleteByName(name: string): Observable<any>{
    return this.httpClient.delete(this.url + name);
  }

  delete(id: number): Observable<any>{
    return this.httpClient.delete(this.url + id);
  }
*/
}
