import ListItem from '@/components/ListItem';
import { ItemsContext, ItemsProvider } from '@/contexts/ItemsContext';
import { ItemPrice } from '@/types';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [showLanding, setShowLanding] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const { items } = useContext(ItemsContext);
  let isMounted = true;
  
  useEffect(() => {
    let isMounted = true;
  
    if (showLanding) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        if (isMounted) setShowLanding(false);
      });
    }
  
    return () => { isMounted = false };
  }, [showLanding]);

  const handlePress = (item: ItemPrice) => {
    router.push({
      pathname: '/item-details',
      params: {
        ...item,
        isFavorite: item.isFavorite ? 'true' : 'false',
        prices: JSON.stringify(item.prices),
        historicalLow: JSON.stringify(item.historicalLow),
      },
    });
  };

  return (
    <ItemsProvider>
      <View style={styles.container}>
        {showLanding ? (
          <Animated.View style={[styles.landing, { opacity: fadeAnim }]}> 
            <Text style={styles.title}>Compare</Text>
          </Animated.View>
        ) : (
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
                  lowestStore={lowest.store}
                  onPress={() => handlePress(item)}
                />
              );
            }}
          />
        )}
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
});
