import React, { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from "react-native";
import NavBar from "../../components/NavBar/NavBar";
import TarjetaCalentamiento from "../../components/TarjetaCalentamiento/TarjetaCalentamiento";
import TarjetaNivel from "../../components/TarjetaNivel/TarjetaNivel.jsx";
import styles from '../Home/Home.js'; // Asegúrate de usar el archivo de estilos correcto
import TarjetaIngresoCodigo from './TarjetaIngesoCodigo/TarjetaingresoCodigo.jsx';
import TarjetaConsejos from '../../components/TarjetaConsejos/TarjetaConsejos.jsx';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig.js';
import { CartContext } from '../../Context/Context.jsx';
import { FontAwesome5 } from '@expo/vector-icons';
import { Swing } from 'react-native-animated-spinkit';

const Home = ({ navigation }) => {
  const [niveles, setNiveles] = useState([]);
  const { closed, setClosed, userRegistro,setUserOnline, userOnline } = useContext(CartContext);
  const [codigoCorrecto, setCodigoCorrecto] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga

  const CerrarModal = () => {
    setCodigoCorrecto(false);
    setModalVisible(false);
  };

  const obtenerNiveles = async () => {
    try {
      const nivelesCollection = collection(db, "niveles");
      const querySnapshot = await getDocs(nivelesCollection);
      let arreglo = [];
      querySnapshot.forEach((doc) => {
        arreglo = [...arreglo, { id: doc.id, data: doc.data() }];
      });
      setNiveles(arreglo);
    } catch (error) {
      console.error("Error obteniendo documentos: ", error);
    }
  };

  const verificarAccesoUsuario = async () => {
    try {
      // Buscar el documento del usuario en Firebase por email
      const userCollectionRef = collection(db, 'usuarios');
      const q = query(userCollectionRef, where('email', '==', userOnline.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Verificar si el usuario ya tiene acceso
        if (userData.access) {
          setClosed(true); // Desbloquear contenido
        } else {
          setClosed(false); // Mantener contenido bloqueado
        }
      } else {
        setClosed(false); // Mantener contenido bloqueado si no se encuentra el usuario
      }
    } catch (error) {
      console.error('Error al verificar el acceso del usuario: ', error);
      setClosed(false); // Mantener contenido bloqueado en caso de error
    } finally {
      setLoading(false); // Terminar el estado de carga
    }
  };

  useEffect(() => {
    obtenerNiveles();
    verificarAccesoUsuario()
  }, [userRegistro]);


  // Mientras loading sea true, mostrar un indicador de carga
  if (loading) {
    return (
      <View style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Swing size={48} color="hsl(199, 76%, 28%)" />
      </View>
    );
  }
  return (
    <View style={styles.home}>
      {!niveles.length > 0 ? (
        <View style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Swing size={48} color="hsl(199, 76%, 28%)" />
        </View>
      ) : (
        <>
          <NavBar />

          <ScrollView style={styles.home__main} contentContainerStyle={styles.home__contentContainer}>
            {!closed && (
              <>
                <TarjetaIngresoCodigo setModalVisible={setModalVisible} CerrarModal={CerrarModal} setCodigoCorrecto={setCodigoCorrecto} />
                {codigoCorrecto && <Text style={{ color: "red", paddingLeft: 20 }}>Codigo incorrecto</Text>}
                <Text style={styles.home__introText}>Encontraras el código único en el folleto que viene con el producto</Text>
              </>
            )}
            <Text style={styles.home__sectionTitle}><FontAwesome5 name="play" size={18} color="white" />  Imprescindibles</Text>
            {niveles.length > 0 &&
              niveles.filter((nivel) => nivel.data.nombre === "Primeros pasos")
                .map((nivel) => (
                  <TarjetaCalentamiento
                    key={nivel.id}
                    data={nivel}
                    navigation={navigation}
                    nivel={nivel.data.nombre}
                    tiempo={nivel.data.tiempoTotal}
                  />
                ))
            }
            <Text style={styles.home__sectionTitle}><FontAwesome5 name="play" size={18} color="white" />  Ejercicios</Text>
            {
  niveles.length > 0 &&
  niveles
    .filter((nivel) => nivel.data.nombre !== "Primeros pasos") // Filtra los niveles que no sean "Primeros pasos"
    .sort((a, b) => { // Ordena los niveles en el orden deseado
      const orden = ["Nivel 1", "Nivel 2", "Nivel 3"];
      return orden.indexOf(a.data.nombre) - orden.indexOf(b.data.nombre);
    })
    .map((nivel) => ( // Mapea los niveles para renderizarlos
      <TarjetaNivel
        key={nivel.id}
        data={nivel}
        navigation={navigation}
        nivel={nivel.data.nombre}
        tiempo={nivel.data.tiempoTotal}
      />
    ))
}

            <View style={styles.home__tipsContainer}>
              <TarjetaConsejos />
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

export default Home;
