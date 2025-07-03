import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { FlatList, View, Text, Dimensions } from 'react-native';

const DATA = [
    {
      name: "Mohamed:",
      todo: [
          {
              id: 1,
              text: "Study for the exam",
          },
          {
              id: 2,
              text: "Go to the gym",
          },
          {
              id: 3,
              text: "Buy groceries",
          },
          {
              id: 4,
              text: "Finish the project",
          },
      ],
    },
    {
        name: "Makady:", 
        todo: [
            {
                id: 1,
                text: "Study for the exam",
            },
            {
                id: 2,
                text: "Go to the gym",
            },
            {
                id: 3,
                text: "Buy groceries",
            },
            {
                id: 4,
                text: "Finish the project",
            },
            {
                id: 5,
                text: "Go to the gym",
            },
            {
                id: 6,
                text: "Buy groceries",
            },
            {
                id: 7,
                text: "Finish the project",
            },
            {
                id: 8,
                text: "Study for the exam",
            },
            {
                id: 9,
                text: "Go to the gym",
            },
            {
                id: 10,
                text: "Buy groceries",
            },
            {
                id: 11,
                text: "Finish the project",
            },
            {
                id: 12,
                text: "Go to the gym",
            },
            {
                id: 13,
                text: "Buy groceries",
            },
            {
                id: 14,
                text: "Finish the project",
            },
            {
                id: 15,
                text: "Go to the gym",
            },
            {
                id: 16,
                text: "Buy groceries",
            },
            {
                id: 17,
                text: "Study for the exam",
            },
            {
                id: 18,
                text: "Go to the gym",
            },
            {
                id: 19,
                text: "Buy groceries",
            },
            {
                id: 20,
                text: "Finish the project",
            },
            {
                id: 21,
                text: "Go to the gym",
            },
            {
                id: 22,
                text: "Buy groceries",
            },
            {
                id: 23,
                text: "Finish the project",
            },
            {
                id: 24,
                text: "Finish the project",
            },
            {
                id: 25,
                text: "Go to the gym",
            },
            {
                id: 26,
                text: "Buy groceries",
            },
            {
                id: 27,
                text: "Finish the project",
            },
        ],
    },
    {
        name: "John:",
        todo: [
            {
                id: 1,
                text: "Study for the exam",
            },
            {
                id: 2,
                text: "Go to the gym",
            },
            {
                id: 3,
                text: "Buy groceries",
            },
            {
                id: 4,
                text: "Finish the project",
            },
        ]
    },
    {
        name: "Jane:",
        todo: [
            {
                id: 1,
                text: "Study for the exam",
            },
        ]
    }
];
const { width } = Dimensions.get('window');
const PAGE_WIDTH = width * 0.8;

export default function MyHorizontalPager() {
  return (
    <ThemedView className='flex-1'>
      <FlatList
        data={DATA}
        horizontal
        snapToInterval={PAGE_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name.toString()}
        renderItem={({ item }) => (
          <View
            style={{ width: PAGE_WIDTH }}
            className='p-8 gap-4'
          >
            <Text className="text-4xl text-red-500">{item.name}</Text>
            <FlatList
              data={item.todo}
              renderItem={({ item }) => (
                <Text className="text-xl text-white">{item.text}</Text>
              )}
            />
          </View>
        )}
      />
    </ThemedView>
  );
}
