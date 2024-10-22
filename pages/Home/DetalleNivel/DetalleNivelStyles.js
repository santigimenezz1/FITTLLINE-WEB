import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container__detalleNivel: {
        backgroundColor: "black",
        borderWidth:10,
        width:"100%"
    },
    contentContainer: {
        paddingTop: 50, // Espacio en la parte superior
        paddingBottom: 20, // Espacio en la parte inferior
        display: "flex",
        gap: 8,
        paddingHorizontal:30,
        width:"100%"

    }
});

export default styles;
