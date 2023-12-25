import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const GetStarted = () => {
  const navigation = useNavigation();

  const signup = () => {
    navigation.navigate("Signup");
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      className="flex-1"
      source={require("../assets/background-image.jpg")}
    >
      <ImageBackground className="bg-[#00000082] flex-1">
        <View className="flex-1 items-center px-8">
          <View className="flex-1 justify-between py-20">
            <Text></Text>
            <View className="w-full">
              <Text className="text-white font-light text-center text-3xl uppercase">
                Discover whats
              </Text>
              <Text className="text-white font-bold text-center text-5xl uppercase">
                happening
              </Text>
              <TouchableOpacity onPress={signup}>
                <View className="bg-[#1f46bcc5] rounded-xl mt-4 flex-row items-center justify-center space-x-2">
                  <Text className="text-center py-3 text-xl text-white">
                    Get Started
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-row mb-6 space-x-2">
            <Text className="text-white">Already have an account?</Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text className="text-white font-bold">Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ImageBackground>
  );
};

export default GetStarted;
