import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api";

interface Strip {
  s_date: string;
  s_latitude: string;
  s_longitude: string;
  s_qualitycolor: string;
}

interface StripDataContextType {
  stripData: Strip[];
}

const StripDataContext = createContext<StripDataContextType>({ stripData: [] });

export const useStripData = () => useContext(StripDataContext);

export const StripDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stripData, setStripData] = useState<Strip[]>([]);

  useEffect(() => {
    console.log("useEffect: Fetching strips...");
    const fetchStripData = async () => {
      try {
        const data = await apiFetch("/api/strips"); // ✅ แก้ตรงนี้
        console.log("Fetched strip data:", data);
        setStripData(data);
      } catch (err) {
        console.error("Error fetching strip data:", err);
      }
    };

    fetchStripData();
  }, []);

  return (
    <StripDataContext.Provider value={{ stripData }}>
      {children}
    </StripDataContext.Provider>
  );
};
