import { LinearGradient } from "expo-linear-gradient";
import {
    ArrowLeft,
    Clock,
    Target,
    TrendingUp,
    Trophy,
    Zap,
} from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// 🔥 네가 직접 props로 넘기는 구조 그대로 반영
export interface WorkoutRecord {
  id: string;
  exerciseType: "squat" | "pushup" | "plank";
  reps: number;
  duration: number;
  averageScore: number;
  timestamp: Date;
}

interface WorkoutHistoryProps {
  history: WorkoutRecord[];
  onBack: () => void;
}

export default function WorkoutHistory({ history = [],   // ← undefined 방지: 기본값 []
  onBack,
}: WorkoutHistoryProps) {
  const getExerciseName = (type: string) => {
    const names: Record<string, string> = {
      squat: 'SQUAT',
      pushup: 'PUSH-UP',
      plank: 'PLANK',
    };
    return names[type] || type;
  };

  const getExerciseColors = (type: string): [string, string] => {
    const colors: Record<string, [string, string]> = {
      squat: ['#06b6d4', '#3b82f6'],
      pushup: ['#f97316', '#ef4444'],
      plank: ['#10b981', '#059669'],
    };
    return colors[type] || ['#6b7280', '#4b5563'];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  const totalWorkouts = history.length;
  const totalReps = history.reduce((sum, record) => sum + record.reps, 0);
  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce((sum, record) => sum + record.averageScore, 0) /
            history.length
        )
      : 0;
  const totalMinutes = Math.floor(
    history.reduce((sum, record) => sum + record.duration, 0) / 60
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#eab308';
    return '#ef4444';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 80) return 'S';
    if (score >= 60) return 'A';
    return 'B';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>운동 기록</Text>
            <Text style={styles.subtitle}>당신의 성장을 확인하세요</Text>
          </View>
        </View>

        {/* Stats Overview */}
        {history.length > 0 && (
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={['rgba(6, 182, 212, 0.2)', 'rgba(59, 130, 246, 0.2)']}
              style={styles.statCard}
            >
              <Zap size={24} color="#22d3ee" />
              <Text style={styles.statValue}>{totalWorkouts}</Text>
              <Text style={styles.statLabel}>세션</Text>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(236, 72, 153, 0.2)']}
              style={styles.statCard}
            >
              <TrendingUp size={24} color="#c084fc" />
              <Text style={styles.statValue}>{totalReps}</Text>
              <Text style={styles.statLabel}>총 횟수</Text>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.2)']}
              style={styles.statCard}
            >
              <Trophy size={24} color="#34d399" />
              <Text style={styles.statValue}>{averageScore}</Text>
              <Text style={styles.statLabel}>평균 점수</Text>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(249, 115, 22, 0.2)', 'rgba(239, 68, 68, 0.2)']}
              style={styles.statCard}
            >
              <Clock size={24} color="#fb923c" />
              <Text style={styles.statValue}>{totalMinutes}</Text>
              <Text style={styles.statLabel}>총 분</Text>
            </LinearGradient>
          </View>
        )}

        {/* History List */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최근 활동</Text>
            {history.length > 0 && (
              <View style={styles.recordCount}>
                <Target size={16} color="#6b7280" />
                <Text style={styles.recordCountText}>
                  {history.length}개 기록
                </Text>
              </View>
            )}
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['rgba(6, 182, 212, 0.2)', 'rgba(59, 130, 246, 0.2)']}
                style={styles.emptyIcon}
              >
                <Zap size={48} color="#22d3ee" />
              </LinearGradient>
              <Text style={styles.emptyTitle}>아직 운동 기록이 없습니다</Text>
              <Text style={styles.emptySubtitle}>
                첫 운동을 시작하고 기록을 남겨보세요
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.map((record, index) => {
                const [color1, color2] = getExerciseColors(record.exerciseType);

                return (
                  <View key={record.id} style={styles.recordCard}>
                    <View style={styles.recordHeader}>
                      <View style={styles.recordInfo}>
                        <View style={styles.recordTitleRow}>
                          <LinearGradient
                            colors={[color1, color2]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.exerciseNameGradient}
                          >
                            <Text style={styles.exerciseName}>
                              {getExerciseName(record.exerciseType)}
                            </Text>
                          </LinearGradient>
                          <View style={styles.recordBadge}>
                            <Text style={styles.recordBadgeText}>
                              #{history.length - index}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.recordDate}>
                          {formatDate(record.timestamp)}
                        </Text>
                      </View>

                      <LinearGradient
                        colors={
                          record.averageScore >= 80
                            ? ['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.2)']
                            : record.averageScore >= 60
                            ? ['rgba(234, 179, 8, 0.2)', 'rgba(249, 115, 22, 0.2)']
                            : ['rgba(239, 68, 68, 0.2)', 'rgba(236, 72, 153, 0.2)']
                        }
                        style={styles.scoreBadge}
                      >
                        <Text
                          style={[
                            styles.scoreValue,
                            { color: getScoreColor(record.averageScore) },
                          ]}
                        >
                          {record.averageScore}
                        </Text>
                        <Text style={styles.scoreLabel}>점수</Text>
                      </LinearGradient>
                    </View>

                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Text style={styles.statItemLabel}>반복</Text>
                        <Text style={styles.statItemValue}>{record.reps}회</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statItemLabel}>시간</Text>
                        <Text style={styles.statItemValue}>
                          {formatDuration(record.duration)}
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statItemLabel}>등급</Text>
                        <Text
                          style={[
                            styles.statItemValue,
                            { color: getScoreColor(record.averageScore) },
                          ]}
                        >
                          {getScoreGrade(record.averageScore)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Motivational card */}
        {history.length > 0 && (
          <LinearGradient
            colors={['rgba(6, 182, 212, 0.1)', 'rgba(59, 130, 246, 0.1)']}
            style={styles.motivationCard}
          >
            <View style={styles.motivationIcon}>
              <Trophy size={24} color="#22d3ee" />
            </View>
            <View style={styles.motivationText}>
              <Text style={styles.motivationTitle}>
                {totalWorkouts >= 20
                  ? '엄청난 성과입니다! 🔥'
                  : totalWorkouts >= 10
                  ? '훌륭한 진행입니다! 💪'
                  : totalWorkouts >= 5
                  ? '좋은 습관을 만들고 있어요! ⭐'
                  : '좋은 시작입니다! 🚀'}
              </Text>
              <Text style={styles.motivationSubtitle}>
                {totalWorkouts >= 20
                  ? '당신은 이미 피트니스 마스터입니다. 계속 도전하세요!'
                  : totalWorkouts >= 10
                  ? '일관성이 결과를 만듭니다. 멋진 여정이네요!'
                  : '매일 조금씩, 꾸준함이 승리의 열쇠입니다.'}
              </Text>
            </View>
          </LinearGradient>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
    marginTop: 16,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#18181b',
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22d3ee',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  historySection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#d1d5db',
  },
  recordCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordCountText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    paddingVertical: 96,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 24,
  },
  historyList: {
    gap: 12,
  },
  recordCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 24,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  exerciseNameGradient: {
    paddingHorizontal: 2,
    borderRadius: 4,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  recordBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#27272a',
    borderRadius: 12,
  },
  recordBadgeText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  recordDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  scoreBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    gap: 16,
  },
  statItem: {
    flex: 1,
  },
  statItemLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  statItemValue: {
    fontSize: 16,
    color: '#fff',
  },
  motivationCard: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.2)',
    gap: 16,
  },
  motivationIcon: {
    padding: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  motivationText: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  motivationSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 18,
  },
});