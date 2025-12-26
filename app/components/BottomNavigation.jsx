import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, Clock, FileText, Calendar } from 'lucide-react-native';
import styles from '../styles/styles';

const BottomNavigation = ({ currentScreen, setCurrentScreen }) => {
  
  // Helper function taaki code clean dikhe
  const renderIcon = (screenName, IconComponent) => {
    const isActive = currentScreen === screenName;
    
    return (
      <View style={isActive ? styles.activeNavPill : null}>
        <IconComponent
          size={24} 
          color={isActive ? '#111827' : '#9CA3AF'} 
          strokeWidth={isActive ? 1.5 : 2} // Active hone par thoda mota icon
        />
      </View>
    );
  };

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        
        {/* Home */}
        <TouchableOpacity
          onPress={() => setCurrentScreen('home')}
          style={styles.navButton}
        >
          {renderIcon('home', Home)}
          <Text
            style={[
              styles.navButtonText,
              // Active hone par Bold aur Blue text
              currentScreen === 'home' 
                ? { color: '#111827', fontWeight: 'bold' } 
                : styles.textGray400,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Attendance */}
        <TouchableOpacity
          onPress={() => setCurrentScreen('attendance')}
          style={styles.navButton}
        >
          {renderIcon('attendance', Clock)}
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'attendance'
                ? { color: '#111827', fontWeight: 'bold' } 
                : styles.textGray500,
            ]}
          >
            Attendance
          </Text>
        </TouchableOpacity>

        {/* Salary */}
        <TouchableOpacity
          onPress={() => setCurrentScreen('salary')}
          style={styles.navButton}
        >
          {renderIcon('salary', FileText)}
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'salary'
                ? { color: '#111827', fontWeight: 'bold' } 
                : styles.textGray500,
            ]}
          >
            Salary
          </Text>
        </TouchableOpacity>

        {/* Leaves */}
        <TouchableOpacity
          onPress={() => setCurrentScreen('leaves')}
          style={styles.navButton}
        >
          {renderIcon('leaves', Calendar)}
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'leaves'
                ? { color: '#111827', fontWeight: 'bold' } 
                : styles.textGray500,
            ]}
          >
            Leaves
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default BottomNavigation;


