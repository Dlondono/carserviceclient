import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/car/car.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  deleteList = new Array();
  owners: Array<any>;
  areSelected: boolean = false;

  constructor( private router: Router,private carService: CarService, private giphyService: GiphyService) { }

  ngOnInit() {
    this.carService.getAllOwners().subscribe(datos => {
      this.owners = datos._embedded.owners;
      for (const owner of this.owners) {
        owner.id = owner._links.self.href.slice(50);
        this.giphyService.get(owner.name).subscribe(url => owner.giphyUrl = url);
      }
    });
  }
  
  lista(e,ownersDel:any) {
      if(e.target.checked){        
        this.deleteList.push(ownersDel._links.self.href); 
      }else{
        var i = this.deleteList.indexOf(ownersDel._links.self.href); 
        this.deleteList.splice(i, 1); 
      }
      if((this.deleteList).length!=0){
        this.areSelected=true;
      }else{
        this.areSelected=false;
      }    
 }

  delete(){
    for(const owner of this.deleteList){
      
      this.carService.remove(owner).subscribe(result => {
        this.update();
      }, error => console.error(error));
    }

  }
 update(){
  this.ngOnInit();
  this.router.navigate(['/owner-list']);
 }
}