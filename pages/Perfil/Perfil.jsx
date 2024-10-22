import { Pressable, Text, View, Alert, Image } from "react-native";
import TarjetaPerfil from "../../components/TarjetaPerfil/TarjetaPerfil.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../Context/Context.jsx";
import { Query, addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../firebaseConfig.js";
import BotonVentana from "../../components/BotonVentana/BotonVentana.jsx";
import { showMessage } from "react-native-flash-message";

const Perfil = () => {
  const { setUsuarioOn, userRegistro, eliminarUsuario } = useContext(CartContext);
  const [userPerfil, setUserPerfil] = useState();
  const [idioma, setIdioma] = useState("https://res.cloudinary.com/dcf9eqqgt/image/upload/v1725984645/APP%20ALFOMBRA%20DE%20FUTBOL%20AMAZON/espana_wyfm4p.png");

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
    fetchUserByEmail("test3@gmail.com"); // Reemplaza con el email que deseas buscar
  }, []);

  const handleEliminarCuenta = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar tu cuenta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Aceptar",
          onPress: () => {
            eliminarUsuario(); // Lógica para eliminar el usuario
            showMessage({
              message: 'Cuenta eliminada con éxito',
              type: 'success',
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "black", position: "relative", padding: 20}}>
      <NavBar />
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: "white", fontSize: 20, textAlign: "center", letterSpacing: 2, fontFamily: 'NunitoSans_400Regular', }}>Cambiar idioma</Text>
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 15 }}>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 15 }}>
            <Pressable onPress={() => cambiarIdioma(urlIdiomas.españa)}>
              <Image width={70} height={60} source={{ uri: urlIdiomas.españa }} />
            </Pressable>
            <Pressable onPress={() => cambiarIdioma(urlIdiomas.italia)}>
              <Image width={70} height={60} source={{ uri: urlIdiomas.italia }} />
            </Pressable>
            <Pressable onPress={() => cambiarIdioma(urlIdiomas.francia)}>
              <Image width={70} height={60} source={{ uri: urlIdiomas.francia }} />
            </Pressable>
          </View>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 15 }}>
            <Pressable onPress={() => cambiarIdioma(urlIdiomas.inglaterra)}>
              <Image width={70} height={60} source={{ uri: urlIdiomas.inglaterra }} />
            </Pressable>
            <Pressable onPress={() => cambiarIdioma(urlIdiomas.paisesBajos)}>
              <Image width={70} height={60} source={{ uri: urlIdiomas.paisesBajos }} />
            </Pressable>
            <Pressable onPress={() => cambiarIdioma(urlIdiomas.alemania)}>
              <Image width={70} height={60} source={{ uri: urlIdiomas.alemania }} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: "white", fontSize: 20, textAlign: "center", letterSpacing: 2, fontFamily: 'NunitoSans_400Regular', }}>Idioma actual</Text>
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, marginTop: 15 }}>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 15 }}>
            <Pressable>
              <Image width={70} height={60} source={{ uri: idioma }} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{ width:"95vw", marginTop: 10, display: "flex", position:"absolute", bottom:20, justifyContent: "center", alignItems: "center", gap: 10}}>
        <Pressable onPress={() => setUsuarioOn(false)} style={{ borderWidth: 1, backgroundColor: "red", borderColor: "red", width: 150, borderRadius: 4, height: 35, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white", fontFamily: "NunitoSans_700Bold", letterSpacing: 1 }}>Cerrar sesión</Text>
        </Pressable>

        <Pressable onPress={handleEliminarCuenta} style={{ borderWidth: 1, backgroundColor: "red", borderColor: "red", width: 150, borderRadius: 4, height: 35, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white", fontFamily: "NunitoSans_700Bold", letterSpacing: 1 }}>Eliminar cuenta</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Perfil;
