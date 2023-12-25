import { View, Text } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "./config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Image } from "react-native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "../store";
import { useNavigation } from "@react-navigation/native";

const Update = () => {
  let data = useSelector((state) => state.user.value);
  const [user, setUser] = useState(data);

  const handleChange = (name, value) => {
    setUser({
      ...user,
      [name]: value,
    });
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const update = async () => {
    const userDoc = doc(db, "users", user.id);
    await updateDoc(userDoc, user).then(() => {
      dispatch(login(user));
      navigation.navigate("Home");
    });
  };

  const goBack = () => {
    navigation.goBack();
  };

  const profilePic = async () => {
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
        const update = { ...user };
        update.image = url;
        setUser(update);
      });
    });
  };

  return (
    <View className="flex-1 px-4 bg-black">
      <View className="w-full justify-center flex-1">
        <TouchableOpacity onPress={goBack}>
          <Image className="h-7 w-7" source={require("../assets/back.png")} />
        </TouchableOpacity>
        <Text className="text-white text-4xl text-center mt-4">
          Update Profile
        </Text>
        <TouchableOpacity onPress={profilePic}>
          <Image
            className="mt-8 mb-5 w-20 h-20 rounded-full"
            source={{ uri: user.image }}
          />
        </TouchableOpacity>
        <Text className="text-white text-lg mt-4">First Name</Text>
        <TextInput
          name="firstName"
          value={user.firstName}
          onChangeText={(value) => handleChange("firstName", value)}
          className="bg-gray-200 rounded-md py-2 px-3 mt-1 text-lg"
        ></TextInput>
        <Text className="text-white text-lg mt-4">Last Name</Text>
        <TextInput
          name="lastName"
          value={user.lastName}
          onChangeText={(value) => handleChange("lastName", value)}
          className="bg-gray-200 rounded-md py-2 px-3 mt-1 text-lg"
        ></TextInput>
        <Text className="text-white text-lg mt-4">Phone</Text>
        <TextInput
          name="phone"
          value={user.phone}
          onChangeText={(value) => handleChange("phone", value)}
          className="bg-gray-200 rounded-md py-2 px-3 mt-1 text-lg"
        ></TextInput>
        <Text className="text-white text-lg mt-4">CNIC</Text>
        <TextInput
          name="cnic"
          value={user.cnic}
          onChangeText={(value) => handleChange("cnic", value)}
          className="bg-gray-200 rounded-md py-2 px-3 mt-1 text-lg"
        ></TextInput>
        <TouchableOpacity
          onPress={update}
          className="bg-[#1f46bc] rounded-2xl mt-6"
        >
          <Text className="text-center py-3 text-lg text-white">Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Update;
