import { useEffect, useState } from "react";
import rawGeoJson from "./thailand-provinces.json";
import { getProvinceFromLatLng } from "../Convertor/ProvinceAnalyzer";
import { toDecimalIfNeeded } from "../../utils/dmsToDecimal";
import { DateAnalyzer } from "../Convertor/DateAnalyzer";
import { apiFetch } from "../../api";

interface GeoJsonFeature {
  properties: { [key: string]: any };
}

interface GeoJson {
  features: GeoJsonFeature[];
}

interface ProvinceStatus {
  province: string;
  status: "Good" | "Bad";
}

interface PublicStrip {
  s_id: string;
  s_latitude: string;
  s_longitude: string;
  s_quality: string;
  s_qualitycolor: string;
  s_date: string;
  brand_name: string;
}

const geoJson = rawGeoJson as GeoJson;

const ProvinceStatus = () => {
  const [provinceStatuses, setProvinceStatuses] = useState<ProvinceStatus[]>(
    []
  );

  useEffect(() => {
    const fetchPublicStrips = async () => {
      try {
        const res = await apiFetch("/api/strip-status/public"); // ✅ เรียกเฉพาะ public
        const data: PublicStrip[] = await res.json();

        // Filter strips for this month
        const stripsThisMonth = DateAnalyzer(data);

        const provinceStatusCount = new Map<
          string,
          { Good: number; Bad: number }
        >();

        stripsThisMonth.forEach((strip) => {
          const lat = toDecimalIfNeeded(strip.s_latitude || "");
          const lng = toDecimalIfNeeded(strip.s_longitude || "");
          if (isNaN(lat) || isNaN(lng)) return;

          const province = getProvinceFromLatLng(lat, lng);
          if (!province) return;

          const status = strip.s_qualitycolor === "#00c951" ? "Good" : "Bad";

          if (!provinceStatusCount.has(province)) {
            provinceStatusCount.set(province, { Good: 0, Bad: 0 });
          }

          const counts = provinceStatusCount.get(province)!;
          counts[status] = (counts[status] || 0) + 1;
        });

        const provincesAll = geoJson.features.map(
          (feat) => (feat.properties as any).NAME_1 as string
        );

        const statuses = provincesAll
          .map((prov) => {
            const counts = provinceStatusCount.get(prov);
            if (!counts) return null;
            const status = counts.Good >= counts.Bad ? "Good" : "Bad";
            return {
              province: prov,
              status,
            };
          })
          .filter((s): s is ProvinceStatus => s !== null);

        setProvinceStatuses(statuses);
      } catch (err) {
        console.error("Error fetching public strip data:", err);
      }
    };

    fetchPublicStrips();
  }, []);

  const statusColors = {
    Good: "text-green-600",
    Bad: "text-red-600",
  };

  return (
    <div className="fixed top-20 right-5 max-h-[80vh] w-80 overflow-auto bg-white p-4 rounded-lg shadow-lg z-50">
      <h2 className="text-xl font-bold mb-4">
        Province Water pH Quality Status (This Month)
      </h2>
      <ul className="space-y-2">
        {provinceStatuses.map(({ province, status }) => (
          <li
            key={province}
            className={`font-semibold ${statusColors[status]}`}
          >
            {province}: {status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProvinceStatus;
