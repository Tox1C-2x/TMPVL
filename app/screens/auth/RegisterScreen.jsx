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

import { Sparkles, ArrowLeft } from 'lucide-react-native';
import { API_BASE } from '../../../src/constants/api';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [ticketNo, setTicketNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !ticketNo || !mobile || !email) {
        Alert.alert('Missing Details', 'Please fill in all fields.');
        return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ticketNo, mobile, email }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        Alert.alert('OTP Sent', 'Check your mobile and email for OTPs!');
        
        // --- FIX: Mobile number ko aage pass kiya ---
        navigation.navigate('otp', {
          email: email,
          ticketNo: data.ticketNo,
          mobile: mobile // Yeh add kiya hai
        });
      } else {
        Alert.alert('Registration Failed', data.message || 'Registration error');
      }
    } catch (err) {
      console.log('register error', err);
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start your journey with TMPVL</Text>
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
              value={ticketNo}
              onChangeText={setTicketNo}
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
            <TouchableOpacity onPress={() => navigation.navigate('login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,
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
    paddingTop: 80, 
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
    color: '#6B7280'
    },
  formContainer: { 
    width: '100%'
    },
  inputWrapper: { 
    marginBottom: 20
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
    paddingVertical: 8
    },
  mobileContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB', 
    height: 44
    },
  mobilePrefix: { 
    fontSize: 16, 
    color: '#111827', 
    marginRight: 10, 
    fontWeight: '500'
    },
  mobileInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#111827', 
    paddingVertical: 8
    },
  primaryButton: { 
    backgroundColor: '#111827', 
    height: 50, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 24, 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2
      }, 
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      elevation: 2
      },
  buttonDisabled: { 
    backgroundColor: '#6B7280'
    },
  primaryButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600'
    },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
    },
  footerText: { 
    color: '#6B7280', 
    fontSize: 14
    },
  loginLink: { 
    color: '#111827', 
    fontSize: 14, 
    fontWeight: '600'
    },
});

export default RegisterScreen;