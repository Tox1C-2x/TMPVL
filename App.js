import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
  Dimensions,
  Modal, // Modal import kiya gaya
} from 'react-native';

// 1. Icon Library
import {
  User,
  Clock,
  FileText,
  Download,
  Calendar,
  Bell,
  Home, // 'TrendingUp' ki jagah 'Home'
  DollarSign,
  Settings,
  X,
  Eye,
  ArrowLeft,
  Lock,
  Mail,
  Smartphone,
  CheckCircle,
  Shield,
  Key,
} from 'lucide-react-native';

// 2. Extra Libraries
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- MAIN APP (Original UI) ---
// Is component ko tabhi dikhayenge jab user logged in ho
const TMPVLApp = ({ onLogout }) => {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'dashboard' se 'home'
  const [user, setUser] = useState({
    empId: '592338',
    name: 'Sushil Chaudhari',
    Shop: '1.5L PowerTrain',
    designation: 'Trainee (DAT)',
    shift: 'Morning (6:30 AM - 3:00 PM)',
  });

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
  
  // --- NAYA DATA (Salary History ke liye) ---
  const [salaryHistory, setSalaryHistory] = useState([
    { id: '1', month: 'October 2025', netSalary: 17850.00 },
    { id: '2', month: 'September 2025', netSalary: 17600.50 },
    { id: '3', month: 'August 2025', netSalary: 18050.00 },
  ]);
  // --- END NAYA DATA ---

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => {
      setAttendanceData((prev) => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString('en-IN'),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Renders the correct screen component based on state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'attendance':
        return (
          <AttendanceScreen
            attendanceData={attendanceData}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'salary':
        return (
          <SalaryScreen
            salaryData={salaryData}
            salaryHistory={salaryHistory} // <-- Naya prop pass kiya
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'leaves':
        return (
          <LeaveScreen
            leaveBalance={leaveBalance}
            setCurrentScreen={setCurrentScreen}
          />
        );
      default:
        // 'home' (default)
        return (
          <HomeScreen
            user={user}
            attendanceData={attendanceData}
            salaryData={salaryData}
            setCurrentScreen={setCurrentScreen}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Original Header */}
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

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={20} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Settings size={20} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onLogout}>
            <User size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Content */}
      <View style={styles.contentArea}>{renderScreen()}</View>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
      />
    </SafeAreaView>
  );
};

// --- Component 1: Home Screen (Original UI) ---
const HomeScreen = ({
  user,
  attendanceData,
  salaryData,
  setCurrentScreen,
}) => (
  <ScrollView
    style={styles.screenScrollContainer}
    contentContainerStyle={styles.screenContentContainer}
    showsVerticalScrollIndicator={false} // Scrollbar fix
  >
    {/* Original Header */}
    <View style={styles.dashboardHeader}>
      <View>
        <Text style={styles.dashboardTitle}>नमस्ते, {user.name}</Text>
        <Text style={styles.dashboardSubtitle}>{user.designation}</Text>
      </View>
      <View style={styles.dashboardUserIcon}>
        <User size={32} color="#2563EB" />
      </View>
    </View>

    {/* Real-time Status Card (Original UI) */}
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
        <Text style={styles.realTimeCardLabel}>Shift: {user.shift}</Text>
      </View>
    </LinearGradient>

    {/* Quick Stats (Original UI) */}
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

    {/* Quick Actions (Original UI) */}
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

    {/* Recent Activity (Original UI) */}
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

// --- Component 2: Attendance Screen (Original UI) ---
const AttendanceScreen = ({ attendanceData, setCurrentScreen }) => (
  <ScrollView
    style={styles.screenScrollContainer}
    contentContainerStyle={styles.screenContentContainer}
    showsVerticalScrollIndicator={false} // Scrollbar fix
  >
    <View style={styles.screenHeader}>
      <TouchableOpacity
        onPress={() => setCurrentScreen('home')} // 'dashboard' se 'home'
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
      <Text style={styles.cardTitle}>March 2024 Summary</Text>
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
            <Text style={styles.fontMedium}>Today - March 15</Text>
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
            <Text style={styles.fontMedium}>March 14</Text>
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

// --- Component 3: Salary Screen (FIXED) ---

// Helper component for modal rows
const RenderSalaryDetail = ({ label, value, isBold = false, isDeduction = false }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[
      isBold ? styles.detailValueBold : styles.detailValue,
      isDeduction ? styles.textRed600 : styles.textGray900
    ]}>
      {isDeduction ? '- ' : ''}₹{value.toLocaleString()}
    </Text>
  </View>
);

const SalaryScreen = ({ salaryData, salaryHistory, setCurrentScreen }) => {
  const [showPreview, setShowPreview] = useState(false); // <-- YEH STATE AB USE HOGA

  return (
    <>
      {/* --- Salary Preview Modal (FIXED) --- */}
      <Modal
        visible={showPreview}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Salary Details ({salaryData.currentMonth})</Text>
              <TouchableOpacity
                onPress={() => setShowPreview(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* --- Earnings --- */}
              <Text style={styles.modalSectionTitle}>Earnings</Text>
              <RenderSalaryDetail label="Basic Salary" value={salaryData.basicSalary} />
              <RenderSalaryDetail label="HRA" value={salaryData.hra} />
              <RenderSalaryDetail label="Medical Allowance" value={salaryData.medicalAllowance} />
              <RenderSalaryDetail label="Transport Allowance" value={salaryData.transportAllowance} />
              <RenderSalaryDetail label="Overtime Amount" value={salaryData.overtimeAmount} />
              <RenderSalaryDetail label="Bonus Amount" value={salaryData.bonusAmount} />
              <View style={styles.divider} />
              <RenderSalaryDetail label="Gross Salary" value={salaryData.grossSalary} isBold={true} />
              <View style={styles.divider} />
              
              {/* --- Deductions --- */}
              <Text style={styles.modalSectionTitle}>Deductions</Text>
              <RenderSalaryDetail label="PF Deduction" value={salaryData.pfDeduction} isDeduction={true} />
              <RenderSalaryDetail label="ESI Deduction" value={salaryData.esiDeduction} isDeduction={true} />
              <RenderSalaryDetail label="Tax Deduction (TDS)" value={salaryData.taxDeduction} isDeduction={true} />
              <RenderSalaryDetail label="Other Deductions" value={salaryData.otherDeductions} isDeduction={true} />
              <View style={styles.divider} />
              <RenderSalaryDetail label="Total Deductions" value={salaryData.totalDeductions} isBold={true} isDeduction={true} />
              <View style={styles.divider} />

              {/* --- Net Salary --- */}
              <RenderSalaryDetail label="Net Salary" value={salaryData.netSalary} isBold={true} />

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- Screen Content --- */}
      <ScrollView
        style={styles.screenScrollContainer}
        contentContainerStyle={styles.screenContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screenHeader}>
          <TouchableOpacity
            onPress={() => setCurrentScreen('home')} // 'dashboard' se 'home'
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Salary Management</Text>
        </View>

        {/* Current Month Summary */}
        <LinearGradient
          colors={['#22C55E', '#16A34A']}
          style={styles.salaryCard}
        >
          <View style={styles.salaryCardHeader}>
            <View>
              <Text style={styles.salaryCardTitle}>
                {salaryData.currentMonth}
              </Text>
              <Text style={styles.salaryCardSubtitle}>Net Salary</Text>
            </View>
            <DollarSign size={32} color="white" />
          </View>
          <Text style={styles.salaryCardNet}>
            ₹{salaryData.netSalary.toLocaleString()}
          </Text>
          <View style={styles.salaryCardGrossDeductions}>
            <Text style={styles.salaryCardSmallText}>
              Gross: ₹{salaryData.grossSalary.toLocaleString()}
            </Text>
            <Text style={styles.salaryCardSmallText}>
              Deductions: ₹{salaryData.totalDeductions.toLocaleString()}
            </Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.gridContainer}>
          <TouchableOpacity
            onPress={() => setShowPreview(true)} // <-- YEH AB MODAL KHOLEGA
            style={[styles.quickAction, styles.quickActionBlue, styles.gridItemHalf]}
          >
            <Eye color="#2563EB" size={24} />
            <View style={styles.quickActionText}>
              <Text style={styles.fontSemiBold}>Preview</Text>
              <Text style={styles.textGray600}>View Details</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Downloading salary slip...')}
            style={[
              styles.quickAction,
              styles.quickActionGreen,
              styles.gridItemHalf,
            ]}
          >
            <Download color="#16A34A" size={24} />
            <View style={styles.quickActionText}>
              <Text style={styles.fontSemiBold}>Download</Text>
              <Text style={styles.textGray600}>PDF Format</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* --- NAYA SECTION: Salary History --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Salary History</Text>
          <View style={styles.historyList}>
            {salaryHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                {/* Text Details */}
                <View>
                  <Text style={styles.historyMonth}>{item.month}</Text>
                  <Text style={styles.historySalary}>
                    Net Salary: ₹{item.netSalary.toLocaleString()}
                  </Text>
                </View>
                {/* Buttons */}
                <View style={styles.historyButtons}>
                  <TouchableOpacity
                    style={styles.historyIconButton}
                    onPress={() =>
                      Alert.alert(
                        'Preview Slip',
                        `Showing preview for ${item.month}`
                      )
                    }
                  >
                    <Eye size={20} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.historyIconButton}
                    onPress={() =>
                      Alert.alert(
                        'Download Slip',
                        `Downloading slip for ${item.month}`
                      )
                    }
                  >
                    <Download size={20} color="#16A34A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* --- END NAYA SECTION --- */}
        
      </ScrollView>
    </>
  );
};

// --- Component 4: Leave Screen (FIXED) ---
const LeaveScreen = ({ leaveBalance, setCurrentScreen }) => {
  const [leaveType, setLeaveType] = useState('Casual');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [reason, setReason] = useState(''); // <-- NAYA STATE REASON KE LIYE
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const onFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setShowFromPicker(Platform.OS === 'ios');
    setFromDate(currentDate);
  };

  const onToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setShowToPicker(Platform.OS === 'ios');
    setToDate(currentDate);
  };

  return (
    <ScrollView
      style={styles.screenScrollContainer}
      contentContainerStyle={styles.screenContentContainer}
      showsVerticalScrollIndicator={false} // Scrollbar fix
    >
      <View style={styles.screenHeader}>
        <TouchableOpacity
          onPress={() => setCurrentScreen('home')} // 'dashboard' se 'home'
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Leave Management</Text>
      </View>

      {/* --- Date Picker Modals (FIXED) --- */}
      {showFromPicker && (
        <DateTimePicker
          testID="dateTimePickerFrom"
          value={fromDate}
          mode="date"
          display="default"
          onChange={onFromDateChange}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          testID="dateTimePickerTo"
          value={toDate}
          mode="date"
          display="default"
          onChange={onToDateChange}
        />
      )}

      {/* Leave Balance */}
      <View style={styles.gridContainer}>
        <View style={[styles.card, styles.gridItemThird]}>
          <Text style={[styles.fontSemiBold, styles.textBlue600]}>
            Casual Leave
          </Text>
          <Text style={styles.leaveBalanceValue}>{leaveBalance.casual}</Text>
          <Text style={styles.textGray600}>Available</Text>
        </View>
        <View style={[styles.card, styles.gridItemThird]}>
          <Text style={[styles.fontSemiBold, styles.textGreen600]}>
            Sick Leave
          </Text>
          <Text style={styles.leaveBalanceValue}>{leaveBalance.sick}</Text>
          <Text style={styles.textGray600}>Available</Text>
        </View>
        <View style={[styles.card, styles.gridItemThird]}>
          <Text style={[styles.fontSemiBold, styles.textPurple600]}>
            Earned Leave
          </Text>
          <Text style={styles.leaveBalanceValue}>{leaveBalance.earned}</Text>
          <Text style={styles.textGray600}>Available</Text>
        </View>
      </View>

      {/* Apply Leave (FIXED) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Apply for Leave</Text>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Leave Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={leaveType}
                onValueChange={(itemValue) => setLeaveType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Casual Leave" value="Casual" />
                <Picker.Item label="Sick Leave" value="Sick" />
                <Picker.Item label="Earned Leave" value="Earned" />
              </Picker>
            </View>
          </View>

          {/* --- MISSING INPUTS AB ADD HO GAYE --- */}
          <View style={styles.gridContainer}>
            <View style={[styles.formGroup, styles.gridItemHalf]}>
              <Text style={styles.formLabel}>From Date</Text>
              <TouchableOpacity
                style={styles.dateInputButton}
                onPress={() => setShowFromPicker(true)}
              >
                <Text style={styles.dateInputText}>{fromDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.formGroup, styles.gridItemHalf]}>
              <Text style={styles.formLabel}>To Date</Text>
              <TouchableOpacity
                style={styles.dateInputButton}
                onPress={() => setShowToPicker(true)}
              >
                <Text style={styles.dateInputText}>{toDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Reason</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Enter reason for leave..."
              placeholderTextColor="#9CA3AF"
              value={reason}
              onChangeText={setReason}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          {/* --- END OF FIXED INPUTS --- */}
          
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>
              Submit Leave Application
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// --- Component 5: Bottom Navigation (Original UI) ---
const BottomNavigation = ({ currentScreen, setCurrentScreen }) => (
  <View style={styles.bottomNavContainer}>
    <View style={styles.bottomNav}>
      <TouchableOpacity
        onPress={() => setCurrentScreen('home')} // 'dashboard' se 'home'
        style={styles.navButton}
      >
        <Home // Icon badla gaya
          size={20}
          color={currentScreen === 'home' ? '#2563EB' : '#6B7280'}
        />
        <Text
          style={[
            styles.navButtonText,
            currentScreen === 'home' ? styles.textBlue600 : styles.textGray500,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setCurrentScreen('attendance')}
        style={styles.navButton}
      >
        <Clock
          size={20}
          color={currentScreen === 'attendance' ? '#2563EB' : '#6B7280'}
        />
        <Text
          style={[
            styles.navButtonText,
            currentScreen === 'attendance'
              ? styles.textBlue600
              : styles.textGray500,
          ]}
        >
          Attendance
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setCurrentScreen('salary')}
        style={styles.navButton}
      >
        <FileText
          size={20}
          color={currentScreen === 'salary' ? '#2563EB' : '#6B7280'}
        />
        <Text
          style={[
            styles.navButtonText,
            currentScreen === 'salary' ? styles.textBlue600 : styles.textGray500,
          ]}
        >
          Salary
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setCurrentScreen('leaves')}
        style={styles.navButton}
      >
        <Calendar
          size={20}
          color={currentScreen === 'leaves' ? '#2563EB' : '#6B7280'}
        />
        <Text
          style={[
            styles.navButtonText,
            currentScreen === 'leaves' ? styles.textBlue600 : styles.textGray500,
          ]}
        >
          Leaves
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- AUTHENTICATION SCREENS (Naye features) ---

// 1. Login Screen
const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Yahan aap real API call karenge
    if (empId === '123' && password === '123') {
      Alert.alert('Login Success', 'Welcome back!');
      onLoginSuccess(); // App ko batayega ki login ho gaya
    } else {
      Alert.alert('Login Failed', 'Invalid Employee ID or Password');
    }
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView
        contentContainerStyle={styles.authScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.authHeader}>
          <View style={styles.headerLogo}>
            <Text style={styles.headerLogoText}>T</Text>
          </View>
          <Text style={styles.authTitle}>Welcome to TMPVL</Text>
          <Text style={styles.authSubtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.authForm}>
          <View style={styles.authInputContainer}>
            <User size={20} color="#6B7280" style={styles.authInputIcon} />
            <TextInput
              style={styles.authInput}
              placeholder="Employee ID"
              placeholderTextColor="#6B7280"
              value={empId}
              onChangeText={setEmpId}
            />
          </View>

          <View style={styles.authInputContainer}>
            <Lock size={20} color="#6B7280" style={styles.authInputIcon} />
            <TextInput
              style={styles.authInput}
              placeholder="Password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.authSwitchButton}
            onPress={() => navigation('register')} // 'register' screen par bhejega
          >
            <Text style={styles.authSwitchText}>
              New user? <Text style={styles.authSwitchHighlight}>Register here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// 2. Register Screen
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [ticketNo, setTicketNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    if (!name || ticketNo.length !== 6 || mobile.length !== 10 || !email) {
      Alert.alert('Error', 'Please fill all fields correctly.');
      return;
    }
    // API call...
    Alert.alert('Success', 'OTP sent to your mobile and email.');
    navigation('otp'); // 'otp' screen par bhejega
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView
        contentContainerStyle={styles.authScroll}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.authBackButton}
          onPress={() => navigation('login')} // 'login' screen par waapas
        >
          <ArrowLeft size={20} color="#111827" />
          <Text style={styles.authBackButtonText}>Back to Login</Text>
        </TouchableOpacity>

        <View style={styles.authHeader}>
          <Text style={styles.authTitle}>Create Account</Text>
          <Text style={styles.authSubtitle}>Join the TMPVL portal</Text>
        </View>

        <View style={styles.authForm}>
          <View style={styles.authInputContainer}>
            <User size={20} color="#6B7280" style={styles.authInputIcon} />
            <TextInput
              style={styles.authInput}
              placeholder="Full Name"
              placeholderTextColor="#6B7280"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.authInputContainer}>
            <Shield size={20} color="#6B7280" style={styles.authInputIcon} />
            <TextInput
              style={styles.authInput}
              placeholder="Ticket Number (6 digits only)"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              maxLength={6}
              value={ticketNo}
              onChangeText={setTicketNo}
            />
          </View>

          <View style={styles.authInputContainer}>
            <Smartphone size={20} color="#6B7280" style={styles.authInputIcon} />
            <Text style={styles.authPrefix}>+91</Text>
            <TextInput
              style={[styles.authInput, { paddingLeft: 8 }]}
              placeholder="Mobile Number (10 digits)"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <View style={styles.authInputContainer}>
            <Mail size={20} color="#6B7280" style={styles.authInputIcon} />
            <TextInput
              style={styles.authInput}
              placeholder="Email ID (e.g., user@gmail.com)"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleRegister}>
            <Text style={styles.authButtonText}>Register Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// 3. Verify OTP Screen
