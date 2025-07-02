import { apiFetch } from "../api";
import { dmsToDecimal } from "./dmsToDecimal";

export async function fetchPlaces() {
  const data = await apiFetch("/api/strip-status/public"); // ✅ แก้ตรงนี้

  return data.map((strip: any) => ({
    id: strip.s_id,
    location: {
      lat: dmsToDecimal(strip.s_latitude),
      lng: dmsToDecimal(strip.s_longitude),
    },
    color: strip.s_qualitycolor,
  }));
}
