import { Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { BottomSheet } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useRef } from "react";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleFindRide = () => {
    // Закрываем BottomSheet
    bottomSheetRef.current?.close();

    // Сразу пушим экран
    router.push("/(root)/(rides)/confirm-ride");
  };

  return (
    <RideLayout title="Ride" snapPoints={["40%", "85%"]} bottomSheetRef={bottomSheetRef}>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>

      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>
        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>

      <CustomButton
        title="Find Ride"
        onPress={handleFindRide}
        className="mt-5"
      />
    </RideLayout>
  );
};

export default FindRide;
