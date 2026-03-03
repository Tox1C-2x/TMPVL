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

// router
import { useRouter } from "expo-router";
// Icons
import { Eye, EyeOff, Check, Sparkles, Fingerprint } from 'lucide-react-native';

// Libraries for Storage and Biometrics
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

// API Base URL
import { API_BASE } from '../../../src/constants/api';

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const router = useRouter();
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
        if (data.mpin) {
            setViewMode('quick_auth'); 
            handleBiometricAuth(data);
        } else {
            setViewMode('login');
        }
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
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: empId,
          password: password
        }),
      });

      const data = await response.json(); 

      if (data.success) {
        // --- SYNCING BACKEND DATA TO FRONTEND PROFILE KEYS ---
        const userData = {
          employee_id: data.employee_id, // backend se mapped
          name: data.full_name || data.name, // handles both backend formats
          email: data.email,
          mobile: data.mobile,
          designation: data.designation || 'Employee',
          token: data.token,
        };

        // Storage mein save karein
        await AsyncStorage.setItem("@user_session", JSON.stringify(userData));

        if (rememberMe) {
            setStoredData(userData);
            setViewMode('setup_mpin');
            Alert.alert("Setup Security", "Please set a 4-digit MPIN for quick login.");
        } else {
            if (onLoginSuccess) onLoginSuccess(userData);
        }
      } 
      else {
        Alert.alert('Login Failed', data.error || data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login Error:', err);
      Alert.alert('Error', 'Server down');
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
          Alert.alert("Success", "MPIN Set! Now you can login quickly.");
          if (onLoginSuccess) onLoginSuccess(sessionData);
      } catch (e) {
          Alert.alert("Error", "Could not save security settings.");
      }
  };

  const handleMpinLogin = () => {
      if (storedData && storedData.mpin === mpin) {
          if (onLoginSuccess) onLoginSuccess(storedData);
      } else {
          Alert.alert("Wrong MPIN", "Access denied. Please try again.");
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
      setStoredData(null);
      setEmpId('');
      setPassword('');
      setMpin('');
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
          <Text style={styles.subtitle}>Log in to manage your profile</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Employee ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1000123"
              placeholderTextColor="#9CA3AF"
              value={empId}
              onChangeText={setEmpId}
              autoCapitalize="none"
              keyboardType="numeric"
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
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Check size={12} color="#fff" strokeWidth={4} />}
                </View>
                <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert('Help', 'Please contact IT department to reset password.')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New employee? </Text>
            <TouchableOpacity onPress={() => router.push('/screens/auth/RegisterScreen')}>
              <Text style={styles.signUpText}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      )}

      {/* SETUP MPIN */}
      {viewMode === 'setup_mpin' && (
          <View style={styles.centerContainer}>
              <Text style={styles.title}>Create MPIN</Text>
              <Text style={styles.subtitle}>Enter 4 digits for quick unlock</Text>
              
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
                  <Text style={styles.loginButtonText}>Save & Finish</Text>
              </TouchableOpacity>
          </View>
      )}

      {/* QUICK AUTH */}
      {viewMode === 'quick_auth' && (
          <View style={styles.centerContainer}>
              <View style={styles.logoContainer}>
                <Sparkles size={40} color="#000" fill="#000" />
              </View>
              
              <Text style={styles.title}>Welcome back,</Text>
              <Text style={styles.userNameText}>{storedData?.name}</Text>
              <Text style={styles.subtitle}>Enter MPIN to Unlock</Text>

              <TextInput
                  style={styles.mpinInput}
                  keyboardType="numeric"
                  maxLength={4}
                  value={mpin}
                  onChangeText={setMpin}
                  secureTextEntry
                  placeholder="••••"
                  placeholderTextColor="#D1D5DB"
              />

              <TouchableOpacity style={styles.loginButton} onPress={handleMpinLogin}>
                  <Text style={styles.loginButtonText}>Unlock App</Text>
              </TouchableOpacity>

              <View style={styles.quickOptions}>
                <TouchableOpacity style={styles.bioButton} onPress={() => handleBiometricAuth(null)}>
                    <Fingerprint size={28} color="#111827" />
                    <Text style={styles.bioText}>Touch ID</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.switchButton} onPress={handleSwitchAccount}>
                    <Text style={styles.switchText}>Switch Account</Text>
                </TouchableOpacity>
              </View>
          </View>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  userNameText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F3F4F6',
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F3F4F6',
    height: 50,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 35,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  rememberText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
  },
  loginButton: {
    backgroundColor: '#111827',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signUpText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
  },
  mpinInput: {
    fontSize: 36,
    letterSpacing: 15,
    textAlign: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#111827',
    width: 180,
    marginBottom: 40,
    marginTop: 20,
    color: '#111827',
    fontWeight: '700',
    paddingVertical: 10,
  },
  quickOptions: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  bioButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
  },
  bioText: {
    marginTop: 8,
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  switchButton: {
    padding: 15,
  },
  switchText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

