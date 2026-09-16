import type { Dictionary } from "./pt";

export const es: Dictionary = {
  code: "es",
  langLabel: "ES",
  switchTo: "Ver en portugués",
  nav: {
    home: "Inicio",
    intro: "Invitación",
    story: "Nuestra historia",
    gallery: "Recuerdos",
    wedding: "La boda",
    rsvp: "Confirmar asistencia",
    gifts: "Regalos",
    menu: "Menú",
    close: "Cerrar",
  },
  hero: {
    saveTheDate: "Save the Date",
    giftsAction: "Ver lista de regalos",
    rsvpAction: "Confirmar asistencia",
    couple: "Isabel y Heins",
    date: "01 . 11 . 2026",
    place: "Fortaleza - Ceará",
    phrase: "Celebremos el amor",
    scroll: "Desliza para descubrir",
  },
  intro: {
    kicker: "Con alegría",
    title: "Nuestra invitación",
    body: [
      "Después de años cruzando fronteras, husos horarios y aeropuertos, elegimos un lugar y una fecha para juntar a quienes caminaron con nosotros.",
      "Será una tarde simple y luminosa, con el mar de Fortaleza de fondo, entre abrazos largos e historias que ya nos sabemos de memoria.",
    ],
    signature: "Isabel y Heins",
  },
  story: {
    kicker: "El camino hasta acá",
    title: "Nuestra historia",
    subtitle: "Cuatro momentos que nos trajeron hasta el 01.11.2026.",
    items: [
      {
        tag: "Donde partió todo",
        year: "Estados Unidos",
        title: "El primer encuentro",
        text: "Dos acentos distintos y una conversación que no terminó nunca más. Lejos de casa descubrimos lo que era sentirse en casa.",
      },
      {
        tag: "Distancia",
        year: "Brasil ↔ Chile",
        title: "Amor a contra horario",
        text: "Miles de kilómetros, llamadas de madrugada y maletas siempre listas. Cada reencuentro confirmaba la decisión.",
      },
      {
        tag: "Raíces",
        year: "Nuestra vida en Chile",
        title: "Construyendo lo cotidiano",
        text: "La cordillera en la ventana, el desayuno compartido, una casa hecha de dos culturas y un solo idioma: el nuestro.",
      },
      {
        tag: "El gran día",
        year: "01.11.2026",
        title: "Sí, para siempre",
        text: "Volvemos a Fortaleza para decir que sí frente a quienes queremos. Y te queremos en esta historia.",
      },
    ],
  },
  gallery: {
    kicker: "Instantes",
    title: "Nuestros recuerdos",
    subtitle: "Un pedacito de nuestra historia en fotos, desde el primer encuentro hasta el sí.",
    swipeHint: "Desliza para ver más",
    open: "Ampliar foto",
    close: "Cerrar",
    previous: "Foto anterior",
    next: "Foto siguiente",
    counter: (current: number, total: number) => `${current} de ${total}`,
    photos: {
      comeco: {
        place: "Estados Unidos",
        caption:
          "Era 4 de julio, el Día de la Independencia, y fuimos a ver los fuegos artificiales con la gente de la escuela.",
        alt: "Isabel y Heins sentados en el pasto, de noche, esperando los fuegos artificiales del 4 de julio en Estados Unidos.",
      },
      carnaval: {
        place: "Carnaval en Flecheiras",
        caption:
          "En la costa de Ceará, Heins con camisa floreada e Isabel con glitter. El Carnaval aprobó a la pareja.",
        alt: "Isabel y Heins abrazados en el Carnaval callejero de Flecheiras, en Ceará, de noche.",
      },
      praia: {
        place: "Fortaleza",
        caption:
          "La primera vez de Heins en Fortaleza. Conoció el sol de Ceará y volvió de otro color.",
        alt: "Isabel y Heins tendidos en la arena, con edificios y palmeras de fondo.",
      },
      neve: {
        place: "Cordillera de los Andes",
        caption:
          "Día de nieve en la cordillera. El cielo estaba tan azul que ni parecía que hacía frío.",
        alt: "Selfie de la pareja en la nieve, con montañas y cielo azul de fondo.",
      },
      sul: {
        place: "Sur de Chile",
        caption:
          "Un río tan azul que parecía de mentira. El viento helado se encargó de recordarnos que era real.",
        alt: "Isabel y Heins con gorro y parka en un mirador, con un río turquesa y un cerro de fondo.",
      },
      show: {
        place: "Concierto de Pedro Sampaio",
        caption:
          "Isabel se sabía todas las letras. Heins quedó a cargo de las chelas y de hacer como que también se las sabía.",
        alt: "Selfie de Isabel y Heins con vasos de cerveza en el concierto de Pedro Sampaio, con el escenario de fondo.",
      },
      brinde: {
        place: "Ensayo general",
        caption: "Practicando el brindis. De aquí a noviembre le agarramos la mano.",
        alt: "Isabel y Heins, bien vestidos, brindando frente a un arco de flores iluminado.",
      },
      pedido: {
        place: "La propuesta",
        caption: "Isabel dijo que sí. El resto de la historia lo ves el 01.11.2026.",
        alt: "Selfie de la pareja en la playa; Isabel muestra el anillo de compromiso.",
      },
    },
  },
  wedding: {
    kicker: "Detalles",
    title: "La boda",
    subtitle: "Todo lo que necesitas saber para celebrar con nosotros.",
    dateLabel: "Fecha y hora",
    dateValue: "1 de noviembre de 2026, a las 16:00",
    venueLabel: "Lugar",
    venueName: "Buffet Le Jardin",
    venueAddress: "Rua General Castelo Branco, 88, Cidade dos Funcionários, Fortaleza - CE",
    dressLabel: "Vestimenta",
    dressValue: "Formal elegante",
    dressNote: "Los colores claros y los tonos naturales acompañan bien nuestra tarde.",
    maps: "Abrir en Google Maps",
  },
  rsvp: {
    kicker: "Asistencia",
    title: "Confirmación de asistencia",
    subtitle:
      "Escribe el nombre de quien recibió la invitación para encontrar a tu familia y confirmar a cada persona.",
    searchLabel: "Buscar por nombre",
    searchPlaceholder: "Ej.: María Oliveira",
    searchButton: "Buscar invitación",
    searching: "Buscando...",
    noResults: "No encontramos ese nombre. Prueba con el nombre completo o escríbenos.",
    resultsTitle: "Selecciona tu invitación",
    membersTitle: "¿Quiénes van a celebrar con nosotros?",
    attending: "Va a asistir",
    notAttending: "No podrá ir",
    messageLabel: "Déjanos un mensaje (opcional)",
    messagePlaceholder: "Un mensaje cariñoso para los novios",
    confirm: "Confirmar asistencia",
    sending: "Enviando...",
    back: "Elegir otra invitación",
    successTitle: "¡Asistencia registrada!",
    successBody: "Gracias por confirmar. Tenemos muchas ganas de abrazarte en Fortaleza.",
    again: "Confirmar otra invitación",
    error: "No pudimos registrarlo ahora. Inténtalo de nuevo en un momento.",
    guestsCount: (n: number) => (n === 1 ? "1 invitado" : `${n} invitados`),
  },
  gifts: {
    kicker: "Cariño",
    title: "Lista de regalos poco convencionales",
    subtitle:
      "Tu presencia ya es el mejor regalo. Pero si quieres ayudar a esta pareja cearense-chilena a partir su vida juntos, elige una opción de aquí abajo. Todas 100% reales (más o menos).",
    choose: "Regalar",
    approx: "aprox.",
    items: {
      terremoto: {
        title: "Ronda de terremotos en La Piojera",
        text: "El trago que tumba hasta al cabra da peste más arretado del Ceará. Réplica incluida.",
      },
      pisco: {
        title: "Pisco sour diplomático",
        text: "Para brindar con pisco chileno. Ojo: decir que el pisco es peruano puede cancelar el matrimonio.",
      },
      palta: {
        title: "Palta de por vida",
        text: "Porque en Chile la palta va hasta en el completo, y la novia ya cayó en el vicio.",
      },
      protetor: {
        title: "Bloqueador factor 100 para el novio",
        text: "Un chileno en la playa de Fortaleza a mediodía queda como camarón en quince minutos. Regalo de utilidad pública.",
      },
      guatero: {
        title: "Kit de supervivencia al invierno santiaguino",
        text: "Para la cearense que descubrió que existen los 3 °C: guatero, tres pares de calcetines y una manda al Padre Cícero.",
      },
      temblor: {
        title: "Seguro anti-susto para temblores",
        text: "Para que la novia deje de salir arrancando con cada temblor mientras el novio ni se para del sillón: “tranquila, fue un temblorcito”.",
      },
      caranguejo: {
        title: "Jueves de cangrejo en Praia do Futuro",
        text: "Para presentarle al novio el martillito, la polera manchada y el concepto de jueves sagrado.",
      },
      forro: {
        title: "Curso intensivo de forró para el novio",
        text: "Para que Heins cambie el pañuelo de la cueca por el xote sin pisarle los pies a la novia. (Ojo: en Brasil, “cueca” significa calzoncillo).",
      },
      rede: {
        title: "Hamaca cearense para el living en Santiago",
        text: "El sillón está bien, pero una cearense solo descansa de verdad meciéndose en una hamaca. Aunque sea al lado de la estufa.",
      },
      tradutor: {
        title: "Traductor simultáneo cearense ↔ chileno",
        text: "Para descifrar cuando él dice “¿cachai, po?” y ella responde “oxe, macho, e eu lá sei?”.",
      },
      mala: {
        title: "Maleta extra de rapadura y castañas",
        text: "Para volver a Santiago con Ceará en la maleta y rezar para que el SAG no la requise.",
      },
      luaDeMel: {
        title: "Luna de miel: de Jeri a Atacama",
        text: "De las dunas de Jericoacoara a las del desierto más seco del mundo. Pareja con arena en los zapatos, pareja que dura.",
      },
    },
    free: {
      title: "Monto libre",
      text: "¿Ninguno te convenció, po? Elige el monto que quieras y nosotros inventamos el chiste.",
      action: "Regalar con monto libre",
    },
    modal: {
      title: "Cómo regalar",
      subtitle: "Elige la opción más cómoda para ti.",
      brazil: "Brasil · Pix",
      chile: "Chile · Santander",
      amount: "Monto",
      suggested: "Monto sugerido",
      freeAmount: "Tú eliges el monto",
      pixScan: "Abre la app de tu banco brasileño, elige Pix › Leer código QR y apunta la cámara.",
      pixCopyPaste: "Pix Copia e Cola",
      pixLabel: "Llave Pix (CPF)",
      pixNote:
        "¿Estás en el celular? Copia el código Pix Copia e Cola y pégalo en la app de tu banco.",
      bankTitle: "Transferencia bancaria",
      bank: "Banco",
      accountTypeLabel: "Tipo de cuenta",
      accountType: "Cuenta corriente",
      holder: "Titular",
      rut: "RUT",
      account: "N° de cuenta",
      email: "Correo",
      copyAll: "Copiar todos los datos",
      transferNote:
        "En la app del banco, agrega este correo para que nos llegue el aviso de la transferencia.",
      copy: "Copiar",
      copied: "¡Copiado!",
      close: "Cerrar",
    },
  },
  closing: {
    title: "Nos vemos el 1 de noviembre",
    body: "Gracias por ser parte de nuestra historia. Que ese día se recuerde por mucho amor, buena música y tiempo de sobra para bailar.",
    signature: "Con amor, Isabel y Heins",
  },
  footer: {
    couple: "Isabel & Heins",
    date: "01.11.2026 · Fortaleza, Ceará",
  },
};
