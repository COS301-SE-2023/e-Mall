/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { IError } from '@features/error/models/error.interface';
import { SetError } from '@features/error/states/error.action';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import {
  Observable,
  tap,
  Subscription,
  map,
  debounceTime,
  shareReplay,
} from 'rxjs';
import { ICombo, ICombo_invites } from '../models/combo.interface';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { ComboSelectors } from '../states/combo.selector';
import { ComboService } from './combo.service';
import * as ComboActions from '../states/combo.actions';

@Injectable()
export class ComboFacade implements OnDestroy {
  @Select(ComboSelectors.getCombos)
  private combos$!: Observable<ICombo[] | null>;
  @Select(ComboSelectors.getComboInvites)
  private combo_invites$!: Observable<ICombo_invites[] | null>;
  private authSubscription: Subscription;
  private combosSubscription = new Subscription();

  constructor(
    private authFacade: AuthFacade,
    private comboService: ComboService
  ) {
    this.authSubscription = this.authFacade
      .getCurrentUser()
      .pipe(
        debounceTime(500),
        tap(async user => {
          if (user) {
            if (user.type === 'seller') return;
            this.fetchCombos();
          } else {
            this.clearCombos();
          }
        })
      )
      .subscribe();
  }

  @Dispatch()
  setCombos(combos: ICombo[], combo_invites: ICombo_invites[]) {
    try {
      return new ComboActions.SetCombos({ combos, combo_invites });
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  async inviteUsers(data: any) {
    try {
      const res = await this.comboService.inviteUsers(data);
      return new ComboActions.InviteUsers(res);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  addProduct(data: any) {
    try {
      this.comboService.addProduct(data);
      return new ComboActions.AddProduct(data);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  updateUsers(data: any) {
    try {
      this.comboService.updateUsers(data);
      return new ComboActions.UpdateUsers(data);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  removeProduct(data: any) {
    try {
      this.comboService.removeProduct(data);
      return new ComboActions.RemoveProductFromCombo(data);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  editCombo(data: any) {
    try {
      this.comboService.editCombo(data);
      return new ComboActions.EditCombo(data);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  deleteUser(data: any) {
    try {
      this.comboService.deleteUser(data);
      return new ComboActions.DeleteUser(data);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  async CreateCombo(data: any) {
    try {
      const res = await this.comboService.createCombo(data);
      return new ComboActions.CreateCombo(data, res);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  clearCombos() {
    try {
      return new ComboActions.ClearCombos();
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  setError(error: any) {
    return [new SetError('combo', error as IError)];
  }

  getCombos(): Observable<ICombo[] | null> {
    return this.combos$.pipe(
      tap(async combos => {
        if (combos == null && (await this.authFacade.isLoggedIn())) {
          await this.fetchCombos();
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  getCombos_invites(): Observable<ICombo_invites[] | null> {
    return this.combo_invites$.pipe(
      tap(async combos => {
        if (combos == null && (await this.authFacade.isLoggedIn())) {
          await this.fetchCombos();
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  getOneCombo(id: number): Observable<ICombo | undefined> {
    return this.combos$.pipe(
      map(combos => {
        if (combos) {
          let matching_combo: ICombo | undefined = undefined;
          for (let i = 0; i < combos.length; i++) {
            if (combos[i].id === id) {
              matching_combo = combos[i];
              break; // Exit the loop when a match is found
            }
          }
          return matching_combo;
        } else {
          return undefined;
        }
      })
    );
  }

  async fetchCombos() {
    try {
      const res = await this.comboService.getCombos();
      const restwo = await this.comboService.getInvites();
      if (res != null) this.setCombos(res.combos, restwo.combos);
    } catch (error) {
      this.setError(error);
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.combosSubscription.unsubscribe();
  }
}
