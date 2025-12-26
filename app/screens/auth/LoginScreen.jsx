import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

// Icons
import { Eye, EyeOff, Check, Sparkles, Fingerprint } from 'lucide-react-native';

// Libraries for Storage and Biometrics
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

// API Base URL
import { API_BASE } from '../../../src/constants/api';

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  // Modes: 'login' (normal), 'setup_mpin' (first time), 'quick_auth' (next time)
  const [viewMode, setViewMode] = useState('login'); 
  const [isLoading, setIsLoading] = useState(true);

  // Login Data
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // MPIN Data
  const [mpin, setMpin] = useState('');
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    checkSavedUser();
  }, []);

  const checkSavedUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_session');
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        setStoredData(data);
        setViewMode('quick_auth'); 
        handleBiometricAuth(data);
      } else {
        setViewMode('login');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!empId || !password) {
        Alert.alert('Missing Details', 'Please enter your Employee ID and Password.');
        return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empId, password }),
      });

      const data = await response.json(); 

      if (data.status === "success") {
        const userData = {
            empId: data.empId,
            name: data.name,
            shop: data.shop,
            designation: data.designation,
            shift: data.shift,
            token: data.token,
            email: data.email, 
            mobile: data.mobile || data.phoneNumber || '', 
        };

        await AsyncStorage.setItem('@user_session', JSON.stringify(userData));

        if (rememberMe) {
            setStoredData(userData);
            setViewMode('setup_mpin');
            Alert.alert("Setup Security", "Please set a 4-digit MPIN for quick login next time.");
        } else {
            if (onLoginSuccess) onLoginSuccess(userData);
        }
      } 
      else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login Error:', err);
      Alert.alert('Error', 'Server down. Please check after some time.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetMpin = async () => {
      if (mpin.length !== 4) {
          Alert.alert("Invalid MPIN", "Please enter a 4-digit PIN.");
          return;
      }

      const sessionData = { ...storedData, mpin: mpin };
      try {
          await AsyncStorage.setItem('@user_session', JSON.stringify(sessionData));
          Alert.alert("Success", "MPIN Set! Next time use MPIN or Fingerprint.");
          if (onLoginSuccess) onLoginSuccess(storedData);
      } catch (e) {
          Alert.alert("Error", "Could not save login details.");
      }
  };

  const handleMpinLogin = () => {
      if (storedData && storedData.mpin === mpin) {
          if (onLoginSuccess) onLoginSuccess(storedData);
      } else {
          Alert.alert("Wrong MPIN", "Please try again.");
          setMpin('');
      }
  };

  const handleBiometricAuth = async (dataToUse) => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
          const result = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Login with Biometrics',
              fallbackLabel: 'Use MPIN',
          });

          if (result.success) {
              const finalData = dataToUse || storedData;
              if (onLoginSuccess && finalData) onLoginSuccess(finalData);
          }
      }
  };

  const handleSwitchAccount = async () => {
      await AsyncStorage.removeItem('@user_session');
      setViewMode('login');
      setEmpId('');
      setPassword('');
      setMpin('');
  };

  const handleGoogleLogin = () => {
    Alert.alert("Coming Soon", "Google login integration is pending.");
  };

  if (isLoading) {
      return (
          <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
              <ActivityIndicator size="large" color="#111827" />
          </View>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {viewMode === 'login' && (
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
            <Sparkles size={32} color="#000" fill="#000" />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome To TMPVL !</Text>
          <Text style={styles.subtitle}>Please enter your details</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Employee ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your ID"
              placeholderTextColor="#9CA3AF"
              value={empId}
              onChangeText={setEmpId}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                style={styles.passwordInput}
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Check size={12} color="#fff" strokeWidth={4} />}
                </View>
                <Text style={styles.rememberText}>Remember for 30 days</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert('Reset', 'Contact Admin to reset password.')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Text style={styles.googleIcon}>G</Text> 
            <Text style={styles.googleButtonText}>Log in with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('register')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      )}

      {/* SETUP MPIN */}
      {viewMode === 'setup_mpin' && (
          <View style={styles.centerContainer}>
              <Text style={styles.title}>Set MPIN</Text>
              <Text style={styles.subtitle}>Create a 4-digit PIN for quick access</Text>
              
              <TextInput
                  style={styles.mpinInput}
                  keyboardType="numeric"
                  maxLength={4}
                  value={mpin}
                  onChangeText={setMpin}
                  secureTextEntry
                  autoFocus
              />

              <TouchableOpacity style={styles.loginButton} onPress={handleSetMpin}>
                  <Text style={styles.loginButtonText}>Save MPIN</Text>
              </TouchableOpacity>
          </View>
      )}

      {/* QUICK AUTH */}
      {viewMode === 'quick_auth' && (
          <View style={styles.centerContainer}>
              <View style={styles.logoContainer}>
                <Sparkles size={40} color="#000" fill="#000" />
              </View>
              
              <Text style={styles.title}>Welcome, {storedData?.name}!</Text>
              <Text style={styles.subtitle}>Enter MPIN to continue</Text>

              <TextInput
                  style={styles.mpinInput}
                  keyboardType="numeric"
                  maxLength={4}
                  value={mpin}
                  onChangeText={setMpin}
                  secureTextEntry
                  placeholder="••••"
                  placeholderTextColor="#9CA3AF"
              />

              <TouchableOpacity style={styles.loginButton} onPress={handleMpinLogin}>
                  <Text style={styles.loginButtonText}>Unlock</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bioButton} onPress={() => handleBiometricAuth(null)}>
                  <Fingerprint size={24} color="#111827" />
                  <Text style={styles.bioText}>Use Biometric</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchButton} onPress={handleSwitchAccount}>
                  <Text style={styles.switchText}>Switch Account</Text>
              </TouchableOpacity>
          </View>
      )}

    </SafeAreaView>
  );
};

// --------------- CLEAN STYLES (Line by Line) ---------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  
  centerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  formContainer: {
    width: '100%',
  },
  
  inputWrapper: {
    marginBottom: 20,
  },
  
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  input: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
  },
  
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    height: 44,
  },
  
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  
  checkboxChecked: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  
  rememberText: {
    fontSize: 13,
    color: '#4B5563',
  },
  
  forgotText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  
  loginButton: {
    backgroundColor: '#111827',
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  googleButton: {
    backgroundColor: '#F3F4F6',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 40,
  },
  
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 10,
  },
  
  googleButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  
  signUpText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // MPIN Specific Styles
  mpinInput: {
    fontSize: 32,
    letterSpacing: 10,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
    width: 150,
    marginBottom: 30,
    color: '#111827',
    paddingVertical: 10,
  },
  
  bioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  
  bioText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  
  switchButton: {
    padding: 10,
  },
  
  switchText: {
    color: '#6B7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;