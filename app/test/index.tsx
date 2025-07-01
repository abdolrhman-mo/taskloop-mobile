import React from 'react';
import { FlatList, View, Text, Dimensions } from 'react-native';

const DATA = [
    {
        name: "Makady:", 
        todo: [
            "Study for the exam",
            "Go to the gym",
            "Buy groceries",
            "Finish the project",
            "Go to the gym",
            "Buy groceries",
            "Finish the project",
        ],
    },
    {
        name: "Mohamed:",
        todo: [
            "Study for the exam",
            "Go to the gym",
            "Buy groceries",
            "Finish the project",
            "Go to the gym",
            "Buy groceries",
            "Finish the project",
        ],
    },
    // {
    //     name: "John:",
    //     todo: [
    //         "Study for the exam",
    //         "Go to the gym",
    //         "Buy groceries",
    //         "Finish the project",
    //     ]
    // },
    // {
    //     name: "Jane:",
    //     todo: [
    //         "Study for the exam",
    //     ]
    // }
];
const { width } = Dimensions.get('window');

export default function MyHorizontalPager() {
  return (
    <FlatList
      data={DATA}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item }) => (
        <View
          style={{
            width: width * 0.8,
            // alignItems: 'center',
            // backgroundColor: 'lightblue',
          }}
        >
          <Text style={{ fontSize: 40 }}>{item.name}</Text>
          <FlatList
            data={item.todo}
            renderItem={({ item }) => (
              <Text style={{ fontSize: 20 }}>{item}</Text>
            )}
          />
        </View>
      )}
    />
  );
}
