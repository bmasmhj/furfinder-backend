export type PetStatus = 'lost' | 'found' | 'reunited';
export type PetSize = 'small' | 'medium' | 'large';
export type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'status_change' | 'comment' | 'sighting' | 'photo_added';
  description: string;
  createdAt: string;
}

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
  photoUris: string[];
  description: string;
  latitude: number;
  longitude: number;
  locationName: string;
  lastSeenDate: string;
  reward: string;
  rewardPool: number;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  isOwner: boolean;
  comments: Comment[];
  timeline: TimelineEvent[];
  reunionMessage?: string;
  reunionDate?: string;
  likes?: number;
  likedByMe?: boolean;
  isBoosted?: boolean;
  boostedAt?: string;
  boostExpiresAt?: string;
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
  biometricPhotoUris: string[];
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

export interface PetMatch {
  id: string;
  type: 'report' | 'profile' | 'org_animal';
  confidence: number;
  reason: string;
  orgName?: string;
  orgType?: string;
}

export type OrgType = 'vet' | 'shelter' | 'rescue';
export type OrgStatus = 'pending' | 'approved' | 'rejected';
export type AnimalStatus = 'available' | 'adopted' | 'on_hold' | 'fostered';
export type IntakeType = 'stray' | 'surrendered' | 'rescue' | 'transferred';

export interface Organisation {
  id: string;
  userId: string;
  name: string;
  type: OrgType;
  abn?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  latitude: number;
  longitude: number;
  description?: string;
  logoUri?: string;
  status: OrgStatus;
  approvedAt?: string;
  createdAt: string;
  animalCount?: number;
}

export interface OrganisationAnimal {
  id: string;
  orgId: string;
  petType: PetType;
  petName: string;
  breed: string;
  size: PetSize;
  color: string;
  markings: string;
  photoUris: string[];
  description: string;
  intakeDate?: string;
  intakeType: IntakeType;
  microchipNumber?: string;
  desexed: boolean;
  status: AnimalStatus;
  createdAt: string;
  updatedAt: string;
  orgName?: string;
  orgType?: OrgType;
}

export interface VetShelter {
  id: string;
  name: string;
  type: 'vet' | 'shelter' | 'rescue';
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  hours: string;
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  icon: string;
  category: 'lost' | 'found' | 'prevention' | 'general';
}

export interface PetNotification {
  id: string;
  type: 'lost_nearby' | 'found_nearby' | 'match_found' | 'status_update';
  title: string;
  message: string;
  reportId?: string;
  profileId?: string;
  read: boolean;
  createdAt: string;
}
