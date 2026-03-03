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
  ActivityIndicator,
} from 'react-native';

// Expo Router hooks (Proper Sync)
import { useRouter, useLocalSearchParams } from 'expo-router';
// Icons
import { ArrowLeft, Sparkles, Eye, EyeOff } from 'lucide-react-native';
// Storage for session (if needed)
import AsyncStorage from '@react-native-async-storage/async-storage';
// API Config
import { API_BASE } from '../../../src/constants/api';

const SetPasswordScreen = () => {
  const router = useRouter();
  
  // --- SYNC: Previous screens se mobile aur employeeId receive karein ---
  const { mobile, employeeId, email } = useLocalSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const handleSetPassword = async () => {
    // 1) Validations
    if (!password || !confirmPassword) {
      Alert.alert('Details Missing', 'Kripya dono password fields bhariye.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password kam se kam 8 characters ka hona chahiye.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Dono password match nahi ho rahe hain.');
      return;
    }

    setLoading(true);
    try {
      // --- BACKEND SYNC: Sending { mobile, password } as per your backend snippet ---
      const response = await fetch(`${API_BASE}/api/auth/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile, // Backend expects mobile
          password: password, // Backend expects password (will be hashed there)
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Success', 
          'Your Password has been succesfully Saved! Please LogIN',
          [
            { 
              text: 'Back to LogIn', 
              onPress: () => router.replace('/screens/auth/LoginScreen') // Seedha login page par bhej dein
            }
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Password set karne mein dikat aayi.');
      }
    } catch (err) {
      console.error('Set Password Error:', err);
      Alert.alert('Connection Error', 'Server se sampark nahi ho pa raha hai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#111827" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.logoContainer}>
            <Sparkles size={32} color="#111827" fill="#111827" />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Set Password</Text>
          <Text style={styles.subtitle}>
            Apna naya surakshit password banayein.{'\n'}
            ID: <Text style={{fontWeight: '700', color: '#111827'}}>{employeeId}</Text>
          </Text>
        </View>

        <View style={styles.formContainer}>
          
          {/* New Password Field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>New Password</Text>
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

          {/* Confirm Password Field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
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

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleSetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Finish & Save</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerLink} 
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.footerLinkText}>Cancel & Go to Login</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 24, 
    zIndex: 10,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20
  },
  scrollContainer: { 
    flexGrow: 1, 
    paddingHorizontal: 24, 
    paddingTop: 100, 
    paddingBottom: 40, 
    justifyContent: 'center' 
  },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 15, 
    color: '#6B7280', 
    textAlign: 'center',
    lineHeight: 22
  },
  formContainer: { width: '100%' },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 2, 
    borderBottomColor: '#E5E7EB', 
    height: 48 
  },
  passwordInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#111827', 
    paddingVertical: 8 
  },
  primaryButton: { 
    backgroundColor: '#111827', 
    height: 54, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20, 
    marginBottom: 20 
  },
  buttonDisabled: { backgroundColor: '#6B7280' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footerLink: { alignItems: 'center', marginTop: 10 },
  footerLinkText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
});

export default SetPasswordScreen;

