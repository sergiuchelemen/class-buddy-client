import { Component } from '@angular/core';
import {MatSidenav, MatSidenavContainer} from '@angular/material/sidenav';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatListItem, MatNavList} from '@angular/material/list';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenavContainer,
    RouterOutlet,
    MatNavList,
    MatListItem,
    RouterLink,
    MatSidenav
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
