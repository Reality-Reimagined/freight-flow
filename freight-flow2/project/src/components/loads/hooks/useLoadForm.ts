import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface LoadFormData {
  origin: string;
  originLat: number | null;
  originLng: number | null;
  destination: string;
  destinationLat: number | null;
  destinationLng: number | null;
  pickupDate: string;
  deliveryDate: string;
  rate: string;
  weight: string;
  equipmentType: string;
  description: string;
  specialInstructions: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  distance: number;
  ratePerMile: number;
}

interface RouteDetails {
  distance: number;
  duration: number;
  polyline?: string;
}

export const useLoadForm = () => {
  const [formData, setFormData] = useState<LoadFormData>({
    origin: '',
    originLat: null,
    originLng: null,
    destination: '',
    destinationLat: null,
    destinationLng: null,
    pickupDate: '',
    deliveryDate: '',
    rate: '',
    weight: '',
    equipmentType: 'Dry Van',
    description: '',
    specialInstructions: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    distance: 0,
    ratePerMile: 0,
  });

  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationChange = (
    field: 'origin' | 'destination',
    location: Location,
    placeDetails?: google.maps.places.PlaceResult,
    routeInfo?: RouteInfo
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: location.address,
      [`${field}Lat`]: location.coordinates?.lat || null,
      [`${field}Lng`]: location.coordinates?.lng || null,
    }));

    if (routeInfo) {
      setRouteDetails({
        distance: routeInfo.distance,
        duration: routeInfo.duration,
        polyline: routeInfo.polyline,
      });

      if (formData.rate) {
        const ratePerMile = parseFloat(formData.rate) / routeInfo.distance;
        setFormData(prev => ({
          ...prev,
          distance: routeInfo.distance,
          ratePerMile: parseFloat(ratePerMile.toFixed(2)),
        }));
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      
      if (name === 'rate' && prev.distance > 0) {
        const rate = parseFloat(value);
        updates.ratePerMile = rate > 0 ? parseFloat((rate / prev.distance).toFixed(2)) : 0;
      }
      
      return { ...prev, ...updates };
    });
  };

  const submitLoad = async (companyId: string, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from('loads').insert([{
        company_id: companyId,
        origin: formData.origin,
        origin_lat: formData.originLat,
        origin_lng: formData.originLng,
        destination: formData.destination,
        destination_lat: formData.destinationLat,
        destination_lng: formData.destinationLng,
        pickup_date: formData.pickupDate,
        delivery_date: formData.deliveryDate,
        rate: parseFloat(formData.rate),
        weight: parseFloat(formData.weight),
        equipment_type: formData.equipmentType,
        description: formData.description,
        special_instructions: formData.specialInstructions,
        distance: formData.distance,
        rate_per_mile: formData.ratePerMile,
        status: 'PENDING',
        contact_name: formData.contactName,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail,
        created_by: userId,
      }]);

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    routeDetails,
    loading,
    error,
    handleLocationChange,
    handleChange,
    submitLoad,
    setError,
  };
};