// RideLayout.tsx
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Map from "@/components/Map";
import { icons } from "@/constants";

const RideLayout = ({
  title,
  snapPoints,
  children,
  bottomSheetRef,
  loading, // 👈 обязательно нужен
}: {
  title: string;
  snapPoints?: string[];
  children: React.ReactNode;
  bottomSheetRef?: React.RefObject<BottomSheet>;
  loading?: boolean;
}) => {
  const sheetRef = bottomSheetRef || useRef<BottomSheet>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Если глобальная загрузка — рендерим только индикатор
  if (loading || !ready) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0286FF" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Карта */}
      <View style={StyleSheet.absoluteFill}>
        <Map />
      </View>

      {/* Контейнер */}
      <View style={styles.overlay}>
        {/* Хэдер */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <View style={styles.backBtn}>
              <Image
                source={icons.backArrow}
                resizeMode="contain"
                style={{ width: 24, height: 24 }}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>{title || "Go Back"}</Text>
        </View>

        {/* BottomSheet */}
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints ?? ["40%", "85%"]}
          index={0}
        >
          <BottomSheetView style={styles.sheetContent}>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RideLayout;

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  header: {
    flexDirection: "row",
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 20,
    alignItems: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: { fontSize: 18, fontWeight: "600", marginLeft: 10, color: "#111" },
  sheetContent: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
