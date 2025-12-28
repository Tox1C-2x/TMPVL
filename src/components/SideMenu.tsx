import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  Switch,
  SafeAreaView,
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { 
  User, Bell, LogOut, Camera, X, Fingerprint, Contrast, 
  FileText, Shield, ChevronRight, Sparkles, Phone, HelpCircle
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SideMenu = ({ 
  isVisible, 
  onClose, 
  user, 
  onLogout, 
  profileImage, 
  onImagePick,
  onProfileClick 
}) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- LOCAL STATE FOR DYNAMIC DATA ---
  const [localUser, setLocalUser] = useState({
      name: 'Guest',
      designation: 'Employee',
      empId: '---',
      mobile: ''
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // --- REFRESH DATA ON OPEN ---
  useEffect(() => {
    if (isVisible) {
      // 1. Animation Start
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      // 2. FETCH LATEST DATA FROM STORAGE
      const fetchLatestData = async () => {
          try {
              const storedJson = await AsyncStorage.getItem('@user_session');
              if (storedJson) {
                  const data = JSON.parse(storedJson);
                  setLocalUser({
                      name: data.name || user?.name || 'Guest',
                      // Yahan update pakka dikhega
                      designation: data.designation || user?.designation || 'Employee', 
                      empId: data.empId || user?.empId || '---',
                      mobile: data.mobile || user?.mobile || ''
                  });
              } else {
                  // Fallback to Props
                  setLocalUser({
                    name: user?.name || 'Guest',
                    designation: user?.designation || 'Employee',
                    empId: user?.empId || '---',
                    mobile: user?.mobile || ''
                  });
              }
          } catch (e) {
              console.log("Error fetching side menu data", e);
          }
      };
      fetchLatestData();

    } else {
      // Close Animation
      slideAnim.setValue(-width);
      fadeAnim.setValue(0);
    }
  }, [isVisible, user]); // Run when isVisible changes

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -width, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };
  
  const menuOptions = [
    { label: 'Notifications', icon: Bell, isToggle: true, value: notificationsEnabled, onToggle: setNotificationsEnabled },
    { label: 'Biometric Unlock', icon: Fingerprint, isToggle: true, value: biometricEnabled, onToggle: setBiometricEnabled },
    { label: 'Dark Mode', icon: Contrast, isToggle: true, value: darkModeEnabled, onToggle: setDarkModeEnabled },
    { sectionDivider: true },
    { label: 'Terms & Conditions', icon: FileText, action: () => console.log('T&C') },
    { label: 'Privacy Policy', icon: Shield, action: () => console.log('Privacy') },
    { label: 'Help & Support', icon: HelpCircle, action: () => console.log('Help') },
  ];

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={handleClose} animationType="none">
        <View style={styles.overlayContainer}>
            <TouchableWithoutFeedback onPress={handleClose}>
                <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
                <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
                    
                    <View>
                        {/* Header */}
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <X size={24} color="#111827" />
                            </TouchableOpacity>
                            <Sparkles size={24} color="#111827" fill="#111827" style={{ opacity: 0.2 }} />
                        </View>

                        {/* Profile Section (USING LOCAL USER STATE) */}
                        <View style={styles.profileSection}>
                            <View style={styles.avatarRow}>
                                <TouchableOpacity onPress={onImagePick} style={styles.avatarContainer}>
                                    {profileImage ? (
                                        <Image source={{ uri: profileImage }} style={styles.avatar} />
                                    ) : (
                                        <View style={styles.placeholderAvatar}>
                                            <Text style={styles.placeholderText}>
                                                {localUser.name ? localUser.name.charAt(0) : "U"}
                                            </Text>
                                        </View>
                                    )}
                                    <View style={styles.editIconBadge}>
                                        <Camera size={10} color="#FFF" />
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.userInfo}>
                                    <Text style={styles.userName} numberOfLines={1}>{localUser.name}</Text>
                                    {/* Updated Designation here */}
                                    <Text style={styles.userRole}>{localUser.designation}</Text>
                                    
                                    <View style={styles.mobileRow}>
                                        <Phone size={12} color="#6B7280" style={{marginRight: 4}} />
                                        <Text style={styles.userMobile}>{localUser.mobile}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.idBadgeContainer}>
                                <Text style={styles.userEmpId}>ID: {localUser.empId}</Text>
                                <TouchableOpacity style={styles.viewProfileBtn} onPress={onProfileClick}>
                                    <Text style={styles.viewProfileText}>Edit Profile</Text>
                                    <ChevronRight size={14} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        {/* Menu Items */}
                        <View style={styles.menuList}>
                            <Text style={styles.sectionHeader}>PREFERENCES</Text>
                            {menuOptions.map((item, index) => {
                                if (item.sectionDivider) {
                                    return <View key={`div-${index}`} style={{marginTop: 15}}><Text style={styles.sectionHeader}>SUPPORT</Text></View>;
                                }
                                if (item.isToggle) {
                                    return (
                                        <View key={index} style={styles.menuItem}>
                                            <View style={styles.menuItemLeft}>
                                                <item.icon size={20} color="#4B5563" />
                                                <Text style={styles.menuItemText}>{item.label}</Text>
                                            </View>
                                            <Switch value={item.value} onValueChange={item.onToggle} trackColor={{ false: '#E5E7EB', true: '#111827' }} thumbColor={'#FFF'} ios_backgroundColor="#E5E7EB" style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }} />
                                        </View>
                                    );
                                }
                                return (
                                    <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
                                        <View style={styles.menuItemLeft}>
                                            <item.icon size={20} color="#4B5563" />
                                            <Text style={styles.menuItemText}>{item.label}</Text>
                                        </View>
                                        <ChevronRight size={16} color="#9CA3AF" />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.bottomSection}>
                        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                            <View style={styles.logoutIconBg}><LogOut size={20} color="#DC2626" /></View>
                            <Text style={styles.logoutText}>Log out</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.madeInText}>Made 💗 TATA MOTORS</Text>
                            <Text style={styles.versionText}>Version 1.0.0</Text>
                        </View>
                    </View>

                </SafeAreaView>
            </Animated.View>
        </View>
    </Modal>
  );
};

