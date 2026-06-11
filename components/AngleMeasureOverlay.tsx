import { useTheme } from '@/hooks/useTheme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

interface Props {
  visible: boolean;
  onSave: (angle: number) => void;
  onCancel: () => void;
}

const MIN_ANGLE = 0;
const MAX_ANGLE = 180;
const STEP = 1;

export default function AngleMeasureOverlay({ visible, onSave, onCancel }: Props) {
  const { theme, isDark } = useTheme();
  const [angle, setAngle] = useState(45);
  const [permission] = useCameraPermissions();
  const [layout, setLayout] = useState({ w: 400, h: 500 });
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(String(angle));

  const handleSave = useCallback(() => {
    onSave(angle);
  }, [angle, onSave]);

  const adjust = useCallback((delta: number) => {
    setAngle(prev => {
      const next = prev + delta;
      if (next < MIN_ANGLE) return MIN_ANGLE;
      if (next > MAX_ANGLE) return MAX_ANGLE;
      return next;
    });
  }, []);

  const commitEdit = useCallback(() => {
    const val = parseInt(editText, 10);
    if (!isNaN(val) && val >= MIN_ANGLE && val <= MAX_ANGLE) {
      setAngle(val);
    }
    setEditMode(false);
  }, [editText]);

  const { w, h } = layout;
  const cx = w / 2;
  const cy = h * 0.82;
  const armLen = Math.min(w, h) * 0.38;
  const arcR = Math.min(w, h) * 0.14;
  const angleRad = (angle * Math.PI) / 180;
  const endX = cx + armLen * Math.cos(angleRad);
  const endY = cy - armLen * Math.sin(angleRad);

  const arcPath = angle > 1
    ? `M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 1 ${cx + arcR * Math.cos(angleRad)} ${cy - arcR * Math.sin(angleRad)}`
    : '';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onCancel}>
      <View style={styles.root}>
        <View
          style={styles.cameraArea}
          onLayout={e => {
            const { width, height } = e.nativeEvent.layout;
            if (width > 0 && height > 0) setLayout({ w: width, h: height });
          }}
        >
          {permission?.granted ? (
            <CameraView style={StyleSheet.absoluteFill} facing="back" />
          ) : (
            <View style={[styles.cameraFallback, { backgroundColor: isDark ? '#1a1a2e' : '#e8e8e8' }]}>
              <MaterialCommunityIcons name="camera-off" size={48} color="#666" />
              <Text style={[styles.fallbackText, { color: isDark ? '#999' : '#666' }]}>
                {permission == null ? 'Loading camera...' : 'Camera permission required'}
              </Text>
              <Text style={[styles.fallbackSubtext, { color: isDark ? '#666' : '#999' }]}>
                You can still adjust the protractor manually
              </Text>
            </View>
          )}

          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
              {Array.from({ length: 19 }, (_, i) => i * 10).map(deg => {
                const rad = (deg * Math.PI) / 180;
                const major = deg % 30 === 0;
                const tickLen = major ? 22 : 10;
                const innerR = armLen - tickLen;
                return (
                  <Line
                    key={deg}
                    x1={cx + innerR * Math.cos(rad)}
                    y1={cy - innerR * Math.sin(rad)}
                    x2={cx + armLen * Math.cos(rad)}
                    y2={cy - armLen * Math.sin(rad)}
                    stroke={deg <= angle ? theme.secondary : '#555'}
                    strokeWidth={major ? 2.5 : 1}
                    opacity={deg <= angle ? 0.8 : 0.35}
                  />
                );
              })}

              {angle > 1 && (
                <Path d={arcPath} stroke={theme.primary} strokeWidth={3} fill="none" />
              )}

              <Line
                x1={cx} y1={cy}
                x2={cx + armLen} y2={cy}
                stroke="#777" strokeWidth={2.5}
              />

              <Line
                x1={cx} y1={cy}
                x2={endX} y2={endY}
                stroke={theme.primary} strokeWidth={4} strokeLinecap="round"
              />
              <Circle cx={cx} cy={cy} r={5} fill={theme.primary} />

              <SvgText
                x={cx + arcR + 16} y={cy - arcR - 16}
                fill={theme.primary} fontSize="30" fontWeight="bold"
              >
                {angle}°
              </SvgText>
            </Svg>
          </View>
        </View>

        <View style={[styles.controls, { backgroundColor: isDark ? '#111' : '#f0f0f0' }]}>
          <View style={styles.angleDisplay}>
            <Text style={[styles.angleLabel, { color: isDark ? '#888' : '#666' }]}>Current Angle</Text>
            {editMode ? (
              <TextInput
                style={[styles.angleInput, { color: theme.secondary, borderBottomColor: theme.secondary }]}
                value={editText}
                onChangeText={setEditText}
                onSubmitEditing={commitEdit}
                onBlur={commitEdit}
                keyboardType="number-pad"
                autoFocus
                returnKeyType="done"
              />
            ) : (
              <Pressable onPress={() => { setEditText(String(angle)); setEditMode(true); }}>
                <Text style={[styles.angleValue, { color: theme.secondary }]}>{angle}°</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.sliderRow}>
            <Pressable onPress={() => adjust(-STEP)} style={[styles.adjBtn, { backgroundColor: isDark ? '#333' : '#ddd' }]}>
              <MaterialCommunityIcons name="minus" size={24} color={theme.secondary} />
            </Pressable>
            <Text style={[styles.rangeLabel, { color: isDark ? '#888' : '#666' }]}>{MIN_ANGLE}°</Text>
            <View style={styles.rangeTrack}>
              <View style={[styles.rangeFill, { backgroundColor: theme.secondary, width: `${(angle / MAX_ANGLE) * 100}%` }]} />
              <Pressable
                style={[styles.rangeThumb, { backgroundColor: theme.secondary, left: `${(angle / MAX_ANGLE) * 100}%` }]}
                onPress={() => {}}
              />
            </View>
            <Text style={[styles.rangeLabel, { color: isDark ? '#888' : '#666' }]}>{MAX_ANGLE}°</Text>
            <Pressable onPress={() => adjust(STEP)} style={[styles.adjBtn, { backgroundColor: isDark ? '#333' : '#ddd' }]}>
              <MaterialCommunityIcons name="plus" size={24} color={theme.secondary} />
            </Pressable>
          </View>

          <View style={styles.presetRow}>
            {[0, 15, 30, 45, 60, 90].map(v => (
              <Pressable
                key={v}
                onPress={() => setAngle(v)}
                style={[styles.presetChip, { backgroundColor: isDark ? '#222' : '#e0e0e0' }, angle === v && { backgroundColor: theme.secondary + '30', borderColor: theme.secondary }]}
              >
                <Text style={[styles.presetText, { color: isDark ? '#aaa' : '#666' }, angle === v && { color: theme.secondary }]}>{v}°</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.actionRow}>
            <Pressable onPress={onCancel} style={[styles.actionBtn, { backgroundColor: isDark ? '#333' : '#ccc' }]}>
              <Text style={[styles.actionBtnText, { color: isDark ? '#fff' : '#333' }]}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={[styles.actionBtn, styles.saveBtn, { backgroundColor: theme.secondary }]}>
              <MaterialCommunityIcons name="content-save" size={20} color={isDark ? '#fff' : '#fff'} />
              <Text style={[styles.actionBtnText, { color: '#fff' }]}>Save Angle</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  cameraArea: { flex: 1, overflow: 'hidden' },
  cameraFallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fallbackText: { fontFamily: 'InterRegular', fontSize: 14, marginTop: 12 },
  fallbackSubtext: { fontFamily: 'InterRegular', fontSize: 12, marginTop: 4 },
  controls: { padding: 16, paddingBottom: 32, gap: 12 },
  angleDisplay: { alignItems: 'center' },
  angleLabel: { fontFamily: 'InterRegular', fontSize: 12 },
  angleInput: { fontFamily: 'PoppinsBold', fontSize: 56, borderBottomWidth: 2, minWidth: 120, textAlign: 'center' },
  angleValue: { fontFamily: 'PoppinsBold', fontSize: 56 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  adjBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  rangeLabel: { fontFamily: 'InterRegular', fontSize: 11, minWidth: 28, textAlign: 'center' },
  rangeTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#444', position: 'relative', justifyContent: 'center' },
  rangeFill: { height: 6, borderRadius: 3, position: 'absolute', left: 0, top: 0 },
  rangeThumb: { width: 20, height: 20, borderRadius: 10, position: 'absolute', marginLeft: -10 },
  presetRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  presetChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: 'transparent' },
  presetText: { fontFamily: 'InterSemiBold', fontSize: 13 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
  saveBtn: { flex: 2 },
  actionBtnText: { fontFamily: 'InterBold', fontSize: 16 },
});
