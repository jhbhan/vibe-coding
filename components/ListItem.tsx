import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ListItemProps {
  name: string;
  isFavorite: boolean;
  onPress: () => void;
  lowestPrice?: number;
  lowestStore?: string;
}

export default function ListItem({ name, isFavorite, onPress, lowestPrice, lowestStore }: ListItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.itemText}>{name}</Text>
        {lowestPrice !== undefined && lowestStore && (
          <Text style={styles.priceText}>
            ${lowestPrice.toFixed(2)} <Text style={styles.storeText}>@ {lowestStore}</Text>
          </Text>
        )}
      </View>
      {isFavorite && (
        <MaterialIcons name="star" size={28} color="#FFD700" style={styles.star} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flex: 1,
  },
  itemText: {
    fontSize: 24,
    color: '#3b5998',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  storeText: {
    color: '#3b5998',
    fontWeight: '500',
  },
  star: {
    marginLeft: 12,
  },
}); 