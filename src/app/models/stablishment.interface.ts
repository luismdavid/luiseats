import { PlaceLocation } from './location.model';

export interface Stablishment {
    id?: string;
    description: string;
    name: string;
    phoneNumber: string;
    image: string;
    creatorEmail: string;
    location: PlaceLocation;
}