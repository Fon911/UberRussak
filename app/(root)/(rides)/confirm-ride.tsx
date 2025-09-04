import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useFetch } from "@/lib/fetch";
import { useDriverStore } from "@/store";
import { Driver } from "@/types/type";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const ConfirmRide = () => {
  const {
    data: fetchedDrivers,
    loading,
    error,
  } = useFetch<Driver[]>("/(api)/driver");
  const { drivers, setDrivers, selectedDriver, setSelectedDriver } =
    useDriverStore();

  useEffect(() => {
    if (fetchedDrivers && fetchedDrivers.length > 0) {
      console.log("[ConfirmRide] setting drivers to store:", fetchedDrivers);
      setDrivers(fetchedDrivers);
    }
  }, [fetchedDrivers, setDrivers]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0286FF" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {error}</Text>
      </View>
    );

  return (
    <RideLayout title={"Choose a Rider"} snapPoints={["60%", "85%"]}>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(item.id!)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Ride"
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