const VerifyOTPScreen = ({ navigation }) => {
  const [mobileOtp, setMobileOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');

  const handleVerify = () => {
    if (mobileOtp.length !== 6 || emailOtp.length !== 6) {
      Alert.alert('Error', 'Please enter both 6-digit OTPs.');
      return;
    }
    // API call...
    Alert.alert('Success', 'Verification complete. Set your password.');
    navigation('password'); // 'password' screen par bhejega
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView
        contentContainerStyle={styles.authScroll}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.authBackButton}
          onPress={() => navigation('register')} // 'register' screen par waapas
        >
          <ArrowLeft size={20} color="#111827" />
          <Text style={styles.authBackButtonText}>Back to Register</Text>
        </TouchableOpacity>

        <View style={styles.authHeader}>
          <Text style={styles.authTitle}>Verify OTP</Text>
          <Text style={styles.authSubtitle}>Enter the OTP sent to your mobile and email</Text>
        </View>

        <View style={styles.authForm}>
          <View style={styles.authInputContainer}>
            <Smartphone size={20} color="#6B7280" style={styles.authInputIcon} />
            <TextInput
              style={styles.authInput}
              placeholder="Mobile OTP"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              maxLength={6}
              value={mobileOtp}
              onChangeText={setMobileOtp}
            />
          </View>

          <View style={styles.authInputContainer}>
            <Mail size={20} color="#6B7280" style={styles.authInputIcon} />
            <TextInput
              style={styles.authInput}
              placeholder="Email OTP"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              maxLength={6}
              value={emailOtp}
              onChangeText={setEmailOtp}
            />
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleVerify}>
            <CheckCircle size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.authButtonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// 4. Set Password Screen
const SetPasswordScreen = ({ navigation, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSetPassword = () => {
    if (password.length < 8 || password.length > 14) {
      Alert.alert('Error', 'Password must be 8-14 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords do not match.");
      return;
    }
    // API call...
    Alert.alert('Success', 'Password set! You are now logged in.');
    onLoginSuccess(); // Login state update karega
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView
        contentContainerStyle={styles.authScroll}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.authBackButton}
          onPress={() => navigation('otp')} // 'otp' screen par waapas
        >
          <ArrowLeft size={20} color="#111827" />
          <Text style={styles.authBackButtonText}>Back to OTP</Text>
        </TouchableOpacity>

        <View style={styles.authHeader}>
          <Text style={styles.authTitle}>Set Your Password</Text>
          <Text style={styles.authSubtitle}>8-14 chars, upper & lower case</Text>
        </View>

        <View style={styles.authForm}>
          <View style={styles.authInputContainer}>
            <Key size={20} color="#6B7280" style={styles.authInputIcon} />
            <TextInput
              style={styles.authInput}
              placeholder="Enter Password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.authInputContainer}>
            <Lock size={20} color="#6B7280" style={styles.authInputIcon} />
            <TextInput
              style={styles.authInput}
              placeholder="Confirm Password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleSetPassword}>
            <Text style={styles.authButtonText}>Set Password & Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


// --- TOP LEVEL APP COMPONENT ---
// Ye component decide karega ki Login dikhana hai ya Main App
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState('login'); // 'login', 'register', 'otp', 'password'

  // Jab login success ho
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Jab logout ho
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => setIsLoggedIn(false) },
    ]);
  };

  // Kaun sa auth screen dikhana hai
  const renderAuthScreen = () => {
    switch (authScreen) {
      case 'register':
        return <RegisterScreen navigation={setAuthScreen} />;
      case 'otp':
        return <VerifyOTPScreen navigation={setAuthScreen} />;
      case 'password':
        return <SetPasswordScreen navigation={setAuthScreen} onLoginSuccess={handleLoginSuccess} />;
      case 'login':
      default:
        return <LoginScreen navigation={setAuthScreen} onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <TMPVLApp onLogout={handleLogout} />
      ) : (
        renderAuthScreen()
      )}
    </>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  // Auth Screens Styles
  authContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  authTitle: {
    fontSize: 28, // text-3xl
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16, // text-base
    color: '#6B7280',
    textAlign: 'center',
  },
  authForm: {
    width: '100%',
  },
  authInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 16,
  },
  authInputIcon: {
    padding: 12,
  },
  authInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: '#111827',
  },
  authPrefix: {
    paddingLeft: 12,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  authButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  authSwitchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  authSwitchText: {
    fontSize: 16,
    color: '#6B7280',
  },
  authSwitchHighlight: {
    color: '#2563EB',
    fontWeight: '600',
  },
  authBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  authBackButtonText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },


  // Main App (TMPVL) Styles
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 16, // Pehle 24 tha, original UI ke liye 16
    paddingTop: 16, // Pehle 24 tha
  },
  screenScrollContainer: {
    flex: 1,
  },
  screenContentContainer: {
    paddingBottom: 80, // Extra space ke liye (fix)
  },

  // Header (Original UI)
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // border-gray-200
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
  },
  headerLogo: {
    width: 32,
    height: 32,
    backgroundColor: '#2563EB', // bg-blue-600
    borderRadius: 8, // rounded-lg
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14, // text-sm
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18, // text-lg
  },
  headerSubtitle: {
    fontSize: 12, // text-xs
    color: '#4B5563', // text-gray-600
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
  },
  iconButton: {
    padding: 8, // p-2
    borderRadius: 8,
  },

  // Screen Header (Back button)
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16, // Pehle 24 tha
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  screenTitle: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
  },

  // Home Screen (Original UI)
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dashboardTitle: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#111827', // text-gray-900
  },
  dashboardSubtitle: {
    color: '#4B5563', // text-gray-600
  },
  dashboardUserIcon: {
    width: 64, // w-16
    height: 64, // h-16
    backgroundColor: '#DBEAFE', // bg-blue-100
    borderRadius: 32, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Real-time Card (Original UI)
  realTimeCard: {
    borderRadius: 12, // rounded-xl
    padding: 24, // p-6
    marginBottom: 16,
  },
  realTimeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // mb-4
  },
  realTimeCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
  },
  realTimeCardTitleText: {
    color: 'white',
    fontWeight: '600', // font-semibold
  },
  liveBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    paddingHorizontal: 12, // px-3
    paddingVertical: 4, // py-1
    borderRadius: 999, // rounded-full
  },
  liveBadgeText: {
    color: 'white',
    fontSize: 12, // text-sm
  },
  realTimeCardLabel: {
    color: '#DBEAFE', // text-blue-100
  },
  realTimeCardValue: {
    color: 'white',
    fontSize: 20, // text-xl
    fontWeight: 'bold',
  },
  realTimeCardFooter: {
    marginTop: 16, // mt-4
    paddingTop: 16, // pt-4
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)', // border-white/20
  },

  // Grid (Original UI)
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginBottom: 16,
  },
  gridItemHalf: {
    width: '48%',
  },
  gridItemThird: {
    width: '32%',
  },
  gridItemFourth: {
    width: '23%',
  },

  // Card (Original UI)
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 16,
  },

  // Quick Stats (Original UI)
  quickStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Quick Actions (Original UI)
  quickAction: {
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickActionBlue: {
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  quickActionGreen: {
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  quickActionText: {
    alignItems: 'flex-start',
  },

  // Recent Activity (Original UI)
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Attendance Screen (Original UI)
  statusBox: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  statusBoxValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statusBoxSubtext: {
    fontSize: 12,
    color: '#16A34A',
  },
  workingHoursBar: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryBox: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  summaryBoxValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  punchList: {
    gap: 12,
  },
  punchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  punchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  punchBadgeText: {
    fontSize: 10,
  },

  // Salary Screen (Original UI)
  salaryCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  salaryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  salaryCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  salaryCardSubtitle: {
    color: '#A7F3D0',
  },
  salaryCardNet: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  salaryCardGrossDeductions: {
    flexDirection: 'row',
    gap: 16,
  },
  salaryCardSmallText: {
    color: 'white',
    fontSize: 12,
  },

  // Leave Screen (Original UI)
  leaveBalanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  form: {
    gap: 16,
  },
  formGroup: {
    gap: 4,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  // --- NAYE STYLES (FIXES KE LIYE) ---
  dateInputButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
  },
  dateInputText: {
    fontSize: 16,
    color: '#111827',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 12,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#4B5563',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  
  // -- Salary History Styles --
  historyList: {
    gap: 8, // Thoda kam space items ke beech
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', // Light gray separator
  },
  historyMonth: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  historySalary: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  historyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  historyIconButton: {
    padding: 8,
  },
  // --- END NAYE STYLES ---


  // Bottom Navigation (Original UI)
  bottomNavContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
  },
  navButtonText: {
    fontSize: 10,
    marginTop: 4,
  },

  // Utility Colors
  textGray500: { color: '#6B7280' },
  textGray600: { color: '#4B5563' },
  textGray900: { color: '#111827' }, // Naya add kiya
  textBlue600: { color: '#2563EB' },
  textGreen600: { color: '#16A34A' },
  textRed600: { color: '#DC2626' },
  textPurple600: { color: '#9333EA' },
  textGreen800: { color: '#166534' },

  bgGreen500: { backgroundColor: '#22C55E' },
  bgBlue500: { backgroundColor: '#3B82F6' },
  bgOrange500: { backgroundColor: '#F97316' },
  bgGreen50: { backgroundColor: '#F0FDF4' },
  bgRed50: { backgroundColor: '#FEF2F2' },
  bgBlue50: { backgroundColor: '#EFF6FF' },
  bgGray50: { backgroundColor: '#F9FAFB' },
  bgGreen100: { backgroundColor: '#DCFCE7' },

  // Utility Font
  fontBold: { fontWeight: 'bold' },
  fontSemiBold: { fontWeight: '600' },
  fontMedium: { fontWeight: '500' },
  textSmall: { fontSize: 12 },
});

export default App; // Default export ab 'App' hai
