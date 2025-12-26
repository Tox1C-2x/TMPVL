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

import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { API_BASE } from '../../../src/constants/api';

const VerifyOTPScreen = ({ navigation, route }) => {
  // --- FIX: Mobile receive kiya ---
  const { email, ticketNo, mobile } = route.params || {};
  
  const [mobileOtp, setMobileOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (mobileOtp.length !== 6 || emailOtp.length !== 6) {
      Alert.alert('Incomplete', 'Please enter both 6-digit OTPs.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketNo,
          mobileOtp,
          emailOtp,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        Alert.alert('Success', 'OTP Verified Successfully!');

        // --- FIX: Mobile number ko password screen par bheja ---
        navigation.navigate('password', {
          email: email,
          ticketNo: ticketNo,
          mobile: mobile, // Yeh data flow tootna nahi chahiye
          defaultPass: data.password, 
        });
      } else {
        Alert.alert('Verification Failed', data.error || data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('OTP Verify Error:', err);
      Alert.alert('Error', 'Server not reachable.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('register')}>
        <ArrowLeft size={24} color="#111827" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.logoContainer}>
            <Sparkles size={32} color="#000" fill="#000" />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the code sent to your mobile & email</Text>
        </View>

        <View style={styles.formContainer}>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Mobile OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={6}
              value={mobileOtp}
              onChangeText={setMobileOtp}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={6}
              value={emailOtp}
              onChangeText={setEmailOtp}
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
                {loading ? "Verifying..." : "Verify & Proceed"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Resend feature is in progress.')}>
              <Text style={styles.linkText}>Resend</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF'
    },
  backButton: { 
    position: 'absolute', 
    top: 50,
    left: 24, 
    zIndex: 10
    },
  scrollContainer: { 
    flexGrow: 1, 
    paddingHorizontal: 24, 
    paddingTop: 100, 
    paddingBottom: 40, 
    justifyContent: 'center'
    },
  logoContainer: { 
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
    marginBottom: 8, 
    letterSpacing: -0.5
    },
  subtitle: { 
    fontSize: 16, 
    color: '#6B7280', 
    textAlign: 'center'
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
    marginBottom: 8
    },
  input: { 
    height: 44, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB', 
    fontSize: 16, 
    color: '#111827', 
    paddingVertical: 8, 
    letterSpacing: 1
    },
  primaryButton: { backgroundColor: '#111827', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  buttonDisabled: { backgroundColor: '#6B7280' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#6B7280', fontSize: 14 },
  linkText: { color: '#111827', fontSize: 14, fontWeight: '600' },
});

export default VerifyOTPScreen;