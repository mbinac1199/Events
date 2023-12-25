import { View, Text } from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./config/firebase";

const Search = () => {
  const {
    params: { searchEvents, searchUsers },
  } = useRoute();
  const user = useSelector((state) => state.user.value);
  const navigation = useNavigation();
  const goToHome = () => {
    navigation.navigate("Home");
  };
  const goToEvent = (event) => {
    navigation.navigate("Event", { event });
  };

  const dispatch = useDispatch();
  const addBuddy = async (id) => {
    const addedBuddy = { ...user };
    addedBuddy.buddies = addedBuddy.buddies.concat(id);
    const userDoc = doc(db, "users", user.id);
    await updateDoc(userDoc, addedBuddy).then(() => {
      dispatch(login(addedBuddy));
    });
  };

  return (
    <View className="px-4 pt-5 bg-black" style={styles.container}>
      <TouchableOpacity onPress={goToHome}>
        <Image
          className="h-7 w-7 mt-4"
          source={require("../assets/back.png")}
        />
      </TouchableOpacity>
      <Text className="text-white text-3xl mt-5 pl-1">Search Results</Text>
      <Text className="text-white text-xl mt-10 pl-1">Join events</Text>
      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          className="my-7 space-x-3"
          horizontal
        >
          {searchEvents.map((event, i) => (
            <TouchableOpacity key={event.id} onPress={() => goToEvent(event)}>
              <View className="relative">
                <Image
                  source={{
                    uri: event.header,
                  }}
                  style={{
                    width: 280,
                    height: 160,
                  }}
                  className="rounded-lg"
                />
                <View className="absolute bottom-0 left-0 p-1">
                  <Text className="text-white text-xl font-medium">
                    {event.title}
                  </Text>
                  <View className="flex-row space-x-1 items-center">
                    <Image
                      className="w-5 h-5"
                      source={require("../assets/location.png")}
                    />
                    <Text className="text-white font-medium">
                      {event.venue}
                    </Text>
                  </View>
                </View>
                <View className="flex-row-reverse absolute bottom-4 right-0">
                  <LinearGradient
                    className="h-8 w-8 relative z-10 left-2 rounded-full"
                    colors={["#7B4397", "#DC2430"]}
                  >
                    <View className="flex-1 justify-center items-center">
                      <Text className="text-white text-center">
                        +{event.more}
                      </Text>
                    </View>
                  </LinearGradient>
                  {event.people.map((buddy, index) => (
                    <View
                      key={buddy.uid}
                      style={{
                        position: "relative",
                        right: index * 12,
                      }}
                    >
                      <Image
                        className="h-8 w-8 rounded-full"
                        source={{ uri: buddy.image }}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Text className="text-white text-xl pl-1">Add Buddies</Text>
      <ScrollView horizontal className="mt-5 space-x-3">
        {searchUsers.map((user) => (
          <TouchableOpacity onPress={() => addBuddy(user.id)} key={user.id}>
            <View className="relative">
              <Image
                className="h-20 w-20 rounded-full"
                source={{ uri: user.image }}
              />
              <View className="bg-white rounded-3xl absolute px-2 bottom-0 left-2">
                <Text className="text-[#512DA8]  font-medium ">Buddy +</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});

export default Search;
