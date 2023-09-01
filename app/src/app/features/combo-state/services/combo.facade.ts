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
    updateCombo(combo: Partial<ICombo>) {
        try {
            this.comboService.updateCombo(combo);
            return new ComboActions.UpdateCombo({combo});
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

    // @Dispatch()
    // deleteUser(id: number) {
    //     try {
    //         this.comboService.deleteUser(id);
    //         return new ComboActions.DeleteUser(id, this.ProfileFacade.getProfile().username);
    //     } catch (error) {
    //         return this.setError(error);
    //     }
    // }

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

    getCombos(): Observable<any | null> {
        return this.combos$.pipe(
            tap(async combos => {
                if (combos == null && (await this.authFacade.isLoggedIn())) {
                    await this.fetchCombos();
                }
            }),
            shareReplay({ bufferSize: 1, refCount: true })
        );
    }

    async fetchCombos() {
        try {
            const res = await this.comboService.getCombos();
            if (res != null) this.setCombos(res);
        } catch (error) {
            this.setError(error);
        }
    }

    

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }
}