import { View, Text, TextInput, Button, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'

// URL base del backend: usa localhost en web y la IP local en dispositivos móviles
const BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : 'http://192.168.1.95:3000';

// Muestra una alerta compatible con web y móvil
function mostrarAlerta(titulo: string, mensaje: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}: ${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
}

// Botón reutilizable con colores de fondo, texto y borde personalizables
function Botonpersonalizado({ titulo, onPress, colorFondo, colorTexto, colorBorde, grosorBorde = 1 }: { titulo: string; onPress: () => void; colorFondo: string; colorTexto: string; colorBorde: string; grosorBorde?: number }) {
  return (
    <Pressable
      style={[styles.boton, { backgroundColor: colorFondo, borderColor: colorBorde, borderWidth: grosorBorde }]}
      onPress={onPress}>
      <Text style={[styles.textoBoton, {color: colorTexto}]}>{titulo}</Text>
    </Pressable>
  );
}

export default function Index() {
  // Lista de citas y datos del formulario
  const [citas, setCitas] = useState<any[]>([]);
  const [especialista, setEspecialista] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [citaEditando, setCitaEditando] = useState<number | null>(null);

  // Selección de los dropdowns y sus listas de opciones
  const [idUsuario, setIdUsuario] = useState<number>(0);
  const [idServicio, setIdServicio] = useState<number>(0);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);

  // Carga inicial de citas, usuarios y servicios desde el backend
  useEffect(() => {
    async function cargarCitas() {
      const response = await fetch(`${BASE_URL}/citas`);
      const data = await response.json();
      setCitas(data);
    }

    async function cargarUsuarios() {
      const response = await fetch(`${BASE_URL}/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    }

    async function caragarServicios() {
      const response = await fetch(`${BASE_URL}/servicios`);
      const data = await response.json();
      setServicios(data);
    }

    cargarCitas();
    cargarUsuarios();
    caragarServicios();
  }, []);

  // Crea una nueva cita enviando los datos del formulario al backend
  async function crearCita() {
    const response = await fetch(`${BASE_URL}/citas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: idUsuario,
        id_servicio: idServicio,
        fecha,
        hora,
        especialista
      }),
    });

    const cita = await response.json();

    if (!response.ok) {
      mostrarAlerta("Error", cita.error || "No se pudo agendar la cita");
    return;
  }
    setCitas([...citas, cita]);
    limpiarFormulario();
    mostrarAlerta("Exito", "Cita agendada correctamente");
  }

  // Actualiza la cita seleccionada con los nuevos datos del formulario
  async function actualizarCita() {
    const response = await fetch(`${BASE_URL}/citas/${citaEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha, hora, especialista, id_usuario: idUsuario, id_servicio: idServicio }),
    });

    const citaActualizada = await response.json();

    if (!response.ok) {
      mostrarAlerta("Error", citaActualizada.error || "No se pudo actualizar la cita");
      return;
    }

    setCitas(citas.map((c: any) => c.id_cita === citaEditando ? citaActualizada : c));
    setCitaEditando(null);
    limpiarFormulario();
    mostrarAlerta("Exito", "Cita actualizada correctamente");
  }

  // Restablece todos los campos del formulario a su valor inicial
  function limpiarFormulario() {
    setEspecialista('');
    setFecha('');
    setHora('');
    setIdUsuario(0);
    setIdServicio(0);
  }

  // Carga los datos de una cita en el formulario para ser editados
  function cargarParaEditar(cita: any) {
    setEspecialista(cita.especialista);
    setFecha(cita.fecha.split('T')[0]);
    setHora(cita.hora);
    setCitaEditando(cita.id_cita);
    setIdUsuario(cita.id_usuario);
    setIdServicio(cita.id_servicio);
  }

  // Elimina una cita del backend y de la lista en pantalla
  async function cancelarCita(id: number) {
    const response = await fetch(`${BASE_URL}/citas/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarAlerta("Error", data.error || "No se pudo cancelar la cita");
      return;
    }
    setCitas(citas.filter((c: any) => c.id_cita !== id));
    mostrarAlerta("Exito", "Cita cancelada correctamente");
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fce3ee' }}>
      <ScrollView style={styles.contenedor}>
        {/* Encabezado con el nombre de la app */}
        <View style={styles.header}>
          <Text style={styles.tituloApp}>Cejas y uñas</Text>
        </View>
        
        <Text style={styles.titulo}>Gestión de citas</Text>

        {/* Dropdown de selección de usuario */}
        <View style={Platform.OS === 'web' ? {} : styles.pickerContenedor}>
          <Picker
            selectedValue={idUsuario}
            onValueChange={(value) => setIdUsuario(value)}
            style={Platform.OS === 'web' ? styles.picker : { height: 50 }}
          >
            <Picker.Item label='Selecciona un usario' value={0} />
            {usuarios.map((u: any) => (
              <Picker.Item key={u.id_usuario} label={ `${u.nombres} ${u.apellidos}` } value={u.id_usuario} />
            ))}
          </Picker>
        </View>
        
        {/* Dropdown de selección de servicio */}
        <View style={Platform.OS === 'web' ? {} : styles.pickerContenedor}>
          <Picker
            selectedValue={idServicio}
            onValueChange={(value) => setIdServicio(value)}
            style={Platform.OS === 'web' ? styles.picker : { height: 50 }}
          >
            <Picker.Item label='Selecciona un servicio' value={0} />
            {servicios.map((s: any) => (
              <Picker.Item key={s.id_servicio} label={s.nombre} value={s.id_servicio} />
            ))}
          </Picker>
        </View>
        
        {/* Campos de texto del formulario */}
        <TextInput
          style={styles.input}
          placeholder='Especialista'
          value={especialista}
          onChangeText={setEspecialista}
        />
        <TextInput
          style={styles.input}
          placeholder='Fecha (YYYY-MM-DD)'
          value={fecha}
          onChangeText={setFecha}
        />
        <TextInput
          style={styles.input}
          placeholder='Hora (HH:MM)'
          value={hora}
          onChangeText={setHora}
        />

        {/* Botón para crear una nueva cita */}
        <View style={{ marginTop: 10 }}>
          <Botonpersonalizado titulo='Agendar cita' onPress={crearCita} colorFondo='#d4f5e2' colorTexto='#1a7a42' colorBorde='#1a7a42' />
        </View>
        
        {/* Botón para guardar cambios, solo visible si hay una cita en edición */}
        <View style={{ marginTop: 10 }}>
          {citaEditando && (
            <Botonpersonalizado titulo='Guardar cambios' onPress={actualizarCita} colorFondo='#fce3ee' colorTexto='#e42bb8' colorBorde='#e42bb8' />
            )}
        </View>

        <Text style={styles.subtitulo}>Citas agendadas</Text>
        
        {/* Lista de citas agendadas, mostrando cliente y servicio asociados */}
        {citas.map((cita: any) => {
          const usuario = usuarios.find((u: any) => u.id_usuario === cita.id_usuario);
          const servicio = servicios.find((s: any) => s.id_servicio === cita.id_servicio);

          return (
            <View key={cita.id_cita} style={styles.tarjeta}>
              <Text>Cliente: { usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Desconocido'}</Text>
              <Text>Servicio: { servicio ? servicio.nombre : 'Desconocido'}</Text>
              <Text>Especialista: { cita.especialista }</Text>
              <Text>Fecha: { cita.fecha }</Text>
              <Text>Hora: { cita.hora }</Text>
              <Text>Estado: {cita.estado}</Text>
              <Botonpersonalizado titulo='Cancelar' onPress={() => cancelarCita(cita.id_cita)} colorFondo='#ffcccc' colorTexto='#c0392b' colorBorde='#c0392b' grosorBorde={0.3} />
              <Botonpersonalizado titulo='Editar' onPress={() => cargarParaEditar(cita)} colorFondo='#fce3ee' colorTexto='#e42bb8' colorBorde='#e42bb8' grosorBorde={0.3} />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos de la aplicación
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e42bb8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  tituloApp: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fce3ee'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#e42bb8',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d922ac',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    outlineColor: '#d922ac',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#e42bb8',
  },
  tarjeta: {
    borderWidth: 1,
    borderColor: 'rgba(203, 46, 217, 0.2)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    gap: 12,
  },
  boton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  textoBoton: {
    fontWeight: 'bold',
  },
  picker: {
  borderWidth: 1,
  borderColor: '#d922ac',
  borderRadius: 8,
  marginBottom: 10,
  backgroundColor: '#fff',
  height: 50,
  },
  pickerContenedor: {
  borderWidth: 1,
  borderColor: '#d922ac',
  borderRadius: 8,
  marginBottom: 10,
  backgroundColor: '#fff',
  overflow: 'hidden',
},
});