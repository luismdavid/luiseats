import { DocumentReference } from '@angular/fire/firestore';

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email?: string;
    username: string;
    cart: { quantity: number; ref: DocumentReference }[];
    isAdmin: boolean;
}