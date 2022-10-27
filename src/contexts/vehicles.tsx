import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as vehicle from "../requests/vehicles";

import { Alert } from "react-native";
import { useAuth } from "./auth";
import { showImageById } from "../requests/events";

export interface EventRecord {
  id: number;
  title: string;
  km: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  nickname: string;
  maker: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  km: number;
  initialKm: number;
  purchaseYear: string;
  createdAt: string;
  updatedAt: string;
  userId?: number;
  events?: EventRecord[];
  photo?: string;
}

interface VehicleContextData {
  vehicles: Vehicle[] | null;
  fetchVehicles: () => Promise<void>;
  loading: boolean;
}

const VehicleContext = createContext<VehicleContextData>(
  {} as VehicleContextData
);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("use effecr vehicles");
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return Alert.alert("ERRO 33", "deu erro 33");
    }

    const data = await vehicle.fetchVehicles(user?.id);

    if (!data) {
      setLoading(false);
      return Alert.alert("ERRO 22", "deu erro 22");
    }

    const vehiclesWithImage = await Promise.all(
      data.map(async (vehicle) => {
        if (vehicle.photo) {
          const img = await showImageById(vehicle.photo);
          return {
            ...vehicle,
            photo: "data:image/png;base64," + img,
          };
        }
        return vehicle;
      })
    );

    setVehicles(vehiclesWithImage);
    setLoading(false);
  }, [user]);

  return (
    <VehicleContext.Provider value={{ vehicles, loading, fetchVehicles }}>
      {children}
    </VehicleContext.Provider>
  );
};

function useVehicle() {
  const context = useContext(VehicleContext);

  if (!context) {
    throw new Error("useVehicle must be used within an AuthVehicle.");
  }

  return context;
}

export { VehicleContext, useVehicle };
