import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, StatusBar, FlatList
} from 'react-native';

const COLORS = {
  navy: '#0a1f5c', teal: '#00dfc4', white: '#ffffff',
  gray50: '#F9FAFB', gray100: '#F3F4F6', gray200: '#E5E7EB',
  gray400: '#9CA3AF', gray600: '#6B7280', gray900: '#111827',
  fb: '#1877F2', ig: '#E1306C', wa: '#25D366',
  pending: '#F59E0B', active: '#3B82F6', done: '#10B981',
};

const PLATFORMS = {
  facebook:  { label: 'Facebook',  color: COLORS.fb, icon: 'f', bg: '#E7F0FD' },
  instagram: { label: 'Instagram', color: COLORS.ig, icon: 'i', bg: '#FCE8F0' },
  whatsapp:  { label: 'WhatsApp',  color: COLORS.wa, icon: 'w', bg: '#E6FAF0' },
};

const STATUS_COLORS = { pendiente: COLORS.pending, 'en curso': COLORS.active, resuelto: COLORS.done };

const CONTACTS = [
  { id:'1', name:'María González',  platform:'whatsapp',  phone:'+52 442 123 4567', lastMsg:'¿Tienen disponibilidad para mañana?', time:'10:32', unread:2, status:'pendiente', tag:'cliente' },
  { id:'2', name:'Carlos Ramírez',  platform:'facebook',  phone:'+52 442 987 6543', lastMsg:'Quiero información sobre sus precios',  time:'09:15', unread:1, status:'pendiente', tag:'prospecto' },
  { id:'3', name:'Ana Herrera',     platform:'instagram', phone:'+52 442 555 1234', lastMsg:'Me encantó el producto 🔥',             time:'08:50', unread:0, status:'resuelto',  tag:'cliente' },
  { id:'4', name:'Luis Torres',     platform:'whatsapp',  phone:'+52 442 321 9876', lastMsg:'¿Hacen envíos a CDMX?',                time:'Ayer',  unread:3, status:'pendiente', tag:'prospecto' },
  { id:'5', name:'Sofía Mendoza',   platform:'facebook',  phone:'+52 442 654 3210', lastMsg:'Gracias por la atención!',             time:'Ayer',  unread:0, status:'resuelto',  tag:'cliente' },
];

const INIT_CHATS = {
  '1': [
    { from:'user', text:'Hola, buenas tardes!', time:'10:20' },
    { from:'agent', text:'¡Hola María! 👋 Bienvenida a Evitare. ¿En qué puedo ayudarte?', time:'10:20' },
    { from:'user', text:'¿Tienen disponibilidad para mañana?', time:'10:32' },
  ],
  '2': [{ from:'user', text:'Buenos días, quiero información sobre sus precios', time:'09:15' }],
  '3': [
    { from:'user', text:'Me encantó el producto 🔥', time:'08:50' },
    { from:'agent', text:'¡Muchas gracias Ana! Nos alegra mucho 😊', time:'08:51' },
  ],
  '4': [{ from:'user', text:'¿Hacen envíos a CDMX?', time:'Ayer' }],
  '5': [{ from:'user', text:'Gracias por la atención!', time:'Ayer' }],
};

const QUICK = [
  '¡Hola! Bienvenido a Evitare 👋',
  'Horario: Lun-Vie 8am-6pm',
  'Con gusto te atiendo.',
  'Te respondemos en breve ⏱️',
];

