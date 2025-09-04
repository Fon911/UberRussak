import { icons } from "@/constants";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, Platform, View } from "react-native";
const TabIcon = ({
  focused,
  source,
}: {
  focused: boolean;
  source: ImageSourcePropType;
}) => {
  return (
    <View className="flex items-center justify-center h-full">
      <View
        className={`
        rounded-full 
        w-12 h-12 
        items-center justify-center
        ${focused ? "bg-general-400" : ""}
      `}
        style={{
          borderRadius: 9999, // Гарантирует идеальный круг
          overflow: "hidden", // Обрезает все выходящее за границы
        }}
      >
        <Image
          source={source}
          tintColor="white"
          resizeMode="contain"
          className="w-6 h-6" // Уменьшаем для гарантированного вписывания
          style={{
            width: 24, // Фиксированные размеры в пикселях
            height: 24,
            margin: 0, // Убираем любые отступы
          }}
        />
      </View>
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: Platform.select({ ios: 20, android: 20 }),
          paddingBottom: Platform.select({ ios: 0, android: 10 }),
          marginHorizontal: Platform.select({ ios: 20, android: 20 }),
          marginBottom: Platform.select({ ios: 20, android: 0 }),
          height: Platform.select({ ios: 78, android: 78 }),
          position: Platform.select({ ios: "absolute", android: "absolute" }),
          bottom: Platform.select({ ios: 0, android: 20 }),

          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          headerShown: false,
          title: "Rides",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.list} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.chat} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.profile} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
