import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Clock, Calendar, DollarSign, FileText } from 'lucide-react-native';
import styles from '@/styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../../src/constants/api';

const HomeScreen = ({ setCurrentScreen }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  
  const [attendanceData, setAttendanceData] = useState({
    checkIn: '--:--',
    todayStatus: 'Pending',
    currentTime: '--:--',
    thisMonth: { present: 0 }
  });

  const [salaryData, setSalaryData] = useState({
    netSalary: 0
  });

  useEffect(() => {
    loadDashboardData();
    
    // Live Clock Timer
    const timer = setInterval(() => {
      const now = new Date();
      setAttendanceData(prev => ({
        ...prev,
        currentTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const sessionValue = await AsyncStorage.getItem('@user_session');
      if (sessionValue) {
        const parsedUser = JSON.parse(sessionValue);
        setUserData(parsedUser);

        // Fetch Attendance Stats from Backend
        const response = await fetch(`${API_BASE}/api/attendance`, {
          headers: { "Authorization": `Bearer ${parsedUser.token}` }
        });
        const result = await response.json();
        const records = Array.isArray(result) ? result : (result.data || []);

        // Logic for Today's Stats
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecord = records.find(r => (r.attendance_date || r.check_in?.split('T')[0]) === todayStr);

        // Logic for This Month's Presence
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const presentDays = records.filter(r => {
          const d = new Date(r.attendance_date || r.check_in);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.status === 'Present';
        }).length;

        setAttendanceData(prev => ({
          ...prev,
          checkIn: todayRecord ? formatTime(todayRecord.check_in) : '--:--',
          todayStatus: todayRecord ? 'Present' : 'Pending',
          thisMonth: { present: presentDays }
        }));

        // Note: Salary data usually comes from a different endpoint
        // Using a placeholder or sync if salary route is available
        setSalaryData({ netSalary: 45000 }); // Default or fetch from /api/salary
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "--:--";
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={[styles.screenScrollContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{marginTop: 10, color: '#6B7280'}}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screenScrollContainer}
      contentContainerStyle={styles.screenContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={styles.dashboardTitle}>Hi, {userData?.name || "Employee"}</Text>
          <Text style={styles.dashboardSubtitle}>{userData?.designation || "TMPVL Team"}</Text>
        </View>
        
        <View style={styles.dashboardUserIcon}>
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              style={{ width: 64, height: 64, borderRadius: 32 }} 
            />
          ) : (
            <User size={32} color="#2563EB" />
          )}
        </View>
      </View>

      {/* Real-time Status Card */}
      <LinearGradient
        colors={['#3B82F6', '#2563EB']}
        style={styles.realTimeCard}
      >
        <View style={styles.realTimeCardHeader}>
          <View style={styles.realTimeCardTitle}>
            <Clock size={24} color="white" />
            <Text style={styles.realTimeCardTitleText}>Today's Status</Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>Live</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridItemHalf}>
            <Text style={styles.realTimeCardLabel}>Check In</Text>
            <Text style={styles.realTimeCardValue}>{attendanceData.checkIn}</Text>
          </View>
          <View style={styles.gridItemHalf}>
            <Text style={styles.realTimeCardLabel}>Status</Text>
            <Text style={styles.realTimeCardValue}>
              {attendanceData.todayStatus}
            </Text>
          </View>
        </View>

        <View style={styles.realTimeCardFooter}>
          <Text style={styles.realTimeCardLabel}>
            Current Time: {attendanceData.currentTime}
          </Text>
          <Text style={styles.realTimeCardLabel}>Shift: {userData?.shift || "General"}</Text>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.gridContainer}>
        <View style={[styles.card, styles.gridItemHalf]}>
          <View style={styles.quickStat}>
            <Calendar color="#16A34A" size={20} />
            <View>
              <Text style={styles.textGray600}>This Month</Text>
              <Text style={styles.fontBold}>
                {attendanceData.thisMonth.present} Days Present
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.gridItemHalf]}>
          <View style={styles.quickStat}>
            <DollarSign color="#2563EB" size={20} />
            <View>
              <Text style={styles.textGray600}>Net Salary</Text>
              <Text style={styles.fontBold}>
                ₹{salaryData.netSalary.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.gridContainer}>
        <TouchableOpacity
          onPress={() => setCurrentScreen('attendance')}
          style={[styles.quickAction, styles.quickActionBlue, styles.gridItemHalf]}
        >
          <Clock color="#2563EB" size={24} />
          <View style={styles.quickActionText}>
            <Text style={styles.fontSemiBold}>Attendance</Text>
            <Text style={styles.textGray600}>View & Mark</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentScreen('salary')}
          style={[
            styles.quickAction,
            styles.quickActionGreen,
            styles.gridItemHalf,
          ]}
        >
          <FileText color="#16A34A" size={24} />
          <View style={styles.quickActionText}>
            <Text style={styles.fontSemiBold}>Salary Slip</Text>
            <Text style={styles.textGray600}>View & Download</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, styles.bgGreen500]} />
            <Text style={styles.textSmall}>
              {attendanceData.checkIn !== '--:--' 
                ? `Punched In at ${attendanceData.checkIn}` 
                : 'Pending daily attendance'}
            </Text>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, styles.bgBlue500]} />
            <Text style={styles.textSmall}>Salary slip for this month generated</Text>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, styles.bgOrange500]} />
            <Text style={styles.textSmall}>No new leave notifications</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

