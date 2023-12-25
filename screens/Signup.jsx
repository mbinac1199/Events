import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./config/firebase";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isChecked, setIsChecked] = useState();
  const toggleIsChecked = () => {
    setIsChecked(!isChecked);
  };

  const navigation = useNavigation();
  const goToLogin = () => {
    navigation.navigate("Login");
  };

  const handleChange = (name, value) => {
    setUser({
      ...user,
      [name]: value,
    });
  };

  const Register = async () => {
    try {
      const { email, password, username } = user;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then(async (cred) => {
        await setDoc(doc(db, "users", cred.user.uid), {
          username,
          buddies: [],
          firstName: "",
          lastName: "",
          cnic: "",
          phone: "",
          score: 0,
          email: email,
          image:
            "https://firebasestorage.googleapis.com/v0/b/eventify-86b12.appspot.com/o/user_318-159711.webp?alt=media&token=43cd37a5-38ba-4d16-96de-633ac62deb84",
        });
      });
      setUser({ ...user, email: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageBackground
      className="flex-1"
      source={require("../assets/background-image.jpg")}
    >
      <ImageBackground className="bg-[#00000082] flex-1">
        <View className="flex-1 justify-center items-center px-4">
          <View className="w-full">
            <Text className="text-white text-3xl mt-10">Welcome!</Text>
            <Text className="text-gray-200">Please enter your details.</Text>
            <Text className="text-white text-lg mt-5">Username</Text>
            <TextInput
              name="username"
              value={user.username}
              onChangeText={(value) => handleChange("username", value)}
              className="bg-gray-200 rounded-md py-2 px-3 mt-1"
            ></TextInput>
            <Text className="text-white text-lg mt-3">Email</Text>
            <TextInput
              name="email"
              value={user.email}
              onChangeText={(value) => handleChange("email", value)}
              className="bg-gray-200 rounded-md py-2 px-3 mt-1"
            ></TextInput>
            <Text className="text-white text-lg mt-3">Password</Text>
            <TextInput
              name="password"
              value={user.password}
              onChangeText={(value) => handleChange("password", value)}
              secureTextEntry={true}
              className="bg-gray-200 rounded-md py-2 px-3 mt-1"
            ></TextInput>
            <Text className="text-white text-lg mt-3">Confirm Password</Text>
            <TextInput
              name="confirmPassword"
              value={user.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
              secureTextEntry={true}
              className="bg-gray-200 rounded-md py-2 px-3 mt-1"
            />
            <TouchableOpacity
              onPress={Register}
              className="bg-[#1f46bc] rounded-2xl mt-7"
            >
              <Text className="text-center py-3 text-lg text-white">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row mt-3 space-x-2">
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

export default Signup;
