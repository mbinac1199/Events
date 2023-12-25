import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config/firebase";

const Login = () => {
  const [isChecked, setIsChecked] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleIsChecked = () => {
    setIsChecked(!isChecked);
  };

  const navigation = useNavigation();
  const goToSignUp = () => {
    navigation.navigate("Signup");
  };

  const login = async () => {
    if (email === "admin" && password === "admin") {
      navigation.navigate("Admin");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setEmail("");
        setPassword("");
        navigation.navigate("Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Login failed:", errorMessage);
      });
  };

  return (
    <ImageBackground
      className="flex-1"
      source={require("../assets/background-image.jpg")}
    >
      <ImageBackground className="bg-[#00000082] flex-1">
        <View className="flex-1 justify-center items-center px-4">
          <View className="w-full">
            <Text className="text-white text-3xl mt-10">Welcome back!</Text>
            <Text className="text-gray-200">
              Welcome! Please enter your details.
            </Text>
            <Text className="text-white text-lg mt-5">Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              className="bg-gray-200 rounded-md py-2 px-3 mt-1"
            ></TextInput>
            <Text className="text-white text-lg mt-3">Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              className="bg-gray-200 rounded-md py-2 px-3 mt-1"
            ></TextInput>
            <TouchableOpacity
              onPress={login}
              className="bg-[#1f46bc] rounded-2xl mt-7"
            >
              <Text className="text-center py-3 text-lg text-white">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row mt-3 space-x-2">
            <Text className="text-white">Don't have an account?</Text>
            <TouchableOpacity onPress={goToSignUp}>
              <Text className="text-white font-bold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ImageBackground>
  );
};

export default Login;
