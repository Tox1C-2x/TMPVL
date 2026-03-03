import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  ActivityIndicator, 
  StyleSheet,
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, DollarSign, Eye, Download, X, Filter, Building2, CreditCard } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import styles from '@/styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../../src/constants/api';

const { width } = Dimensions.get('window');

// --- SKELETON COMPONENT ---
const SkeletonItem = () => {
  const opacity = new Animated.Value(0.3);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[localStyles.skeletonCard, { opacity }]}>
      <View style={localStyles.skeletonLeft}>
        <View style={localStyles.skeletonCircle} />
        <View style={{ marginLeft: 12 }}>
          <View style={localStyles.skeletonLineShort} />
          <View style={[localStyles.skeletonLineShort, { width: 60, marginTop: 8 }]} />
        </View>
      </View>
      <View style={[localStyles.skeletonLineShort, { width: 70 }]} />
    </Animated.View>
  );
};

const RenderSalaryDetail = ({ label, value, isBold = false, isDeduction = false }) => (
  <View style={localStyles.detailRow}>
    <Text style={localStyles.detailLabel}>{label}</Text>
    <Text style={[
      isBold ? localStyles.detailValueBold : localStyles.detailValue,
      isDeduction ? { color: '#DC2626' } : { color: '#111827' }
    ]}>
      {isDeduction ? '- ' : ''}₹{value ? value.toLocaleString('en-IN') : '0'}
    </Text>
  </View>
);

