import { addItemAsync } from "@/constants/supabase";
import { useStores } from "@/contexts/StoresContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BaseModalProps } from "./baseModal";

export default function NewItemModal(props: BaseModalProps) {
    const {
        visible,
        onClose
    } = props;
    const { stores } = useStores();
    const [addError, setAddError] = useState('');
    const [adding, setAdding] = useState(false);

    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [selectedStore, setSelectedStore] = useState<string>('');

    const handleAddItem = async () => {
        setAddError('');
        if (!itemName.trim() || !itemPrice.trim() || !selectedStore) {
          setAddError('Please fill all fields.');
          return;
        }
        setAdding(true);
        try {
          const newItem = await addItemAsync(itemName, selectedStore, parseFloat(itemPrice));
          onClose();
        } catch (e: any) {
          setAddError(e.message || 'Failed to add item.');
        } finally {
          setAdding(false);
        }
      };

    return (
        <Modal visible={visible} animationType="slide" transparent>
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <View style={styles.header}>
                <Text style={styles.modalTitle}>Add New Item</Text>
                <TouchableOpacity onPress={onClose}>
                  <MaterialIcons name="close" size={28} color="#3b5998" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={itemName}
                onChangeText={setItemName}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={itemPrice}
                onChangeText={setItemPrice}
                keyboardType="numeric"
              />
              <Picker
                selectedValue={selectedStore}
                onValueChange={setSelectedStore}
                style={styles.input}
              >
                <Picker.Item label="Select Store" value="" />
                {stores.map((store, idx) => (
                  <Picker.Item key={idx} label={store.name} value={store.id} />
                ))}
              </Picker>
              {addError ? <Text style={styles.error}>{addError}</Text> : null}
              <TouchableOpacity style={styles.modalAddBtn} onPress={handleAddItem} disabled={adding}>
                <Text style={styles.modalAddBtnText}>{adding ? 'Adding...' : 'Add Item'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    )
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
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b5998',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  modalAddBtn: {
    backgroundColor: '#3b5998',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalAddBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  error: {
    color: '#d11a2a',
    marginBottom: 8,
    fontSize: 16,
    textAlign: 'center',
  },
})