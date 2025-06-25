
export interface Model {
  id: string;
  user_id: string;
  name: string;
  artistic_name?: string;
  email: string;
  phone: string;
  bio?: string;
  age?: number;
  status: 'active' | 'inactive' | 'pending';
  platforms: PlatformData[];
  portfolio_images: string[];
  photos: string[];
  city?: string;
  state?: string;
  country?: string;
  gender?: string;
  birth_date?: string;
  cpf?: string;
  rg?: string;
  height?: string;
  weight?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  hair?: string;
  eyes?: string;
  ethnicity?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformData {
  id: string;
  type: 'instagram' | 'telegram' | 'privacy';
  name: string;
  username?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

export interface CreateModelData {
  name: string;
  artistic_name?: string;
  email: string;
  phone: string;
  bio?: string;
  age?: number;
  status: 'active' | 'inactive' | 'pending';
  platforms?: PlatformData[];
  portfolio_images?: string[];
  photos?: string[];
  city?: string;
  state?: string;
  country?: string;
  gender?: string;
  birth_date?: string;
  cpf?: string;
  rg?: string;
  height?: string;
  weight?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  hair?: string;
  eyes?: string;
  ethnicity?: string;
  notes?: string;
}

export interface ModelKPIs {
  totalModels: number;
  activeModels: number;
  totalSessions: number;
  upcomingSessions: number;
  averageRating: number;
}
