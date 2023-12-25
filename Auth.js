import React from "react";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import Event from "./screens/Event";
import Profile from "./screens/Profile";
import GetStarted from "./screens/GetStarted";
import Menu from "./screens/Menu";
import Maps from "./screens/Maps";
import AddEvent from "./screens/AddEvent";
import Search from "./screens/Search";
import { useDispatch, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./screens/config/firebase";
import { useState } from "react";
import { login } from "./store";
import { collection, doc, getDoc } from "firebase/firestore";
import Update from "./screens/Update";
import Admin from "./screens/Admin";

function Auth() {
  const Stack = createNativeStackNavigator();
  const [loggedIn, setLoggedIn] = useState(false);

  const dispatch = useDispatch();
  // const selector = useSelector((state) => state.user.value);
  // console.log(selector);
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setLoggedIn(true);
      const userDoc = doc(db, "users", currentUser.uid);
      const data = await getDoc(userDoc);
      const user = { ...data.data(), id: data.id };
      dispatch(login(user));
    } else {
      setLoggedIn(false);
    }
  });
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!loggedIn ? (
        <>
          <Stack.Screen name="GetStarted" component={GetStarted} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Admin" component={Admin} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddEvent" component={AddEvent} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="Maps" component={Maps} />
          <Stack.Screen name="Update" component={Update} />
        </>
      )}
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Event" component={Event} />
    </Stack.Navigator>
  );
}

export default Auth;
