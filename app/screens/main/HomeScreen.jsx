import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Clock, Calendar, DollarSign, FileText } from 'lucide-react-native';
import styles from '../../styles/styles';

const HomeScreen = ({
  user,
  attendanceData,
  salaryData,
  setCurrentScreen,
  profileImage,
}) => (
  <ScrollView
    style={styles.screenScrollContainer}
    contentContainerStyle={styles.screenContentContainer}
    showsVerticalScrollIndicator={false}
  >
    {/* Header Section */}
    <View style={styles.dashboardHeader}>
      <View>
        <Text style={styles.dashboardTitle}>Hi, {user?.name || ""}</Text>
        <Text style={styles.dashboardSubtitle}>{user?.designation}</Text>
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
        <Text style={styles.realTimeCardLabel}>Shift: {user?.shift}</Text>
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
          <Text style={styles.textSmall}>Punched In at Gate 1 - 09:15 AM</Text>
        </View>
        <View style={styles.activityItem}>
          <View style={[styles.activityDot, styles.bgBlue500]} />
          <Text style={styles.textSmall}>Salary slip for February generated</Text>
        </View>
        <View style={styles.activityItem}>
          <View style={[styles.activityDot, styles.bgOrange500]} />
          <Text style={styles.textSmall}>Leave request approved</Text>
        </View>
      </View>
    </View>
  </ScrollView>
);

export default HomeScreen;

