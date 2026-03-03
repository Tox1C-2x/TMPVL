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

import { useRouter } from 'expo-router'; 
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import { API_BASE } from '../../../src/constants/api';

const RegisterScreen = () => {
  // --- FIX 2: router initialize karein ---
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // --- FIX 3: Back handle karne ka sahi tareeka ---
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Agar back jane ki jagah nahi hai toh login par bhej do
      router.push('/screens/auth/LoginScreen'); 
    }
  };

 const handleRegister = async () => {
  if (!name || !employeeId || !mobile || !email) {
    Alert.alert('Details Missing', 'Saari details bhariye.');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: employeeId.trim(),
        full_name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
      }),
    });

      const data = await response.json();
      console.log("REGISTER RESPONSE:", data);

      if (data.success) {
      Alert.alert('Success', 'OTP Sent Succesfully');

        // Path hamesha lowercase file name ke hisaab se check karein
        router.push({
          pathname: "/screens/auth/VerifyOTPScreen",
          params: { email, employeeId: data.employeeId || employeeId, mobile }
        });
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Server connection error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Back button fixed logic */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={24} color="#111827" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.logoContainer}>
            <Sparkles size={32} color="#000" />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}> With TMPVL</Text>
        </View>

        <View style={styles.formContainer}>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Ticket Number</Text>
            <TextInput
              style={styles.input}
              placeholder="6-digit Ticket No"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={6}
              value={employeeId}
              onChangeText={setEmployeeId}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.mobileContainer}>
                <Text style={styles.mobilePrefix}>+91</Text>
                <TextInput
                style={styles.mobileInput}
                placeholder="10-digit Mobile No"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
                />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email ID</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>{loading ? "Processing..." : "Sign Up"}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            {/* --- FIX 5: Sahi route path use kiya --- */}
            <TouchableOpacity onPress={() => router.push('/screens/auth/LoginScreen')}>
              <Text style={styles.loginLink}>Log in</Text>
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
    backgroundColor: '#f3f4f6',
    borderRadius: 20
  },
  scrollContainer: { 
    flexGrow: 1, 
    paddingHorizontal: 24, 
    paddingTop: 80, 
    paddingBottom: 40, 
    justifyContent: 'center'
  },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  formContainer: { width: '100%' },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { height: 44, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', fontSize: 16, color: '#111827', paddingVertical: 8 },
  mobileContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', height: 44 },
  mobilePrefix: { fontSize: 16, color: '#111827', marginRight: 10, fontWeight: '500' },
  mobileInput: { flex: 1, fontSize: 16, color: '#111827', paddingVertical: 8 },
  primaryButton: { backgroundColor: '#111827', height: 50, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 24 },
  buttonDisabled: { backgroundColor: '#6B7280' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#6B7280', fontSize: 14 },
  loginLink: { color: '#111827', fontSize: 14, fontWeight: '700', padding: 5 },
});

export default RegisterScreen;

