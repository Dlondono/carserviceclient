import { Component, OnInit ,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../shared/car/car.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { NgForm } from '@angular/forms';
import { NullAstVisitor } from '@angular/compiler';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit, OnDestroy {
  car: any = {};
  owner: any = {};
  ownerLista = new Array();
  sub: Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private giphyService: GiphyService) { }



  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.carService.getOwner(id).subscribe((owner: any) => {
          if (owner) {
            this.owner = owner;
            this.owner.href = owner._links.self.href;
            this.giphyService.get(owner.name).subscribe(url => owner.giphyUrl = url);
          } else {
            console.log(`Owner with id '${id}' not found, returning to list`);
            this.gotoList();
          }
        });
      }
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  gotoList() {
    this.router.navigate(['/owner-list']);
  }
  save(form: NgForm) {
    this.carService.saveOwner(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

  removeOwner(href) {
    this.carService.remove(href).subscribe(result => {
      this.gotoList();
      
    }, error => console.error(error));
  }


}