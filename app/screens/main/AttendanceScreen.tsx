import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Clock } from 'lucide-react-native';
import styles from '@/styles/styles';

const AttendanceScreen = ({ attendanceData, setCurrentScreen }) => (
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
          <Text style={styles.statusBoxSubtext}>Gate 1 - Main Entry</Text>
        </View>
        <View style={[styles.gridItemHalf, styles.statusBox, styles.bgGray50]}>
          <Clock size={32} color="#9CA3AF" style={{ marginBottom: 8 }} />
          <Text style={styles.textGray600}>Check Out</Text>
          <Text style={styles.statusBoxValue}>--:--</Text>
          <Text style={[styles.statusBoxSubtext, { color: '#9CA3AF' }]}>
            Not punched yet
          </Text>
        </View>
      </View>

      <View style={styles.workingHoursBar}>
        <Text>Working Hours Today</Text>
        <Text style={styles.fontBold}>{attendanceData.workingHours}</Text>
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
        <View style={styles.punchItem}>
          <View>
            <Text style={styles.fontMedium}>Today</Text>
            <Text style={styles.textGray600}>Check In: 09:15 AM | Gate 1</Text>
          </View>
          <View style={[styles.punchBadge, styles.bgGreen100]}>
            <Text style={[styles.punchBadgeText, styles.textGreen800]}>
              Present
            </Text>
          </View>
        </View>
        <View style={styles.punchItem}>
          <View>
            <Text style={styles.fontMedium}>Yesterday</Text>
            <Text style={styles.textGray600}>
              Check In: 06:05 AM | Check Out: 03:10 PM
            </Text>
          </View>
          <View style={[styles.punchBadge, styles.bgGreen100]}>
            <Text style={[styles.punchBadgeText, styles.textGreen800]}>
              Present
            </Text>
          </View>
        </View>
      </View>
    </View>
  </ScrollView>
);

export default AttendanceScreen;

