export type PetStatus = 'lost' | 'found' | 'reunited';
export type PetSize = 'small' | 'medium' | 'large';
export type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export interface PetReport {
  id: string;
  status: PetStatus;
  petType: PetType;
  petName: string;
  breed: string;
  size: PetSize;
  color: string;
  markings: string;
  photoUri: string;
  description: string;
  latitude: number;
  longitude: number;
  locationName: string;
  lastSeenDate: string;
  reward: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  isOwner: boolean;
}

export interface PetProfile {
  id: string;
  petType: PetType;
  petName: string;
  breed: string;
  size: PetSize;
  color: string;
  markings: string;
  photoUris: string[];
  microchipNumber: string;
  medicalNotes: string;
  suburb: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}
