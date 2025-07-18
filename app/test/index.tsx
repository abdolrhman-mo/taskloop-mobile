import { CustomInputAccessory } from '@/components/common/CustomInputAccessory';
import { darkTheme, lightTheme } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import PagerView from 'react-native-pager-view';

const { width } = Dimensions.get('window');

const MultiScreenForm = () => {
const { resolvedTheme } = useTheme();
const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
  const [currentPage, setCurrentPage] = useState(0);
  const [sessionName, setSessionName] = useState('');
  
  const pagerRef = useRef<PagerView>(null);
  const totalPages = 2;

  const updateFormData = (field: string, value: string) => {
    setSessionName(value);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  const handlePageSelected = (e: any) => {
    setCurrentPage(e.nativeEvent.position);
  };

  // Validation logic for each screen
  const isCurrentInputValid = () => {
    if (currentPage === 0) {
      return sessionName.trim() !== '';
    }
    return false;
  };

  const renderScreen1 = () => (
    <View className="h-full">
        <TextInput
            className="border-none rounded-lg p-3 mb-4 text-base bg-white"
            placeholder="What course or topic are you studying today?"
            value={sessionName}
            onChangeText={(text) => setSessionName(text)}
            autoFocus={true}
        />
        <CustomInputAccessory
          isVisible={true}
          onClose={() => {}}
          overlayFlag={false}
        >
          <TouchableOpacity
            className={`bg-blue-500 py-3 rounded-lg m-4 ${!isCurrentInputValid() ? 'bg-gray-300' : ''}`}
            onPress={goToNextPage}
            disabled={!isCurrentInputValid() || currentPage === totalPages - 1}
          >
            <Text className={`text-white text-base font-semibold text-center ${!isCurrentInputValid() || currentPage === totalPages - 1 ? 'text-gray-400' : ''}`}>
              Start study room
            </Text>
          </TouchableOpacity>
        </CustomInputAccessory>
    </View>
  );


  const renderScreen2 = () => (
    <View className="w-[90vw] p-4 flex-1 bg-red-500">
      {/*
        Content of screen 2
        TODO:
        - Study room created, show study room name
        - Share study room menu
        - Then enter study room button now should be enabled
      
      */}
      <Text className="text-2xl font-bold mb-8 text-center text-gray-800">Summary</Text>
      <View className="bg-white p-5 rounded-lg mb-5">
        <Text className="text-base mb-2 font-semibold text-gray-800">Name: <Text className="font-normal text-gray-500">{sessionName}</Text></Text>
      </View>
      <TouchableOpacity className="bg-green-500 p-4 rounded-lg items-center">
        <Text className="text-white text-lg font-semibold">Enter study room</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView 
        className="flex-1 mb-12 p-5"
        style={{
            // position: 'absolute',
            // top: 0,
            // left: 0,
            // right: 0,
            // bottom: 0,
            // zIndex: 9999,
            // elevation: 9999,
            backgroundColor: theme.background.secondary
        }}
    >
        <PagerView
            ref={pagerRef}
            style={{ flex: 1 }}
            initialPage={0}
            onPageSelected={handlePageSelected}
            scrollEnabled={false} // disables swipe
        >
            <View key="1" 
                className="flex-1"
                // className="flex-1 justify-center items-center"
            >
                {renderScreen1()}
            </View>
            <View key="2" className="flex-1">
                {renderScreen2()}
            </View>
        </PagerView>
    </SafeAreaView>
  );
};

export default MultiScreenForm;