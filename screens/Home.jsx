import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./config/firebase";
import { Image } from "react-native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { allEvents, login } from "../store";
import * as Location from "expo-location";

const Home = () => {
  const [events, setEvents] = useState([]);
  const user = useSelector((state) => state.user.value);
  const [allUsers, setAllUsers] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const allEventsData = useSelector((state) => state.event.value);
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.value);

  // Get Events
  useEffect(() => {
    const getEvents = async () => {
      const collectionRef = collection(db, "events");
      const data = await getDocs(collectionRef);
      let events = data?.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .map((obj) => ({
          ...obj,
          people: obj.people.filter((item) => item.uid !== user.id),
        }));
      events.forEach((event) => {
        event.more = event.people.length;
      });
      events = events.map((obj) => ({
        ...obj,
        people: obj.people.filter((item) => user.buddies?.includes(item.uid)),
      }));
      events.forEach((event) => {
        event.more -= event.people.length;
      });
      setEvents(events);
      dispatch(allEvents(events));
    };
    getEvents();
  }, [user, admin]);

  // Get Users
  useEffect(() => {
    const getUsers = async () => {
      const collectionRef = collection(db, "users");
      const data = await getDocs(collectionRef);
      let users = data?.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((u) => u.id !== user.id);
      setBuddies(
        users.filter((obj1) => user.buddies?.some((obj2) => obj1.id === obj2))
      );
      users = users.filter(
        (obj1) => !user.buddies?.some((obj2) => obj1.id === obj2)
      );
      setAllUsers(users);
    };
    getUsers();
  }, [user]);

  const addBuddy = async (id) => {
    const addedBuddy = { ...user };
    addedBuddy.buddies = addedBuddy.buddies.concat(id);
    const userDoc = doc(db, "users", user.id);
    await updateDoc(userDoc, addedBuddy).then(() => {
      dispatch(login(addedBuddy));
    });
  };

  const navigation = useNavigation();
  const goToEvent = (event) => {
    navigation.navigate("Event", { event });
  };
  const goToProfile = () => {
    navigation.navigate("Profile", { user, edit: true });
  };
  const openMenu = () => {
    navigation.navigate("Menu", { user });
  };
  const buddiesMaps = () => {
    navigation.navigate("Maps", { locations: buddies, buddy: true });
  };
  const locationsMaps = () => {
    navigation.navigate("Maps", { locations: allEventsData });
  };

  const [searchText, setSearchText] = useState();
  const search = () => {
    const searchEvents = allEventsData.filter((item) => {
      return item.title.toLowerCase().startsWith(searchText.toLowerCase());
    });
    const searchUsers = allUsers.filter((item) => {
      const mergedString = (item.firstName + item.lastName).toLowerCase();
      return mergedString.startsWith(searchText.toLowerCase());
    });
    navigation.navigate("Search", { searchEvents, searchUsers });
  };

  useEffect(() => {
    (async () => {
      if (!user) return;
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      let addLocation = { ...user };
      addLocation.location = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      const userDoc = doc(db, "users", user.id);
      await updateDoc(userDoc, addLocation);
    })();
  }, [user]);

  // Used to make center card big
  const [centerIndex, setCenterIndex] = useState(0);
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const itemWidth = 280;
    const centerOffset = event.nativeEvent.layoutMeasurement.width / 2;
    const centerIndex = Math.floor(
      offsetX / itemWidth + centerOffset / itemWidth
    );
    setCenterIndex(centerIndex);
  };

  return (
    <SafeAreaView className="flex-1 px-5 justify-between bg-black">
      <View>
        <View className="flex-row justify-between items-center mt-3">
          <TouchableOpacity onPress={openMenu}>
            <Image source={require("../assets/menu.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToProfile}>
            <View className="rounded-full border-2 border-white">
              <Image
                className="w-8 h-8 rounded-full"
                source={{ uri: user.image }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex-row mt-4 bg-gray-600 rounded-lg py-3 px-6 space-x-4 items-center">
          <Image source={require("../assets/search.png")} />
          <TextInput
            placeholder="Search places"
            placeholderTextColor={"#fff"}
            value={searchText}
            onChangeText={(value) => setSearchText(value)}
            onSubmitEditing={search}
            className="text-lg text-white font-extralight pb-1 flex-1"
          />
        </View>
      </View>
      <View>
        <Text className="text-xl text-white font-medium">Join Events</Text>

        <ScrollView
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          className="mt-7 space-x-3"
          contentContainerStyle={{ alignItems: "flex-end" }}
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
                    height: 160 + (i === centerIndex ? 20 : 0),
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
      <View>
        <Text className="text-xl text-white font-medium">Quick Add</Text>
        <ScrollView horizontal className="mt-5 space-x-3">
          {allUsers.slice(0, 4).map((user) => (
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
      <View className="flex-row justify-center items-center space-x-14 mb-1">
        <TouchableOpacity onPress={buddiesMaps}>
          <Image
            className="h-5 w-5"
            source={require("../assets/location.png")}
          />
        </TouchableOpacity>
        <Image className="h-8 w-8" source={require("../assets/home.png")} />
        <TouchableOpacity onPress={locationsMaps}>
          <Image
            className="h-5 w-5"
            source={require("../assets/building.png")}
          />
        </TouchableOpacity>
      </View>
      <View className="absolute rounded-full -bottom-72 -z-10 bg-[#D9D9D9] opacity-30 h-96 w-96 left-1"></View>
    </SafeAreaView>
  );
};

export default Home;