const SalaryScreen = ({ setCurrentScreen }) => {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchSalaryData();
  }, []);

  useEffect(() => {
    setFilteredHistory(
      salaryHistory.filter(s => Number(s.year) === Number(selectedYear))
    );
  }, [selectedYear, salaryHistory]);

  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      const sessionValue = await AsyncStorage.getItem('@user_session');
      if (!sessionValue) return;

      const userData = JSON.parse(sessionValue);
      const response = await fetch(`${API_BASE}/api/salary/my-salary`, {
        headers: { "Authorization": `Bearer ${userData.token}` }
      });
      const result = await response.json();

      if (result.success && result.data) {
        const formattedHistory = result.data.map(item => ({
          id: item.id,
          monthName: monthNames[item.month - 1],
          month: item.month,
          year: item.year,
          netSalary: parseFloat(item.net_salary),
          grossSalary: parseFloat(item.gross_salary),
          basic_salary: parseFloat(item.basic_salary),
          overtime_allowance: parseFloat(item.overtime_allowance) || 0,
          total_deductions: parseFloat(item.total_deductions),
          pan: item.pan || "N/A",
          bank_name: item.bank_name || "Bank Transfer",
          account_no: item.account_no || "**** ****",
          pf_no: item.pf_no || "N/A",
        }));
        setSalaryHistory(formattedHistory);
        if (formattedHistory.length > 0) setSelectedSalary(formattedHistory[0]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handlePreview = (item) => {
    setSelectedSalary(item);
    setShowPreview(true);
  };

  // --- DOWNLOAD PDF FROM BACKEND ---
  const downloadBackendPDF = async (salaryId, fileName) => {
    try {
      setDownloading(true);
      const sessionValue = await AsyncStorage.getItem('@user_session');
      if (!sessionValue) return;
      const { token } = JSON.parse(sessionValue);

      const downloadUrl = `${API_BASE}/api/salary/download/${salaryId}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}.pdf`;

      const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (downloadRes.status === 200) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        Alert.alert("Error", "Could not download payslip from server.");
      }
    } catch (error) {
      console.error("PDF Download Error:", error);
      Alert.alert("Error", "Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const currentDisp = selectedSalary || { netSalary: 0, grossSalary: 0, total_deductions: 0, monthName: 'N/A', year: '' };

  return (
    <>
      {/* Detail Modal */}
      <Modal visible={showPreview} transparent animationType="slide" onRequestClose={() => setShowPreview(false)}>
        <View style={localStyles.modalBackdrop}>
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
              <View>
                <Text style={localStyles.modalTitle}>Detailed Payslip</Text>
                <Text style={localStyles.modalSubtitle}>{selectedSalary?.monthName} {selectedSalary?.year}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPreview(false)} style={localStyles.closeBtn}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={localStyles.infoSection}>
                 <View style={localStyles.infoRow}>
                    <Building2 size={16} color="#6B7280" />
                    <Text style={localStyles.infoText}>Bank: {selectedSalary?.bank_name} | A/c: {selectedSalary?.account_no}</Text>
                 </View>
                 <View style={localStyles.infoRow}>
                    <CreditCard size={16} color="#6B7280" />
                    <Text style={localStyles.infoText}>PAN: {selectedSalary?.pan} | PF: {selectedSalary?.pf_no}</Text>
                 </View>
              </View>

              <Text style={localStyles.sectionTitle}>Earnings</Text>
              <RenderSalaryDetail label="Basic Salary" value={selectedSalary?.basic_salary} />
              <RenderSalaryDetail label="Overtime Allowance" value={selectedSalary?.overtime_allowance} />
              <View style={localStyles.divider} />
              <RenderSalaryDetail label="Gross Earnings" value={selectedSalary?.grossSalary} isBold />

              <Text style={[localStyles.sectionTitle, { marginTop: 15 }]}>Deductions</Text>
              <RenderSalaryDetail label="Total Deductions" value={selectedSalary?.total_deductions} isBold isDeduction />

              <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={localStyles.netBox}>
                <Text style={localStyles.netLabel}>Net Take Home</Text>
                <Text style={localStyles.netValue}>₹{selectedSalary?.netSalary.toLocaleString('en-IN')}</Text>
              </LinearGradient>

              <TouchableOpacity 
                style={localStyles.downloadFullBtn} 
                onPress={() => downloadBackendPDF(selectedSalary.id, `Payslip_${selectedSalary.monthName}_${selectedSalary.year}`)}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Download size={20} color="#FFF" />
                    <Text style={localStyles.downloadFullText}>Download PDF Slip</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView style={localStyles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Salary Management</Text>
        </View>

        <LinearGradient colors={['#10B981', '#059669']} style={localStyles.mainCard}>
          <View style={localStyles.mainCardTop}>
             <View>
                <Text style={localStyles.mainCardMonth}>{currentDisp.monthName} {currentDisp.year}</Text>
                <Text style={localStyles.mainCardLabel}>Monthly Net Salary</Text>
             </View>
             <DollarSign size={32} color="rgba(255,255,255,0.6)" />
          </View>
          <Text style={localStyles.mainCardNet}>₹{currentDisp.netSalary.toLocaleString('en-IN')}</Text>
          <View style={localStyles.mainCardFooter}>
             <Text style={localStyles.footerText}>Gross: ₹{currentDisp.grossSalary.toLocaleString('en-IN')}</Text>
             <Text style={localStyles.footerText}>Ded: ₹{currentDisp.total_deductions.toLocaleString('en-IN')}</Text>
          </View>
        </LinearGradient>

        <View style={localStyles.historySection}>
          <View style={localStyles.historyHeader}>
            <Text style={localStyles.historyTitle}>Salary History</Text>
            <View style={localStyles.yearFilter}>
               <Filter size={14} color="#6B7280" />
               <Text style={localStyles.yearText}>{selectedYear}</Text>
            </View>
          </View>

          {loading ? (
            <View><SkeletonItem /><SkeletonItem /><SkeletonItem /></View>
          ) : filteredHistory.length === 0 ? (
            <View style={localStyles.noDataBox}><Text style={localStyles.noDataText}>No records found</Text></View>
          ) : (
            filteredHistory.map((item) => (
              <View key={item.id} style={localStyles.historyItem}>
                <View style={localStyles.historyItemLeft}>
                  <View style={localStyles.monthBadge}>
                    <Text style={localStyles.monthBadgeText}>{item.monthName.substring(0, 3)}</Text>
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={localStyles.historyMonthName}>{item.monthName}</Text>
                    <Text style={localStyles.historyAmount}>₹{item.netSalary.toLocaleString('en-IN')}</Text>
                  </View>
                </View>
                
                <View style={localStyles.actionButtons}>
                  <TouchableOpacity style={localStyles.iconBtn} onPress={() => handlePreview(item)}>
                    <Eye size={18} color="#10B981" />
                    <Text style={[localStyles.btnText, {color: '#10B981'}]}>View</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[localStyles.iconBtn, {marginLeft: 10}]} 
                    onPress={() => downloadBackendPDF(item.id, `Payslip_${item.monthName}_${item.year}`)}
                    disabled={downloading}
                  >
                    <Download size={18} color="#6B7280" />
                    <Text style={localStyles.btnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
};

const localStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB', 
    paddingHorizontal: 6
    },
  mainCard: { 
    borderRadius: 14, 
    padding: 16, 
    marginTop: 12, 
    elevation: 8, 
    shadowColor: '#10B981', 
    shadowOpacity: 0.3, 
    shadowRadius: 10
    },
  mainCardTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start'
    },
  mainCardMonth: { 
    color: '#FFF', 
    fontSize: 14, 
    opacity: 0.8, 
    fontWeight: '600'
    },
  mainCardLabel: { color: '#FFF', fontSize: 18, fontWeight: '700', marginTop: 2 },
  mainCardNet: { color: '#FFF', fontSize: 34, fontWeight: '800', marginVertical: 12 },
  mainCardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 10 },
  footerText: { color: '#FFF', fontSize: 12, opacity: 0.9 },
  historySection: { marginTop: 30 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  historyTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  yearFilter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  yearText: { marginLeft: 5, fontSize: 12, fontWeight: '700', color: '#4B5563' },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 16, marginBottom: 12, elevation: 1 },
  historyItemLeft: { flexDirection: 'row', alignItems: 'center' },
  monthBadge: { width: 45, height: 45, backgroundColor: '#F3F4F6', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  monthBadgeText: { fontSize: 12, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' },
  historyMonthName: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  historyAmount: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { alignItems: 'center', justifyContent: 'center', minWidth: 40 },
  btnText: { fontSize: 10, fontWeight: '700', color: '#6B7280', marginTop: 2 },
  noDataBox: { padding: 40, alignItems: 'center' },
  noDataText: { color: '#9CA3AF', fontStyle: 'italic' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  modalSubtitle: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  closeBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
  infoSection: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  infoText: { marginLeft: 8, fontSize: 12, color: '#4B5563' },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 14, color: '#4B5563' },
  detailValue: { fontSize: 14, fontWeight: '500' },
  detailValueBold: { fontSize: 15, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  netBox: { marginTop: 20, padding: 15, borderRadius: 16, alignItems: 'center' },
  netLabel: { fontSize: 12, color: '#166534', fontWeight: '600' },
  netValue: { fontSize: 28, fontWeight: '800', color: '#166534' },
  downloadFullBtn: { flexDirection: 'row', backgroundColor: '#10B981', marginTop: 20, padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  downloadFullText: { color: '#FFF', fontWeight: '700', marginLeft: 10, fontSize: 16 },
  skeletonCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 16, marginBottom: 12 },
  skeletonLeft: { flexDirection: 'row', alignItems: 'center' },
  skeletonCircle: { width: 45, height: 45, backgroundColor: '#E5E7EB', borderRadius: 12 },
  skeletonLineShort: { width: 100, height: 12, backgroundColor: '#E5E7EB', borderRadius: 4 }
});

export default SalaryScreen;

