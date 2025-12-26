import { StyleSheet, Platform, StatusBar } from 'react-native';

// Yeh file 'App.js' se saare styles ko alag karta hai.

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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screenScrollContainer: {
    flex: 1,
  },
  screenContentContainer: {
    paddingBottom: 80, // Extra space for bottom nav
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
    marginBottom: 16,
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
    fontSize: 22, // text-xl
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
  
  // --- Modal Styles ---
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

  // Bottom Navigation (Original UI)
bottomNavContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20, 
    paddingTop: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  
  navButtonText: {
    fontSize: 10,
    marginTop: 4,
  },
  
    // --- Bacground Pill -- 
    
  activeNavPill: {
    backgroundColor: '#DBEAFE', 
    paddingHorizontal: 20,       
    paddingVertical: 6,          
    borderRadius: 20,             
    marginBottom: 4,             
  },
  
  navButtonText: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2, // Icon ke baad thoda gap
  },

  // Utility Colors
  textGray500: { color: '#6B7280' },
  textGray600: { color: '#4B5563' },
  textGray900: { color: '#111827' },
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

export default styles;
