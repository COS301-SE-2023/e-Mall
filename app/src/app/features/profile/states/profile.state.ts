import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { IConsumerProfile } from '../models/consumer-profile.interface';
import { ISellerProfile } from '../models/seller-profile.interface';
import * as ProfileActions from './profile.actions';
import produce from 'immer';
import { Profile } from '../models/alias-profile.interface';

export interface ProfileStateModel {
  profile: Profile;
}

@State<ProfileStateModel>({
  name: 'profile',
  defaults: {
    profile: null,
  },
})
@Injectable()
export class ProfileState {
  @Action(ProfileActions.SetProfile)
  SetProfile(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.SetProfile
  ) {
    ctx.setState({ profile: action.profile });
  }
  @Action(ProfileActions.UpdateProfile)
  UpdateProfile(
    ctx: StateContext<ProfileStateModel>,
    action: ProfileActions.UpdateProfile
  ) {
    ctx.setState(
      produce(draft => {
        if (draft.profile) {
          Object.assign(draft.profile, action.payload);
        } else {
          draft.profile = action.payload as unknown as
            | IConsumerProfile
            | ISellerProfile;
        }
      })
    );
  }
  @Action(ProfileActions.ClearProfile)
  signOut(ctx: StateContext<ProfileStateModel>) {
    ctx.setState({ profile: null });
  }
}
