export interface Load {
  id: string;
  origin: string;
  origin_lat: number | null;
  origin_lng: number | null;
  destination: string;
  destination_lat: number | null;
  destination_lng: number | null;
  pickup_date: string;
  delivery_date: string;
  rate: number;
  weight: number;
  equipment_type: string;
  description: string;
  special_instructions?: string;
  status: 'PENDING' | 'BOOKED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  company_id: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  created_by: string;
  booked_by?: string;
  distance: number;
  rate_per_mile: number;
  created_at: string;
  updated_at: string;
}