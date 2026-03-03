import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Platform, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native'; 
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '@/styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../../src/constants/api';

const LeaveScreen = ({ leaveBalance, setCurrentScreen }) => {
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [userToken, setUserToken] = useState(null);

  // 1. Load Session and Fetch History on Mount
  useEffect(() => {
    const loadSessionAndData = async () => {
      try {
        const session = await AsyncStorage.getItem("@user_session");
        if (session) {
          const parsedSession = JSON.parse(session);
          if (parsedSession.token) {
            setUserToken(parsedSession.token);
            // Fetch history immediately using the parsed token
            await fetchLeaveHistory(parsedSession.token);
          }
        } else {
          setHistoryLoading(false);
        }
      } catch (error) {
        console.error("Session Load Error:", error);
        setHistoryLoading(false);
      }
    };

    loadSessionAndData();
  }, []);

  // 2. FETCH LEAVE HISTORY FROM BACKEND
  const fetchLeaveHistory = async (tokenToUse) => {
    const token = tokenToUse || userToken;
    if (!token) return;

    try {
      setHistoryLoading(true);
      const response = await fetch(`${API_BASE}/api/leave/my-leaves`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setLeaveHistory(data.leaves || []);
      }
    } catch (error) {
      console.error("Fetch History Error:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Backend expects YYYY-MM-DD
  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  const onFromDateChange = (event, selectedDate) => {
    setShowFromPicker(Platform.OS === 'ios');
    if (selectedDate) setFromDate(selectedDate);
  };

  const onToDateChange = (event, selectedDate) => {
    setShowToPicker(Platform.OS === 'ios');
    if (selectedDate) setToDate(selectedDate);
  };

  // 3. SUBMIT LEAVE TO BACKEND
  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please enter a reason for leave.");
      return;
    }

    if (!userToken) {
      Alert.alert("Error", "User session not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/leave/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({
          leave_type: leaveType,
          reason: reason,
          start_date: formatDateForAPI(fromDate),
          end_date: formatDateForAPI(toDate)
        })
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("Success", "Leave Application Submitted Successfully!");
        setReason('');
        // Refresh list after success
        fetchLeaveHistory(userToken);
      } else {
        Alert.alert("Error", result.message || "Failed to apply leave");
      }
    } catch (error) {
      console.error("Apply Leave Error:", error);
      Alert.alert("Error", "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return '#16A34A';
      case 'rejected': return '#DC2626';
      default: return '#F59E0B';
    }
  };

  return (
    <ScrollView
      style={styles.screenScrollContainer}
      contentContainerStyle={styles.screenContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Leave Management</Text>
      </View>

      {showFromPicker && <DateTimePicker value={fromDate} mode="date" display="default" onChange={onFromDateChange} />}
      {showToPicker && <DateTimePicker value={toDate} mode="date" display="default" onChange={onToDateChange} />}

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
              <TouchableOpacity style={styles.dateInputButton} onPress={() => setShowFromPicker(true)}>
                <Text style={styles.dateInputText}>{formatDate(fromDate)}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.formGroup, styles.gridItemHalf]}>
              <Text style={styles.formLabel}>To Date</Text>
              <TouchableOpacity style={styles.dateInputButton} onPress={() => setShowToPicker(true)}>
                <Text style={styles.dateInputText}>{formatDate(toDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Reason</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Enter reason for leave..."
              value={reason}
              onChangeText={setReason}
              multiline={true}
              numberOfLines={2}
          
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.submitButton, loading && { opacity: 0.7 }]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Leave Application</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leave History</Text>
        
        {historyLoading ? (
          <ActivityIndicator color="#3B82F6" style={{ margin: 20 }} />
        ) : leaveHistory.length === 0 ? (
          <Text style={{color: '#6B7280', textAlign: 'center', padding: 10}}>No leave history found</Text>
        ) : (
          <View style={{ gap: 12 }}>
            {leaveHistory.map((item) => (
              <View key={item.id || item._id} style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#F9FAFB'
              }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                  <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.leave_type || item.type}</Text>
                  <View style={{
                    backgroundColor: getStatusColor(item.status) + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4
                  }}>
                    <Text style={{ color: getStatusColor(item.status), fontWeight: '600', fontSize: 12 }}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <Text style={{color: '#4B5563', fontSize: 14, marginBottom: 4}}>
                  {item.start_date} - {item.end_date}
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

