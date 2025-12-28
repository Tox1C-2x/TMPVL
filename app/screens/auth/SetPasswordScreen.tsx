import React, { useState } from 'react';
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
} from 'react-native';

import { ArrowLeft, Sparkles, Eye, EyeOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Storage Import
import { API_BASE } from '../../../src/constants/api';

const SetPasswordScreen = ({ navigation, route, onLoginSuccess }) => {
  // --- FIX: Mobile receive kiya ---
  const { ticketNo, email, mobile } = route.params || {};
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const handleSetPassword = async () => {
    if (password.length < 8 || password.length > 14) {
      Alert.alert('Weak Password', 'Password must be between 8-14 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const respSet = await fetch(`${API_BASE}/api/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const setData = await respSet.json();

      if (!setData || setData.success !== true) {
        Alert.alert('Failed', setData.message || 'Could not set password.');
        setLoading(false);
        return;
      }

      // 2) Auto-Login immediately
      const respLogin = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId: ticketNo, password }),
      });

      const loginData = await respLogin.json();

      if (loginData && (loginData.status === 'success' || loginData.success === true)) {
        
        // --- CRITICAL FIX: Include Mobile/Email in Session ---
        const userObj = {
          empId: loginData.empId || ticketNo,
          name: loginData.name || '',
          shop: loginData.shop || '',
          designation: loginData.designation || 'Employee',
          shift: loginData.shift || '',
          token: loginData.token || 'tmpvl_dummy_token',
          email: email, // Register wala email
          mobile: mobile || loginData.mobile || '', // Register wala mobile
        };

        // --- Save to Local Storage (Taaki SideMenu padh sake) ---
        await AsyncStorage.setItem('@user_session', JSON.stringify(userObj));

        // Pass to Main App
        onLoginSuccess(userObj);

      } else {
        Alert.alert('Login Failed', 'Password set, but auto-login failed. Please login manually.');
        navigation.navigate('login');
      }
    } catch (err) {
      console.error('Set Password Error:', err);
      Alert.alert('Error', 'Server not reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#111827" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.logoContainer}>
            <Sparkles size={32} color="#000" fill="#000" />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Set new password</Text>
          <Text style={styles.subtitle}>Must be at least 8 characters.</Text>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
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

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm password</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleSetPassword}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Resetting..." : "Reset password"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerLink} 
            onPress={() => navigation.navigate('login')}
          >
            <ArrowLeft size={16} color="#4B5563" style={{marginRight: 6}} />
            <Text style={styles.footerLinkText}>Back to log in</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  backButton: { position: 'absolute', top: 50, left: 24, zIndex: 10 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 100, paddingBottom: 40, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  formContainer: { width: '100%' },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', height: 44 },
  passwordInput: { flex: 1, fontSize: 16, color: '#111827', paddingVertical: 8 },
  primaryButton: { backgroundColor: '#111827', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  buttonDisabled: { backgroundColor: '#6B7280' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footerLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerLinkText: { color: '#4B5563', fontSize: 14, fontWeight: '600' },
});

export default SetPasswordScreen;