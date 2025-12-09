import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

declare module '@shopify/react-native-skia';

interface AnalysisResult {
  score: number;
  feedback: string[];
  repCount: number;
  isCorrectPosition: boolean;
}

export default function PoseDetectorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const exercise = (params.exercise as string) || "squat";

  const [permission, requestPermission] = useCameraPermissions();
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult>({
    score: 0,
    feedback: [],
    repCount: 0,
    isCorrectPosition: false,
  });
  const [elapsedTime, setElapsedTime] = useState(0);

  const repCountRef = useRef(0);
  const isDownRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 모킹용 AI 모델 로딩
  useEffect(() => {
    const loadModel = async () => {
      setIsModelLoading(true);
      await new Promise<void>(res => setTimeout(res, 1500));
      setIsModelLoading(false);
    };
    loadModel();
  }, []);

  // 타이머
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // 테스트용 키포인트
  const generateMockKeypoints = () => {
    const time = Date.now() / 1000;
    const wave = Math.sin(time * 2);
    return [
      { name: "nose", x: 180, y: 100 + wave * 10, score: 0.9 },
      { name: "left_shoulder", x: 150, y: 160, score: 0.95 },
      { name: "right_shoulder", x: 230, y: 160, score: 0.95 },
      { name: "left_elbow", x: 130, y: 220 + wave * 15, score: 0.9 },
      { name: "right_elbow", x: 250, y: 220 + wave * 15, score: 0.9 },
      { name: "left_wrist", x: 120, y: 280 + wave * 20, score: 0.85 },
      { name: "right_wrist", x: 260, y: 280 + wave * 20, score: 0.85 },
      { name: "left_hip", x: 160, y: 320, score: 0.95 },
      { name: "right_hip", x: 220, y: 320, score: 0.95 },
      { name: "left_knee", x: 160, y: 400 + wave * 15, score: 0.9 },
      { name: "right_knee", x: 220, y: 400 + wave * 15, score: 0.9 },
      { name: "left_ankle", x: 160, y: 480, score: 0.85 },
      { name: "right_ankle", x: 220, y: 480, score: 0.85 },
    ];
  };

  const connections = [
    ["left_shoulder", "right_shoulder"],
    ["left_shoulder", "left_elbow"],
    ["left_elbow", "left_wrist"],
    ["right_shoulder", "right_elbow"],
    ["right_elbow", "right_wrist"],
    ["left_shoulder", "left_hip"],
    ["right_shoulder", "right_hip"],
    ["left_hip", "right_hip"],
    ["left_hip", "left_knee"],
    ["left_knee", "left_ankle"],
    ["right_hip", "right_knee"],
    ["right_knee", "right_ankle"],
  ];

  // 자세 분석 로직
  const analyzePose = (keypoints: any[]) => {
    const getKeypoint = (name: string) => keypoints.find(kp => kp.name === name);

    let score = 0;
    let feedback: string[] = [];

    if (exercise === 'squat') {
      const leftHip = getKeypoint('left_hip');
      const leftKnee = getKeypoint('left_knee');
      const leftAnkle = getKeypoint('left_ankle');

      if (leftHip && leftKnee && leftAnkle) {
        const hipKneeDistance = Math.abs(leftHip.y - leftKnee.y);
        const isDown = hipKneeDistance < 80;

        if (isDown && !isDownRef.current) {
          repCountRef.current += 1;
          isDownRef.current = true;
        } else if (!isDown && isDownRef.current) {
          isDownRef.current = false;
        }

        score = isDown ? 85 : 75;

        if (leftKnee.x > leftAnkle.x + 30) {
          feedback.push('무릎이 발끝을 넘어갔습니다');
          score -= 10;
        }
        if (!isDown) {
          feedback.push('더 깊이 앉으세요');
        }
      }
    } else if (exercise === 'pushup') {
      const leftShoulder = getKeypoint('left_shoulder');
      const leftElbow = getKeypoint('left_elbow');
      const leftHip = getKeypoint('left_hip');

      if (leftShoulder && leftElbow && leftHip) {
        const shoulderElbowDistance = Math.abs(leftShoulder.y - leftElbow.y);
        const isDown = shoulderElbowDistance > 40;

        if (isDown && !isDownRef.current) {
          repCountRef.current += 1;
          isDownRef.current = true;
        } else if (!isDown && isDownRef.current) {
          isDownRef.current = false;
        }

        score = isDown ? 80 : 70;

        const hipShoulderDiff = Math.abs(leftHip.y - leftShoulder.y);
        if (hipShoulderDiff > 100) {
          feedback.push('엉덩이를 낮추세요');
          score -= 15;
        }
        if (!isDown) {
          feedback.push('팔꿈치를 더 구부리세요');
        }
      }
    } else if (exercise === 'plank') {
      const leftShoulder = getKeypoint('left_shoulder');
      const leftHip = getKeypoint('left_hip');

      if (leftShoulder && leftHip) {
        const shoulderHipDiff = Math.abs(leftShoulder.y - leftHip.y);

        score = 90;

        if (shoulderHipDiff > 50) {
          feedback.push('엉덩이가 너무 높습니다');
          score -= 20;
        } else if (shoulderHipDiff < 20) {
          feedback.push('엉덩이가 처졌습니다');
          score -= 20;
        }

        repCountRef.current = 0;
      }
    }

    setAnalysis({
      score: Math.max(0, Math.min(100, score)),
      feedback,
      repCount: repCountRef.current,
      isCorrectPosition: score >= 70,
    });
  };

  // 주기적으로 자세 분석
  useEffect(() => {
    if (!isActive || isModelLoading) return;

    const interval = setInterval(() => {
      const keypoints = generateMockKeypoints();
      analyzePose(keypoints);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isModelLoading, exercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getExerciseName = () => {
    if (exercise === 'squat') return '🏋️ 스쿼트';
    if (exercise === 'pushup') return '💪 푸시업';
    return '🧘 플랭크';
  };

  // 권한 체크
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#00e5ff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>카메라 권한 필요</Text>
        <Text style={styles.errorMessage}>AI 자세 분석을 위해{'\n'}카메라 접근이 필요합니다</Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>권한 허용</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 카메라 뷰 */}
      <CameraView style={StyleSheet.absoluteFill} facing="front" />

      {/* AI 로딩 오버레이 */}
      {isModelLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingSpinner}>
            <View style={styles.spinnerOuter} />
            <ActivityIndicator size="large" color="#00e5ff" style={styles.spinnerInner} />
          </View>
          <Text style={styles.loadingTitle}>AI 로딩 중...</Text>
          <Text style={styles.loadingSubtitle}>잠시만 기다려주세요</Text>
        </View>
      )}

      {/* 카메라 준비 완료 배지 */}
      {!isActive && !isModelLoading && (
        <View style={styles.readyBadge}>
          <Text style={styles.readyIcon}>📷</Text>
          <Text style={styles.readyText}>카메라 준비 완료</Text>
        </View>
      )}

      {/* Skia Canvas - 스켈레톤 */}
      {isActive && !isModelLoading && (
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          {generateMockKeypoints().map((kp, idx) => (
            <Circle key={idx} cx={kp.x} cy={kp.y} r={6} color="#3b82f6" />
          ))}

          {connections.map(([a, b], idx) => {
            const k1 = generateMockKeypoints().find(k => k.name === a);
            const k2 = generateMockKeypoints().find(k => k.name === b);
            if (!k1 || !k2) return null;
            const path = Skia.Path.Make();
            path.moveTo(k1.x, k1.y);
            path.lineTo(k2.x, k2.y);
            return <Path key={idx} path={path} color="#06b6d4" style="stroke" strokeWidth={4} />;
          })}
        </Canvas>
      )}

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
        <Text style={styles.exerciseTitle}>{getExerciseName()}</Text>
      </View>

      {/* 통계 패널 */}
      {isActive && !isModelLoading && (
        <View style={styles.statsPanel}>
          {/* 시간 */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>시간</Text>
            <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
          </View>

          {/* 횟수 */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>횟수</Text>
            <Text style={styles.statValue}>{analysis.repCount}</Text>
          </View>

          {/* 점수 */}
          <View style={[styles.statCard, analysis.isCorrectPosition ? styles.statCardGood : styles.statCardBad]}>
            <Text style={styles.statLabel}>점수</Text>
            <Text style={styles.statValue}>{analysis.score}</Text>
          </View>
        </View>
      )}

      {/* 피드백 */}
      {isActive && !isModelLoading && analysis.feedback.length > 0 && (
        <View style={styles.feedbackContainer}>
          {analysis.feedback.map((fb, idx) => (
            <View key={idx} style={styles.feedbackItem}>
              <Text style={styles.feedbackIcon}>💡</Text>
              <Text style={styles.feedbackText}>{fb}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 하단 컨트롤 */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.controlButton, isActive ? styles.stopButton : styles.startButton]}
          onPress={() => setIsActive(!isActive)}
          disabled={isModelLoading}
        >
          <Text style={styles.controlButtonText}>
            {isActive ? '⏸ 일시정지' : '▶ 시작하기'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "black",
    padding: 20,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 10,
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  spinnerOuter: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  spinnerInner: {
    position: 'absolute',
  },
  loadingTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  readyBadge: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#3f3f46',
    zIndex: 10,
  },
  readyIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  readyText: {
    color: '#d1d5db',
    fontSize: 16,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  statsPanel: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#3f3f46',
    alignItems: 'center',
  },
  statCardGood: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statCardBad: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  feedbackIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  controlButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#10b981',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errorMessage: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});