import { IConsumerProfile } from './consumer-profile.interface';
import { ISellerProfile } from './seller-profile.interface';

export type Profile = ISellerProfile | IConsumerProfile | null;
