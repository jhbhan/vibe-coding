import ListItem from '@/components/ListItem';
import { ItemsProvider, useItems } from '@/contexts/ItemsContext';
import { useStores } from '@/contexts/StoresContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NewItemModal from '../modals/NewItemModal';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { items } = useItems();
  const { storeNames } = useStores();
   const [modalVisible, setModalVisible] = useState(false);

  const handlePress = (id: string) => {
    router.push({
      pathname: '/item-details',
      params: {
        itemId: id
      }
    });
  };

  return (
    <ItemsProvider>
      <View style={styles.container}>
        {
          items.length === 0 
          ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No items yet.</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                  <MaterialIcons name="add" size={24} color="#fff" />
                  <Text style={styles.addBtnText}>Add Items</Text>
                </TouchableOpacity>
              </View>
            ) 
          : (
            <>
              <FlatList
                data={items}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                  let lowest = item.prices.reduce((min, p) => (p.price < min.price ? p : min), item.prices[0]);
                  return (
                    <ListItem
                      name={item.name}
                      isFavorite={item.isFavorite}
                      lowestPrice={lowest.price}
                      lowestStore={storeNames[lowest.store_id] ?? "N/A"}
                      onPress={() => handlePress(item.id)}
                    />
                  );
                }}
              />
              <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <MaterialIcons name="add" size={24} color="#fff" />
                <Text style={styles.addBtnText}>Add Items</Text>
              </TouchableOpacity>
            </>
          )
        }
        <NewItemModal 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)} 
        />
      </View>
    </ItemsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b5998', // blueish background
    alignItems: 'center',
    justifyContent: 'center',
  },
  landing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    zIndex: 2,
  },
  title: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
    gap: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#3b5998',
    marginBottom: 16,
  }
});
