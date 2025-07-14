import { updateItemAsync } from '@/constants/supabase';
import { useItems } from '@/contexts/ItemsContext';
import { useStores } from '@/contexts/StoresContext';
import { EditableItemPrice, Item, ItemViewModel } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ItemDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { items } = useItems()
  const { stores } = useStores();
  const itemId = params.itemId as string;
  const item = items.find(i => i.id === itemId);


  // fallback for direct navigation
  const [name, setName] = useState(item?.name);
  const [isFavorite, setIsFavorite] = useState(item?.is_favorite);
  const [prices, setPrices] = useState<EditableItemPrice[]>(item?.item_prices.map(price => ({
    ...price,
    price_string: price.price.toString(),
  })) || []);
  console.log(prices);

  const handlePriceChange = (
    index: number,
    field: 'store_id' | 'price_string',
    value: string
  ) => {
    setPrices(prices =>
      prices.map((p, i) =>
        i === index
          ? {
              ...p,
              [field]: value
            }
          : p
      )
    );
  };

  const handleAddPrice = () => {
    setPrices(prices => [
      ...prices,
      {
        item_id: itemId,
        store_id: '',
        price: 0,
        price_string: '0.00'
      }
    ]);
  };

  const handleRemovePrice = (index: number) => {
    setPrices(prices => prices.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const updatedItem: ItemViewModel = {
      id: itemId,
      name,
      is_favorite: isFavorite,
      item_prices: prices.map(({price_string, ...rest}) => ({
        ...rest,
        price: parseFloat(price_string)
      })),
      historical_low: {
        item_id: itemId,
        store_id: prices[0]?.store_id || '',
        price: Math.min(...prices.map(p => parseFloat(p.price_string))),
      }
    };

    try {
      await updateItemAsync(updatedItem);
      router.back();
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  }

  if (!item && !params.id) {
    return (
      <View style={styles.container}>
        <Text>Item not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <MaterialIcons name="arrow-back" size={28} color="#3b5998" />
      </TouchableOpacity>
      <View style={styles.header}>
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          placeholder="Item Name"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={() => setIsFavorite(fav => !fav)}>
          <MaterialIcons name={isFavorite ? 'star' : 'star-border'} size={36} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Prices</Text>
      <FlatList
        data={prices}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.priceRow}>
            <Picker
              selectedValue={item.store_id}
              onValueChange={(storeId) => handlePriceChange(index, 'store_id', storeId)}
              style={styles.priceInput}
            >
              <Picker.Item label="Select Store" value="" />
              {stores.map((store, idx) => (
                <Picker.Item key={idx} label={store.name} value={store.id} />
              ))}
            </Picker>
            <TextInput
              style={styles.priceInput}
              value={item.price_string}
              onChangeText={text => handlePriceChange(index, 'price_string', text)}
              placeholder="$0.00"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => handleRemovePrice(index)}>
              <MaterialIcons name="delete" size={24} color="#d11a2a" />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn} onPress={handleAddPrice}>
            <MaterialIcons name="add" size={24} color="#3b5998" />
            <Text style={styles.addBtnText}>Add Price</Text>
          </TouchableOpacity>
        }
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
      >
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: '#f7f9fb',
    padding: 24,
  },
  backBtn: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  nameInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b5998',
    borderBottomWidth: 1,
    borderBottomColor: '#3b5998',
    marginRight: 12,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3b5998',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  storeInput: {
    flex: 2,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginLeft: 8,
    marginRight: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'flex-start',
    gap: 4,
  },
  addBtnText: {
    color: '#3b5998',
    fontWeight: '600',
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#3b5998',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});