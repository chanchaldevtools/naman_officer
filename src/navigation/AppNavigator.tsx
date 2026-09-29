import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import SplashView from '../screens/SplashView';
import NoInternetView from '../screens/NoInternetView';
import LoginView from '../screens/LoginView';
import RegisterView from '../screens/RegisterView';
import RegisterDetailsView from '../screens/RegisterDetailsView';
import HomeView from '../screens/HomeView';
import MyHelpsView from '../screens/MyHelpsView';
import VisitView from '../screens/VisitView';
import ProfileView from '../screens/ProfileView';
import AudioPlayerView from '../screens/AudioPlayerView';
import AudioPlayView from '../screens/AudioPlayView';
import ImageDetailsView from '../screens/ImageDetailsView';
import PrivacyView from '../screens/PrivacyView';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Splash" component={SplashView} />
        <Stack.Screen name="NoInternet" component={NoInternetView} />
        <Stack.Screen name="Login" component={LoginView} />
        <Stack.Screen name="Register" component={RegisterView} />
        <Stack.Screen name="RegisterDetails" component={RegisterDetailsView} />
        <Stack.Screen name="Home" component={HomeView} />
        <Stack.Screen name="MyHelps" component={MyHelpsView} />
        <Stack.Screen name="VisitView" component={VisitView} />
        <Stack.Screen name="Profile" component={ProfileView} />
        <Stack.Screen name="AudioPlayer" component={AudioPlayerView} />
        <Stack.Screen name="AudioPlay" component={AudioPlayView} />
        <Stack.Screen name="ImageDetails" component={ImageDetailsView} />
        <Stack.Screen name="Privacy" component={PrivacyView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
