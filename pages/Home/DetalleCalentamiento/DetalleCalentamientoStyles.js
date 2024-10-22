import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";


const styles = StyleSheet.create({
    container__detalleCalentamiento:{
        height:"auto",
        backgroundColor:"hsl(216, 13%, 8%)",
        display:"flex",
        gap:8,
        paddingTop:20,
        paddingBottom:30,
        paddingHorizontal:12
,    },
detalleCalentamiento__title:{
    color:"white",
    fontSize:RFValue(14),
    margin:10,
    marginTop:20
}
})
export default styles