// ─── PANTALLA CONTACTOS ────────────────────────────────
function ContactsScreen({ onSelect }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = CONTACTS.filter(c => {
    const mp = filter === 'all' || c.platform === filter;
    const ms = c.name.toLowerCase().includes(search.toLowerCase());
    return mp && ms;
  });

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLogo}>
          <Text style={s.logoText}>E</Text>
        </View>
        <View>
          <Text style={s.headerTitle}>Evitare CRM</Text>
          <Text style={s.headerSub}>Panel de Mensajes</Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={s.filterRow}>
        {['all','facebook','instagram','whatsapp'].map(p => (
          <TouchableOpacity key={p} onPress={() => setFilter(p)}
            style={[s.filterBtn, filter===p && { backgroundColor: p==='all' ? COLORS.navy : PLATFORMS[p]?.color }]}>
            <Text style={[s.filterTxt, filter===p && { color:'#fff' }]}>
              {p==='all' ? 'Todos' : p.charAt(0).toUpperCase()+p.slice(1,3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Búsqueda */}
      <View style={s.searchWrap}>
        <Text style={{ color: COLORS.gray400 }}>🔍 </Text>
        <TextInput style={s.searchInput} placeholder="Buscar contacto..."
          value={search} onChangeText={setSearch} placeholderTextColor={COLORS.gray400} />
      </View>

      {/* Lista */}
      <FlatList data={filtered} keyExtractor={i => i.id} renderItem={({ item: c }) => {
        const p = PLATFORMS[c.platform];
        return (
          <TouchableOpacity style={s.contactRow} onPress={() => onSelect(c)}>
            <View style={[s.avatar, { backgroundColor: p.bg }]}>
              <Text style={[s.avatarTxt, { color: p.color }]}>{c.name[0]}</Text>
              <View style={[s.platformDot, { backgroundColor: p.color }]}>
                <Text style={s.platformDotTxt}>{p.icon}</Text>
              </View>
            </View>
            <View style={s.contactInfo}>
              <View style={s.row}>
                <Text style={s.contactName}>{c.name}</Text>
                <Text style={s.contactTime}>{c.time}</Text>
              </View>
              <Text style={s.contactMsg} numberOfLines={1}>{c.lastMsg}</Text>
              <View style={s.row}>
                <View style={[s.badge, { backgroundColor: STATUS_COLORS[c.status]+'20' }]}>
                  <Text style={[s.badgeTxt, { color: STATUS_COLORS[c.status] }]}>{c.status}</Text>
                </View>
                {c.unread > 0 && (
                  <View style={s.unread}><Text style={s.unreadTxt}>{c.unread}</Text></View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      }} />

      {/* Stats */}
      <View style={s.statsBar}>
        {[['Total', CONTACTS.length, COLORS.gray600],
          ['Pendientes', CONTACTS.filter(c=>c.status==='pendiente').length, COLORS.pending],
          ['Resueltos', CONTACTS.filter(c=>c.status==='resuelto').length, COLORS.done]
        ].map(([l,v,c]) => (
          <View key={l} style={s.stat}>
            <Text style={[s.statN, { color: c }]}>{v}</Text>
            <Text style={s.statL}>{l}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── PANTALLA CHAT ─────────────────────────────────────
function ChatScreen({ contact, onBack }) {
  const [msgs, setMsgs] = useState(INIT_CHATS[contact.id] || []);
  const [input, setInput] = useState('');
  const [tab, setTab] = useState('chat');
  const pl = PLATFORMS[contact.platform];

  function send() {
    if (!input.trim()) return;
    const msg = { from:'agent', text:input, time: new Date().toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'}) };
    setMsgs(prev => [...prev, msg]);
    setInput('');
  }

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      {/* Header */}
      <View style={s.chatHeader}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backTxt}>←</Text>
        </TouchableOpacity>
        <View style={[s.avatarSm, { backgroundColor: pl.bg }]}>
          <Text style={[s.avatarTxt, { color: pl.color }]}>{contact.name[0]}</Text>
        </View>
        <View style={{ flex:1 }}>
          <Text style={s.chatName}>{contact.name}</Text>
          <Text style={[s.chatPlatform, { color: pl.color }]}>{pl.label}</Text>
        </View>
        <View style={s.tabsRow}>
          {['chat','info'].map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)}
              style={[s.tabBtn, tab===t && s.tabBtnActive]}>
              <Text style={[s.tabTxt, tab===t && s.tabTxtActive]}>
                {t === 'chat' ? '💬' : '👤'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {tab === 'chat' ? (
        <>
          {/* Mensajes */}
          <ScrollView style={s.msgs} contentContainerStyle={{ padding:12, gap:8 }}>
            {msgs.map((m, i) => (
              <View key={i} style={[s.bubble, m.from==='agent' ? s.bubbleAgent : s.bubbleUser]}>
                <Text style={[s.bubbleTxt, m.from==='agent' && { color:'#fff' }]}>{m.text}</Text>
                <Text style={[s.bubbleTime, m.from==='agent' && { color:'rgba(255,255,255,0.6)' }]}>{m.time}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Rápidas */}
          <ScrollView horizontal style={s.quickRow} showsHorizontalScrollIndicator={false}>
            {QUICK.map((q, i) => (
              <TouchableOpacity key={i} onPress={() => setInput(q)} style={s.quickBtn}>
                <Text style={s.quickTxt}>{q.slice(0,20)}…</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={s.inputRow}>
            <TextInput style={s.input} placeholder="Escribe un mensaje..."
              value={input} onChangeText={setInput} placeholderTextColor={COLORS.gray400}
              multiline />
            <TouchableOpacity style={s.sendBtn} onPress={send}>
              <Text style={s.sendTxt}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView style={{ padding:16 }}>
          <View style={s.card}>
            <Text style={s.cardTitle}>Información del Contacto</Text>
            {[['Nombre', contact.name], ['Teléfono', contact.phone],
              ['Plataforma', pl.label], ['Etiqueta', contact.tag], ['Estado', contact.status]
            ].map(([l,v]) => (
              <View key={l} style={s.infoRow}>
                <Text style={s.infoLabel}>{l}</Text>
                <Text style={s.infoVal}>{v}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────
export default function App() {
  const [selected, setSelected] = useState(null);
  return selected
    ? <ChatScreen contact={selected} onBack={() => setSelected(null)} />
    : <ContactsScreen onSelect={setSelected} />;
}

// ─── ESTILOS ───────────────────────────────────────────
const s = StyleSheet.create({
  container:    { flex:1, backgroundColor: COLORS.gray100 },
  header:       { flexDirection:'row', alignItems:'center', gap:10, backgroundColor: COLORS.navy, padding:16 },
  headerLogo:   { width:38, height:38, borderRadius:10, backgroundColor: COLORS.teal, alignItems:'center', justifyContent:'center' },
  logoText:     { color:'#fff', fontWeight:'900', fontSize:20 },
  headerTitle:  { color:'#fff', fontWeight:'700', fontSize:16 },
  headerSub:    { color:'rgba(255,255,255,0.6)', fontSize:11 },
  filterRow:    { flexDirection:'row', gap:6, padding:10, backgroundColor:'#fff', borderBottomWidth:1, borderColor: COLORS.gray200 },
  filterBtn:    { flex:1, padding:6, borderRadius:8, alignItems:'center', backgroundColor: COLORS.gray100 },
  filterTxt:    { fontSize:11, fontWeight:'600', color: COLORS.gray600 },
  searchWrap:   { flexDirection:'row', alignItems:'center', margin:10, paddingHorizontal:12, backgroundColor:'#fff', borderRadius:10, borderWidth:1, borderColor: COLORS.gray200 },
  searchInput:  { flex:1, paddingVertical:8, fontSize:13, color: COLORS.gray900 },
  contactRow:   { flexDirection:'row', padding:14, backgroundColor:'#fff', borderBottomWidth:1, borderColor: COLORS.gray100, alignItems:'center', gap:12 },
  avatar:       { width:46, height:46, borderRadius:23, alignItems:'center', justifyContent:'center', position:'relative' },
  avatarTxt:    { fontWeight:'700', fontSize:18 },
  platformDot:  { position:'absolute', bottom:-2, right:-2, width:16, height:16, borderRadius:8, borderWidth:2, borderColor:'#fff', alignItems:'center', justifyContent:'center' },
  platformDotTxt: { color:'#fff', fontSize:7, fontWeight:'700' },
  contactInfo:  { flex:1, gap:3 },
  row:          { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  contactName:  { fontWeight:'600', fontSize:14, color: COLORS.gray900 },
  contactTime:  { fontSize:11, color: COLORS.gray400 },
  contactMsg:   { fontSize:12, color: COLORS.gray600 },
  badge:        { paddingHorizontal:8, paddingVertical:2, borderRadius:10 },
  badgeTxt:     { fontSize:10, fontWeight:'600' },
  unread:       { backgroundColor:'#EF4444', borderRadius:10, paddingHorizontal:6 },
  unreadTxt:    { color:'#fff', fontSize:10, fontWeight:'700' },
  statsBar:     { flexDirection:'row', justifyContent:'space-around', padding:12, backgroundColor:'#fff', borderTopWidth:1, borderColor: COLORS.gray200 },
  stat:         { alignItems:'center' },
  statN:        { fontSize:20, fontWeight:'700' },
  statL:        { fontSize:10, color: COLORS.gray400 },
  chatHeader:   { flexDirection:'row', alignItems:'center', gap:10, backgroundColor: COLORS.navy, padding:12 },
  backBtn:      { padding:6 },
  backTxt:      { color:'#fff', fontSize:22, fontWeight:'300' },
  avatarSm:     { width:36, height:36, borderRadius:18, alignItems:'center', justifyContent:'center' },
  chatName:     { color:'#fff', fontWeight:'700', fontSize:14 },
  chatPlatform: { fontSize:11 },
  tabsRow:      { flexDirection:'row', gap:4 },
  tabBtn:       { padding:6, borderRadius:8, backgroundColor:'rgba(255,255,255,0.1)' },
  tabBtnActive: { backgroundColor: COLORS.teal },
  tabTxt:       { fontSize:14 },
  tabTxtActive: { },
  msgs:         { flex:1, backgroundColor: COLORS.gray50 },
  bubble:       { maxWidth:'75%', padding:12, borderRadius:16, marginVertical:2 },
  bubbleUser:   { backgroundColor:'#fff', alignSelf:'flex-start', borderTopLeftRadius:4 },
  bubbleAgent:  { backgroundColor: COLORS.navy, alignSelf:'flex-end', borderTopRightRadius:4 },
  bubbleTxt:    { fontSize:13, color: COLORS.gray900 },
  bubbleTime:   { fontSize:10, color: COLORS.gray400, marginTop:4, textAlign:'right' },
  quickRow:     { backgroundColor:'#fff', borderTopWidth:1, borderColor: COLORS.gray100, paddingVertical:8, paddingHorizontal:10 },
  quickBtn:     { paddingHorizontal:12, paddingVertical:6, borderRadius:20, borderWidth:1, borderColor: COLORS.gray200, marginRight:8, backgroundColor: COLORS.gray50 },
  quickTxt:     { fontSize:11, color: COLORS.gray600 },
  inputRow:     { flexDirection:'row', gap:8, padding:10, backgroundColor:'#fff', borderTopWidth:1, borderColor: COLORS.gray200 },
  input:        { flex:1, padding:10, borderWidth:1, borderColor: COLORS.gray200, borderRadius:12, fontSize:13, maxHeight:80 },
  sendBtn:      { backgroundColor: COLORS.navy, paddingHorizontal:16, borderRadius:12, justifyContent:'center' },
  sendTxt:      { color:'#fff', fontWeight:'600', fontSize:13 },
  card:         { backgroundColor:'#fff', borderRadius:16, padding:16, marginBottom:12 },
  cardTitle:    { fontWeight:'700', fontSize:14, color: COLORS.gray900, marginBottom:12 },
  infoRow:      { flexDirection:'row', justifyContent:'space-between', paddingVertical:8, borderBottomWidth:1, borderColor: COLORS.gray100 },
  infoLabel:    { color: COLORS.gray600, fontSize:13 },
  infoVal:      { fontWeight:'600', color: COLORS.gray900, fontSize:13 },
});
