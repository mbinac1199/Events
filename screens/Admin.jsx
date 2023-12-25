import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { adminData, login } from "../store";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firebase";
import { useSelector } from "react-redux";

const Admin = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const admin = useSelector((state) => state.admin.value);

  useEffect(() => {
    const getEvents = async () => {
      const collectionRef = collection(db, "events");
      const data = await getDocs(collectionRef);
      setEvents(data?.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getEvents();
  }, [admin]);

  useEffect(() => {
    const getUsers = async () => {
      const collectionRef = collection(db, "users");
      const data = await getDocs(collectionRef);
      setUsers(data?.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, [admin]);

  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  const goToEvent = (event) => {
    navigation.navigate("Event", { event, admin: true });
  };

  const openUser = async (user) => {
    navigation.navigate("Profile", { user, admin: true });
  };

  return (
    <LinearGradient
      className="flex-1"
      colors={["rgba(191,90,224,100)", "rgba(168,17,218,100)"]}
    >
      <View className="px-4 pt-5" style={styles.container}>
        <TouchableOpacity onPress={goBack}>
          <Image className="h-7 w-7" source={require("../assets/back.png")} />
        </TouchableOpacity>
        <Text className="text-white text-3xl mt-5 pl-1">Admin Panel</Text>
        <Text className="text-white text-xl mt-10 pl-1">Events</Text>
        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            className="my-7 space-x-3"
            horizontal
          >
            {events.map((event, i) => (
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
                          {event.people.length}
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Text className="text-white text-xl pl-1">Users</Text>
        <ScrollView horizontal className="mt-5 space-x-3">
          {users.map((user) => (
            <TouchableOpacity onPress={() => openUser(user)} key={user.id}>
              <View>
                <Image
                  className="h-20 w-20 rounded-full"
                  source={{ uri: user.image }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});

export default Admin;
