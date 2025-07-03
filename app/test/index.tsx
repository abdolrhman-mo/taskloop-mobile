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
      style={{ width }}
      contentContainerStyle={{ paddingHorizontal: width * 0.15 }}
      renderItem={({ item }) => (
        <View
          style={{ width: width * 0.7 }}
          className='p-8 gap-4'
        >
          <Text className="text-4xl text-red-500">{item.name}</Text>
          <FlatList
            data={item.todo}
            renderItem={({ item }) => (
              <Text className="text-xl text-slate-600">{item}</Text>
            )}
          />
        </View>
      )}
    />
  );
}
