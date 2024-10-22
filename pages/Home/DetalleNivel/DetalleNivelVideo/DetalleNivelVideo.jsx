import { Video } from "expo-av";
import { Image, TouchableOpacity, View, Dimensions, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useRef, useEffect } from "react";
import { Swing } from "react-native-animated-spinkit";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./DetalleNivelVideo";
import * as ScreenOrientation from 'expo-screen-orientation'; // Importa el paquete de orientación
import { RFValue } from "react-native-responsive-fontsize";

const DetalleNivelVideo = () => {
    const route = useRoute(); // Usamos useRoute para acceder a los parámetros pasados a la pantalla (el nivel)
    const { ejercicio } = route.params; 
    const navigation = useNavigation();
    const [typeVideo, setTypeVideo] = useState("trailer");
    const [isLoading, setIsLoading] = useState(true); // Estado para manejar el texto de cargando
    const [isPosterVisible, setIsPosterVisible] = useState(true); // Estado para manejar la visibilidad de la previsualización
    const [videoDuration, setVideoDuration] = useState(0); // Estado para almacenar la duración del video en milisegundos
    const [isFullScreen, setIsFullScreen] = useState(false); // Estado para manejar si está en pantalla completa
    const [botonActive, setBotonActive] = useState("Tutorial")
    const videoRef = useRef(null);

   
    useEffect(() => {
        // Actualiza el título de la cabecera con el nombre del ejercicio
        navigation.setOptions({ title: ejercicio.nombre });
    }, [navigation, ejercicio.nombre]);

    useEffect(() => {
        // Listener para detectar cambios en la orientación de la pantalla
        const subscription = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
            if (orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
                setIsFullScreen(true);
            } else {
                setIsFullScreen(false);
            }
        });

        // Limpia el listener al desmontar el componente
        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, []);

    const handleVideoLoad = (data) => {
        setIsLoading(false);
        setIsPosterVisible(false); // Oculta la imagen de previsualización cuando el video está listo
        setVideoDuration(data.durationMillis); // Guarda la duración del video en el estado
        videoRef.current?.playAsync(); // Reproduce automáticamente el video cuando está listo
    };

    const handleFullScreenToggle = async () => {
        if (isFullScreen) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Cambiar a retrato
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT); // Cambiar a paisaje
        }
    };

    const handleChangeVideo = async (videoType) => {
        let type = await videoType
        if(type === "tutorial"){
            setBotonActive("Tutorial")
        }else{
            setBotonActive("Entrenamiento")
        }
        setIsPosterVisible(true); // Mostrar la imagen de previsualización
        setIsLoading(true); // Mostrar el indicador de carga
        setTypeVideo(videoType); // Cambiar el tipo de video
        videoRef.current?.stopAsync(); // Detener el video actual antes de cambiar

        // Cargar y reproducir automáticamente el nuevo video
        setTimeout(() => {
            videoRef.current?.loadAsync(
                { uri: videoType === "ejercicio" ? ejercicio.videoURL : ejercicio.videoTrailerURL },
                {},
                false
            ).then(() => {
                videoRef.current?.playAsync(); // Autoplay el video
            });
        }, 0);
      
        

    };

    const formatDuration = (millis) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = Math.floor((millis % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`;
    };

    return (

        <ScrollView>

        <View style={{  backgroundColor: "black",paddingBottom:RFValue(50), height:500}}>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 30 }}>
                <View style={{display:"flex", width:"80%", marginBottom:10, flexDirection:"row-reverse", justifyContent:"space-between"}}>
                    <View>
                        <View style={{display:"flex", flexDirection:"row", gap:5}}>
                            {ejercicio.estrellas.completas.map(() => (
                                <FontAwesome name="star" size={24} color="hsl(199, 76%, 28%)" />                
                            ))}
                            {ejercicio.estrellas.vacias.map(() => (
                                <FontAwesome name="star-o" size={24} color="hsl(199, 76%, 28%)" />                
                            ))}
                        </View>
                    </View>
                    <Text style={{color:"white", textAlign:"start", letterSpacing:2, margin:2}}>
                        {formatDuration(videoDuration)}
                    </Text>
                </View>
                <View style={{ width: "98%", gap:5, display: "flex", alignItems: "center", position: "relative" }}>
                    {isLoading && (
                        <Swing style={{ position: "absolute", top: "40%", zIndex: 2 }} size={48} color="hsl(199, 76%, 28%)" />
                    )}
                            <Text style={{ color: "white",  fontSize:22, textAlign: "center", letterSpacing: 2, fontFamily: 'NunitoSans_400Regular' }}>{botonActive}</Text>
                            {isPosterVisible && (
                        <Image 
                            source={{ uri: ejercicio.videoPosterURL }} 
                            style={{ 
                                width: "100%", 
                                height: isFullScreen ? Dimensions.get('window').height : 179, // Ajuste de la altura según el modo
                                borderRadius: 7, 
                                position: 'absolute', 
                                zIndex: 1 
                            }} 
                        />
                    )}
                    <Video
                        ref={videoRef} // Asigna la referencia al componente Video
                        source={{ uri: typeVideo === "ejercicio" ? ejercicio.videoURL : ejercicio.videoTrailerURL }}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                        style={{ 
                            width: isFullScreen ? Dimensions.get('window').width : "95%", // En pantalla completa
                            height: isFullScreen ? Dimensions.get('window').height : RFValue(170), // Ajuste de altura en pantalla completa
                            borderRadius: 7 
                        }}
                        onLoadStart={() => setIsLoading(true)}  // Inicia la carga
                        onLoad={handleVideoLoad}                // Termina la carga y obtiene la duración
                        onFullscreenUpdate={handleFullScreenToggle} // Cambia la orientación en pantalla completa
                    />
                </View>
                <View style={{width:RFValue(300), borderWidth:3, borderColor:"hsl(199, 76%, 28%)", marginTop:20}}>
                    <Image source={{uri:ejercicio.imagenVideo, width:"100%", height:RFValue(120), }} />
                </View>
                <View style={{ width: "100%", marginTop: RFValue(20), display: "flex", justifyContent: "center", alignItems: "center" }}>
                </View>
                <View style={{ marginTop: 40, display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <View style={{ display: "flex", gap: 12, width:"90%", marginBottom:30, justifyContent: "center", flexDirection:"row" }}>
                        <TouchableOpacity 
                            style={styles.botonActive}
                            onPress={() => handleChangeVideo("tutorial")}
                        >
                            <Text style={{ color: "white", textAlign: "center", letterSpacing: 1, fontFamily: 'NunitoSans_400Regular' }}>Tutorial</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.botonDesactivado}
                            onPress={() => handleChangeVideo("ejercicio")}
                        >
                            <Text style={{ color: "white", textAlign: "center", letterSpacing: 1, fontFamily: 'NunitoSans_400Regular' }}>Entrenamiento</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
        </ScrollView>
    );
}

export default DetalleNivelVideo;