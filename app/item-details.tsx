import { ItemsContext } from '@/contexts/ItemsContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Price {
  store: string;
  price: number;
}

export default function ItemDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { items, setItems } = useContext(ItemsContext);
  const itemId = params.id as string;
  const item = items.find(i => i.id === itemId);

  // fallback for direct navigation
  const [name, setName] = useState(item?.name || (params.name as string));
  const [isFavorite, setIsFavorite] = useState(item?.isFavorite ?? (params.isFavorite as string) === 'true');
  const [prices, setPrices] = useState<Price[]>(() => {
    if (item) return item.prices;
    try {
      return JSON.parse(params.prices as string);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!item) return;
    setName(item.name);
    setIsFavorite(item.isFavorite);
    setPrices(item.prices);
  }, [itemId]);

  useEffect(() => {
    if (!item) return;
    setItems(
      items.map(i =>
        i.id === itemId ? { ...i, name, isFavorite, prices } : i
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, isFavorite, prices]);

  const handlePriceChange = (index: number, field: 'store' | 'price', value: string) => {
    setPrices(prices =>
      prices.map((p, i) =>
        i === index ? { ...p, [field]: field === 'price' ? parseFloat(value) || 0 : value } : p
      )
    );
  };

  const handleAddPrice = () => {
    setPrices(prices => [...prices, { store: '', price: 0 }]);
  };

  const handleRemovePrice = (index: number) => {
    setPrices(prices => prices.filter((_, i) => i !== index));
  };

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
            <TextInput
              style={styles.storeInput}
              value={item.store}
              onChangeText={text => handlePriceChange(index, 'store', text)}
              placeholder="Store Name"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.priceInput}
              value={item.price.toString()}
              onChangeText={text => handlePriceChange(index, 'price', text)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
}); 