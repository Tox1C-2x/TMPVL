import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, DollarSign, Eye, Download, X } from 'lucide-react-native';
import styles from '@/styles/styles';

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
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
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
              
              <Text style={styles.modalSectionTitle}>Deductions</Text>
              <RenderSalaryDetail label="PF Deduction" value={salaryData.pfDeduction} isDeduction={true} />
              <RenderSalaryDetail label="ESI Deduction" value={salaryData.esiDeduction} isDeduction={true} />
              <RenderSalaryDetail label="Tax Deduction (TDS)" value={salaryData.taxDeduction} isDeduction={true} />
              <RenderSalaryDetail label="Other Deductions" value={salaryData.otherDeductions} isDeduction={true} />
              <View style={styles.divider} />
              <RenderSalaryDetail label="Total Deductions" value={salaryData.totalDeductions} isBold={true} isDeduction={true} />
              <View style={styles.divider} />

              <RenderSalaryDetail label="Net Salary" value={salaryData.netSalary} isBold={true} />
            </ScrollView>
          </View>
        </View>
      </Modal>

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
          <Text style={styles.screenTitle}>Salary Management</Text>
        </View>

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

        <View style={styles.gridContainer}>
          <TouchableOpacity
            onPress={() => setShowPreview(true)}
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
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Salary History</Text>
          <View style={styles.historyList}>
            {salaryHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View>
                  <Text style={styles.historyMonth}>{item.month}</Text>
                  <Text style={styles.historySalary}>
                    Net Salary: ₹{item.netSalary.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.historyButtons}>
                  <TouchableOpacity
                    style={styles.historyIconButton}
                    onPress={() =>
                      Alert.alert('Preview Slip', `Showing preview for ${item.month}`)
                    }
                  >
                    <Eye size={20} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.historyIconButton}
                    onPress={() =>
                      Alert.alert('Download Slip', `Downloading slip for ${item.month}`)
                    }
                  >
                    <Download size={20} color="#16A34A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default SalaryScreen;

