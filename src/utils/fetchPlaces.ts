import { apiFetch } from "../api";
import { toDecimalIfNeeded } from "./dmsToDecimal";

export async function fetchPlaces() {
  const response = await apiFetch("/api/strip-status/public");
  const data = await response.json();

  return data.map((strip: any) => ({
    id: strip.s_id,
    location: {
      lat: toDecimalIfNeeded(strip.s_latitude),
      lng: toDecimalIfNeeded(strip.s_longitude),
    },
    color: strip.s_qualitycolor,
  }));
}
