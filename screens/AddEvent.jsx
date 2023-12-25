import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "./config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { login } from "../store";
import { adminData } from "../store";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";

const AddEvent = () => {
  const [event, setEvent] = useState({
    title: "",
    price: "",
    duration: "",
    venue: "",
    description: "",
    header: "",
    gallery: [],
    people: [],
    score: 0,
    location: {
      longitude: "",
      latitude: "",
    },
  });

  const [location, setLocation] = useState();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleChange = (name, value) => {
    setEvent({
      ...event,
      [name]: value,
    });
  };

  const navigation = useNavigation();
  const collectionRef = collection(db, "events");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const upload = async () => {
    if (event.title == "") {
      Alert.alert("Upload", "Please enter title");
      return;
    }
    if (event.price == "") {
      Alert.alert("Upload", "Please enter price");
      return;
    }
    if (event.duration == "") {
      Alert.alert("Upload", "Please enter duration");
      return;
    }
    if (event.venue == "") {
      Alert.alert("Upload", "Please enter location");
      return;
    }
    if (event.location.longitude == "") {
      Alert.alert("Upload", "Please enter Longitude");
      return;
    }
    if (event.location.latitude == "") {
      Alert.alert("Upload", "Please enter Latitude");
      return;
    }
    if (event.description == "") {
      Alert.alert("Upload", "Please enter description");
      return;
    }
    if (event.header == "") {
      Alert.alert("Upload", "Please upload header photo");
      return;
    }
    if (event.gallery.length == 0) {
      Alert.alert("Upload", "Please upload gallery photos");
      return;
    }
    let uploadData = { ...event };
    uploadData.price = Number(event.price);
    uploadData.duration = Number(event.duration);

    await addDoc(collectionRef, uploadData);
    Alert.alert("Upload", "Event uploaded");
    dispatch(login(user));
    dispatch(adminData(""));
    navigation.navigate("Home");
  };

  const headerInput = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (result == null) return;
    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();
    const filename = result.assets[0].uri.substring(
      result.assets[0].uri.lastIndexOf("/") + 1
    );
    const imageRef = ref(storage, `images/${filename}`);
    uploadBytes(imageRef, blob).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const update = { ...event };
        update.header = url;
        setEvent(update);
      });
    });
  };
  const galleryInput = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
    });
    if (result.assets.length !== 3) {
      Alert.alert("Upload Gallery", "Please select 3 images");
      return;
    }
    let gallery = [];
    result.assets.forEach((asset) => {
      const uploadImage = async () => {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const filename = asset.uri.substring(asset.uri.lastIndexOf("/") + 1);
        const imageRef = ref(storage, `images/${filename}`);
        uploadBytes(imageRef, blob).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            gallery.push(url);
          });
        });
      };
      uploadImage();
    });
    setEvent({
      ...event,
      ["gallery"]: gallery,
    });
  };

  const handlePinpointPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const location = { latitude, longitude };
    handleChange("location", location);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
      }}
    >
      <TouchableOpacity
        className="mt-8 mx-5"
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image className="h-7 w-7" source={require("../assets/back.png")} />
      </TouchableOpacity>
      <Text className="text-white text-4xl text-center mt-2">Add Event</Text>
      <ScrollView className="flex-1 px-4">
        <View className="w-full justify-center flex-1">
          <Text className="text-white text-lg mt-4">Title</Text>
          <TextInput
            name="title"
            value={event.title}
            onChangeText={(value) => handleChange("title", value)}
            className="bg-gray-200 rounded-md py-2 px-3 mt-1"
          ></TextInput>
          <Text className="text-white text-lg mt-1">Price</Text>
          <TextInput
            name="price"
            value={event.price}
            onChangeText={(value) => handleChange("price", value)}
            keyboardType="numeric"
            className="bg-gray-200 rounded-md py-2 px-3 mt-1"
          ></TextInput>
          <Text className="text-white text-lg mt-1">Duration</Text>
          <TextInput
            name="duration"
            value={event.duration}
            onChangeText={(value) => handleChange("duration", value)}
            keyboardType="numeric"
            placeholder="hours"
            className="bg-gray-200 rounded-md py-2 px-3 mt-1"
          ></TextInput>
          <Text className="text-white text-lg mt-1">Venue</Text>
          <TextInput
            value={event.venue}
            onChangeText={(value) => handleChange("venue", value)}
            name="venue"
            className="bg-gray-200 rounded-md py-2 px-3 mt-1"
          ></TextInput>
          <Text className="text-white text-lg mt-1">Location</Text>
          {location && (
            <MapView
              onPress={handlePinpointPress}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              className="h-64"
            >
              <Marker
                coordinate={{
                  latitude: event.location.latitude,
                  longitude: event.location.longitude,
                }}
                className="w-12 h-12"
              ></Marker>
            </MapView>
          )}
          <Text className="text-white text-lg mt-1">Description</Text>
          <TextInput
            name="description"
            value={event.descrtiption}
            onChangeText={(value) => handleChange("description", value)}
            multiline={true}
            className="bg-gray-200 rounded-md py-3 px-3 mt-1 h-24"
            style={{ textAlignVertical: "top" }}
          ></TextInput>
          <View className="flex-row space-x-4 mt-1">
            <View>
              <Text className="text-white text-lg mt-1">Header</Text>
              <TouchableOpacity onPress={headerInput}>
                <View className="flex-row">
                  <Text className="bg-[#1f46bc] py-2 px-4 mt-1 rounded-xl text-white">
                    Select Photo
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <Text className="text-white text-lg mt-1">Gallery</Text>
              <TouchableOpacity onPress={galleryInput}>
                <View className="flex-row">
                  <Text className="bg-[#1f46bc] py-2 px-4 mt-1 rounded-xl text-white">
                    Select 3 Photos
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* sign up button */}
          <TouchableOpacity
            onPress={upload}
            className="bg-[#1f46bc] rounded-2xl mt-6 mb-3"
          >
            <Text className="text-center py-3 text-lg text-white">Upload</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddEvent;
