import React, { useState } from 'react';
import { Alert } from 'react-native';

// Auth Screens new correct paths
import MainApp from './screens/MainApp';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import VerifyOTPScreen from './screens/auth/VerifyOTPScreen';
import SetPasswordScreen from './screens/auth/SetPasswordScreen';


// --- TOP LEVEL APP COMPONENT ---
// Yeh component decide karega ki Login dikhana hai ya Main App
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState('login'); // 'login', 'register', 'otp', 'password'
  const [authRouteParams, setAuthRouteParams] = useState({});
  const [appUser, setAppUser] = useState(null);

  // Jab login success ho
  const handleLoginSuccess = (userData) => {
    setAppUser(userData);
    setIsLoggedIn(true);
    setAuthRouteParams({});
  };

  // Jab logout ho
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          setIsLoggedIn(false);
          setAppUser(null);
          setAuthScreen('login');
        },
      },
    ]);
  };

  // Custom navigation function jo screen aur params dono handle karega
  const handleAuthNavigation = (screenName, params = {}) => {
    setAuthRouteParams(params);
    setAuthScreen(screenName);
  };

  // Kaun sa auth screen dikhana hai
  const renderAuthScreen = () => {
    const navProps = {
      navigation: { navigate: handleAuthNavigation },
      route: { params: authRouteParams },
    };

    switch (authScreen) {
      case 'register':
        return <RegisterScreen {...navProps} />;
      case 'otp':
        return <VerifyOTPScreen {...navProps} />;
      case 'password':
        return (
          <SetPasswordScreen {...navProps} onLoginSuccess={handleLoginSuccess} />
        );
      case 'login':
      default:
        return <LoginScreen {...navProps} onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <MainApp onLogout={handleLogout} user={appUser} />
      ) : (
        renderAuthScreen()
      )}
    </>
  );
};

export default App;
