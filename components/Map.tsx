import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();

  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });
  useEffect(() => {
    console.log("[Map] drivers from API:", drivers);
    console.log("[Map] loading:", loading, "error:", error);
  }, [drivers, loading, error]);
  useEffect(() => {
    if (
      markers.length === 0 ||
      destinationLatitude === undefined ||
      destinationLongitude === undefined
    )
      return;

    (async () => {
      const updatedDrivers = await calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      });

      // берём текущее состояние стора
      const { drivers: currentDrivers } = useDriverStore.getState();
      const isEqual =
        JSON.stringify(currentDrivers) === JSON.stringify(updatedDrivers);

      if (!isEqual) {
        setDrivers(updatedDrivers); // теперь всегда массив
      }
    })();
  }, [
    markers,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  ]);

  useEffect(() => {
    if (!Array.isArray(drivers) || !userLatitude || !userLongitude) return;

    const newMarkers = generateMarkersFromData({
      data: drivers,
      userLatitude,
      userLongitude,
    });

    setMarkers(newMarkers);
  }, [drivers, userLatitude, userLongitude]);

  if (loading || (!userLatitude && !userLongitude))
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  if (!region) {
    return (
      <View className="flex justify-center items-center w-full h-full">
        <ActivityIndicator size="large" color="#0286FF" />
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={{ flex: 1, width: "100%", height: "100%" }}
      showsUserLocation
      initialRegion={region}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === +marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}

      {userLatitude &&
        userLongitude &&
        destinationLatitude &&
        destinationLongitude && (
          <>
            <Marker
              key="destination"
              coordinate={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              title="Destination"
              image={icons.pin}
            />
            <MapViewDirections
              origin={{
                latitude: userLatitude,
                longitude: userLongitude,
              }}
              destination={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              apikey={directionsAPI!}
              strokeColor="#0286FF"
              strokeWidth={2}
              onError={(errorMessage) => {
                console.log("Directions error:", errorMessage);
              }}
            />
          </>
        )}
    </MapView>
  );
};

export default Map;
