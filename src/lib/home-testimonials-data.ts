/**
 * Testimonios del inicio (carrusel). Podés sumar filas acá.
 * Sin `imageSrc`: avatar con la primera letra del nombre.
 * Sin `quote` o quote vacío: solo nombre, estrellas e imagen (ej. captura de reseña).
 */
export type HomeTestimonial = {
  name: string;
  quote?: string;
  imageSrc?: string;
};

export const HOME_TESTIMONIALS: HomeTestimonial[] = [
  {
    name: "Mariela Provasi",
    quote:
      "Excelente atención desde el primer momento. Es muy profesional, cuidadosa e higiénica. Me asesoró según mi tipo de piel y los resultados fueron visibles desde la primera sesión. Se nota su formación, experiencia y ama lo que hace. 100% recomendable.",
    imageSrc: "/testimonios/mariela.webp",
  },
  {
    name: "Constanza Castillo",
    quote:
      "Excelente atención, en un lugar pensado especialmente para nosotras y el cuidado que cada una necesitamos! Bienestar en todos los aspectos! Amoo este lugar",
    imageSrc: "/testimonios/constanza.webp",
  },
  {
    name: "Celene",
    quote:
      "Excelente atención! Hermoso espacio y gran variedad de servicios. Las chicas son divinas, siempre con una sonrisa y dispuestas a asesorarte en lo que necesites. 100% recomendable💕",
    imageSrc: "/testimonios/celene.webp",
  },
  {
    name: "Lorena Lovato",
    quote:
      "Hace años conozco a Carla y su dulzura… buena predisposición y profesionalismo hacen que la siga eligiendo día a día… El espacio, por demás confortable… para sentirse única, mimada en las mejores manos.",
    imageSrc: "/testimonios/lorena.webp",
  },
  {
    name: "Maria Claudia Shedden",
    quote:
      "Excelente atención y profesional.\nAtenta a mis necesidades, cordial y muy profesional.\n¡Gracias, Carla!",
  },
  {
    name: "Maria Cecilia Juan",
    quote:
      "Desde que me atiende noté una mejora enorme en mi piel. Es súper dedicada, explica todo con claridad y transmite mucha confianza. El espacio es hermoso, cuidado y se siente un clima de bienestar desde que entrás. Sin dudas, la recomiendo 💖✨",
    imageSrc: "/testimonios/maria_cecilia.webp",
  },
  {
    name: "Laura Gonzalez",
    quote:
      "Hace 1 año que Carla me atiende; realiza un trabajo profesional y dedicado. Además, un trato excelente y su nuevo espacio es excelente.",
    imageSrc: "/testimonios/laura_gonzalez.webp",
  },
  {
    name: "Daichu Mattos",
    quote:
      "Bellísimo el lugar y confortable. La atención de Carla es excelente y muy consciente en su trabajo, que lo hace con amor y dedicación.",
    imageSrc: "/testimonios/daichu_mattos.webp",
  },
  {
    name: "Claudia Diaz",
    quote:
      "El espacio es hermoso, cálido y confortable, pero lo mejor es Carla, gran profesional, sabe muchísimo. Super recomendable !!! No lo duden",
  },
  {
    name: "Susana Tolarechipi",
    quote:
      "Muy buena experiencia!! Carla Bruni es una excelente profesional que ama su trabajo y da lo mejor en cada práctica; los resultados de los tratamientos se observan a corto plazo!! La recomiendo plenamente!!",
    imageSrc: "/testimonios/susana_tolarechipi.webp",
  },
  {
    name: "Maria Victoria",
    quote: "Hermoso espacio, Carla súper profesional! Excelente atención y servicio.",
  },
  {
    name: "Andrea Cecchi",
    quote:
      "Carla Bruni me atiende hace más de 10 años… Es una gran profesional y excelente persona… siempre te trata con mucho cariño y mi piel cada vez está mejor a pesar de que pasan los años… ¡Gracias por tanto!!!",
  },
  {
    name: "Titi la Torre Brogna",
    quote:
      "Carlita es una excelente profesional. No solo con su trabajo sino como persona. ¡Súper recomendable! Te vas muy contenta y con tu carita espléndida… no la vas a poder dejar más, jajaja.",
  },
  {
    name: "Mariela Montecino",
    quote:
      "El espacio es hermoso, lleno de mucho amor 😍 ni hablar de Carla que es una genia total ❤️\nSúper dulce con sus tratamientos.",
    imageSrc: "/testimonios/mariela_ontecino.webp",
  },
  {
    name: "Uschi Banki",
    quote:
      "Carla es una excelente profesional y excelente persona! Cada tratamiento que elijo hacerme ahí tiene efectos extraordinarios y visibles!\nSiempre te explica el paso a paso, y lo más importante, los fundamentos científicos de cada técnica.\nTe explica de manera sencilla los pros y contras en tal caso de que quieras hacerte algo que ella no practica!\n¡Muy profesional!\n¡Pongo mi cara y cuerpo en sus manos!\nAdemás los productos que comercializa son un 10!\nGracias Carla 🫶🏻",
    imageSrc: "/testimonios/uschi_banki.webp",
  },
  {
    name: "Adriana Mirazo",
    quote:
      "Ese espacio del bien… Carla es la mejor, siempre actualizada con los tratamientos, generosa y con muy buena energía. ¡Su lugar es impecable!",
    imageSrc: "/testimonios/adriana_mirazo.webp",
  },
  {
    name: "Carolina Segura",
    quote:
      "¡Qué genia!! Excelente profesional y hermoso espacio… siempre en cada detalle!!",
  },
  {
    name: "Lorena Cassanelli",
    quote: "Carlita, una genia. ¡Excelente atención! Súper recomendable. ❤️",
    imageSrc: "/testimonios/lorena_cassanelli.webp",
  },
  {
    name: "Pamela Altamirano",
    quote: "Carla, una genia en lo que hace. Sin dudas, la mejor. Profesional y excelente persona.",
  },
  {
    name: "Vanesa Beatriz Rodriguez",
    quote:
      "Un lugar muy cálido.\nManos sutiles que cuidan de tu cara (en mi caso).\nMuy bien asesorada con respecto a la piel.",
    imageSrc: "/testimonios/vanesa_beatriz_rodriguez.webp",
  },
  {
    name: "Maria Sol Sepulveda",
    quote:
      "Este lugar es mucho más que una estética para mí. Hace años que vengo y cada visita es un mimo al alma. La dedicación, el detalle y la forma en que te escucha Carla hacen toda la diferencia. No es solo verse mejor, es sentirse mejor. Ojalá más mujeres puedan conocer este espacio y regalarse esta experiencia.",
  },
  {
    name: "Ana Maria Coppolillo",
    quote: "Totalmente recomendable, un espacio muy cálido y Carla es la mejor profesional!!!",
    imageSrc: "/testimonios/ana_maria_coppolillo.webp",
  },
  {
    name: "Marcela Miño",
    quote: "Maravillosa profesional, con una dedicación y atención excelente.\nMuy recomendable.",
  },
  {
    name: "Laura Giner",
    quote:
      "Carla es sumamente profesional. Cuenta con aparatología de última generación. La atención que brinda es de lo más agradable. Siempre con atención personalizada.",
    imageSrc: "/testimonios/laura_giner.webp",
  },
  {
    name: "Romina Gisela Baiotti",
    quote:
      "¡Súper recomendable! Carlita es la número uno 🫶🏼 tanto en lo profesional como en el confort que ofrece en su espacio.",
    imageSrc: "/testimonios/romina_gisela_baiotti.webp",
  },
  {
    name: "Jessica Cabada",
    quote: "Excelente atención y servicio.\nCarla, un amor de persona… ❤️",
    imageSrc: "/testimonios/jessica_cabada.webp",
  },
  {
    name: "Diabetes Salud",
    quote: "Una genia Carlita, súper profesional y buena persona.",
    imageSrc: "/testimonios/diabetes_salud.webp",
  },
  {
    name: "Jardín Maternal Modelo",
    quote: "Súper recomendable, muy buenos tratamientos y excelentes resultados.",
  },
  {
    name: "Sofia Di Domenico",
    quote: "Excelente servicio y atención.\nRecomiendo 100%.",
  },
  {
    name: "Noelia Barca",
    quote:
      "Hola, hace 2 años que me atiendo con Carla: siempre con tratamientos nuevos, responsable y profesional.\nLos resultados son reales.",
  },
  {
    name: "Maria Laura Oraziuk",
    quote: "Muy profesional y hermosa ambientación.",
  },
  {
    name: "Ayelen Rodriguez",
    quote: "La mejor de todas, siempre es bueno aprender de ella 🥰",
  },
  {
    name: "Zio",
    quote: "¡Recomiendo! Muy profesional.",
    imageSrc: "/testimonios/zio.webp",
  },
  {
    name: "Evelina Martin",
    quote:
      "Una genia, todo lo que sabe en el cuidado de la piel; tiene las mejores máquinas, cremas y consejos para el cuidado diario. El estacionamiento es un plus: llegás, lo dejás y subís. Carlita, la mejor de Mar del Plata, ¡lejos!",
    imageSrc: "/testimonios/evelina_martin.webp",
  },
  {
    name: "Monica Patricia Farro",
    imageSrc: "/testimonios/monica_patricia_farro.webp",
  },
  {
    name: "Romina Dasse",
    quote: "La mejor lejos!!",
    imageSrc: "/testimonios/romina_dasse.webp",
  },
  {
    name: "Veronica Leal",
    imageSrc: "/testimonios/veronica_leal.webp",
  },
];
