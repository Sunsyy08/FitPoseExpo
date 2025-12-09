import { LinearGradient } from "expo-linear-gradient";
import { Target, TrendingUp, Zap } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ExerciseType } from "../types/exercise"; // ✔ 올바른 경로로 변경

interface Props {
  onSelect: (exercise: ExerciseType) => void;
}

const exercises = [
  {
    type: "squat" as ExerciseType,
    name: "스쿼트",
    nameEn: "SQUAT",
    description: "하체 폭발적 파워",
    muscles: "대퇴사두근 • 둔근 • 햄스트링",
    difficulty: "BEGINNER",
    gradient: ["#06b6d4", "#3b82f6", "#8b5cf6"],
    bgGradient: ["rgba(6,182,212,0.2)", "rgba(59,130,246,0.2)"],
  },
  {
    type: "pushup" as ExerciseType,
    name: "푸쉬업",
    nameEn: "PUSH-UP",
    description: "상체 근력 폭발",
    muscles: "가슴 • 삼두 • 어깨",
    difficulty: "INTERMEDIATE",
    gradient: ["#f97316", "#ef4444", "#ec4899"],
    bgGradient: ["rgba(249,115,22,0.2)", "rgba(239,68,68,0.2)"],
  },
  {
    type: "plank" as ExerciseType,
    name: "플랭크",
    nameEn: "PLANK",
    description: "코어 강화 마스터",
    muscles: "복근 • 코어 • 허리",
    difficulty: "BEGINNER",
    gradient: ["#22c55e", "#10b981", "#14b8a6"],
    bgGradient: ["rgba(34,197,94,0.2)", "rgba(16,185,129,0.2)"],
  },
];

export default function ExerciseSelector({ onSelect }: Props) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <LinearGradient
            colors={["#22d3ee", "#3b82f6"]}
            style={styles.headerIconBox}
          >
            <Zap size={32} color="white" />
          </LinearGradient>

          <View>
            <Text style={styles.title}>AI FITNESS COACH</Text>
            <Text style={styles.subtitle}>AI 기반 실시간 자세 분석 시스템</Text>
          </View>
        </View>

        <View style={styles.statusBox}>
          <View style={styles.statusItem}>
            <View style={styles.greenDot} />
            <Text style={styles.statusText}>AI 분석 준비 완료</Text>
          </View>

          <View style={styles.statusItem}>
            <Target size={18} color="#9ca3af" />
            <Text style={styles.statusSubText}>정확도 99.8%</Text>
          </View>
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionTitleWrapper}>
        <View style={styles.line} />
        <Text style={styles.sectionTitle}>운동 선택</Text>
        <View style={styles.line} />
      </View>

      {/* Exercise Cards */}
      {exercises.map((ex) => (
        <TouchableOpacity
          key={ex.type}
          onPress={() => onSelect(ex.type)}
          style={styles.card}
          activeOpacity={0.85}
        >
            <LinearGradient
              colors={ex.bgGradient as [string, string]} // 두 개 이상이면 그 이상도 가능
              style={styles.cardBg}
            />

          <View style={styles.cardOverlay} />

          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              {/* EN Title + Difficulty */}
              <View style={styles.cardTop}>
                <Text
                  style={[
                    styles.cardEnTitle,
                    { color: ex.gradient[1] },
                  ]}
                >
                  {ex.nameEn}
                </Text>

                <Text style={styles.difficulty}>{ex.difficulty}</Text>
              </View>

              <Text style={styles.korTitle}>{ex.name}</Text>

              <Text style={styles.description}>{ex.description}</Text>

              <View style={styles.muscleRow}>
                <TrendingUp size={18} color="#6b7280" />
                <Text style={styles.muscles}>{ex.muscles}</Text>
              </View>
            </View>

            {/* Arrow Button */}
            <LinearGradient
              colors={ex.bgGradient as [string, string]} // 두 개 이상이면 그 이상도 가능
              style={styles.cardBg}
            />

          </View>
        </TouchableOpacity>
      ))}

      {/* Features */}
      <View style={styles.featuresWrapper}>
        {[
          { icon: "🎯", title: "실시간 분석", value: "99.8%" },
          { icon: "⚡", title: "즉각 피드백", value: "<0.1s" },
          { icon: "🔄", title: "자동 카운트", value: "100%" },
          { icon: "🎧", title: "음성 가이드", value: "KR" },
        ].map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureValue}>{f.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  /* Header */
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  headerIconBox: {
    padding: 12,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#60a5fa",
  },
  subtitle: {
    color: "#9ca3af",
    marginTop: 4,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(39,39,42,0.5)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3f3f46",
    justifyContent: "space-between",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },
  statusText: {
    color: "#d1d5db",
  },
  statusSubText: {
    color: "#9ca3af",
    fontSize: 12,
  },

  /* Section title */
  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#52525b",
  },
  sectionTitle: {
    color: "#9ca3af",
    fontSize: 18,
    letterSpacing: 2,
  },

  /* Cards */
  card: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
  },
  cardBg: {
    ...StyleSheet.absoluteFillObject,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(24,24,27,0.8)",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
  },
  cardLeft: {
    flex: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardEnTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  korTitle: {
    fontSize: 20,
    color: "white",
    marginBottom: 12,
  },
  difficulty: {
    backgroundColor: "#27272a",
    color: "#a1a1aa",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
  },
  description: {
    color: "#9ca3af",
    marginBottom: 12,
  },
  muscleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  muscles: {
    color: "#6b7280",
  },
  arrowBox: {
    padding: 24,
    borderRadius: 16,
    marginLeft: 16,
  },
  arrow: {
    color: "white",
    fontSize: 32,
  },

  /* Features */
  featuresWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "rgba(39,39,42,0.5)",
    borderWidth: 1,
    borderColor: "#3f3f46",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 12,
    color: "#9ca3af",
  },
  featureValue: {
    fontSize: 16,
    color: "#22d3ee",
    marginTop: 4,
  },
});
