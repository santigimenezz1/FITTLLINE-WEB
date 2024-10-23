import { Pressable, Text, View, Image } from "react-native";
import TarjetaPerfil from "../../components/TarjetaPerfil/TarjetaPerfil.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../Context/Context.jsx";
import { Query, addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../firebaseConfig.js";
import { showMessage } from "react-native-flash-message";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Perfil = () => {
  const { setUsuarioOn, userRegistro, eliminarUsuario } = useContext(CartContext);
  const [userPerfil, setUserPerfil] = useState();
  const [idioma, setIdioma] = useState("https://res.cloudinary.com/dcf9eqqgt/image/upload/v1725984645/APP%20ALFOMBRA%20DE%20FUTBOL%20AMAZON/espana_wyfm4p.png");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const cambiarIdioma = (idioma) => {
    setIdioma(idioma);
    showMessage({
      message: 'Idioma cambiado con éxito',
      type: 'success',
    });
  };

  const urlIdiomas = {
    españa: "https://res.cloudinary.com/dcf9eqqgt/image/upload/v1725984645/APP%20ALFOMBRA%20DE%20FUTBOL%20AMAZON/espana_wyfm4p.png",
    italia: "https://res.cloudinary.com/dcf9eqqgt/image/upload/v1725984646/APP%20ALFOMBRA%20DE%20FUTBOL%20AMAZON/italia_r7gxfl.png",
    francia: "https://res.cloudinary.com/dcf9eqqgt/image/upload/v1725984645/APP%20ALFOMBRA%20DE%20FUTBOL%20AMAZON/francia_bluayx.png",
    inglaterra: "https://res.cloudinary.com/dcf9eqqgt/image/upload/v1725984645/APP%20ALFOMBRA%20DE%20FUTBOL%20AMAZON/inglaterra_vgobrt.png",
    paisesBajos: "https://res.cloudinary.com/dcf9eqqgt/image/upload/v1725985145/APP%20ALFOMBRA%20DE%20FUTBOL%20AMAZON/paises-bajos_hhqaua.png",
    alemania: "https://res.cloudinary.com/dcf9eqqgt/image/upload/v1725984645/APP%20ALFOMBRA%20DE%20FUTBOL%20AMAZON/bandera_ykvinl.png"
  };

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const userCollectionRef = collection(db, "usuarios");
      const q = query(userCollectionRef, where("email", "==", userRegistro.email));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserPerfil(userDoc.data());
        } else {
          // Manejo si no se encuentra el usuario
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    fetchUserByEmail(userRegistro.email); // Usar email del registro
  }, [userRegistro.email]);

  const handleEliminarCuenta = () => {
    setModalIsOpen(true);
  };

  const confirmarEliminacion = () => {
    eliminarUsuario(); // Lógica para eliminar el usuario
    toast.success('Cuenta eliminada con éxito');
    setModalIsOpen(false);
  };

  const cancelarEliminacion = () => {
    setModalIsOpen(false);
  };

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "black", position: "relative", padding: 20 }}>
      <NavBar />
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: "white", fontSize: 20, textAlign: "center", letterSpacing: 2, fontFamily: 'NunitoSans_400Regular' }}>Cambiar idioma</Text>
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 15 }}>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 15 }}>
            {Object.keys(urlIdiomas).slice(0, 3).map((key) => (
              <Pressable key={key} onPress={() => cambiarIdioma(urlIdiomas[key])}>
                <Image style={{ width: 70, height: 60 }} source={{ uri: urlIdiomas[key] }} resizeMode="contain" />
              </Pressable>
            ))}
          </View>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 15 }}>
            {Object.keys(urlIdiomas).slice(3).map((key) => (
              <Pressable key={key} onPress={() => cambiarIdioma(urlIdiomas[key])}>
                <Image style={{ width: 70, height: 60 }} source={{ uri: urlIdiomas[key] }} resizeMode="contain" />
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: "white", fontSize: 20, textAlign: "center", letterSpacing: 2, fontFamily: 'NunitoSans_400Regular' }}>Idioma actual</Text>
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 15 }}>
          <Pressable>
            <Image style={{ width: 70, height: 60 }} source={{ uri: idioma }} resizeMode="contain" />
          </Pressable>
        </View>
      </View>

      <View style={{ width: "95vw", marginTop: 10, display: "flex", position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", gap: 10 }}>
        <Pressable onPress={() => setUsuarioOn(false)} style={{ borderWidth: 1, backgroundColor: "red", borderColor: "red", width: 150, borderRadius: 4, height: 35, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white", fontFamily: "NunitoSans_700Bold", letterSpacing: 1 }}>Cerrar sesión</Text>
        </Pressable>

        <Pressable onPress={handleEliminarCuenta} style={{ borderWidth: 1, backgroundColor: "red", borderColor: "red", width: 150, borderRadius: 4, height: 35, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white", fontFamily: "NunitoSans_700Bold", letterSpacing: 1 }}>Eliminar cuenta</Text>
        </Pressable>
      </View>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={cancelarEliminacion}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '80%',  
            maxWidth: '300px',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: "hsl(199, 76%, 28%)",
            color: 'white',
          }
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 10, color:"white" }}>Eliminar cuenta</Text>
        <Text style={{color:"white"}}>¿Estás seguro de que deseas eliminar tu cuenta?</Text>
        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable onPress={cancelarEliminacion} style={{ marginRight: 10 }}>
            <Text style={{ color: 'white' }}>Cancelar</Text>
          </Pressable>
          <Pressable onPress={confirmarEliminacion}>
            <Text style={{ color: 'red' }}>Aceptar</Text>
          </Pressable>
        </View>
      </Modal>

      <ToastContainer />
    </View>
  );
};

export default Perfil;
