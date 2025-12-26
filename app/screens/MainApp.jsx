import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

// Imported Modules
import styles from '../styles/styles.js';
import BottomNavigation from '../components/BottomNavigation';
import SideMenu from '../components/SideMenu';

// Screens
import HomeScreen from './main/HomeScreen';
import AttendanceScreen from './main/AttendanceScreen';
import SalaryScreen from './main/SalaryScreen';
import LeaveScreen from './main/LeaveScreen';
// --- FIX 1: Correct Import Path ---
import Profile from './main/Profile'; 

const MainApp = ({ onLogout, user }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Image Picker Logic
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions needed!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Data States
  const [attendanceData, setAttendanceData] = useState({
    todayStatus: 'Present',
    checkIn: '06:15 AM',
    checkOut: null,
    workingHours: '8h 30m',
    thisMonth: { present: 22, absent: 2, leaves: 1 },
    currentTime: new Date().toLocaleTimeString('en-IN'),
  });

  const [salaryData, setSalaryData] = useState({
    currentMonth: 'November 2025',
    basicSalary: 18000,
    hra: 18000,
    medicalAllowance: 1500,
    transportAllowance: 2000,
    overtimeAmount: 3500,
    bonusAmount: 5000,
    grossSalary: 75000,
    pfDeduction: 5400,
    esiDeduction: 562.5,
    taxDeduction: 8500,
    otherDeductions: 1000,
    totalDeductions: 15462.5,
    netSalary: 18000,
    workingDays: 25,
    presentDays: 22,
    leavesTaken: 1,
    overtimeHours: 15,
  });

  const [leaveBalance, setLeaveBalance] = useState({
    casual: 8,
    sick: 10,
    earned: 15,
  });

  const [salaryHistory, setSalaryHistory] = useState([
    { id: '1', month: 'October 2025', netSalary: 17850.00 },
    { id: '2', month: 'September 2025', netSalary: 17600.50 },
    { id: '3', month: 'August 2025', netSalary: 18050.00 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttendanceData((prev) => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString('en-IN'),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderScreen = () => {
    const screenProps = {
      user,
      setCurrentScreen,
    };

    switch (currentScreen) {
      case 'attendance':
        return <AttendanceScreen {...screenProps} attendanceData={attendanceData} />;
      case 'salary':
        return <SalaryScreen {...screenProps} salaryData={salaryData} salaryHistory={salaryHistory} />;
      case 'leaves':
        return <LeaveScreen {...screenProps} leaveBalance={leaveBalance} />;
      
      // --- FIX 2: Profile Case Add kiya ---
      case 'profile':
        return (
          <Profile 
            user={user} 
            onBack={() => setCurrentScreen('home')} 
          />
        );

      default:
        return (
          <HomeScreen
            {...screenProps}
            attendanceData={attendanceData}
            salaryData={salaryData}
            profileImage={profileImage}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Agar Profile khula hai to Header mat dikhao (Profile ka apna header hai) */}
      {currentScreen !== 'profile' && (
        <View style={styles.header}>
          <View style={styles.headerTitleGroup}>
            <View style={styles.headerLogo}>
              <Text style={styles.headerLogoText}>T</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>TMPVL</Text>
              <Text style={styles.headerSubtitle}>TATA Employee Portal</Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => setMenuVisible(true)}
            style={{
              width: 44, height: 44, backgroundColor: '#F3F4F6',
              borderRadius: 12, alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: '#E5E7EB',
            }}
          >
            <Menu size={24} color="#111827" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      )}

      <SideMenu 
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        user={user}
        onLogout={onLogout}
        profileImage={profileImage}
        onImagePick={pickImage}
        // --- FIX 3: Function pass kiya SideMenu ko ---
        onProfileClick={() => {
          setMenuVisible(false); // Menu band karo
          setCurrentScreen('profile'); // Screen switch karo
        }}
      />

      <View style={styles.contentArea}>
        {renderScreen()}
      </View>

      {/* Profile par Bottom Bar nahi dikhana */}
      {currentScreen !== 'profile' && (
        <BottomNavigation
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      )}
    </SafeAreaView>
  );
};

export default MainApp;