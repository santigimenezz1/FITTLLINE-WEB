import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  botonActive: {
   borderWidth: 2,
    borderColor: "white",
    width: RFValue(130),
     height: RFValue(40),
      borderRadius: 14,
       display: "flex",
        justifyContent: "center",
         alignItems: "center",
          backgroundColor: "hsl(199, 76%, 28%)"
  } ,
  botonDesactivado: {
    borderWidth: 2, borderColor: "white",
    width: RFValue(130),
    height: RFValue(40),
    borderRadius: 14,
       display: "flex",
        justifyContent: "center",
         alignItems: "center",
          backgroundColor: "hsl(199, 76%, 28%)"
  }
})

export default styles