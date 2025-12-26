import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Platform, 
  Alert 
} from 'react-native';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native'; // Icons update kiye
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../styles/styles';

const LeaveScreen = ({ leaveBalance, setCurrentScreen }) => {
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [reason, setReason] = useState('');
  
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // 1. LEAVE HISTORY STATE --
  const [leaveHistory, setLeaveHistory] = useState([
    {
      id: 1,
      type: 'Sick Leave',
      from: '10/11/2025',
      to: '12/11/2025',
      days: 3,
      status: 'Approved',
      reason: 'Viral Fever'
    },
    {
      id: 2,
      type: 'Casual Leave',
      from: '01/11/2025',
      to: '01/11/2025',
      days: 1,
      status: 'Rejected',
      reason: 'Personal work'
    }
  ]);

  // 2. HELPER FUNCTION: DATE FORMATTER (DD/MM/YYYY)
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month 0 se start hota hai
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  // 3. SUBMIT LEAVE FUNCTION
  const handleSubmit = () => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please enter a reason for leave.");
      return;
    }

    // New Leave Object create --
    const newLeave = {
      id: Date.now(), // Unique ID
      type: leaveType,
      from: formatDate(fromDate),
      to: formatDate(toDate),
      days: Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1, // Days calculate karna
      status: 'Pending', // Default status
      reason: reason
    };

    // History 
    setLeaveHistory([newLeave, ...leaveHistory]);
    
    // Reset Form
    setReason('');
    Alert.alert("Success", "Leave Application Submitted Successfully!");
  };

  // Helper to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return '#16A34A'; // Green
      case 'Rejected': return '#DC2626'; // Red
      default: return '#F59E0B'; // Orange (Pending)
    }
  };

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
        <Text style={styles.screenTitle}>Leave Management</Text>
      </View>

      {/* Date Pickers (Hidden by default) */}
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

      {/* Leave Balance Cards */}
      <View style={styles.gridContainer}>
        <View style={[styles.card, styles.gridItemThird]}>
          <Text style={[styles.fontSemiBold, styles.textBlue600]}>Casual</Text>
          <Text style={styles.leaveBalanceValue}>{leaveBalance.casual}</Text>
          <Text style={styles.textGray600}>Available</Text>
        </View>
        <View style={[styles.card, styles.gridItemThird]}>
          <Text style={[styles.fontSemiBold, styles.textGreen600]}>Sick</Text>
          <Text style={styles.leaveBalanceValue}>{leaveBalance.sick}</Text>
          <Text style={styles.textGray600}>Available</Text>
        </View>
        <View style={[styles.card, styles.gridItemThird]}>
          <Text style={[styles.fontSemiBold, styles.textPurple600]}>Earned</Text>
          <Text style={styles.leaveBalanceValue}>{leaveBalance.earned}</Text>
          <Text style={styles.textGray600}>Available</Text>
        </View>
      </View>

      {/* Apply Leave Form */}
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
                <Picker.Item label="Casual Leave" value="Casual Leave" />
                <Picker.Item label="Sick Leave" value="Sick Leave" />
                <Picker.Item label="Earned Leave" value="Earned Leave" />
              </Picker>
            </View>
          </View>

          <View style={styles.gridContainer}>
            <View style={[styles.formGroup, styles.gridItemHalf]}>
              <Text style={styles.formLabel}>From Date</Text>
              <TouchableOpacity
                style={styles.dateInputButton}
                onPress={() => setShowFromPicker(true)}
              >
                {/* 4. Yahan Format Function Use Kiya */}
                <Text style={styles.dateInputText}>{formatDate(fromDate)}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.formGroup, styles.gridItemHalf]}>
              <Text style={styles.formLabel}>To Date</Text>
              <TouchableOpacity
                style={styles.dateInputButton}
                onPress={() => setShowToPicker(true)}
              >
                {/* 4. Yahan Format Function Use Kiya */}
                <Text style={styles.dateInputText}>{formatDate(toDate)}</Text>
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
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              Submit Leave Application
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. LEAVE HISTORY SECTION (New) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leave History</Text>
        
        {leaveHistory.length === 0 ? (
          <Text style={{color: '#6B7280', textAlign: 'center', padding: 10}}>No leave history found</Text>
        ) : (
          <View style={{ gap: 12 }}>
            {leaveHistory.map((item) => (
              <View key={item.id} style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#F9FAFB'
              }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.type}</Text>
                  <View style={{
                    backgroundColor: getStatusColor(item.status) + '20', // Light bg
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4
                  }}>
                    <Text style={{
                      color: getStatusColor(item.status),
                      fontWeight: '600',
                      fontSize: 12
                    }}>{item.status}</Text>
                  </View>
                </View>

                <Text style={{color: '#4B5563', fontSize: 14, marginBottom: 4}}>
                  {item.from} - {item.to} ({item.days} days)
                </Text>

                <Text style={{color: '#6B7280', fontSize: 13, fontStyle: 'italic'}}>
                  Reason: {item.reason}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

    </ScrollView>
  );
};

export default LeaveScreen;

