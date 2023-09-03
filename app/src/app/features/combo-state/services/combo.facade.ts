import { Injectable, OnDestroy } from '@angular/core';
import { IError } from '@features/error/models/error.interface';
import { SetError } from '@features/error/states/error.action';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable, shareReplay, tap, Subscription, map, of } from 'rxjs';
import { ICombo } from '../models/combo.interface';
import { AuthFacade } from '@features/auth/services/auth.facade';
import { Router } from '@angular/router';
import { ComboSelectors } from '../states/combo.selector';
import { ComboService } from './combo.service';
import * as ComboActions from '../states/combo.actions';
import { ProfileFacade } from '@features/profile/services/profile.facade';
import { async } from '@angular/core/testing';

@Injectable()
export class ComboFacade implements OnDestroy {
  @Select(ComboSelectors.getCombos)
  private combos$!: Observable<ICombo[] | null>;
  private authSubscription: Subscription;

  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private comboService: ComboService,
    private ProfileFacade: ProfileFacade
  ) {
    console.log('Combo facade initialized');
    this.authSubscription = this.authFacade
      .getCurrentUser()
      .pipe(
        tap(user => {
          if (user) {
            this.fetchCombos();
          } else {
            this.clearCombos();
          }
        })
      )
      .subscribe();
  }

  @Dispatch()
  setCombos(combos: ICombo[]) {
    try {
      return new ComboActions.SetCombos(combos);
    } catch (error) {
      return this.setError(error);
    }
  }

  @Dispatch()
  updateCombo(data: any) {
    try {
      this.comboService.updateCombo(data);
      return new ComboActions.UpdateCombo(data);
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
  deleteUser(data: any) {
      try {
          this.comboService.deleteUser(data);
          return new ComboActions.DeleteUser(data);
      } catch (error) {
          return this.setError(error);
      }
  }

  @Dispatch()
  CreateCombo(data: any) {
    try {
      this.comboService.createCombo(data);
      return new ComboActions.CreateCombo(data);
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
      if (res != null) this.setCombos(res.combos);
    } catch (error) {
      this.setError(error);
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
