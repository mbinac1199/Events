import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { StatusBar } from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { adminData } from "../store";

const Profile = () => {
  const {
    params: { user, edit, admin },
  } = useRoute();

  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  const update = () => {
    navigation.navigate("Update", user);
  };

  const dispatch = useDispatch();
  const deleteUser = async () => {
    const userDoc = doc(db, "users", user.id);
    await deleteDoc(userDoc);
    dispatch(adminData(""));
    navigation.goBack();
  };

  const logout = async () => {
    await signOut(auth);
    navigation.navigate("GetStarted");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity className="mt-4 mx-3" onPress={goBack}>
        <Image className="h-7 w-7" source={require("../assets/back.png")} />
      </TouchableOpacity>
      <View className={`flex-1 mt-7 ${edit && "justify-between"}`}>
        <View className="mx-5 flex-row space-x-6 items-center">
          <Image
            className="h-28 w-28 rounded-full"
            source={{ uri: user.image }}
          />
          <View className="border-l-2 border-white mb-3 pl-6">
            <Text className="text-white text-lg">Score</Text>
            <Text className="text-white text-3xl font-medium">
              {user.score}
            </Text>
          </View>
        </View>
        <View className={`mx-5 ${!edit && "mt-7"}`}>
          <Text className="text-5xl text-white font-medium">
            {user.firstName}
          </Text>
          <Text className="text-5xl text-white font-light">
            {user.lastName}
          </Text>
        </View>
        <View className="bg-[rgba(168, 17, 218, 0.5)] mx-5 rounded-2xl py-6 px-8">
          <View className="flex-row space-x-3 items-center">
            <Image source={require("../assets/profile.png")} />
            <Text className="text-white opacity-50 font-medium text-lg">
              {user.username}
            </Text>
          </View>
          <View className="flex-row mt-4 space-x-3 items-center">
            <View>
              <Image source={require("../assets/email.png")} />
            </View>
            <View>
              <Text className="text-white opacity-50 font-medium text-lg">
                {user.email}
              </Text>
            </View>
          </View>
          <View className="flex-row mt-3 space-x-3 items-center">
            <Image className="mt-1" source={require("../assets/phone.png")} />
            <Text className="text-white opacity-50 font-medium text-lg">
              {user.phone}
            </Text>
          </View>
          <View className="flex-row mt-4 space-x-3 items-center">
            <Image source={require("../assets/card.png")} />
            <Text className="text-white opacity-50 font-medium text-lg">
              {user.cnic}
            </Text>
          </View>
        </View>
        {edit && (
          <View className="mb-6">
            <TouchableOpacity onPress={logout}>
              <View className="flex-row mb-6 space-x-1 mx-5 items-center">
                <Image
                  className="w-8 h-8"
                  source={require("../assets/logout.png")}
                />
                <Text className="text-white text-lg">Logout</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={update}>
              <View className="items-center">
                <View className="flex-row space-x-1 bg-[#1f46bc] py-3 px-10 rounded-3xl">
                  <Text className="text-white text-2xl">Update</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {admin && (
          <TouchableOpacity onPress={deleteUser}>
            <View className="items-center">
              <View className="flex-row space-x-1 bg-[#1f46bc] py-3 px-10 rounded-3xl">
                <Text className="text-white text-2xl">Delete</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: "#000000",
  },
});

export default Profile;
