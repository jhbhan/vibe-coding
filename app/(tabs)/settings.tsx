import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StoresModal from '../modals/StoresModal';
import { useAuth } from '@/contexts/AuthContext';

const firstName = 'User'; // Replace with actual user data if available

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { signOut} = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Welcome {firstName}</Text>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="store" size={24} color="#3b5998" />
          <Text style={styles.menuText}>Your Stores</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.spacer} />
      <TouchableOpacity 
        style={styles.logoutBtn} 
        onPress={signOut}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <StoresModal 
        visible={modalVisible} 
        onClose={() => 
        setModalVisible(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb',
    padding: 24,
    marginBottom: 80
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 32,
  },
  menu: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 16,
    color: '#3b5998',
  },
  spacer: {
    flex: 1,
  },
  logoutBtn: {
    backgroundColor: '#d11a2a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 