// --------------- CLEAN LINE-BY-LINE STYLES ---------------
const styles = StyleSheet.create({
  overlayContainer: { 
    flex: 1, 
    zIndex: 1000 
  },
  
  backdrop: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  
  menuContainer: { 
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    width: width * 0.85, 
    height: '100%', 
    backgroundColor: '#FFFFFF', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20, 
    paddingHorizontal: 24, 
    shadowColor: "#000", 
    shadowOffset: { width: 5, height: 0 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 25 
  },
  
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 18,
    paddingVertical: 15
  },
  
  closeButton: { 
    padding: 8, 
    backgroundColor: '#F3F4F6', 
    borderRadius: 50,
    marginTop: -15,
  },
  
  profileSection: { 
    marginBottom: 15 
  },
  
  avatarRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  
  avatarContainer: { 
    position: 'relative', 
    marginRight: 15 
  },
  
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28 
  },
  
  placeholderAvatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#F3F4F6', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  
  placeholderText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  
  editIconBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#111827', 
    padding: 4, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#FFF' 
  },
  
  userInfo: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  
  userName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 2 
  },
  
  userRole: { 
    fontSize: 13, 
    color: '#6B7280', 
    marginBottom: 4, 
    fontWeight: '500' 
  },
  
  mobileRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  
  userMobile: { 
    fontSize: 12, 
    color: '#6B7280', 
    fontWeight: '500' 
  },
  
  idBadgeContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#F9FAFB', 
    padding: 8, 
    borderRadius: 8 
  },
  
  userEmpId: { 
    fontSize: 12, 
    color: '#374151', 
    fontWeight: '600', 
    letterSpacing: 0.5 
  },
  
  viewProfileBtn: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  
  viewProfileText: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginRight: 2 
  },
  
  separator: { 
    height: 1, 
    backgroundColor: '#F3F4F6', 
    marginBottom: 15 
  },
  
  menuList: {},
  
  sectionHeader: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: '#9CA3AF', 
    marginBottom: 10, 
    letterSpacing: 0.5 
  },
  
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 15, 
    marginBottom: 0 
  },
  
  menuItemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  
  menuItemText: { 
    fontSize: 15, 
    color: '#374151', 
    marginLeft: 12, 
    fontWeight: '500' 
  },
  
  bottomSection: { 
    paddingBottom: 20 
  },
  
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15, 
    backgroundColor: '#FEF2F2', 
    padding: 12, 
    borderRadius: 8 
  },
  
  logoutIconBg: { 
    marginRight: 12 
  },
  
  logoutText: { 
    fontSize: 15, 
    color: '#DC2626', 
    fontWeight: '600' 
  },
  
  footer: { 
    borderTopWidth: 1, 
    borderTopColor: '#F3F4F6', 
    paddingTop: 15, 
    alignItems: 'center' 
  },
  
  madeInText: { 
    fontSize: 12, 
    color: '#111827', 
    fontWeight: 'bold', 
    marginBottom: 2, 
    textTransform: 'uppercase' 
  },
  
  versionText: { 
    fontSize: 10, 
    color: '#9CA3AF' 
  },
});

export default SideMenu;