import { View, Text } from "react-native";
import React from "react";
import { ImageBackground } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./config/firebase";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { adminData, allEvents, login } from "../store";

const Event = () => {
  const {
    params: { event, admin },
  } = useRoute();

  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  let user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const join = async () => {
    let e = { ...event };

    if (e.people.find((p) => (p.uid === user.id ? true : false))) {
      Alert.alert("Event", "Event already joined.");
      return;
    }
    e.people = e.people.concat({
      uid: user.id,
      image: user.image,
    });
    e.score += 500;
    const eventDoc = doc(db, "events", e.id);
    await updateDoc(eventDoc, e);
    const userDoc = doc(db, "users", user.id);
    user.score += 500;
    await updateDoc(userDoc, user);
    dispatch(login(user));
    Alert.alert("Event", "Event successfully joined.");
  };

  const deleteEvent = async () => {
    const userDoc = doc(db, "events", event.id);
    await deleteDoc(userDoc);
    dispatch(adminData(""));
    navigation.goBack();
  };

  return (
    <ImageBackground className="flex-1" source={{ uri: event.header }}>
      <View style={styles.container} className="px-3 pt-12 relative">
        <TouchableOpacity onPress={goBack}>
          <Image className="h-7 w-7" source={require("../assets/back.png")} />
        </TouchableOpacity>
        <View className="flex-row justify-between mt-8 items-center">
          <Text className="text-white text-3xl ml-1 font-bold">
            {event.title}
          </Text>
          <Text className="text-white text-lg">{event.score}</Text>
        </View>
        <View className="absolute bg-black w-screen h-full -z-10 opacity-10 left-0 -bottom-10"></View>
      </View>
      <View className="justify-between flex-1 bg-black rounded-t-3xl">
        <View className="flex-row justify-center items-center mt-8 space-x-4">
          <View className="bg-[#1f46bc] rounded-3xl py-2 pl-6 pr-8 flex-row items-center space-x-2">
            <Image
              className="w-12 h-12 mt-2"
              source={require("../assets/price.png")}
            />
            <View>
              <Text className="text-white text-xl">
                {event.price === 0 ? "Free" : event.price}
              </Text>
              <Text className="text-white font-light">Price</Text>
            </View>
          </View>
          <View className="bg-[#1f46bc] rounded-3xl h-full py-2 pl-6 pr-8 flex-row items-center space-x-2">
            <Image
              className="w-8 h-12"
              source={require("../assets/duration.png")}
            />
            <View>
              <Text className="text-white text-xl">
                {event.duration + " hours"}
              </Text>
              <Text className="text-white font-light">Duration</Text>
            </View>
          </View>
        </View>
        <View className="mx-5">
          <Text className="text-white text-xl font-medium">Description</Text>
          <Text className="text-white mt-1 font-light">
            {event.description}
          </Text>
        </View>
        <View className="mx-5">
          <Text className="text-white text-xl font-medium">Gallery</Text>
          <View className="flex-row space-x-2 mt-2">
            <View className="w-1/2">
              <Image
                className="w-full rounded-2xl"
                source={{ uri: event.gallery[0] }}
                height={80}
              />
              <Image
                className="w-full rounded-2xl mt-2"
                source={{ uri: event.gallery[1] }}
                height={100}
              />
            </View>
            <View className="w-1/2">
              <Image
                className="w-full rounded-2xl"
                source={{ uri: event.gallery[2] }}
                height={187}
              />
            </View>
          </View>
        </View>
        <View className="mb-10">
          {admin ? (
            <TouchableOpacity onPress={deleteEvent}>
              <View className="items-center">
                <View className="bg-[#1f46bc] py-3 px-10 rounded-3xl">
                  <Text className="text-white text-2xl">Delete</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={join}>
                <View className="items-center">
                  <View className="flex-row space-x-1 bg-[#1f46bc] py-3 px-10 rounded-3xl">
                    <Text className="text-white text-2xl">Join</Text>
                    <Text className="text-gray-200 text-2xl">+</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <Text className="text-gray-50 mt-2 text-center">
                Terms and Conditions applied
              </Text>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
});

export default Event;
