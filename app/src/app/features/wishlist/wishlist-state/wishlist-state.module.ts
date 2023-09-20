import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { WishlistState } from './states/wishlist.state';
import { WishlistService } from './services/wishlist.service';
import { WishlistFacade } from './services/wishlist.facade';
import { WishlistComponent } from './components/wishlist-state.component';

@NgModule({
  declarations: [WishlistComponent],
  imports: [CommonModule, NgxsModule.forFeature([WishlistState])],
  exports: [WishlistComponent],
  providers: [WishlistService, WishlistFacade],
})
export class WishlistStateModule {}
