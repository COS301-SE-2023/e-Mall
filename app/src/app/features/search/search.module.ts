import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule as SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  exports: [SearchComponent],
})
export class SearchModule {}
