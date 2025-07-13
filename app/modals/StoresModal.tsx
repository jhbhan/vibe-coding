import { addStoreAsync } from '@/constants/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useStores } from '@/contexts/StoresContext';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseModalProps } from './baseModal';

export default function StoresModal({ visible, onClose }: BaseModalProps) {
  const { stores, addStore } = useStores();
  const [newStore, setNewStore] = useState('');
  const { user } = useAuth();

  const handleAdd = async () => {
    const trimmed = newStore.trim();
    if (trimmed) {
      console.debug('Adding new store:', trimmed);
      const retVal = await addStoreAsync(trimmed);
      console.debug('Store added:', retVal);
      if (retVal && retVal.data) {
        alert('Store added successfully!');
        setNewStore('');
        addStore(retVal.data)
      } else {
        alert('Store already exists or an error occurred.');
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Stores</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={28} color="#3b5998" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={stores}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.storeItem}>
                <Text style={styles.storeText}>{item.name}</Text>
                {user?.email === item.user_id && (
                  <TouchableOpacity onPress={handleAdd}>
                    <MaterialIcons name="delete" size={20} color="#3b5998" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            style={styles.list}
          />
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              value={newStore}
              onChangeText={setNewStore}
              placeholder="Add new store"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  list: {
    marginBottom: 16,
  },
  storeItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  storeText: {
    fontSize: 18,
    color: '#333',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  addBtn: {
    backgroundColor: '#3b5998',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 