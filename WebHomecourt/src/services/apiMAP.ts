import { supabase } from "../lib/supabase";
export interface Court {
  court_id: number;
  name: string;
  direction: string;
  longitude: number;
  latitude: number;
  allow_court: boolean;
}

export interface NominatimReverseResponse {
  address: {
    city: string;
  };
}

export async function getCiudad(lat: number, lng: number): Promise<string | null> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`
  );

  if (!response.ok) {
    return null;
  }

  const Ciudad = ((await response.json()) as NominatimReverseResponse).address;
  if (!Ciudad) return null;
  return Ciudad.city ?? null;
}

export async function getCourts(){
  const { data: court, error } = await supabase
  .from('court')
  .select('*')
  if (error){
    console.error(error.message)
    return null
  }
  return court
}