import React, { useEffect, useRef, useCallback } from "react";

// Definimos el componente GeoGebraApplet, que acepta una prop llamada onLoad.
const GeoGebraApplet = ({ onLoad }) => {
  // useRef se utiliza para crear referencias que se pueden modificar sin provocar re-renderizados.
  const ggbApplet = useRef(null); // Se refiere al applet de GeoGebra.
  const isInjected = useRef(false); // Marca si el applet ya ha sido inyectado en el DOM.

  // useCallback se utiliza para memorizar la función getAppletSize para evitar que se vuelva a crear en cada renderizado.
  const getAppletSize = useCallback(() => {
    const width = window.innerWidth; // Obtiene el ancho actual de la ventana.

    // Según el ancho de la ventana, se determina el tamaño del applet (ancho y alto).
    if (width >= 1600) {
      return { width: 1000, height: 800 }; // Pantallas extra grandes
    } else if (width >= 1400 && width < 1600) {
      return { width: 930, height: 700 }; // Pantallas muy grandes
    } else if (width >= 1300 && width < 1400) {
      return { width: 860, height: 680 }; // Pantallas grandes
    } else if (width >= 1200 && width < 1300) {
      return { width: 795, height: 640 }; // Pantallas medianas grandes
    } else if (width >= 1100 && width < 1200) {
      return { width: 720, height: 600 }; // Pantallas medianas
    } else if (width >= 992 && width < 1100) {
      return { width: 650, height: 560 }; // Pantallas medianas pequeñas
    } else if (width >= 768 && width < 992) {
      return { width: 510, height: 500 }; // Pantallas pequeñas
    } else if (width < 768) {
      return { width: width, height: 400 }; // Pantallas muy pequeñas
    } else {
      return { width: width, height: 350 }; // Tamaño por defecto
    }
  }, []); // La función no depende de ninguna variable externa.

  // useEffect se ejecuta después de que el componente se ha montado y cada vez que se actualiza.
  useEffect(() => {
    const initializeApplet = () => {
      const { width, height } = getAppletSize(); // Obtener el tamaño del applet.
      const params = {
        id: "ggbApplet", // ID único para el applet.
        appName: "graphing", // Nombre de la aplicación que se está utilizando (GeoGebra en este caso).
        width, // Ancho calculado.
        height, // Alto calculado.
        showToolBar: false, // Oculta la barra de herramientas.
        showAlgebraInput: false, // Oculta el campo de entrada algebraica.
        showMenuBar: false, // Oculta la barra de menú.
        enableLabelDrags: false, // Deshabilita el arrastre de etiquetas.
        showToolBarHelp: false, // Deshabilita la ayuda de la barra de herramientas.
      };

      // Verifica si el applet ya fue creado y lo reinicializa si es necesario.
      if (ggbApplet.current) {
        ggbApplet.current = null; // Reinicializa el applet.
      }

      // Crea una nueva instancia del applet de GeoGebra con los parámetros definidos.
      ggbApplet.current = new window.GGBApplet(params, true);
      // Inyecta el applet en el elemento del DOM con ID "ggb-element".
      ggbApplet.current.inject("ggb-element");

      // Llama a la función onLoad pasada como prop, pasando el applet como argumento.
      if (ggbApplet.current) {
        onLoad(ggbApplet.current);
      } else {
        console.error("GeoGebra applet not initialized");
      }
    };

    // Verifica si el applet ya fue inyectado. Si no lo fue, lo inicializa.
    if (!isInjected.current) {
      initializeApplet();
      isInjected.current = true; // Marca que el applet ha sido inyectado.
    }

    // Define una función que se ejecutará cuando la ventana cambie de tamaño.
    const handleResize = () => {
      initializeApplet(); // Re-inicializa el applet para ajustarlo al nuevo tamaño de la ventana.
    };

    // Crea una versión de la función handleResize que se ejecutará después de un tiempo de espera para evitar múltiples ejecuciones.
    const debounceResize = debounce(handleResize, 200);

    // Añade un evento que escucha los cambios de tamaño de la ventana.
    window.addEventListener("resize", debounceResize);

    // Retorna una función de limpieza que eliminará el evento al desmontar el componente.
    return () => {
      window.removeEventListener("resize", debounceResize);
    };
  }, [getAppletSize, onLoad]); // Dependencias del efecto: getAppletSize y onLoad.

  // Renderiza un div donde se inyectará el applet de GeoGebra.
  return <div id="ggb-element" className="ggb-element"></div>;
};

// Función de debounce para limitar la cantidad de veces que se ejecuta una función en un periodo de tiempo.
const debounce = (func, wait) => {
  let timeout; // Variable para almacenar el temporizador.
  return (...args) => {
    clearTimeout(timeout); // Limpia el temporizador anterior.
    // Establece un nuevo temporizador que ejecutará la función después del tiempo de espera especificado.
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación.
export default GeoGebraApplet;
