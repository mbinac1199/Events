import { NavigationContainer } from "@react-navigation/native"; 
import { Provider } from "react-redux";
import { store } from "./store";
import Auth from "./Auth";


export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Auth />
      </Provider>
    </NavigationContainer>
  );
}
