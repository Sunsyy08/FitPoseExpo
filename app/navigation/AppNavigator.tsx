import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { History, Home } from 'lucide-react-native';
import React from 'react';

import ExerciseSelectorScreen from '../(tabs)/ExerciseSelectorScreen';
import PoseDetectorScreen from '../(tabs)/PoseDetectorScreen';
import WorkoutHistoryScreen from '../(tabs)/WorkoutHistoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 임시 히스토리 데이터 (필요하면 수정)
const historyData: any[] = [];

// 홈 스택 네비게이터
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ExerciseSelector"
        component={ExerciseSelectorWrapper}
      />
      <Stack.Screen
        name="PoseDetector"
        component={PoseDetectorScreen}
      />
    </Stack.Navigator>
  );
}

// 하단 탭 네비게이터
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#27272a',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />

      {/* ⭐ children 형식으로 바꿔서 navigation 사용 가능 */}
      <Tab.Screen
        name="History"
        options={{
          tabBarLabel: '기록',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      >
        {({ navigation }) => (
          <WorkoutHistoryScreen
            history={historyData}
            onBack={() => navigation.goBack()}
          />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
} 

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

// ExerciseSelector wrapper
function ExerciseSelectorWrapper({ navigation }: any) {
  const handleSelect = (exercise: string) => {
    console.log("선택됨:", exercise);
    navigation.navigate("PoseDetector", { exercise });
  };

  return <ExerciseSelectorScreen onSelect={handleSelect} />;
}
