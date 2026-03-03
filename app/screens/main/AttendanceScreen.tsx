import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, Clock } from 'lucide-react-native';
import styles from '@/styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../../src/constants/api';

const AttendanceScreen = ({ setCurrentScreen }) => {
  const [loading, setLoading] = useState(true);
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceData, setAttendanceData] = useState({
    checkIn: '--:--',
    checkOut: '--:--',
    workingHours: '00:00',
    thisMonth: { present: 0, absent: 0, leaves: 0 }
  });

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const sessionValue = await AsyncStorage.getItem('@user_session');
      if (!sessionValue) {
        Alert.alert("Error", "Session not found");
        return;
      }
      const userData = JSON.parse(sessionValue);
      const token = userData.token;

      // Backend API call (As per your attendance.routes.js)
      const response = await fetch(`${API_BASE}/api/attendance`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();

      // Handling both direct array or { success, data } format
      const data = Array.isArray(result) ? result : result.data || [];
      setAttendanceList(data);

      // --- LOGIC TO MAP BACKEND DATA TO UI ---
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRecord = data.find(item => {
          const itemDate = item.attendance_date || item.check_in?.split('T')[0];
          return itemDate === todayStr;
      });

      // Stats for current month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const stats = data.reduce((acc, curr) => {
        const d = new Date(curr.attendance_date || curr.check_in);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          if (curr.status === 'Present') acc.present++;
          else if (curr.status === 'Absent') acc.absent++;
          else if (curr.status === 'Leave') acc.leaves++;
        }
        return acc;
      }, { present: 0, absent: 0, leaves: 0 });

      setAttendanceData({
        checkIn: todayRecord ? formatTime(todayRecord.check_in) : '--:--',
        checkOut: todayRecord?.check_out ? formatTime(todayRecord.check_out) : '--:--',
        workingHours: todayRecord?.total_hours || '00:00',
        thisMonth: stats
      });

    } catch (error) {
      console.error("Attendance Fetch Error:", error);
      Alert.alert("Error", "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Format Time to AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return "--:--";
    const date = new Date(timeStr);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  };

  // Helper: Format Date for List
  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  if (loading) {
    return (
      <View style={[styles.screenScrollContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Fetching Attendance...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screenScrollContainer}
      contentContainerStyle={styles.screenContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.screenHeader}>
        <TouchableOpacity
          onPress={() => setCurrentScreen('home')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Attendance</Text>
      </View>

      {/* Current Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Attendance</Text>
        <View style={styles.gridContainer}>
          <View style={[styles.gridItemHalf, styles.statusBox, styles.bgGreen50]}>
            <Clock size={32} color="#16A34A" style={{ marginBottom: 8 }} />
            <Text style={styles.textGray600}>Check In</Text>
            <Text style={styles.statusBoxValue}>{attendanceData.checkIn}</Text>
            <Text style={styles.statusBoxSubtext}>Main Office Entry</Text>
          </View>
          <View style={[styles.gridItemHalf, styles.statusBox, styles.bgGray50]}>
            <Clock size={32} color="#9CA3AF" style={{ marginBottom: 8 }} />
            <Text style={styles.textGray600}>Check Out</Text>
            <Text style={styles.statusBoxValue}>{attendanceData.checkOut}</Text>
            <Text style={[styles.statusBoxSubtext, { color: attendanceData.checkOut === '--:--' ? '#9CA3AF' : '#4B5563' }]}>
              {attendanceData.checkOut === '--:--' ? 'Not punched yet' : 'Daily Exit'}
            </Text>
          </View>
        </View>

        <View style={styles.workingHoursBar}>
          <Text>Working Hours Today</Text>
          <Text style={styles.fontBold}>{attendanceData.workingHours} hrs</Text>
        </View>
      </View>

      {/* Monthly Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Summary</Text>
        <View style={styles.gridContainer}>
          <View style={[styles.gridItemThird, styles.summaryBox, styles.bgGreen50]}>
            <Text style={[styles.summaryBoxValue, styles.textGreen600]}>
              {attendanceData.thisMonth.present}
            </Text>
            <Text style={styles.textGray600}>Present</Text>
          </View>
          <View style={[styles.gridItemThird, styles.summaryBox, styles.bgRed50]}>
            <Text style={[styles.summaryBoxValue, styles.textRed600]}>
              {attendanceData.thisMonth.absent}
            </Text>
            <Text style={styles.textGray600}>Absent</Text>
          </View>
          <View style={[styles.gridItemThird, styles.summaryBox, styles.bgBlue50]}>
            <Text style={[styles.summaryBoxValue, styles.textBlue600]}>
              {attendanceData.thisMonth.leaves}
            </Text>
            <Text style={styles.textGray600}>Leaves</Text>
          </View>
        </View>
      </View>

      {/* Recent Punches */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Punches</Text>
        <View style={styles.punchList}>
          {attendanceList.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#9CA3AF', padding: 20 }}>No records found</Text>
          ) : (
            attendanceList.slice(0, 5).map((item, index) => (
              <View key={item.id || index} style={styles.punchItem}>
                <View>
                  <Text style={styles.fontMedium}>{formatDateLabel(item.attendance_date || item.check_in)}</Text>
                  <Text style={styles.textGray600}>
                    Check In: {formatTime(item.check_in)} {item.check_out ? `| Check Out: ${formatTime(item.check_out)}` : ''}
                  </Text>
                </View>
                <View style={[
                  styles.punchBadge, 
                  item.status === 'Present' ? styles.bgGreen100 : styles.bgRed100
                ]}>
                  <Text style={[
                    styles.punchBadgeText, 
                    item.status === 'Present' ? styles.textGreen800 : styles.textRed800
                  ]}>
                    {item.status || 'N/A'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default AttendanceScreen;