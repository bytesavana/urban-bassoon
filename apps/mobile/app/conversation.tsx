import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CANVAS_KICKER, useSchool, type Approval, type Message } from '@school/core';
import { CanvasContent } from '../components/CanvasView';
import { Toast } from '../components/Toast';
import { colors, t } from '../components/theme';

function ApprovalCard({ msg, approval }: { msg: Message; approval: Approval }) {
  const resolve = useSchool((s) => s.resolveApproval);
  const secondary = useSchool((s) => s.approvalSecondary);
  return (
    <View style={[t.card, { gap: 8 }]}>
      <Text style={t.cardTitle}>{approval.title}</Text>
      {approval.lines.map((l) => <Text key={l} style={{ fontSize: 13, color: colors.text2 }}>{l}</Text>)}
      {approval.status === 'resolved' ? (
        <View style={[t.row, { gap: 6, marginTop: 4 }]}><Ionicons name="checkmark" size={14} color={colors.success} /><Text style={{ color: colors.success, fontWeight: '600', fontSize: 13 }}>{approval.resolutionText}</Text></View>
      ) : (
        <View style={[t.row, { gap: 8, marginTop: 6 }]}>
          <Pressable style={t.btnGhost} onPress={() => secondary(msg.id)}><Text style={t.btnGhostText}>{approval.secondaryLabel}</Text></Pressable>
          <Pressable style={[t.btn, { paddingVertical: 8 }]} onPress={() => resolve(msg.id)}><Text style={t.btnText}>{approval.primaryLabel}</Text></Pressable>
        </View>
      )}
    </View>
  );
}

function Bubble({ msg }: { msg: Message }) {
  if (msg.role === 'user') {
    return <Text style={{ alignSelf: 'flex-end', maxWidth: '80%', backgroundColor: colors.accent, color: '#fff', borderRadius: 14, borderBottomRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, overflow: 'hidden' }}>{msg.text}</Text>;
  }
  return (
    <View style={{ alignSelf: 'flex-start', maxWidth: '90%', gap: 8 }}>
      {msg.activity?.map((a) => (
        <View key={a} style={[t.row, { gap: 6 }]}><View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.subtle }} /><Text style={{ fontSize: 12.5, color: colors.subtle }}>{a}</Text></View>
      ))}
      {msg.text ? <Text style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, borderTopLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: colors.text, overflow: 'hidden' }}>{msg.text}</Text> : null}
      {msg.approval ? <ApprovalCard msg={msg} approval={msg.approval} /> : null}
    </View>
  );
}

export default function Conversation() {
  const conv = useSchool((s) => s.conversation);
  const thinking = useSchool((s) => s.thinking);
  const send = useSchool((s) => s.sendReply);
  const closeCanvas = useSchool((s) => s.closeCanvas);
  const [draft, setDraft] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const canvas = conv?.canvas ?? null;
  const canvasKey = canvas ? `${canvas.type}:${canvas.type === 'attendance' ? canvas.className : canvas.type === 'student' ? canvas.name : canvas.title}` : '';
  // Open the canvas sheet whenever the agent produces a new artifact.
  useEffect(() => { setSheetOpen(!!canvasKey); }, [canvasKey]);
  useEffect(() => { setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50); }, [conv?.messages.length, thinking]);

  if (!conv) return null;
  const submit = () => { const text = draft.trim(); if (text) { setDraft(''); void send(text); } };

  return (
    <KeyboardAvoidingView style={t.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <Stack.Screen options={{ title: conv.title, headerTitleStyle: { fontSize: 14, fontWeight: '500' } }} />
      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {conv.messages.map((m) => <Bubble key={m.id} msg={m} />)}
        {thinking && <Text style={{ color: colors.subtle, fontSize: 18, letterSpacing: 2 }}>•••</Text>}
      </ScrollView>

      {canvas && !sheetOpen && (
        <Pressable onPress={() => setSheetOpen(true)} style={[t.row, { gap: 8, marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 10, backgroundColor: colors.accentSoft }]}>
          <Ionicons name="albums-outline" size={16} color={colors.accent} />
          <Text style={{ flex: 1, color: colors.accent, fontWeight: '600', fontSize: 13 }}>View {CANVAS_KICKER[canvas.type].toLowerCase()}</Text>
          <Ionicons name="chevron-up" size={16} color={colors.accent} />
        </Pressable>
      )}

      <View style={[t.row, { gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={submit} returnKeyType="send" placeholder="Message…" placeholderTextColor="#A6A19A" style={[t.input, { flex: 1 }]} />
        <Pressable style={t.btn} onPress={submit}><Text style={t.btnText}>Send</Text></Pressable>
      </View>

      <Modal visible={sheetOpen && !!canvas} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSheetOpen(false)}>
        <View style={{ flex: 1, backgroundColor: colors.canvas }}>
          <View style={[t.row, { justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.4 }}>{canvas ? (canvas.type === 'results' ? canvas.kicker : CANVAS_KICKER[canvas.type]) : ''}</Text>
            <View style={[t.row, { gap: 18 }]}>
              <Pressable accessibilityLabel="Dismiss canvas" onPress={closeCanvas}><Ionicons name="trash-outline" size={18} color={colors.subtle} /></Pressable>
              <Pressable accessibilityLabel="Close" onPress={() => setSheetOpen(false)}><Ionicons name="close" size={22} color={colors.text} /></Pressable>
            </View>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
            {canvas && <CanvasContent canvas={canvas} />}
          </ScrollView>
          <Toast />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
