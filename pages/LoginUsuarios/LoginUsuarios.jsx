import { Image, View } from "react-native"
import styles from "./LoginUsuarios.js"
import BotonLoginUsuario from "../../components/BotonLoginUsuario/BotonLoginUsuario.jsx"


const LoginUsuarios = ( {navigation} ) => {
    return (
        <View style={styles.container__loginUsuarios}>
<Image 
  source={{ uri: "https://res.cloudinary.com/dcf9eqqgt/image/upload/v1726996815/APP%20ALFOMBRA%20DE%20FUTBOL%20AMAZON/icon_xoqflq.jpg" }} 
  style={{ width: 250, height: 70 }} 
  resizeMode="contain" 
/>
            <View>
                <BotonLoginUsuario navigation={navigation}  />
            </View>
        </View>
    )
}
export default LoginUsuarios