import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Alert
} from 'react-native';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Hash, 
  Edit2, 
  Check 
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ onBack }) => {

  // --- STATE ---
  const [userData, setUserData] = useState({
    name: '',
    employee_id: '',
    mobile: '',
    email: '',
    designation: '',
  });

  const [loading, setLoading] = useState(true);
  const [isEditingDesignation, setIsEditingDesignation] = useState(false);
  const [tempDesignation, setTempDesignation] = useState('');

  // --- LOAD DATA ---
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const storedJson = await AsyncStorage.getItem('@user_session');
      const storedData = storedJson ? JSON.parse(storedJson) : null;

      if (!storedData) {
        setLoading(false);
        return;
      }

      // --- FIX: Mapping corrected from storage keys ---
      setUserData({
        name: storedData.name || '',
        ticketNumber: storedData.employee_id || '', // Corrected key
        mobile: storedData.mobile || '',
        email: storedData.email || '',
        designation: storedData.designation || 'Employee',
      });

      setTempDesignation(storedData.designation || 'Employee');

    } catch (e) {
      console.error("Failed to load profile:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE HANDLER ---
  const handleSaveDesignation = async () => {
    if (!tempDesignation.trim()) {
      Alert.alert("Invalid Input", "Designation cannot be empty.");
      return;
    }

    setLoading(true);
    try {
        const storedJson = await AsyncStorage.getItem('@user_session');
        const currentData = storedJson ? JSON.parse(storedJson) : {};

        const updatedData = {
            ...currentData,
            designation: tempDesignation,
        };

        await AsyncStorage.setItem('@user_session', JSON.stringify(updatedData));
        
        setUserData(prev => ({ ...prev, designation: tempDesignation }));
        setIsEditingDesignation(false);
        Alert.alert("Success", "Designation updated!");

    } catch (error) {
        Alert.alert("Error", "Could not save changes.");
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Details</Text>
        <View style={{ width: 10 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.spacer} />

        <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.inputText}>{userData.name}</Text>
                    <User size={18} color="#9CA3AF" />
                </View>
            </View>

            {/* Ticket No */}
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Ticket Number</Text>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.inputText}>{userData.ticketNumber}</Text>
                    <Hash size={18} color="#9CA3AF" />
                </View>
            </View>

            {/* Mobile */}
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.inputText}>{userData.mobile}</Text>
                    <Phone size={18} color="#9CA3AF" />
                </View>
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.readOnlyContainer}>
                    <Text style={styles.inputText}>{userData.email}</Text>
                    <Mail size={18} color="#9CA3AF" />
                </View>
            </View>

            {/* Designation */}
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Designation</Text>
                {isEditingDesignation ? (
                    <View style={styles.editableContainer}>
                        <TextInput
                            style={styles.inputEditable}
                            value={tempDesignation}
                            onChangeText={setTempDesignation}
                            autoFocus
                        />
                        <TouchableOpacity onPress={handleSaveDesignation} style={styles.iconButton}>
                            <Check size={20} color="#22C55E" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.readOnlyContainer}>
                        <Text style={styles.inputText}>{userData.designation}</Text>
                        <TouchableOpacity onPress={() => setIsEditingDesignation(true)} style={styles.iconButton}>
                            <Edit2 size={18} color="#111827" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF'
    },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#FFFFFF'
    },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', paddingHorizontal: 24, 
    paddingTop: Platform.OS === 'android' ? 40 : 20, paddingBottom: 20,
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6'
    },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  scrollContent: { paddingBottom: 40 },
  spacer: { height: 20 },
  formContainer: { paddingHorizontal: 24 },
  inputWrapper: { marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  readOnlyContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', paddingHorizontal: 16, height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  inputText: { fontSize: 15, color: '#111827', fontWeight: '500', flex: 1 },
  editableContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingHorizontal: 16, height: 52, borderRadius: 12, borderWidth: 1.5, borderColor: '#111827' },
  inputEditable: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  iconButton: { padding: 8 },
  backButton: { padding: 4 }
});

export default Profile;

