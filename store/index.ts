import { DriverStore, LocationStore, MarkerData } from "@/types/type";
import { create } from "zustand";

export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },
}));

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[], // безопасный массив по умолчанию
  selectedDriver: null,

  setSelectedDriver: (driverId: number) => {
    console.log("[Store] setSelectedDriver called with:", driverId);
    set(() => ({ selectedDriver: driverId }));
  },

  setDrivers: (drivers: MarkerData[] | undefined) => {
    const safeDrivers = Array.isArray(drivers) ? drivers : [];
    console.log("[Store] setDrivers called. Count:", safeDrivers.length);
    console.log("[Store] Drivers data:", safeDrivers);
    set(() => ({ drivers: safeDrivers }));
  },

  clearSelectedDriver: () => {
    console.log("[Store] clearSelectedDriver called");
    set(() => ({ selectedDriver: null }));
  },
}));
