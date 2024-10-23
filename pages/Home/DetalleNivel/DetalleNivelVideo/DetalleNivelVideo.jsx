import { Video } from "expo-av";
import { Image, TouchableOpacity, View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useRef, useEffect } from "react";
import { Swing } from "react-native-animated-spinkit";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./DetalleNivelVideo"; // Asegúrate de que este archivo exista
import * as ScreenOrientation from 'expo-screen-orientation';
import { RFValue } from "react-native-responsive-fontsize";

const DetalleNivelVideo = () => {
    const route = useRoute();
    const { ejercicio } = route.params; 
    const navigation = useNavigation();
    const [typeVideo, setTypeVideo] = useState("trailer");
    const [isLoading, setIsLoading] = useState(true);
    const [isPosterVisible, setIsPosterVisible] = useState(true);
    const [videoDuration, setVideoDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [botonActive, setBotonActive] = useState("Tutorial");
    const videoRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({ title: ejercicio.nombre });
    }, [navigation, ejercicio.nombre]);

    useEffect(() => {
        const subscription = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
            setIsFullScreen(orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || 
                            orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT);
        });

        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, []);

    const handleVideoLoad = (data) => {
        setIsLoading(false);
        setIsPosterVisible(false);
        setVideoDuration(data.durationMillis);
        videoRef.current?.playAsync();
    };

    const handleFullScreenToggle = async (status) => {
        if (status.didJustEnterFullscreen) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
    };

    const handleChangeVideo = async (videoType) => {
        setIsPosterVisible(true);
        setIsLoading(true);
        setTypeVideo(videoType);
        videoRef.current?.stopAsync();
        
        setTimeout(() => {
            videoRef.current?.loadAsync(
                { uri: videoType === "ejercicio" ? ejercicio.videoURL : ejercicio.videoTrailerURL },
                {},
                false
            ).then(() => {
                videoRef.current?.playAsync();
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
            <View style={{ backgroundColor: "black", paddingBottom: RFValue(50), height: "auto" }}>
                <View style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 30 }}>
                    <View style={{ display: "flex", width: "80%", marginBottom: 10, flexDirection: "row-reverse", justifyContent: "space-between" }}>
                        <View>
                            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                                {ejercicio.estrellas.completas.map((_, index) => (
                                    <FontAwesome key={index} name="star" size={24} color="hsl(199, 76%, 28%)" />
                                ))}
                                {ejercicio.estrellas.vacias.map((_, index) => (
                                    <FontAwesome key={index} name="star-o" size={24} color="hsl(199, 76%, 28%)" />
                                ))}
                            </View>
                        </View>
                        <Text style={{ color: "white", textAlign: "start", letterSpacing: 2, margin: 2 }}>
                            {formatDuration(videoDuration)}
                        </Text>
                    </View>
                    <View style={{ width: "98%", gap: 5, display: "flex", alignItems: "center", position: "relative" }}>
                        {isLoading && (
                            <Swing style={{ position: "absolute", top: "40%", zIndex: 2 }} size={48} color="hsl(199, 76%, 28%)" />
                        )}
                        <Text style={{ color: "white", fontSize: 22, textAlign: "center", letterSpacing: 2, fontFamily: 'NunitoSans_400Regular' }}>{botonActive}</Text>
                        {isPosterVisible && (
                            <Image 
                                source={{ uri: ejercicio.videoPosterURL }} 
                                style={{ 
                                    width: "100%", 
                                    height: isFullScreen ? "100%" : 179, 
                                    borderRadius: 7,
                                    position: 'absolute',
                                    zIndex: 1 
                                }} 
                            />
                        )}
                        <View style={{ width: RFValue(320), height: RFValue(180), position: 'relative' }}>
                            <Video
                                ref={videoRef}
                                source={{ uri: typeVideo === "ejercicio" ? ejercicio.videoURL : ejercicio.videoTrailerURL }}
                                useNativeControls
                                resizeMode="contain" // Cambia a "cover" o "stretch" si es necesario
                                isLooping
                                style={{ 
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 7 
                                }}
                                onLoadStart={() => setIsLoading(true)}
                                onLoad={handleVideoLoad}
                                onFullscreenUpdate={handleFullScreenToggle}
                            />
                        </View>
                    </View>
                    <View style={{ width: RFValue(300), borderWidth: 3, borderColor: "hsl(199, 76%, 28%)", marginTop: 20 }}>
                        <Image source={{ uri: ejercicio.imagenVideo }} style={{ width: "100%", height: RFValue(120) }} />
                    </View>
                    <View style={{ width: "100%", marginTop: RFValue(20), display: "flex", justifyContent: "center", alignItems: "center" }}>
                    </View>
                    <View style={{ marginTop: 40, display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
                        <View style={{ display: "flex", gap: 12, width: "90%", marginBottom: 30, justifyContent: "center", flexDirection: "row" }}>
                            <TouchableOpacity 
                                style={styles.botonActive}
                                onPress={() => handleChangeVideo("tutorial")}
                            >
                                <Text style={{ color: "white", textAlign: "center", letterSpacing: 1, fontFamily: 'NunitoSans_400Regular' }}>Tutorial</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.botonDesactivado}
                                onPress={() => handleChangeVideo("ejercicio")}>
                                <Text style={{ color: "white", textAlign: "center", letterSpacing: 1, fontFamily: 'NunitoSans_400Regular' }}>Entrenamiento</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default DetalleNivelVideo;
