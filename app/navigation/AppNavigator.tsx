import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import ExerciseSelectorScreen from '../(tabs)/ExerciseSelectorScreen';
import PoseDetectorScreen from '../(tabs)/PoseDetectorScreen';
 // ✅ 추가

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen
          name="ExerciseSelector"
          component={ExerciseSelectorWrapper}
        />

        {/* ✅ PoseDetector 화면 등록 */}
        <Stack.Screen
          name="PoseDetector"
          component={PoseDetectorScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 🔥 래퍼 컴포넌트
function ExerciseSelectorWrapper({ navigation }: any) {
  const handleSelect = (exercise: string) => {
    console.log("선택됨:", exercise);

    // ✅ PoseDetector 화면으로 이동
    navigation.navigate("PoseDetector", { exercise });
  };

  return <ExerciseSelectorScreen onSelect={handleSelect} />;
}