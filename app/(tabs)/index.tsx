import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type ExerciseType = 'squat' | 'pushup' | 'plank';

interface Exercise {
  type: ExerciseType;
  name: string;
  nameEn: string;
  description: string;
  muscles: string;
  difficulty: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
} 

const exercises: Exercise[] = [
  {
    type: 'squat',
    name: '스쿼트',
    nameEn: 'SQUAT',
    description: '하체 폭발적 파워',
    muscles: '대퇴사두근 • 둔근 • 햄스트링',
    difficulty: 'BEGINNER',
    colors: {
      primary: '#06b6d4',
      secondary: '#3b82f6',
      tertiary: '#8b5cf6',
    },
  },
  {
    type: 'pushup',
    name: '푸쉬업',
    nameEn: 'PUSH-UP',
    description: '상체 근력 폭발',
    muscles: '가슴 • 삼두 • 어깨',
    difficulty: 'INTERMEDIATE',
    colors: {
      primary: '#f97316',
      secondary: '#ef4444',
      tertiary: '#ec4899',
    },
  },
  {
    type: 'plank',
    name: '플랭크',
    nameEn: 'PLANK',
    description: '코어 강화 마스터',
    muscles: '복근 • 코어 • 허리',
    difficulty: 'BEGINNER',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      tertiary: '#14b8a6',
    },
  },
];

const features = [
  { icon: '🎯', title: '실시간 분석', value: '99.8%' },
  { icon: '⚡', title: '즉각 피드백', value: '<0.1s' },
  { icon: '🔄', title: '자동 카운트', value: '100%' },
  { icon: '🎧', title: '음성 가이드', value: 'KR' },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleExerciseSelect = (exercise: ExerciseType) => {
    router.push({
      pathname: '/PoseDetectorScreen',
      params: { exercise }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>⚡</Text>
            </View>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>AI FITNESS COACH</Text>
            <Text style={styles.subtitle}>AI 기반 실시간 자세 분석 시스템</Text>
          </View>
        </View>

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>AI 분석 준비 완료</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusIcon}>🎯</Text>
            <Text style={styles.statusSubtext}>정확도 99.8%</Text>
          </View>
        </View>
      </View>

      {/* Section Divider */}
      <View style={styles.sectionDivider}>
        <View style={styles.dividerLine} />
        <Text style={styles.sectionTitle}>운동 선택</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Exercise Cards */}
      <View style={styles.exercisesContainer}>
        {exercises.map((exercise) => (
          <Pressable
            key={exercise.type}
            style={({ pressed }) => [
              styles.exerciseCard,
              pressed && styles.exerciseCardPressed,
            ]}
            onPress={() => handleExerciseSelect(exercise.type)}
          >
            <View style={[styles.cardBackground, { backgroundColor: exercise.colors.primary + '20' }]} />
            <View style={styles.cardOverlay} />
            
            {/* Content */}
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                {/* Title */}
                <View style={styles.cardHeader}>
                  <Text style={[styles.exerciseNameEn, { color: exercise.colors.primary }]}>
                    {exercise.nameEn}
                  </Text>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                
                {/* Description */}
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                
                {/* Muscles */}
                <View style={styles.musclesContainer}>
                  <Text style={styles.musclesIcon}>📈</Text>
                  <Text style={styles.musclesText}>{exercise.muscles}</Text>
                </View>
              </View>

              {/* Arrow Button */}
              <View style={[styles.arrowButton, { backgroundColor: exercise.colors.primary }]}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Features Grid */}
      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureValue}>{feature.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  heroSection: {
    marginBottom: 48,
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  logoGlow: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#06b6d4',
    borderRadius: 16,
    opacity: 0.5,
    transform: [{ scale: 1.2 }],
  },
  logo: {
    backgroundColor: '#06b6d4',
    padding: 12,
    borderRadius: 16,
  },
  logoIcon: {
    fontSize: 32,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#06b6d4',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 16,
    padding: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
    marginRight: 12,
  },
  statusText: {
    color: '#d1d5db',
    fontSize: 14,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusSubtext: {
    color: '#9ca3af',
    fontSize: 12,
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#27272a',
  },
  sectionTitle: {
    color: '#9ca3af',
    fontSize: 16,
    marginHorizontal: 16,
    letterSpacing: 2,
  },
  exercisesContainer: {
    gap: 24,
    marginBottom: 48,
  },
  exerciseCard: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  exerciseCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardBackground: {
    position: 'absolute',
    inset: 0,
    opacity: 0.5,
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 24,
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  exerciseNameEn: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  difficultyBadge: {
    backgroundColor: '#27272a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#9ca3af',
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '600',
  },
  exerciseName: {
    fontSize: 18,
    color: '#d1d5db',
    marginBottom: 12,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  musclesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musclesIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  musclesText: {
    fontSize: 12,
    color: '#6b7280',
  },
  arrowButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  arrowIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  featureValue: {
    fontSize: 16,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
});