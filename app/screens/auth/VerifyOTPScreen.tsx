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

// Expo Router hooks
import { useRouter, useLocalSearchParams } from 'expo-router';
// Icons
import { ArrowLeft, Smartphone } from 'lucide-react-native';
// API Config
import { API_BASE } from '../../../src/constants/api';

const VerifyOTPScreen = () => {
  const router = useRouter();
  
  // --- SYNC WITH BACKEND: mobile aur email params receive karein ---
  const { mobile, email, employeeId } = useLocalSearchParams();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    // Basic Validation
    if (otp.length < 4) {
      Alert.alert('Invalid OTP', 'Kripya sahi OTP enter karein.');
      return;
    }

    setLoading(true);
    try {
      // --- BACKEND SYNC: Sending { mobile, otp } as per your service ---
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile, // Backend expects 'mobile'
          otp: otp,       // Backend expects 'otp' (mapped to phone_otp in DB)
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Mobile number verified successfully!');

        // Navigating to Set Password Screen
        router.push({
          pathname: "/screens/auth/SetPasswordScreen",
          params: {
            mobile: mobile,
            email: email,
            employeeId: employeeId,
          }
        });
      } else {
        // Backend throw errors like "Invalid OTP", "OTP expired", etc.
        Alert.alert('Verification Failed', data.message || data.error || 'Invalid OTP');
      }
    } catch (err) {
      console.error('OTP Verify Error:', err);
      Alert.alert('Connection Error', 'Server se contact nahi ho pa raha hai.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#111827" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.iconContainer}>
            <Smartphone size={48} color="#111827" />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your mobile number:{"\n"}
            <Text style={{fontWeight: '700', color: '#111827'}}>+91 {mobile}</Text>
          </Text>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="000000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Verify Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={() => Alert.alert('OTP Sent', 'Naya OTP bhej diya gaya hai.')}>
              <Text style={styles.linkText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>

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
  iconContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  headerContainer: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
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
  formContainer: { 
    width: '100%' 
  },
  inputWrapper: { 
    marginBottom: 24 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#374151', 
    marginBottom: 8,
    textAlign: 'center'
  },
  input: { 
    height: 60, 
    borderBottomWidth: 2, 
    borderBottomColor: '#111827', 
    fontSize: 28, 
    color: '#111827', 
    textAlign: 'center',
    letterSpacing: 12
  },
  primaryButton: { 
    backgroundColor: '#111827', 
    height: 54, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 30 
  },
  buttonDisabled: { backgroundColor: '#6B7280' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#6B7280', fontSize: 14 },
  linkText: { color: '#111827', fontSize: 14, fontWeight: '700' },
});

export default VerifyOTPScreen;

