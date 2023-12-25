import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { PROVIDER_GOOGLE } from "react-native-maps";

const Maps = () => {
  const user = useSelector((state) => state.user.value);
  const {
    params: { locations, buddy },
  } = useRoute();
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

  const navigation = useNavigation();
  const goToHome = () => {
    navigation.navigate("Home");
  };
  const open = (data) => {
    if (buddy) {
      navigation.navigate("Profile", { user: data });
    } else {
      navigation.navigate("Event", { event: data });
    }
  };
  return (
    <>
      {location && (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            className="flex-1"
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={user?.firstName}
              description={"You're here"}
              identifier="origin"
              pinColor="#00CCBB"
              className="h-16 w-16"
            >
              <Image
                className="w-16 h-16 rounded-full"
                source={{ uri: user?.image }}
              />
            </Marker>
            {locations.map((location, index) => (
              <Marker
                key={index}
                className="w-14 h-14"
                onPress={() => open(location)}
                coordinate={{
                  latitude: location.location.latitude,
                  longitude: location.location.longitude,
                }}
              >
                <Image
                  className="w-14 h-14 rounded-full"
                  source={{ uri: buddy ? location.image : location.header }}
                ></Image>
              </Marker>
            ))}
          </MapView>
          <TouchableOpacity
            className="absolute top-20 left-5"
            onPress={goToHome}
          >
            <Image className="h-7 w-7" source={require("../assets/back.png")} />
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

export default Maps;
