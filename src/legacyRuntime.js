import * as oasis from "./services/oasisApi.js";
import { StudentService } from "./services/StudentService.js";
import { GradeService } from "./services/GradeService.js";

// Acceso al correo institucional (Microsoft 365 del dominio espoch.edu.ec).
const WEBMAIL_URL = "https://login.microsoftonline.com/?whr=espoch.edu.ec";

export function initLegacyRuntime() {
  if (window.__espochLegacyInit) return;
  window.__espochLegacyInit = true;

  var DB_RACS_TI = [
    { id: 'rac1', code: 'RAC1', description: 'Comunica efectivamente en español e inglés en diversos contextos profesionales.' },
    { id: 'rac2', code: 'RAC2', description: 'Aplica métodos y técnicas eficientes en el gobierno, auditoría y gestión de proyectos de Tecnologías de la Información (TI) para la administración de tecnologías informáticas fiables que protejan la información de los usuarios o corporaciones.' },
    { id: 'rac3', code: 'RAC3', description: 'Implementa soluciones basadas en tecnologías web y móvil para el cumplimiento de los requerimientos y estándares corporativos.' },
    { id: 'rac4', code: 'RAC4', description: 'Aplica las competencias adquiridas con liderazgo en actividades inherentes a la profesión para la construcción de soluciones innovadoras con sostenibilidad ambiental basados en TIC y TIP.' },
    { id: 'rac5', code: 'RAC5', description: 'Desarrolla diferentes tecnologías de redes para la optimización de la administración y gestión de grandes volúmenes de datos en sistemas distribuidos.' }
  ];

  var DB_ESPOCH = {
    'TECNOLOGÍAS DE LA INFORMACIÓN': {
      maxPao: 8,
      racs: DB_RACS_TI,
      malla: {
        'NIVELACIÓN': ['Introducción a las TIC', 'Matemáticas Básicas'],
        '1': ['INGLÉS I', 'FUNDAMENTOS DE PROGRAMACIÓN', 'EDUCACIÓN FÍSICA', 'SOSTENIBILIDAD AMBIENTAL', 'COMUNICACIÓN ORAL Y ESCRITA', 'QUÍMICA', 'ÁLGEBRA LINEAL'],
        '2': ['FÍSICA MECÁNICA', 'INGLÉS II', 'METODOLOGÍA DE LA INVESTIGACIÓN', 'CÁLCULO DE UNA VARIABLE', 'ADMINISTRACIÓN DE SISTEMAS OPERATIVOS', 'PROGRAMACIÓN'],
        '3': ['INGLÉS III', 'SISTEMAS DE COMUNICACIÓN', 'FUNDAMENTOS DE BASE DE DATOS', 'ECUACIONES DIFERENCIALES', 'CÁLCULO DE VARIAS VARIABLES', 'GESTIÓN DE PROYECTOS TI', 'REALIDAD SOCIOECONÓMICA E INTERCULTURALIDAD'],
        '4': ['INGLÉS IV', 'MATEMÁTICA AVANZADA', 'FUNDAMENTOS DE REDES', 'DISEÑO DE EXPERIENCIA DE USUARIO', 'ADMINISTRACIÓN DE BASE DE DATOS', 'MÉTODOS NUMÉRICOS', 'GESTIÓN ADMINISTRATIVA'],
        '5': ['CONMUTACIÓN Y ENRUTAMIENTO', 'ESTADÍSTICA Y PROBABILIDAD', 'TECNOLOGÍA WEB', 'BIG DATA', 'TECNOLOGÍA Y DISEÑO MULTIMEDIA', 'INFRAESTRUCTURA TI', 'ÉTICA Y RELACIONES HUMANAS'],
        '6': ['ESCALABILIDAD DE REDES', 'COMPUTACIÓN MÓVIL', 'MACHINE LEARNING', 'PRÁCTICAS DE SERVICIOS COMUNITARIO', 'INTEROPERABILIDAD DE PLATAFORMAS', 'EMPRENDIMIENTO'],
        '7': ['ITINERARIO 1: Ethical Hacking', 'ITINERARIO 1: Criptografía', 'BUSINESS INTELLIGENCE', 'SEGURIDAD TI', 'APLICACIONES IoT', 'PRÁCTICAS LABORALES', 'FORMULACIÓN DE TRABAJO DE TITULACIÓN'],
        '8': ['CLOUD COMPUTING', 'AUDITORÍA TI', 'GOBIERNO TI', 'SISTEMAS DE INFORMACIÓN GEOGRÁFICA', 'ITINERARIO 2: Deep Learning 2', 'ITINERARIO 2: Deep Learning 1', 'TRABAJO DE TITULACIÓN']
      },
      asignaturas: {
        'INGLÉS I': { raau: [{ code: 'RAAU1', description: 'Utiliza expresiones de uso común para comunicar ideas sencillas.', racId: 'rac1' }] },
        'FUNDAMENTOS DE PROGRAMACIÓN': { raau: [{ code: 'RAAU1', description: 'Implementa algoritmos estructurados para computadoras eficientes.', racId: 'rac3' }] },
        'SOSTENIBILIDAD AMBIENTAL': { raau: [{ code: 'RAAU1', description: 'Aplica los principios y normas ambientales para la adopción de alternativas.', racId: 'rac4' }] },
        'COMUNICACIÓN ORAL Y ESCRITA': { raau: [{ code: 'RAAU1', description: 'Aplica los conceptos de la comunicación oral y escrita en diversos contextos.', racId: 'rac1' }] },
        'GESTIÓN DE PROYECTOS TI': { raau: [
          { code: 'RAAU1', description: 'Diseña planes de proyecto que garanticen la implementación de soluciones.', racId: 'rac2' },
          { code: 'RAAU2', description: 'Utiliza herramientas tecnológicas para el seguimiento y control.', racId: 'rac2' }
        ]},
        'FUNDAMENTOS DE REDES': { raau: [{ code: 'RAAU1', description: 'Diseña redes de computadoras basados en modelos OSI, TCP/IP.', racId: 'rac5' }] },
        'GOBIERNO TI': { raau: [{ code: 'RAAU1', description: 'Identifica los marcos de referencia y estándares del gobierno TI.', racId: 'rac2' }] },
        'AUDITORÍA TI': { raau: [{ code: 'RAAU1', description: 'Aplica normas de auditoría TI en sistemas de información.', racId: 'rac2' }] },
        'CLOUD COMPUTING': { raau: [{ code: 'RAAU1', description: 'Aplica arquitecturas en la nube para optimización de recursos.', racId: 'rac2' }] },
        'PROGRAMACIÓN': { raau: [{ code: 'RAAU1', description: 'Implementa aplicaciones de escritorio para ambientes colaborativos.', racId: 'rac3' }] },
        'ADMINISTRACIÓN DE SISTEMAS OPERATIVOS': { raau: [{ code: 'RAAU1', description: 'Configura sistemas operativos para solución de problemas.', racId: 'rac2' }] },
        'INGLÉS II': { raau: [{ code: 'RAAU1', description: 'Utiliza vocabulario y frases simples sobre temas de interés.', racId: 'rac1' }] },
        'INGLÉS III': { raau: [{ code: 'RAAU1', description: 'Habla en diversos contextos sobre situaciones reales con claridad.', racId: 'rac1' }] },
        'INGLÉS IV': { raau: [{ code: 'RAAU1', description: 'Construye ideas coherentes con lenguaje claro y preciso.', racId: 'rac1' }] },
        'SISTEMAS DE COMUNICACIÓN': { raau: [{ code: 'RAAU1', description: 'Interpreta técnicas de transmisión, modulación y multiplexación.', racId: 'rac5' }] },
        'FUNDAMENTOS DE BASE DE DATOS': { raau: [{ code: 'RAAU1', description: 'Diseña modelos de bases de datos relacionales.', racId: 'rac5' }] },
        'MACHINE LEARNING': { raau: [{ code: 'RAAU1', description: 'Analiza patrones de datos en implementación de modelos predictivos.', racId: 'rac2' }] },
        'SEGURIDAD TI': { raau: [{ code: 'RAAU1', description: 'Implementa medidas de seguridad efectivas.', racId: 'rac2' }] },
        'COMPUTACIÓN MÓVIL': { raau: [{ code: 'RAAU1', description: 'Desarrolla aplicaciones móviles adaptables.', racId: 'rac3' }] },
        'ADMINISTRACIÓN DE BASE DE DATOS': { raau: [{ code: 'RAAU1', description: 'Diseña bases de datos avanzadas SQL y no SQL.', racId: 'rac5' }] },
        'CONMUTACIÓN Y ENRUTAMIENTO': { raau: [{ code: 'RAAU1', description: 'Diseña topologías de redes para conmutación y enrutamiento.', racId: 'rac5' }] },
        'DISEÑO DE EXPERIENCIA DE USUARIO': { raau: [{ code: 'RAAU1', description: 'Aplica principios de usabilidad y diseño centrado en el usuario.', racId: 'rac3' }] },
        'INFRAESTRUCTURA TI': { raau: [{ code: 'RAAU1', description: 'Implementa infraestructura TI para soluciones escalables.', racId: 'rac2' }] },
        'ESCALABILIDAD DE REDES': { raau: [{ code: 'RAAU1', description: 'Implementa redes escalables con alta disponibilidad.', racId: 'rac5' }] },
        'TECNOLOGÍA WEB': { raau: [{ code: 'RAAU1', description: 'Implementa aplicaciones web para solución de problemas tecnológicos.', racId: 'rac3' }] },
        'BIG DATA': { raau: [{ code: 'RAAU1', description: 'Utiliza aplicaciones del ecosistema Big Data.', racId: 'rac5' }] },
        'MÉTODOS NUMÉRICOS': { raau: [{ code: 'RAAU1', description: 'Aplica métodos numéricos para resolución de problemas en TI.', racId: 'rac2' }] },
        'TECNOLOGÍA Y DISEÑO MULTIMEDIA': { raau: [{ code: 'RAAU1', description: 'Utiliza software multimedia para creación de contenido.', racId: 'rac3' }] },
        'GESTIÓN ADMINISTRATIVA': { raau: [{ code: 'RAAU1', description: 'Identifica riesgos y procesos de control estratégico.', racId: 'rac2' }] },
        'ÉTICA Y RELACIONES HUMANAS': { raau: [{ code: 'RAAU1', description: 'Aplica principios éticos universales.', racId: 'rac4' }] },
        'CÁLCULO DE UNA VARIABLE': { raau: [{ code: 'RAAU1', description: 'Aplica conocimientos del cálculo para resolución de problemas.', racId: 'rac2' }] },
        'ESTADÍSTICA Y PROBABILIDAD': { raau: [{ code: 'RAAU1', description: 'Aplica conceptos estadísticos y probabilísticos.', racId: 'rac2' }] },
        'ECUACIONES DIFERENCIALES': { raau: [{ code: 'RAAU1', description: 'Aplica métodos de ecuaciones diferenciales en problemas reales.', racId: 'rac2' }] },
        'CÁLCULO DE VARIAS VARIABLES': { raau: [{ code: 'RAAU1', description: 'Aplica cálculo diferencial e integral con múltiples variables.', racId: 'rac2' }] },
        'MATEMÁTICA AVANZADA': { raau: [{ code: 'RAAU1', description: 'Integra modelos de matemática avanzada.', racId: 'rac2' }] },
        'ÁLGEBRA LINEAL': { raau: [{ code: 'RAAU1', description: 'Comprende representaciones algebraicas de vectores.', racId: 'rac2' }] },
        'FÍSICA MECÁNICA': { raau: [{ code: 'RAAU1', description: 'Aplica principios de física mecánica.', racId: 'rac2' }] },
        'QUÍMICA': { raau: [{ code: 'RAAU1', description: 'Evalúa reacciones químicas inorgánicas.', racId: 'rac2' }] },
        'METODOLOGÍA DE LA INVESTIGACIÓN': { raau: [{ code: 'RAAU1', description: 'Aplica metodologías de investigación.', racId: 'rac2' }] },
        'REALIDAD SOCIOECONÓMICA E INTERCULTURALIDAD': { raau: [{ code: 'RAAU1', description: 'Relaciona conceptos de economía, cultura y proceso social.', racId: 'rac4' }] },
        'BUSINESS INTELLIGENCE': { raau: [{ code: 'RAAU1', description: 'Implementa entornos de visualización y análisis de negocios.', racId: 'rac2' }] },
        'Introducción a las TIC': { raau: [{ code: 'RAAU1', description: 'Identifica conceptos básicos de TIC.', racId: 'rac1' }] },
        'Matemáticas Básicas': { raau: [{ code: 'RAAU1', description: 'Aplica conceptos matemáticos básicos.', racId: 'rac2' }] }
      }
    },
    'AMBIENTAL': { maxPao: 8, racs: [], malla: { 'NIVELACIÓN': [] }, asignaturas: {} },
    'AGRONOMÍA': { maxPao: 9, racs: [], malla: { 'NIVELACIÓN': [] }, asignaturas: {} },
    'ZOOTECNIA': { maxPao: 8, racs: [], malla: { 'NIVELACIÓN': [] }, asignaturas: {} },
    'TURISMO': { maxPao: 8, racs: [], malla: { 'NIVELACIÓN': [] }, asignaturas: {} },
    'DERECHO': { maxPao: 0, racs: [], malla: { 'NIVELACIÓN': ['Introducción al Derecho'] }, asignaturas: {} }
  };

  var EVAL_PROCEDURES = {
    ACD: [
      { id: 'acd1', name: 'Participación en clase' }, { id: 'acd2', name: 'Investigación Formativa' },
      { id: 'acd3', name: 'Resúmenes' }, { id: 'acd4', name: 'Lectura crítica de textos' },
      { id: 'acd5', name: 'Exposiciones' }, { id: 'acd6', name: 'Proyecto o planes en el aula' },
      { id: 'acd7', name: 'Comunicación oral y escrita' }, { id: 'acd8', name: 'Debates' },
      { id: 'acd9', name: 'Cuestionarios' }, { id: 'acd10', name: 'Ensayos' }, { id: 'acd11', name: 'Panel de discusión' }
    ],
    APEX: [
      { id: 'apex1', name: 'Aplicación de contenidos' }, { id: 'apex2', name: 'Talleres en equipo' },
      { id: 'apex3', name: 'Resolución de problemas' }, { id: 'apex4', name: 'Comprobación' },
      { id: 'apex5', name: 'Experimentación' }, { id: 'apex6', name: 'Replicación de casos' },
      { id: 'apex7', name: 'Práctica de laboratorio' }, { id: 'apex8', name: 'Simulación' }, { id: 'apex9', name: 'Talleres individuales' }
    ],
    AAUT: [
      { id: 'aaut1', name: 'Escritura académica' }, { id: 'aaut2', name: 'Elaboración de informes' },
      { id: 'aaut3', name: 'Preparación para lecciones' }, { id: 'aaut4', name: 'Preparación de exámenes' },
      { id: 'aaut5', name: 'Lecturas complementarias' }, { id: 'aaut6', name: 'Resolución de ejercicios' }
    ]
  };

  var FULL_RAAU_TI = {
    'INGLÉS I': ['Utiliza expresiones de uso común para comunicar ideas sencillas sobre actividades cotidianas, descripciones familiares y opiniones básicas.', 'rac1'],
    'FUNDAMENTOS DE PROGRAMACIÓN': ['Implementa algoritmos estructurados para computadoras eficientes para la resolución de problemas planteados.', 'rac3'],
    'EDUCACIÓN FÍSICA': ['Aplica métodos teóricos y prácticos para facilitar la comprensión de las diferentes técnicas de los deportes.', 'rac4'],
    'SOSTENIBILIDAD AMBIENTAL': ['Aplica los principios y normas ambientales para la adopción de alternativas de evaluación, control y mitigación de impactos ambientales contribuyendo al equilibrio ecológico, económico, y social.', 'rac4'],
    'COMUNICACIÓN ORAL Y ESCRITA': ['Aplica los conceptos de la comunicación oral y escrita en diversos contextos sociales y profesionales.', 'rac1'],
    'QUÍMICA': ['Evalúa las reacciones químicas inorgánicas en el laboratorio caracterizando las funciones químicas.', 'rac2'],
    'ÁLGEBRA LINEAL': ['Comprende las representaciones algebraicas y geométricas de vectores en varias dimensiones y sus operaciones.', 'rac2'],
    'FÍSICA MECÁNICA': ['Aplica los principios fundamentales de la física mecánica en la resolución de problemas relacionados con el movimiento y las fuerzas en sistemas físicos.', 'rac2'],
    'INGLÉS II': ['Utiliza vocabulario y frases simples sobre temas de interés personal comunicando ideas básicas y comunes con tiempos gramaticales como presente, pasado y futuro.', 'rac1'],
    'METODOLOGÍA DE LA INVESTIGACIÓN': ['Aplica las metodologías de investigación en las propuestas de proyectos tecnológicos.', 'rac2'],
    'CÁLCULO DE UNA VARIABLE': ['Aplica los conocimientos del cálculo para la resolución de problemas matemáticos con aplicaciones tecnológicas en su entorno.', 'rac2'],
    'ADMINISTRACIÓN DE SISTEMAS OPERATIVOS': ['Configura sistemas operativos para la solución de problemas tecnológicos en diferentes plataformas.', 'rac2'],
    'ESTADÍSTICA Y PROBABILIDAD': ['Aplica conceptos estadísticos y probabilísticos para el tratamiento de datos en eventos aleatorios.', 'rac2'],
    'PROGRAMACIÓN': ['Implementa aplicaciones de escritorio para ambientes colaborativos en desarrollo de soluciones informáticas.', 'rac3'],
    'INGLÉS III': ['Habla en diversos contextos sobre situaciones reales, verdades científicas y hechos describiendo eventos pasados, presentes y futuros con claridad.', 'rac1'],
    'SISTEMAS DE COMUNICACIÓN': ['Interpreta las técnicas de transmisión, modulación y multiplexación para la transmisión de señales analógicas y digitales.', 'rac5'],
    'FUNDAMENTOS DE BASE DE DATOS': ['Diseña modelos bases de datos relacionales para la manipulación de los datos en la resolución de problemas del entorno.', 'rac5'],
    'ECUACIONES DIFERENCIALES': ['Aplica métodos de ecuaciones diferenciales en la resolución de problemas reales en el área de las tecnologías de la información.', 'rac2'],
    'CÁLCULO DE VARIAS VARIABLES': ['Aplica los conceptos del cálculo diferencial e integral en problemas reales que involucran múltiples variables.', 'rac2'],
    'GESTIÓN DE PROYECTOS TI': ['Diseña planes de proyecto que garanticen la implementación de soluciones tecnológicas.', 'rac2'],
    'REALIDAD SOCIOECONÓMICA E INTERCULTURALIDAD': ['Relaciona los conceptos entre la estructura de la economía, cultura y el proceso social en el contexto ecuatoriano.', 'rac4'],
    'INGLÉS IV': ['Construye ideas coherentes con un lenguaje claro y preciso desarrollando el pensamiento crítico y argumentativo.', 'rac1'],
    'MATEMÁTICA AVANZADA': ['Integra modelos de matemática avanzada en la resolución de problemas complejos de ingeniería en TI.', 'rac2'],
    'FUNDAMENTOS DE REDES': ['Diseña redes de computadoras basados en modelos OSI, TCP/IP para entornos locales.', 'rac5'],
    'DISEÑO DE EXPERIENCIA DE USUARIO': ['Aplica los principios de usabilidad, accesibilidad y diseño centrado en el usuario en la creación de prototipos.', 'rac3'],
    'ADMINISTRACIÓN DE BASE DE DATOS': ['Diseña base de datos avanzadas SQL y no SQL para soluciones tecnológicas.', 'rac5'],
    'MÉTODOS NUMÉRICOS': ['Aplica los métodos numéricos para resolución de problemas de un paso y multipaso aplicados en tecnologías informáticas.', 'rac2'],
    'GESTIÓN ADMINISTRATIVA': ['Identifica riesgos y procesos de control estratégico con la aplicación de medidas preventivas para organizaciones.', 'rac2'],
    'CONMUTACIÓN Y ENRUTAMIENTO': ['Diseña topologías de redes de datos para la conmutación y enrutamiento de paquetes en diferentes ambientes.', 'rac5'],
    'TECNOLOGÍA WEB': ['Implementa aplicaciones web para la solución de problemas tecnológicos en el entorno.', 'rac3'],
    'BIG DATA': ['Utiliza aplicaciones del ecosistema de Big Data para la implementación de soluciones escalables.', 'rac5'],
    'TECNOLOGIA Y DISEÑO MULTIMEDIA': ['Utiliza software y herramientas multimedia para creación y edición de contenido multimedia e inmersivo.', 'rac3'],
    'INFRAESTRUCTURA TI': ['Implementa infraestructura TI para soluciones escalables que atiendan necesidades empresariales.', 'rac2'],
    'ÉTICA Y RELACIONES HUMANAS': ['Aplica los principios éticos universales en los diferentes ambientes sociales y laborales para una convivencia armónica.', 'rac4'],
    'ESCALABILIDAD DE REDES': ['Implementa redes escalables con alta disponibilidad y redundancia para pequeñas y medianas empresas.', 'rac5'],
    'COMPUTACIÓN MÓVIL': ['Desarrolla aplicaciones móviles adaptables para diferentes plataformas móviles.', 'rac3'],
    'MACHINE LEARNING': ['Analiza patrones de comportamiento de datos en la implementación de modelos predictivos integrados en producción.', 'rac2'],
    'INTEROPERABILIDAD DE PLATAFORMAS': ['Analiza las arquitecturas orientadas a servicios (SOA) y los servicios de integración SOAP y REST.', 'rac2'],
    'EMPRENDIMIENTO': ['Diseña planes de negocios tecnológicos, innovadores y sostenibles para diferentes grupos humanos.', 'rac4'],
    'ITINERARIO 1: Ethical Hacking': ['Aplica técnicas de hacking ético en la identificación de vulnerabilidades de sistemas informáticos y redes.', 'rac2'],
    'ITINERARIO 1: Criptografía': ['Aplica criptosistemas y protocolos de criptografía para el aseguramiento de infraestructuras tecnológicas.', 'rac2'],
    'BUSINESS INTELLIGENCE': ['Implementa entornos de visualización y análisis de negocios para la toma de decisiones estratégicas.', 'rac2'],
    'SEGURIDAD TI': ['Implementa medidas de seguridad efectivas que salvaguarden recursos y procesos críticos dentro de una organización.', 'rac2'],
    'APLICACIONES IoT': ['Implementa soluciones tecnológicas innovadoras basadas en IoT para sectores industrial, empresarial y social.', 'rac3'],
    'FORMULACIÓN DE TRABAJO DE TITULACIÓN': ['Desarrolla la propuesta de trabajo de titulación acorde a la normativa vigente.', 'rac2'],
    'CLOUD COMPUTING': ['Aplica arquitecturas en la nube para la optimización de recursos y la escalabilidad de servicios de TI.', 'rac2'],
    'AUDITORÍA TI': ['Aplica normas de auditoría TI en los sistemas de información.', 'rac2'],
    'GOBIERNO TI': ['Identifica marcos de referencia, estándares y mejores prácticas relacionadas al gobierno TI.', 'rac2'],
    'SISTEMAS DE INFORMACIÓN GEOGRÁFICA': ['Desarrolla soluciones tecnológicas integrales basadas en SIG para análisis avanzado geoespacial.', 'rac3'],
    'ITINERARIO 2: Deep Learning 2': ['Implementa modelos de inteligencia artificial con datos multimodales para automatización de procesos.', 'rac2'],
    'ITINERARIO 2: Deep Learning 1': ['Implementa modelos de inteligencia artificial para automatización de procesos con datos 2D y 3D.', 'rac2'],
    'TRABAJO DE TITULACIÓN': ['Desarrolla el trabajo de titulación de acuerdo a la modalidad seleccionada.', 'rac2']
  };

  Object.keys(FULL_RAAU_TI).forEach(function (subject) {
    var pair = FULL_RAAU_TI[subject];
    DB_ESPOCH['TECNOLOGÍAS DE LA INFORMACIÓN'].asignaturas[subject] = {
      raau: [{ code: 'RAAU1', description: pair[0], racId: pair[1] }]
    };
  });

  var COMPONENT_WEIGHTS = { ACD: 3.5, APEX: 3.5, AAUT: 3.0 };
  var COMPONENT_COLORS = { ACD: '#3b82f6', APEX: '#22c55e', AAUT: '#f59e0b' };
  var COMPONENT_LABELS = { ACD: 'Aprendizaje en Contacto con el Docente', APEX: 'Aprendizaje Práctico Experimental', AAUT: 'Aprendizaje Autónomo' };
  var COMPONENTS = ['ACD', 'APEX', 'AAUT'];
  // Único usuario base: el coordinador (clave temporal de prueba).
  // Los docentes se crean/importan por el coordinador y se guardan en STATE.docentes.
  var COORDINADOR = { email: 'ppaguay@espoch.edu.ec', password: 'paguay2026', role: 'coordinador', name: 'PAUL PAGUAY', cedula: '' };
  function getDocentes() { return STATE.docentes || []; }
  function allUsers() { return [COORDINADOR].concat(getDocentes()); }
  function findUserByEmail(email) {
    var lower = String(email || '').toLowerCase();
    return allUsers().find(function (u) { return u.email.toLowerCase() === lower; }) || null;
  }
  // Asignaturas del usuario actual. TODOS (incluido el coordinador, que también
  // es docente) configuran únicamente sus propias asignaturas asignadas.
  function myAssignments() {
    var email = STATE.currentUser && STATE.currentUser.email;
    return (STATE.teacherAssignments || []).filter(function (a) { return a.docenteEmail === email; });
  }
  var ROLE_LABEL = { admin: 'Administrador', docente: 'Docente', coordinador: 'Coordinador' };

  var DEFAULT_STATE = {
    courseConfig: { periodoAcademico: '', facultad: 'SEDE ORELLANA', carrera: '', asignatura: '', docente: '', pao: '', aporte: 'FIN DE CICLO' },
    selectedRACIds: [], raauEntries: [], activities: [],
    configLocked: false, activeConfigId: '', editingConfigId: '',
    savedConfigs: [],
    studentsByConfig: {},
    gradesByConfig: {},
    teacherAssignments: [],
    docentes: [],
    students: [],
    grades: [],
    recentActivity: [],
    currentUser: null
  };

  var STATE = {};
  window.STATE = STATE; // window.STATE y STATE apuntan al mismo objeto
  var CAREER_RACS = [];
  var dbPushTimer = null;
  // No se empuja a la BD hasta haber HIDRATADO primero. Evita que un guardado
  // temprano (con el estado aún vacío) sobrescriba/borre datos en la BD.
  var dbReady = false;
  function save() {
    pushToDb();
  }

  // Empuja (con "debounce") los datos propios del usuario a PostgreSQL vía BFF.
  function pushToDb() {
    if (!STATE.currentUser) return;
    clearTimeout(dbPushTimer);
    dbPushTimer = setTimeout(doPushToDb, 800);
  }
  async function doPushToDb() {
    var u = STATE.currentUser;
    if (!u) return;
    if (!dbReady) { dbReady = true; } // si nunca se hidrató, igual permitir escritura
    // Mantén sincronizado el config activo antes de enviar.
    persistActiveConfigData();
    var misConfigs = (STATE.savedConfigs || []).filter(function (c) { return (c.ownerEmail || '') === u.email; });
    var ids = {};
    misConfigs.forEach(function (c) { ids[c.id] = true; });
    if (STATE.activeConfigId) ids[STATE.activeConfigId] = true;
    var students = {}, grades = {};
    Object.keys(ids).forEach(function (id) {
      if (STATE.studentsByConfig[id]) students[id] = STATE.studentsByConfig[id];
      if (STATE.gradesByConfig[id]) grades[id] = STATE.gradesByConfig[id];
    });
    var payload = {
      email: u.email,
      role: u.role,
      savedConfigs: misConfigs,
      studentsByConfig: students,
      gradesByConfig: grades
    };
    if (u.role === 'coordinador') {
      payload.docentes = STATE.docentes;
      payload.teacherAssignments = STATE.teacherAssignments;
    }
    try { await oasis.putStore(payload); } catch { /* sin conexión: no se guarda */ }
  }
  async function hydrateFromDb() {
    var u = STATE.currentUser;
    if (!u) { dbReady = true; return; }
    var store;
    try { store = await oasis.getStore({ email: u.email, role: u.role }); } catch { dbReady = true; return; }
    if (!store) { dbReady = true; return; }
    if (store.disabled) { dbReady = true; return; }
    if (Array.isArray(store.docentes) && store.docentes.length > 0) {
      var byEmail = {};
      (STATE.docentes || []).forEach(function (d) { byEmail[d.email] = d; });
      STATE.docentes = store.docentes.map(function (d) {
        var local = byEmail[d.email];
        var pw = (local && local.password) || '';
        if (!pw && d.password_set) pw = 'saved';
        return {
          email: d.email, nombre: d.nombre, name: d.nombre, cedula: d.cedula || '',
          role: d.rol || 'docente', rol: d.rol || 'docente',
          password: pw
        };
      });
    }
    if (Array.isArray(store.teacherAssignments) && store.teacherAssignments.length > 0)
      STATE.teacherAssignments = store.teacherAssignments;
    if (Array.isArray(store.savedConfigs) && store.savedConfigs.length > 0) {
      STATE.savedConfigs = store.savedConfigs;
    }
    if (store.studentsByConfig && Object.keys(store.studentsByConfig).length > 0)
      STATE.studentsByConfig = store.studentsByConfig;
    if (store.gradesByConfig && Object.keys(store.gradesByConfig).length > 0)
      STATE.gradesByConfig = store.gradesByConfig;
    if (STATE.activeConfigId) {
      cargarPaoActivo();
    }
    rerenderActive();
    dbReady = true;
  }

  function rerenderActive() {
    updateSidebar();
    var page = STATE.currentPage;
    if (!page) {
      var active = document.querySelector('.page.active');
      if (!active) return;
      page = active.id.replace('page-', '');
    }
    renderPage(page);
  }
  function load() {
    STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));
    window.STATE = STATE;
  }
  load();

  function getActiveConfigKey() {
    return STATE.activeConfigId || '';
  }

  function loadActiveConfigData() {
    var key = getActiveConfigKey();
    if (!key) return;
    if (!STATE.studentsByConfig[key]) STATE.studentsByConfig[key] = [];
    if (!STATE.gradesByConfig[key]) STATE.gradesByConfig[key] = [];
    STATE.students = JSON.parse(JSON.stringify(STATE.studentsByConfig[key]));
    STATE.grades = JSON.parse(JSON.stringify(STATE.gradesByConfig[key]));
  }

  function persistActiveConfigData() {
    var key = getActiveConfigKey();
    if (!key) return;
    STATE.studentsByConfig[key] = JSON.parse(JSON.stringify(STATE.students));
    STATE.gradesByConfig[key] = JSON.parse(JSON.stringify(STATE.grades));
  }
  if (STATE.activeConfigId) loadActiveConfigData();

  // ================================================================
  // SISTEMA DE PAO ACTIVO — fuente única de verdad
  // ================================================================

  function getPaoActivo() {
    if (!STATE.activeConfigId) return null;
    var found = STATE.savedConfigs.find(function (c) { return c.id === STATE.activeConfigId; });
    return found || null;
  }

  function setPaoActivo(configId) {
    if (STATE.currentUser && STATE.currentUser.role === 'docente') {
      var found = STATE.savedConfigs.find(function (c) { return c.id === configId; });
      if (found && (found.ownerEmail || '') !== STATE.currentUser.email) {
        showToast('No puede abrir configuraciones de otros docentes.', 'error');
        return false;
      }
    }
    STATE.activeConfigId = configId;
    return cargarPaoActivo();
  }

  function cargarPaoActivo() {
    if (!STATE.activeConfigId) return false;
    var found = STATE.savedConfigs.find(function (c) { return c.id === STATE.activeConfigId; });
    if (!found) {
      STATE.activeConfigId = '';
      save();
      return false;
    }
    STATE.courseConfig = JSON.parse(JSON.stringify(found.courseConfig));
    STATE.selectedRACIds = found.selectedRACIds.slice();
    STATE.raauEntries = JSON.parse(JSON.stringify(found.raauEntries));
    STATE.activities = JSON.parse(JSON.stringify(found.activities));
    STATE.configLocked = true;
    if (STATE.courseConfig.carrera && DB_ESPOCH[STATE.courseConfig.carrera]) {
      CAREER_RACS = DB_ESPOCH[STATE.courseConfig.carrera].racs || [];
    }
    loadActiveConfigData();
    save();
    return true;
  }

  function sincronizarPaoActivoConUI() {
    updateSidebar();
    renderPaoSidebarList();
    renderSavedConfigs();
    var active = document.querySelector('.page.active');
    if (active) {
      var id = active.id.replace('page-', '');
      if (id.indexOf('coord-') === 0 || id === 'coordinacion') id = id === 'coordinacion' ? 'coordinacion' : id;
      renderPage(id);
    }
  }

  function cargarDatosDelPao(configId) {
    if (!setPaoActivo(configId)) return false;
    sincronizarPaoActivoConUI();
    showToast('PAO seleccionado correctamente.', 'success');
    return true;
  }

  function showToast(msg, type) {
    var toastEl = document.getElementById('toast');
    var text = document.getElementById('toast-text');
    if (!toastEl || !text) return;
    text.textContent = msg;
    toastEl.style.background = type === 'error' ? 'var(--espoch-red)' : 'var(--espoch-green)';
    toastEl.classList.add('show');
    setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  }

  function closeModal(e) {
    if (e && e.target !== document.getElementById('modal-overlay')) return;
    var overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  function showSuccessModal() {
    launchConfetti();
    var totalActs = STATE.activities.length;
    var asig = STATE.courseConfig.asignatura || 'la asignatura';
    var el = document.getElementById('success-modal-content');
    if (!el) return;
    el.innerHTML =
      '<div class="success-checkmark"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      '<div class="success-title">¡Configuración Guardada!</div>' +
      '<div class="success-text">Se han registrado <strong>' + totalActs + ' actividades</strong> de evaluación para <strong>' + asig + '</strong>.<br><br>Los componentes ACD (' + COMPONENT_WEIGHTS.ACD + ' pts), APEX (' + COMPONENT_WEIGHTS.APEX + ' pts) y AAUT (' + COMPONENT_WEIGHTS.AAUT + ' pts) están configurados correctamente.</div>' +
      '<div style="margin-top:20px"><button class="btn btn-success" onclick="onConfigConfirmContinue()" style="margin:0 auto">Confirmar y Gestionar</button></div>';
    document.getElementById('success-modal-overlay').classList.add('open');
  }

  function closeSuccessModal(e) {
    if (e && e.target !== document.getElementById('success-modal-overlay')) return;
    var overlay = document.getElementById('success-modal-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  function launchConfetti() {
    var canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var particles = [];
    var colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#7c3aed', '#003366'];
    for (var i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2, y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 0.5) * 16 - 5,
        w: Math.random() * 8 + 3, h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.15, opacity: 1
      });
    }
    var frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = false;
      particles.forEach(function (p) {
        p.x += p.vx; p.vy += p.gravity; p.y += p.vy;
        p.rotation += p.rotSpeed; p.vx *= 0.99;
        if (frame > 60) p.opacity -= 0.01;
        if (p.opacity <= 0) return;
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (alive && frame < 200) requestAnimationFrame(animate);
      else canvas.style.display = 'none';
    }
    animate();
  }

  function openModal(title, bodyHtml, actions) {
    var modalEl = document.querySelector('#modal-overlay .modal');
    if (modalEl) modalEl.style.maxWidth = ''; // ancho por defecto (lo amplía quien lo necesite)
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-actions').innerHTML = actions.map(function (a, i) {
      return '<button class="btn ' + a.cls + '" onclick="_modalAction(' + i + ')">' + a.label + '</button>';
    }).join('');
    window._modalActions = actions;
    document.getElementById('modal-overlay').classList.add('open');
  }

  window._modalAction = function (i) {
    var a = window._modalActions[i];
    if (typeof a.action === 'function') a.action();
    else if (a.action === 'close') closeModal();
  };

  function updateSidebar() {
    var set = function (id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
    if (!STATE.activeConfigId) {
      set('sb-asignatura', 'Seleccione un PAO');
      set('sb-pao', 'PAO —');
      set('sb-aporte', '—');
      set('sb-docente', (STATE.currentUser && STATE.currentUser.name) || '—');
      var roleEl = document.getElementById('sb-role');
      if (roleEl) {
        var roleTxt = ROLE_LABEL[(STATE.currentUser && STATE.currentUser.role) || ''] || 'Invitado';
        roleEl.textContent = roleTxt;
      }
      renderPaoSidebarList();
      return;
    }
    var c = STATE.courseConfig;
    set('sb-asignatura', c.asignatura || '—');
    set('sb-pao', 'PAO ' + (c.pao || '—'));
    set('sb-aporte', c.aporte || '—');
    set('sb-docente', c.docente || ((STATE.currentUser && STATE.currentUser.name) || '—'));
    var roleEl = document.getElementById('sb-role');
    if (roleEl) {
      var roleTxt = ROLE_LABEL[(STATE.currentUser && STATE.currentUser.role) || ''] || 'Invitado';
      var email = STATE.currentUser && STATE.currentUser.email;
      if (email) {
        roleEl.innerHTML = roleTxt + ' · <a href="' + WEBMAIL_URL + '" target="_blank" rel="noopener" ' +
          'title="' + email + '" style="color:rgba(255,255,255,.6);text-decoration:underline">WebMail</a>';
      } else {
        roleEl.textContent = roleTxt;
      }
    }
    renderPaoSidebarList();
  }

  var _paoDropdownOpen = false;

  function renderPaoSidebarList() {
    var container = document.getElementById('sidebar-pao-list');
    if (!container) return;
    var email = STATE.currentUser && STATE.currentUser.email;
    if (!email) {
      container.innerHTML = '';
      return;
    }
    var isCoord = STATE.currentUser && STATE.currentUser.role === 'coordinador';
    var configs = (STATE.savedConfigs || []).filter(function (c) {
      return isCoord || (c.ownerEmail || '') === email;
    });
    if (configs.length === 0) {
      container.innerHTML = '<div class="pao-sidebar-empty">No existen PAOs configurados.<br>Cree uno desde Configuraci\u00f3n.</div>';
      return;
    }
    var sorted = configs.slice().sort(function (a, b) {
      return (b.savedAt || '').localeCompare(a.savedAt || '');
    });
    var activeId = STATE.activeConfigId;
    var activeCfg = activeId ? sorted.find(function (c) { return c.id === activeId; }) : null;
    var selectText = activeCfg
      ? 'PAO ' + (activeCfg.courseConfig.pao || '—') + ' — ' + (activeCfg.courseConfig.asignatura || 'Sin asignatura')
      : 'Seleccionar PAO';

    var html = '<div class="pao-dropdown' + (activeCfg ? ' has-active' : '') + '">';
    html += '<div class="pao-dropdown-toggle" onclick="togglePaoDropdown(event)">';
    html += '<span class="pao-dropdown-text">' + selectText + '</span>';
    html += '<svg class="pao-dropdown-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
    html += '</div>';
    html += '<div class="pao-dropdown-menu' + (_paoDropdownOpen ? ' open' : '') + '" id="pao-dropdown-menu">';
    html += sorted.map(function (cfg) {
      var isActive = cfg.id === activeId;
      var pao = cfg.courseConfig.pao || '—';
      var asig = cfg.courseConfig.asignatura || 'Sin asignatura';
      var aporte = cfg.courseConfig.aporte || '—';
      return '<div class="pao-dropdown-item' + (isActive ? ' active' : '') + '" onclick="selectPaoFromDropdown(\'' + cfg.id + '\', event)">' +
        (isActive ? '<svg class="pao-dropdown-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--espoch-red)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
        '<div class="pao-dropdown-item-content"><span class="pao-dropdown-item-pao">PAO ' + pao + '</span><span class="pao-dropdown-item-asig">' + asig + '</span></div>' +
        '<span class="pao-dropdown-item-aporte">' + aporte + '</span>' +
        '</div>';
    }).join('');
    html += '</div></div>';
    container.innerHTML = html;
  }

  function togglePaoDropdown(event) {
    if (event) event.stopPropagation();
    _paoDropdownOpen = !_paoDropdownOpen;
    var menu = document.getElementById('pao-dropdown-menu');
    if (menu) menu.classList.toggle('open', _paoDropdownOpen);
    var toggle = document.querySelector('.pao-dropdown-toggle');
    if (toggle) toggle.classList.toggle('open', _paoDropdownOpen);
  }

  function closePaoDropdown() {
    _paoDropdownOpen = false;
    var menu = document.getElementById('pao-dropdown-menu');
    if (menu) menu.classList.remove('open');
    var toggle = document.querySelector('.pao-dropdown-toggle');
    if (toggle) toggle.classList.remove('open');
  }

  function selectPaoFromDropdown(configId, event) {
    if (typeof window.__closeSidebar === 'function') window.__closeSidebar();
    if (event) event.stopPropagation();
    closePaoDropdown();
    if (configId === STATE.activeConfigId) return;
    if (STATE.currentUser && STATE.currentUser.role === 'docente') {
      var found = STATE.savedConfigs.find(function (c) { return c.id === configId; });
      if (found && (found.ownerEmail || '') !== STATE.currentUser.email) {
        showToast('No puede abrir configuraciones de otros docentes.', 'error');
        return;
      }
    }
    if (!setPaoActivo(configId)) return;
    sincronizarPaoActivoConUI();
    showToast('PAO seleccionado correctamente.', 'success');
    syncStudentsFromOasis(configId).then(function () { renderEstudiantes(); }).catch(function () {});
  }

  function navigateToNewConfig() {
    unlockNewConfig();
    navigate('configuracion');
  }

  function cfgStartNew() {
    unlockNewConfig();
    navigate('configuracion');
  }

  function roleCanAccess(page) {
    var role = STATE.currentUser && STATE.currentUser.role;
    if (!role) return false;
    if (page.indexOf('coord-') === 0) return role === 'coordinador' || role === 'admin';
    if (page.indexOf('consulta-') === 0) return role === 'coordinador' || role === 'admin';
    if (role === 'docente') return page !== 'coordinacion';
    return true;
  }

  function applyRoleUI() {
    var role = STATE.currentUser && STATE.currentUser.role;
    var appShell = document.getElementById('app-shell');
    var auth = document.getElementById('auth-screen');
    if (!role) {
      if (auth) auth.style.display = 'flex';
      if (appShell) appShell.style.display = 'none';
      return;
    }
    if (auth) auth.style.display = 'none';
    if (appShell) appShell.style.display = 'flex';
    var navCoord = document.getElementById('nav-coordinacion');
    if (navCoord) navCoord.style.display = role === 'docente' ? 'none' : '';
    var coordItems = ['nav-coord-asig', 'nav-coord-rac', 'nav-coord-raau', 'nav-coord-docentes'];
    coordItems.forEach(function (id) {
      var item = document.getElementById(id);
      if (item) item.style.display = (role === 'coordinador' || role === 'admin') ? '' : 'none';
    });
    var consultaItems = ['nav-consulta-divider', 'nav-consulta-section',
      'nav-consulta-sede', 'nav-consulta-info', 'nav-consulta-est'];
    consultaItems.forEach(function (id) {
      var item = document.getElementById(id);
      if (item) item.style.display = (role === 'coordinador' || role === 'admin') ? '' : 'none';
    });
  }

  function setAuthLoading(loading) {
    var btn = document.querySelector('.auth-main-btn');
    if (btn) { btn.disabled = loading; btn.textContent = loading ? 'Verificando…' : 'Ingresar'; }
  }

  function deriveRole(roles) {
    var names = (roles || []).map(function (r) { return (r.nombreRol || '').toUpperCase(); });
    if (names.some(function (n) { return n.indexOf('COORDINADOR') !== -1; })) return 'coordinador';
    if (names.some(function (n) { return n.indexOf('DECANO') !== -1 || n.indexOf('ADMIN') !== -1; })) return 'admin';
    return 'docente';
  }

  function buildUserFromOasis(loginValue, result) {
    var perfil = (result && result.perfil) || {};
    var roles = (result && result.roles) || [];
    var name = ((perfil.nombres || '') + ' ' + (perfil.apellidos || '')).trim() || loginValue;
    return {
      email: perfil.email || loginValue,
      role: deriveRole(roles),
      name: name,
      cedula: perfil.cedula || '',
      roles: roles,
      source: 'oasis'
    };
  }

  // Cada usuario tiene su propio borrador de configuración y sus propios datos.
  // Si la configuración activa no le pertenece, la reiniciamos al ingresar.
  function resetDraftIfNotMine() {
    var email = STATE.currentUser && STATE.currentUser.email;
    var active = (STATE.savedConfigs || []).find(function (c) { return c.id === STATE.activeConfigId; });
    var mineActive = active && (active.ownerEmail || '') === email;
    if (mineActive) { loadActiveConfigData(); return; }
    STATE.configLocked = false;
    STATE.activeConfigId = '';
    STATE.courseConfig = {
      periodoAcademico: (STATE.oasisPeriodo && STATE.oasisPeriodo.descripcion) || '',
      facultad: 'SEDE ORELLANA', carrera: '', asignatura: '',
      docente: (STATE.currentUser && STATE.currentUser.name) || '', pao: '', aporte: 'FIN DE CICLO'
    };
    STATE.selectedRACIds = [];
    STATE.raauEntries = [];
    STATE.activities = [];
    STATE.students = [];
    STATE.grades = [];
    save();
  }

  function finishLogin(user) {
    STATE.currentUser = user;
    resetDraftIfNotMine();
    save();
    var msgEl = document.getElementById('auth-msg');
    if (msgEl) msgEl.textContent = '';
    applyRoleUI();
    updateSidebar();
    navigate(user.role === 'coordinador' ? 'coord-asignaturas' : 'dashboard');
    showToast('Bienvenido, ' + user.name, 'success');
    autoLoadPeriodo();
    hydrateFromDb(); // trae datos persistidos (configs, notas, asignaciones)
  }

  // Cuenta local (coordinador o docente creado por el coordinador).
  function findLocalUser(email, pass) {
    var u = findUserByEmail(email);
    if (u && u.password === pass) {
      return { email: u.email, role: u.role, name: u.name, cedula: u.cedula || '', source: 'local' };
    }
    return null;
  }

  async function doLogin() {
    var emailEl = document.getElementById('auth-email');
    var passEl = document.getElementById('auth-pass');
    var msgEl = document.getElementById('auth-msg');
    var email = (emailEl && emailEl.value || '').trim();
    var pass = (passEl && passEl.value || '').trim();
    if (!email || !pass) {
      if (msgEl) msgEl.textContent = 'Ingrese su correo institucional y contraseña.';
      return;
    }
    // 1) Cuentas locales en memoria (coordinador / docentes de esta sesión). Offline-proof.
    var local = findLocalUser(email, pass);
    if (local) { finishLogin(local); return; }
    setAuthLoading(true);
    try {
      // 2) Login contra la base de datos (docentes creados por el coordinador, otra PC).
      try {
        var dbUser = await oasis.loginDb(email, pass);
        if (dbUser && !dbUser.disabled) { finishLogin(dbUser); return; }
      } catch { /* credenciales no válidas en BD o sin BD: probamos OASIS */ }
      // 4) Autenticación real contra OASIS.
      var result = await oasis.login(email, pass);
      finishLogin(buildUserFromOasis(email, result));
    } catch (err) {
      if (msgEl) {
        msgEl.textContent = err && err.offline
          ? 'No se pudo contactar el servidor. Verifique su conexión.'
          : (err.message || 'Usuario o contraseña incorrectos.');
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function autoLoadPeriodo() {
    try {
      var p = await oasis.getPeriodoActual();
      if (p && p.descripcion) {
        STATE.oasisPeriodo = p;
        if (!STATE.courseConfig.periodoAcademico) STATE.courseConfig.periodoAcademico = p.descripcion;
        save();
        var el = document.getElementById('cfg-periodo');
        if (el) el.value = STATE.courseConfig.periodoAcademico;
      }
    } catch { /* sin conexión: el período se ingresa manualmente */ }
  }

  // Carga la credencial temporal del coordinador en el formulario de acceso.
  function fillDemoCredentials() {
    var emailEl = document.getElementById('auth-email');
    var passEl = document.getElementById('auth-pass');
    var msgEl = document.getElementById('auth-msg');
    if (emailEl) emailEl.value = COORDINADOR.email;
    if (passEl) passEl.value = COORDINADOR.password;
    if (msgEl) msgEl.textContent = 'Credencial temporal del coordinador cargada.';
  }

  function doLogout() {
    STATE.currentUser = null;
    save();
    applyRoleUI();
    updateSidebar();
    var msgEl = document.getElementById('auth-msg');
    if (msgEl) msgEl.textContent = '';
    var passEl = document.getElementById('auth-pass');
    if (passEl) passEl.value = '';
  }

  // Configuración de perfil del usuario actual (datos + cambio de contraseña).
  function openProfile() {
    var u = STATE.currentUser;
    if (!u) return;
    var local = findUserByEmail(u.email);
    var body = '<div style="font-size:.82rem;color:var(--gray-700);line-height:1.8">' +
      '<div><strong>Nombre:</strong> ' + (u.name || '—') + '</div>' +
      '<div><strong>Correo:</strong> ' + (u.email || '—') + '</div>' +
      (u.cedula ? '<div><strong>Cédula:</strong> ' + u.cedula + '</div>' : '') +
      '<div><strong>Rol:</strong> ' + (ROLE_LABEL[u.role] || u.role) + '</div>' +
      '<div><strong>Origen:</strong> ' + (u.source === 'oasis' ? 'OASIS (institucional)' : 'Local') + '</div></div>';
    if (local) {
      body += '<div style="margin-top:14px;border-top:1px solid var(--gray-200);padding-top:12px">' +
        '<div style="font-weight:600;font-size:.82rem;margin-bottom:8px">Cambiar mi contraseña</div>' +
        '<div class="form-group"><input class="form-input" id="prof-pass" type="text" placeholder="Nueva contraseña"></div></div>';
    } else {
      body += '<div class="info-box" style="margin-top:12px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><p>La contraseña de cuentas OASIS se gestiona en el sistema institucional.</p></div>';
    }
    var actions = [{ label: 'Cerrar', cls: 'btn-ghost', action: 'close' }];
    var misAsig = myAssignments();
    if (u.cedula && misAsig.length) {
      actions.push({ label: 'Ver mi horario', cls: 'btn-edit', action: function () { closeModal(); verHorario(u.name, u.cedula, misAsig); } });
    }
    if (local) {
      actions.push({ label: 'Guardar contraseña', cls: 'btn-success', action: function () {
        var p = document.getElementById('prof-pass').value.trim();
        if (!p) { showToast('Ingrese una contraseña.', 'error'); return; }
        local.password = p;
        save();
        closeModal();
        showToast('Contraseña actualizada.', 'success');
      } });
    }
    openModal('Mi perfil', body, actions);
  }

  function onCarreraChange() {
    var carreraValue = document.getElementById('cfg-carrera').value;
    var paoSelect = document.getElementById('cfg-pao');
    var asigSelect = document.getElementById('cfg-asignatura');
    paoSelect.innerHTML = '<option value="">-- Seleccione PAO --</option>';
    asigSelect.innerHTML = '<option value="">-- Seleccione primero Carrera y PAO --</option>';
    paoSelect.disabled = true;
    asigSelect.disabled = true;
    if (!carreraValue) return;
    var carreraData = DB_ESPOCH[carreraValue];
    CAREER_RACS = (carreraData && carreraData.racs) || [];
    if (STATE.currentUser) {
      // Cada usuario solo puede elegir PAOs donde tiene asignaturas asignadas.
      var paos = [];
      myAssignments().filter(function (a) { return a.carrera === carreraValue; }).forEach(function (a) {
        if (paos.indexOf(String(a.pao)) === -1) paos.push(String(a.pao));
      });
      paos.sort();
      paos.forEach(function (p) { paoSelect.innerHTML += '<option value="' + p + '">PAO ' + p + '</option>'; });
    } else if (carreraData) {
      paoSelect.innerHTML += '<option value="NIVELACIÓN">NIVELACIÓN</option>';
      for (var p = 1; p <= carreraData.maxPao; p++) paoSelect.innerHTML += '<option value="' + p + '">PAO ' + p + '</option>';
    }
    paoSelect.disabled = false;
    // Solo reiniciamos RAC/RAAU/actividades cuando la carrera REALMENTE cambia
    // (no al re-renderizar el paso con la misma carrera).
    if (STATE.courseConfig.carrera !== carreraValue) {
      STATE.courseConfig.carrera = carreraValue;
      STATE.selectedRACIds = [];
      STATE.raauEntries = [];
      STATE.activities = [];
      save();
    }
  }

  function onPaoChange() {
    var carreraValue = document.getElementById('cfg-carrera').value;
    var paoValue = document.getElementById('cfg-pao').value;
    var asigSelect = document.getElementById('cfg-asignatura');
    asigSelect.innerHTML = '<option value="">-- Seleccione Asignatura --</option>';
    if (!paoValue) { asigSelect.disabled = true; return; }
    var materias;
    if (STATE.currentUser) {
      materias = myAssignments()
        .filter(function (a) { return a.carrera === carreraValue && String(a.pao) === String(paoValue); })
        .map(function (a) { return a.asignatura; });
      materias = materias.filter(function (m, i) { return materias.indexOf(m) === i; });
    } else {
      materias = (DB_ESPOCH[carreraValue] && DB_ESPOCH[carreraValue].malla[paoValue]) || [];
    }
    materias.forEach(function (mat) { asigSelect.innerHTML += '<option value="' + mat + '">' + mat + '</option>'; });
    asigSelect.disabled = false;
    STATE.courseConfig.pao = paoValue;
    save();
  }

  // Si la asignatura proviene de una asignación (creada por el coordinador desde
  // OASIS), guardamos sus códigos exactos para importar la nómina sin re-resolver.
  function storeOasisCodesForSubject(carrera, asignatura) {
    var asg = myAssignments().find(function (a) { return a.carrera === carrera && a.asignatura === asignatura; });
    if (asg) {
      STATE.courseConfig.codCarrera = asg.codCarrera || '';
      STATE.courseConfig.codMateria = asg.codMateria || '';
      STATE.courseConfig.codNivel = asg.codNivel || asg.pao || '';
      STATE.courseConfig.codParalelo = asg.paralelo || '';
      STATE.courseConfig.codPeriodo = asg.codPeriodo || (STATE.oasisPeriodo && STATE.oasisPeriodo.codigo) || '';
    } else {
      STATE.courseConfig.codCarrera = '';
      STATE.courseConfig.codMateria = '';
      STATE.courseConfig.codNivel = '';
      STATE.courseConfig.codParalelo = '';
    }
  }

  function onAsignaturaChange() {
    var carrera = document.getElementById('cfg-carrera').value;
    var asignatura = document.getElementById('cfg-asignatura').value;
    STATE.courseConfig.asignatura = asignatura;
    storeOasisCodesForSubject(carrera, asignatura);
    if (!carrera || !asignatura) return;
    var asignaturaData = DB_ESPOCH[carrera] && DB_ESPOCH[carrera].asignaturas[asignatura];
    if (asignaturaData && asignaturaData.raau && asignaturaData.raau.length > 0) {
      STATE.raauEntries = asignaturaData.raau.map(function (r, index) {
        return { id: 'raau_auto_' + r.racId + '_' + (r.code || index), code: r.code, description: r.description, racId: r.racId };
      });
      STATE.selectedRACIds = [];
      asignaturaData.raau.forEach(function (r) { if (STATE.selectedRACIds.indexOf(r.racId) === -1) STATE.selectedRACIds.push(r.racId); });
      showToast('RAC y RAAU identificados automáticamente para la asignatura seleccionada.', 'success');
    } else {
      STATE.raauEntries = [];
      STATE.selectedRACIds = [];
      showToast('Esta asignatura no tiene mapeo automático de RAC/RAAU.', 'error');
    }
    STATE.activities = [];
    save();
    updateSidebar();
    syncActivitiesWithRAAU();
    renderRAAUList();
    renderSelectedSummary();
  }

  var cfgStep = 0;
  var CFG_STEPS = ['Información', 'RAC de la Carrera', 'RAAU de la Asignatura', 'Actividades'];

  function renderConfig() {
    cfgStep = 0;
    // Sólo limpiar datos si es una configuración nueva (sin PAO activo ni edición)
    if (!STATE.configLocked && !STATE.activeConfigId && !STATE.editingConfigId) {
      STATE.selectedRACIds = [];
      STATE.raauEntries = [];
      STATE.activities = [];
    }
    renderCfgStep();
  }

  function applyDefaultTemplateIfNeeded() {
    if (!STATE.savedConfigs || STATE.savedConfigs.length === 0) return;
    var template = STATE.savedConfigs[0];
    if (!STATE.courseConfig.periodoAcademico) STATE.courseConfig.periodoAcademico = template.courseConfig.periodoAcademico || 'SEPTIEMBRE 2025 - FEBRERO 2026';
    if (!STATE.courseConfig.aporte) STATE.courseConfig.aporte = template.courseConfig.aporte || 'FIN DE CICLO';
  }

  function renderManagedConfigSection() {
    var wizard = document.getElementById('cfg-wizard');
    var managed = document.getElementById('cfg-managed-section');
    if (!wizard || !managed) return;
    if (!STATE.configLocked) {
      wizard.style.display = '';
      managed.style.display = 'none';
      return;
    }
    wizard.style.display = 'none';
    managed.style.display = 'block';
    var c = STATE.courseConfig;
    var racHtml = CAREER_RACS.map(function (rac) {
      var selected = STATE.selectedRACIds.indexOf(rac.id) !== -1;
      return '<div class="item-row"><div style="flex:1"><div class="item-name">' + rac.code + '</div><div class="item-sub">' + rac.description + '</div></div><button class="btn btn-sm ' + (selected ? 'btn-danger' : 'btn-edit') + '" onclick="toggleManagedRAC(\'' + rac.id + '\')">' + (selected ? 'Quitar' : 'Agregar') + '</button></div>';
    }).join('');
    var raauRows = STATE.raauEntries.map(function (r, i) {
      return '<div class="item-row"><div style="flex:1"><div class="item-name">' + r.code + '</div><div class="item-sub">' + r.description + '</div></div><button class="btn btn-edit btn-sm" onclick="editRAAU(' + i + ')">Editar</button><button class="btn btn-danger btn-sm" onclick="deleteRAAU(' + i + ')">Eliminar</button></div>';
    }).join('');
    var actsRows = STATE.activities.map(function (a) {
      return activityItemHTML(a, a.component, COMPONENT_COLORS[a.component]);
    }).join('');
    managed.innerHTML =
      '<div class="card" style="margin-bottom:16px"><div class="card-header"><div class="card-title">Gestión de configuración confirmada</div>' +
      '<button class="btn btn-ghost btn-sm" onclick="unlockInitialConfig()">Editar configuración</button>' +
      '<button class="btn btn-primary btn-sm" onclick="unlockNewConfig();navigate(\'configuracion\')">+ Nueva configuración</button></div>' +
      '<div class="card-body"><div class="info-box"><p>Los datos base son de solo lectura. Aquí puede editar RAC, RAAU y actividades.</p></div>' +
      '<div class="form-grid"><div class="form-group"><label class="form-label">Período</label><input class="form-input" value="' + (c.periodoAcademico || '') + '" readonly></div>' +
      '<div class="form-group"><label class="form-label">Docente</label><input class="form-input" value="' + (c.docente || '') + '" readonly></div></div>' +
      '<div class="form-grid-3"><div class="form-group"><label class="form-label">Carrera</label><input class="form-input" value="' + (c.carrera || '') + '" readonly></div>' +
      '<div class="form-group"><label class="form-label">PAO</label><input class="form-input" value="' + (c.pao || '') + '" readonly></div>' +
      '<div class="form-group"><label class="form-label">Asignatura</label><input class="form-input" value="' + (c.asignatura || '') + '" readonly></div></div>' +
      '<div style="margin-top:10px"><div style="font-size:.78rem;font-weight:700;color:var(--gray-800);margin-bottom:6px">RAC (editar/agregar)</div><div>' + (racHtml || '<span style="font-size:.78rem;color:var(--gray-400)">Sin RAC disponibles</span>') + '</div></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;margin-bottom:6px"><div style="font-size:.78rem;font-weight:700;color:var(--gray-800)">RAAU</div><button class="btn btn-sm btn-primary" onclick="addRAAU()">Agregar RAAU</button></div>' +
      (raauRows || '<div style="font-size:.78rem;color:var(--gray-400)">Sin RAAU definidos.</div>') +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;margin-bottom:6px"><div style="font-size:.78rem;font-weight:700;color:var(--gray-800)">Actividades</div><div style="display:flex;gap:6px"><button class="btn btn-sm" style="background:' + COMPONENT_COLORS.ACD + '15;color:' + COMPONENT_COLORS.ACD + '" onclick="addActivity(\'ACD\')">+ ACD</button><button class="btn btn-sm" style="background:' + COMPONENT_COLORS.APEX + '15;color:' + COMPONENT_COLORS.APEX + '" onclick="addActivity(\'APEX\')">+ APEX</button><button class="btn btn-sm" style="background:' + COMPONENT_COLORS.AAUT + '15;color:' + COMPONENT_COLORS.AAUT + '" onclick="addActivity(\'AAUT\')">+ AAUT</button></div></div>' +
      (actsRows || '<div style="font-size:.78rem;color:var(--gray-400)">Sin actividades registradas.</div>') +
      '</div></div>';
  }

  function onConfigConfirmContinue() {
    closeSuccessModal();
    STATE.configLocked = true;
    // Asegurar que activeConfigId se establezca desde la config recién guardada
    if (!STATE.activeConfigId && STATE.savedConfigs.length > 0) {
      STATE.activeConfigId = STATE.savedConfigs[0].id;
    } else if (!STATE.activeConfigId) {
      // Fallback: crear un ID temporal
      STATE.activeConfigId = 'cfg_' + Date.now();
    }
    loadActiveConfigData();
    save();
    updateSidebar();
    renderCfgStep();
    renderPage(STATE.currentPage || 'configuracion');
    showToast('Configuración guardada y activada correctamente.', 'success');
  }

  function renderStepper() {
    document.getElementById('cfg-stepper').innerHTML = CFG_STEPS.map(function (label, i) {
      var isDone = i < cfgStep;
      var isActive = i === cfgStep;
      var cssClass = isDone ? 'done' : isActive ? 'active' : 'pending';
      return '<div class="step-item"><div class="step-dot ' + cssClass + '">' + (isDone ? '✓' : (i + 1)) + '</div><span class="step-label ' + cssClass + '">' + label + '</span>' + (i < CFG_STEPS.length - 1 ? '<div class="step-line' + (isDone ? ' done' : '') + '"></div>' : '') + '</div>';
    }).join('');
  }

  function collectMappedRAAUs() {
    var carrera = STATE.courseConfig.carrera;
    var asignatura = STATE.courseConfig.asignatura;
    var asignaturaData = DB_ESPOCH[carrera] && DB_ESPOCH[carrera].asignaturas[asignatura];
    return (asignaturaData && asignaturaData.raau) ? asignaturaData.raau : [];
  }

  function regenerateRAAUFromSelectedRACs() {
    var previousEntries = STATE.raauEntries.slice();
    var mapped = collectMappedRAAUs();
    var generated = [];
    function findRAC(racKey) {
      return CAREER_RACS.find(function (r) { return r.id === racKey || r.code === racKey; }) || null;
    }
    STATE.selectedRACIds.forEach(function (racId, idx) {
      var mappedByRac = mapped.filter(function (m) { return m.racId === racId; });
      if (mappedByRac.length > 0) {
        mappedByRac.forEach(function (m, i) {
          generated.push({
            id: 'raau_auto_' + racId + '_' + (m.code || ('IDX' + i)),
            code: m.code || ('RAAU' + (generated.length + 1)),
            description: m.description,
            racId: racId
          });
        });
      } else {
        var rac = findRAC(racId);
        generated.push({
          id: 'raau_auto_' + racId + '_' + idx,
          code: 'RAAU' + (generated.length + 1),
          description: 'Resultado de aprendizaje asociado a ' + (rac ? rac.code : ('RAC ' + (idx + 1))),
          racId: racId
        });
      }
    });
    STATE.raauEntries = generated;
    STATE.activities.forEach(function (act) {
      var oldRaau = previousEntries.find(function (r) { return r.id === act.raauId; });
      if (!oldRaau) return;
      var replacement = generated.find(function (r) { return r.code === oldRaau.code && r.racId === oldRaau.racId; }) ||
        generated.find(function (r) { return r.racId === oldRaau.racId; });
      if (replacement) {
        act.raauId = replacement.id;
        act.racId = replacement.racId;
      }
    });
  }

  function syncActivitiesWithRAAU() {
    STATE.activities.forEach(function (act) {
      var raau = STATE.raauEntries.find(function (r) { return r.id === act.raauId; });
      if (raau) {
        act.racId = raau.racId;
        return;
      }
      var fallback = STATE.raauEntries.find(function (r) { return r.racId === act.racId; });
      if (fallback) {
        act.raauId = fallback.id;
        act.racId = fallback.racId;
      }
    });
  }

  function renderSelectedSummary() {
    var target = document.getElementById('cfg-selected-summary');
    if (!target) return;
    if (STATE.selectedRACIds.length === 0) {
      target.innerHTML = '<div class="selected-box muted">Seleccione RAC para generar RAAU automáticamente.</div>';
      return;
    }
    var racBadges = STATE.selectedRACIds.map(function (racId) {
      var rac = CAREER_RACS.find(function (r) { return r.id === racId; });
      return '<span class="sel-chip">' + (rac ? rac.code : racId) + '</span>';
    }).join('');
    var raauBadges = STATE.raauEntries.map(function (entry) {
      return '<span class="sel-chip secondary">' + entry.code + '</span>';
    }).join('');
    target.innerHTML =
      '<div class="selected-box"><div><strong>RAC seleccionados:</strong> ' + racBadges + '</div>' +
      '<div style="margin-top:8px"><strong>RAAU generados:</strong> ' + (raauBadges || '<span style="color:var(--gray-400)">—</span>') + '</div></div>';
  }

  function renderRAAUList() {
    var target = document.getElementById('cfg-raau-list');
    if (!target) return;
    if (STATE.raauEntries.length === 0) {
      target.innerHTML = '<p style="font-size:0.8rem;color:var(--gray-500);text-align:center;padding:20px;">No hay RAAU definidos. Seleccione la asignatura correcta en el Paso 1.</p>';
      return;
    }
    target.innerHTML = STATE.raauEntries.map(function (entry, i) {
      var rac = CAREER_RACS.find(function (c) { return c.id === entry.racId; });
      return '<div class="item-row"><div style="font-size:.72rem;font-weight:700;color:var(--gray-800);min-width:50px">' + entry.code + '</div><div style="flex:1"><div style="font-size:.82rem;font-weight:500;color:var(--gray-700)">' + entry.description + '</div><div style="font-size:.72rem;color:var(--gray-400);margin-top:2px">' + (rac ? rac.code : entry.racId) + '</div></div><button class="btn btn-danger btn-sm" onclick="deleteRAAU(' + i + ')" title="Eliminar">Eliminar</button></div>';
    }).join('');
    renderSelectedSummary();
  }

  function renderActivitiesPanels() {
    var panel = document.getElementById('cfg-activities-panels');
    var summaryDiv = document.getElementById('cfg-activities-summary');
    if (!panel || !summaryDiv) return;
    var hasAny = STATE.activities.length > 0;
    summaryDiv.style.display = hasAny ? 'block' : 'none';
    panel.innerHTML = COMPONENTS.map(function (comp) {
      var acts = STATE.activities.filter(function (a) { return a.component === comp; });
      var color = COMPONENT_COLORS[comp];
      var totalMax = acts.reduce(function (s, a) { return s + a.maxScore; }, 0);
      var maxWeight = COMPONENT_WEIGHTS[comp];
      var remaining = maxWeight - totalMax;
      return '<div style="margin-bottom:20px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><div><span style="font-weight:700;color:' + color + ';font-size:.85rem">' + comp + '</span><span style="font-size:.75rem;color:var(--gray-500);margin-left:8px">' + COMPONENT_LABELS[comp] + '</span></div><div style="display:flex;align-items:center;gap:8px"><span style="font-size:.72rem;color:' + (remaining < 0 ? 'var(--red)' : 'var(--gray-400)') + '">' + remaining.toFixed(1) + ' pts disponibles</span><button class="btn btn-sm" style="background:' + color + '15;color:' + color + '" onclick="addActivity(\'' + comp + '\')">Agregar</button></div></div><div id="acts-' + comp + '">' + acts.map(function (act) { return activityItemHTML(act, comp, color); }).join('') + '</div></div>';
    }).join('');
    renderActivitiesSummary();
  }

  function renderActivitiesSummary() {
    var summaryContent = document.getElementById('cfg-activities-summary-content');
    if (!summaryContent) return;
    if (STATE.activities.length === 0) {
      summaryContent.innerHTML = '<div style="font-size:.78rem;color:var(--gray-400)">Aún no hay actividades registradas.</div>';
      return;
    }
    var lines = COMPONENTS.map(function (comp) {
      var acts = STATE.activities.filter(function (a) { return a.component === comp; });
      var total = acts.reduce(function (sum, a) { return sum + a.maxScore; }, 0);
      var expected = COMPONENT_WEIGHTS[comp];
      var pctComp = Math.round((total / expected) * 100);
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:white;border:1px solid var(--gray-200);border-radius:8px;margin-bottom:6px">' +
        '<span style="font-size:.76rem;color:var(--gray-600)">' + comp + ': ' + acts.length + ' actividades</span>' +
        '<span style="font-size:.75rem;font-weight:700;color:' + COMPONENT_COLORS[comp] + '">' + total.toFixed(1) + '/' + expected + ' pts (' + Math.min(pctComp, 100) + '%)</span>' +
      '</div>';
    }).join('');
    summaryContent.innerHTML = lines;
  }

  function activityItemHTML(act, comp, color) {
    var raauEntry = STATE.raauEntries.find(function (r) { return r.id === act.raauId; });
    var racIdToSearch = (raauEntry && raauEntry.racId) || act.racId;
    var rac = CAREER_RACS.find(function (r) { return r.id === racIdToSearch; });
    var procedure = (EVAL_PROCEDURES[comp] || []).find(function (p) { return p.id === act.procedureId; });
    return '<div class="item-row">' +
      '<span class="comp-pill" style="background:' + color + '15;color:' + color + '">' + comp + '</span>' +
      '<div style="flex:1"><div class="item-name">' + act.name + '</div><div class="item-sub">Max: ' + act.maxScore + ' pts | RAAU: ' + (raauEntry ? raauEntry.code : '—') + ' | RAC: ' + (rac ? rac.code : '—') + ' | Proc: ' + (procedure ? procedure.name : '—') + '</div></div>' +
      '<button class="btn btn-edit btn-sm" onclick="editActivity(\'' + act.id + '\')" title="Editar">Editar</button>' +
      '<button class="btn btn-danger btn-sm" onclick="deleteActivity(\'' + act.id + '\')" title="Eliminar">Eliminar</button>' +
      '</div>';
  }

  // La carrera se limita a las carreras donde el usuario tiene asignaturas.
  function applyDocenteCarreraOptions(elCarrera) {
    if (!elCarrera || !STATE.currentUser) return;
    var carreras;
    if (STATE.currentUser.role === 'coordinador' || STATE.currentUser.role === 'admin') {
      carreras = Object.keys(DB_ESPOCH);
    } else {
      carreras = [];
      myAssignments().forEach(function (a) { if (a.carrera && carreras.indexOf(a.carrera) === -1) carreras.push(a.carrera); });
    }
    elCarrera.innerHTML = '<option value="">-- Seleccione la carrera --</option>' +
      carreras.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
  }

  function renderCfgStep() {
    // Mostrar el wizard completo siempre (paso a paso)
    applyDefaultTemplateIfNeeded();
    renderStepper();
    for (var i = 0; i < 4; i++) {
      var stepEl = document.getElementById('cfg-step-' + i);
      if (stepEl) stepEl.style.display = 'none';
    }
    var current = document.getElementById('cfg-step-' + cfgStep);
    if (current) current.style.display = 'block';
    document.getElementById('cfg-prev').style.display = cfgStep > 0 ? '' : 'none';
    document.getElementById('cfg-next').style.display = cfgStep < 3 ? '' : 'none';
    var saveBtn = document.getElementById('cfg-save');
    if (saveBtn) {
      saveBtn.style.display = cfgStep === 3 ? '' : 'none';
      saveBtn.textContent = 'Guardar para finalizar';
    }

    var config = STATE.courseConfig;
    if (cfgStep === 0) {
      var periodo = config.periodoAcademico || (STATE.oasisPeriodo && STATE.oasisPeriodo.descripcion) || '';
      document.getElementById('cfg-periodo').value = periodo;
      if (periodo && !config.periodoAcademico) config.periodoAcademico = periodo;
      var docenteDefault = config.docente || (STATE.currentUser && STATE.currentUser.name) || '';
      document.getElementById('cfg-docente').value = docenteDefault;
      document.getElementById('cfg-aporte').value = config.aporte || 'FIN DE CICLO';
      var elCarrera = document.getElementById('cfg-carrera');
      applyDocenteCarreraOptions(elCarrera);
      if (config.carrera) {
        elCarrera.value = config.carrera;
        onCarreraChange();
        var elPao = document.getElementById('cfg-pao');
        if (config.pao) {
          elPao.value = config.pao;
          onPaoChange();
          var elAsig = document.getElementById('cfg-asignatura');
          if (config.asignatura) elAsig.value = config.asignatura;
        }
      }
    }
    if (cfgStep === 1) {
      document.getElementById('cfg-rac-title').textContent = 'RAC disponibles — Carrera: ' + (STATE.courseConfig.carrera || '—');
      if (CAREER_RACS.length === 0) {
        document.getElementById('cfg-rac-list').innerHTML = '<div class="info-box" style="background:#fee2e2;border-color:#fca5a5"><p style="color:#991b1b">No hay RACs configurados para la carrera seleccionada.</p></div>';
      } else {
        document.getElementById('cfg-rac-list').innerHTML = CAREER_RACS.map(function (rac) {
          var isSelected = STATE.selectedRACIds.indexOf(rac.id) !== -1;
          return '<div class="rac-card ' + (isSelected ? 'selected' : '') + '" onclick="toggleRAC(\'' + rac.id + '\',this)"><div class="rac-checkbox"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><div><div class="rac-code">' + rac.code + '</div><div class="rac-desc">' + rac.description + '</div></div></div>';
        }).join('');
      }
    }
    if (cfgStep === 2) { renderRAAUList(); renderSelectedSummary(); }
    if (cfgStep === 3) renderActivitiesPanels();
    renderSavedConfigs();
  }

  function cfgPrev() { if (cfgStep > 0) { cfgStep--; renderCfgStep(); } }
  function cfgNext() {
    if (cfgStep === 0) {
      var periodoVal = document.getElementById('cfg-periodo').value;
      var carreraVal = document.getElementById('cfg-carrera').value;
      var asignaturaVal = document.getElementById('cfg-asignatura').value;
      var docenteVal = document.getElementById('cfg-docente').value;
      if (!carreraVal || !asignaturaVal) { showToast('Seleccione carrera y asignatura antes de continuar.', 'error'); return; }
      if (!periodoVal) { showToast('Ingrese el período académico.', 'error'); return; }
      var duplicate = (STATE.savedConfigs || []).find(function (cfg) {
        var cc = cfg.courseConfig || {};
        return cc.carrera === carreraVal && cc.pao === document.getElementById('cfg-pao').value && cc.asignatura === asignaturaVal;
      });
      if (duplicate && duplicate.id !== STATE.activeConfigId && duplicate.id !== STATE.editingConfigId) {
        showToast('Esta materia ya fue configurada. Use la configuración guardada.', 'error');
        return;
      }
      STATE.courseConfig.periodoAcademico = periodoVal;
      STATE.courseConfig.facultad = document.getElementById('cfg-facultad').value;
      STATE.courseConfig.carrera = carreraVal;
      STATE.courseConfig.asignatura = asignaturaVal;
      STATE.courseConfig.docente = docenteVal;
      STATE.courseConfig.pao = document.getElementById('cfg-pao').value;
      STATE.courseConfig.aporte = document.getElementById('cfg-aporte').value;
      addRecentActivity('Configuración: ' + carreraVal + ' — ' + asignaturaVal, 'config');
    }
    if (cfgStep < 3) { cfgStep++; renderCfgStep(); }
  }
  async function cfgSave() {
    var issues = [];
    if (STATE.selectedRACIds.length === 0) issues.push('Debe seleccionar al menos un RAC de la carrera.');
    if (STATE.raauEntries.length === 0) issues.push('Debe configurar al menos un RAAU de la asignatura.');
    COMPONENTS.forEach(function (comp) {
      var acts = STATE.activities.filter(function (a) { return a.component === comp; });
      var total = acts.reduce(function (s, a) { return s + (Number(a.maxScore) || 0); }, 0);
      var weight = COMPONENT_WEIGHTS[comp];
      var faltan = weight - total;
      if (acts.length < 2) {
        issues.push(comp + ' (' + COMPONENT_LABELS[comp] + '): requiere ≥2 actividades (tiene ' + acts.length + ')');
      }
      if (Math.abs(faltan) > 0.001) {
        if (faltan > 0) {
          issues.push(comp + ': debe completar los puntos — suma ' + total.toFixed(1) + '/' + weight.toFixed(1) + ' (faltan ' + faltan.toFixed(1) + ' pts)');
        } else {
          issues.push(comp + ': excede el puntaje — suma ' + total.toFixed(1) + '/' + weight.toFixed(1) + ' (sobran ' + Math.abs(faltan).toFixed(1) + ' pts)');
        }
      }
    });
    if (issues.length > 0) {
      var issuesHtml = issues.map(function (i) {
        return '<li style="padding:6px 10px;background:var(--red-bg);border-radius:var(--radius);font-size:.8rem;color:#991b1b;margin-bottom:4px;display:flex;align-items:center;gap:6px">' + i + '</li>';
      }).join('');
      openModal('Configuración Incompleta',
        '<p style="color:var(--gray-600);font-size:.85rem;margin-bottom:12px">Complete todos los requisitos antes de guardar:</p>' +
        '<ul style="list-style:none;padding:0">' + issuesHtml + '</ul>',
        [{ label: 'Entendido', cls: 'btn-primary', action: 'close' }]
      );
      return;
    }
    var targetId = STATE.editingConfigId || STATE.activeConfigId;
    var existingIdx = -1;
    if (targetId) {
      existingIdx = STATE.savedConfigs.findIndex(function (c) { return c.id === targetId; });
    }
    var savedId = '';
    var wasUpdate = existingIdx >= 0;
    if (wasUpdate) {
      var existing = STATE.savedConfigs[existingIdx];
      existing.savedAt = new Date().toLocaleString();
      existing.courseConfig = JSON.parse(JSON.stringify(STATE.courseConfig));
      existing.selectedRACIds = STATE.selectedRACIds.slice();
      existing.raauEntries = JSON.parse(JSON.stringify(STATE.raauEntries));
      existing.activities = JSON.parse(JSON.stringify(STATE.activities));
      savedId = existing.id;
    } else {
      var snapshot = {
        id: 'cfg_' + Date.now(),
        savedAt: new Date().toLocaleString(),
        ownerEmail: (STATE.currentUser && STATE.currentUser.email) || '',
        courseConfig: JSON.parse(JSON.stringify(STATE.courseConfig)),
        selectedRACIds: STATE.selectedRACIds.slice(),
        raauEntries: JSON.parse(JSON.stringify(STATE.raauEntries)),
        activities: JSON.parse(JSON.stringify(STATE.activities))
      };
      STATE.savedConfigs.unshift(snapshot);
      if (STATE.savedConfigs.length > 8) STATE.savedConfigs = STATE.savedConfigs.slice(0, 8);
      savedId = snapshot.id;
    }
    // NO activar automáticamente — el PAO solo se activa desde el dropdown "MIS PAOs"
    var isEditingActiveConfig = wasUpdate && savedId === STATE.activeConfigId;
    STATE.editingConfigId = '';
    // Si hay un PAO activo, recargar sus datos (puede ser el que se editó, u otro)
    if (STATE.activeConfigId) {
      cargarPaoActivo();
    }
    STATE.configLocked = !!STATE.activeConfigId;
    cfgStep = 0;
    save();
    updateSidebar();
    renderPaoSidebarList();
    // Sincronizar con OASIS solo si hay PAO activo
    if (STATE.activeConfigId) {
      try {
        var synced = await syncStudentsFromOasis(STATE.activeConfigId);
        if (synced && (synced.added > 0 || synced.updated > 0)) {
          var parts = [];
          if (synced.added > 0) parts.push(synced.added + ' nuevos');
          if (synced.updated > 0) parts.push(synced.updated + ' actualizados');
          addRecentActivity('OASIS: ' + parts.join(', '), 'student');
          showToast(parts.join(', ') + ' desde OASIS', 'success');
        }
      } catch (e) {
        showToast('Guardado. No se pudo conectar con OASIS para cargar estudiantes.', 'error');
      }
    }
    addRecentActivity('Configuración guardada exitosamente', 'config');
    renderCfgStep();
    var msg = wasUpdate ? 'Configuración actualizada correctamente.' : 'Nuevo PAO guardado. Selecciónelo desde MIS PAOs para trabajar con él.';
    showToast(msg, 'success');
  }

  function applySavedConfig(configId) {
    if (!setPaoActivo(configId)) return;
    sincronizarPaoActivoConUI();
    showToast('Configuración aplicada correctamente.', 'success');
  }

  function editSavedConfigName(configId) {
    var found = STATE.savedConfigs.find(function (cfg) { return cfg.id === configId; });
    if (!found) return;
    // Guardar el id del PAO que se está editando (SIN cambiar el PAO activo)
    STATE.editingConfigId = configId;
    STATE.courseConfig = JSON.parse(JSON.stringify(found.courseConfig));
    STATE.selectedRACIds = found.selectedRACIds.slice();
    STATE.raauEntries = JSON.parse(JSON.stringify(found.raauEntries));
    STATE.activities = JSON.parse(JSON.stringify(found.activities));
    STATE.configLocked = false;
    cfgStep = 0;
    if (STATE.courseConfig.carrera && DB_ESPOCH[STATE.courseConfig.carrera]) {
      CAREER_RACS = DB_ESPOCH[STATE.courseConfig.carrera].racs || [];
    }
    save();
    navigate('configuracion');
    showToast('Editando configuración completa del PAO. Guarde al finalizar.', 'success');
  }

  function renderSavedConfigs() {
    var target = document.getElementById('cfg-saved-configs');
    if (!target) return;
    var visibleConfigs = (STATE.savedConfigs || []).filter(function (cfg) {
      if (!STATE.currentUser) return false;
      return (cfg.ownerEmail || '') === STATE.currentUser.email;
    });
    if (!visibleConfigs || visibleConfigs.length === 0) {
      target.innerHTML = '<div style="font-size:.8rem;color:var(--gray-500)">Aún no existen configuraciones guardadas.</div>';
      return;
    }
    target.innerHTML = visibleConfigs.map(function (cfg) {
      var acts = cfg.activities ? cfg.activities.length : 0;
      var raau = cfg.raauEntries ? cfg.raauEntries.length : 0;
      var isActive = cfg.id === STATE.activeConfigId;
      return '<div class="saved-config-item' + (isActive ? ' active' : '') + '">' +
        '<div style="flex:1"><div class="saved-config-title">' + (cfg.courseConfig.asignatura || 'Sin asignatura') + (isActive ? ' <span style="font-size:.7rem;color:var(--espoch-green);font-weight:600">(Activo)</span>' : '') + '</div>' +
        '<div class="saved-config-sub">' + (cfg.courseConfig.carrera || '—') + ' · PAO ' + (cfg.courseConfig.pao || '—') + ' · ' + acts + ' actividades · ' + raau + ' RAAU · ' + cfg.savedAt + '</div></div>' +
        '<div style="display:flex;gap:6px"><button class="btn btn-sm btn-edit" onclick="editSavedConfigName(\'' + cfg.id + '\')">Editar</button><button class="btn btn-sm btn-danger" onclick="deleteSavedConfig(\'' + cfg.id + '\')">Eliminar</button></div>' +
      '</div>';
    }).join('');
  }

  function deleteSavedConfig(configId) {
    var cfg = STATE.savedConfigs.find(function (item) { return item.id === configId; });
    if (!cfg) return;
    openModal('Eliminar configuración',
      '<p style="font-size:.85rem;color:var(--gray-600)">¿Eliminar la configuración <strong>' + (cfg.courseConfig.asignatura || 'sin nombre') + '</strong>?</p>',
      [
        { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
        { label: 'Eliminar', cls: 'btn-danger', action: function () {
          STATE.savedConfigs = STATE.savedConfigs.filter(function (item) { return item.id !== configId; });
          delete STATE.studentsByConfig[configId];
          delete STATE.gradesByConfig[configId];
          if (STATE.activeConfigId === configId) {
            STATE.activeConfigId = '';
            STATE.students = [];
            STATE.grades = [];
            STATE.configLocked = false;
          }
          save();
          updateSidebar();
          renderPaoSidebarList();
          renderSavedConfigs();
          closeModal();
          showToast('Configuración eliminada.', 'success');
        } }
      ]);
  }

  function unlockInitialConfig() {
    STATE.configLocked = false;
    save();
    updateSidebar();
    renderCfgStep();
    showToast('Configuración reabierta para edición.', 'success');
  }

  function unlockNewConfig() {
    STATE.configLocked = false;
    STATE.activeConfigId = '';
    STATE.editingConfigId = '';
    STATE.courseConfig.periodoAcademico = '';
    STATE.courseConfig.carrera = '';
    STATE.courseConfig.pao = '';
    STATE.courseConfig.asignatura = '';
    STATE.courseConfig.docente = '';
    STATE.courseConfig.aporte = 'FIN DE CICLO';
    STATE.selectedRACIds = [];
    STATE.raauEntries = [];
    STATE.activities = [];
    cfgStep = 0;
    save();
    updateSidebar();
    renderCfgStep();
    showToast('Nuevo PAO: complete los datos y guarde.', 'success');
  }

  function saveManagedConfigEdits() {
    STATE.courseConfig.periodoAcademico = document.getElementById('managed-periodo').value;
    STATE.courseConfig.docente = document.getElementById('managed-docente').value;
    STATE.courseConfig.asignatura = document.getElementById('managed-asignatura').value;
    save();
    updateSidebar();
    renderManagedConfigSection();
    showToast('Cambios generales guardados', 'success');
  }

  function openManagedRAAUEditor() {
    STATE.configLocked = false;
    cfgStep = 1;
    renderCfgStep();
    showToast('Puede editar RAC/RAAU. Al guardar volverá a gestión.', 'success');
  }

  function openManagedActivities() {
    STATE.configLocked = false;
    cfgStep = 3;
    renderCfgStep();
    showToast('Puede editar actividades. Al guardar volverá a gestión.', 'success');
  }

  function toggleRAC(id, el) {
    if (STATE.selectedRACIds.indexOf(id) !== -1) {
      STATE.selectedRACIds = STATE.selectedRACIds.filter(function (r) { return r !== id; });
      el.classList.remove('selected');
    } else {
      STATE.selectedRACIds.push(id);
      el.classList.add('selected');
    }
    regenerateRAAUFromSelectedRACs();
    syncActivitiesWithRAAU();
    renderRAAUList();
    renderSelectedSummary();
    save();
  }

  function toggleManagedRAC(id) {
    var current = STATE.selectedRACIds.indexOf(id);
    if (current >= 0) STATE.selectedRACIds.splice(current, 1);
    else STATE.selectedRACIds.push(id);
    regenerateRAAUFromSelectedRACs();
    syncActivitiesWithRAAU();
    save();
    renderManagedConfigSection();
  }

  function deleteRAAU(i) {
    STATE.raauEntries.splice(i, 1);
    syncActivitiesWithRAAU();
    if (STATE.configLocked) renderManagedConfigSection();
    else renderRAAUList();
    save();
  }
  function editRAAU(i) {
    var entry = STATE.raauEntries[i];
    if (!entry) return;
    var racOptions = CAREER_RACS.map(function (r) {
      return '<option value="' + r.id + '"' + (r.id === entry.racId ? ' selected' : '') + '>' + r.code + '</option>';
    }).join('');
    openModal('Editar RAAU',
      '<div class="form-group"><label class="form-label">Código</label><input class="form-input" id="m-raau-code" value="' + entry.code + '"></div>' +
      '<div class="form-group"><label class="form-label">Descripción</label><textarea class="form-input" id="m-raau-desc" rows="3">' + entry.description + '</textarea></div>' +
      '<div class="form-group"><label class="form-label">RAC asociado</label><select class="form-select" id="m-raau-rac">' + racOptions + '</select></div>',
      [
        { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
        { label: 'Guardar', cls: 'btn-success', action: function () {
          entry.code = document.getElementById('m-raau-code').value;
          entry.description = document.getElementById('m-raau-desc').value;
          entry.racId = document.getElementById('m-raau-rac').value;
          syncActivitiesWithRAAU();
          save();
          if (STATE.configLocked) renderManagedConfigSection();
          else renderRAAUList();
          closeModal();
        } }
      ]);
  }
  function addRAAU() {
    var selectedRacs = STATE.selectedRACIds;
    if (selectedRacs.length === 0) { showToast('Primero seleccione al menos un RAC.', 'error'); return; }
    var newCode = 'RAAU' + (STATE.raauEntries.length + 1);
    var racOptions = CAREER_RACS.filter(function (r) { return selectedRacs.indexOf(r.id) !== -1; }).map(function (r) {
      return '<option value="' + r.id + '">' + r.code + ' — ' + r.description.slice(0, 60) + '…</option>';
    }).join('');
    openModal('Nuevo RAAU',
      '<div class="form-group"><label class="form-label">Código</label><input class="form-input" id="m-code" value="' + newCode + '"></div>' +
      '<div class="form-group"><label class="form-label">Descripción</label><textarea class="form-input" id="m-desc" rows="3" style="resize:vertical"></textarea></div>' +
      '<div class="form-group"><label class="form-label">RAC asociado</label><select class="form-select" id="m-rac">' + racOptions + '</select></div>',
      [
        { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
        { label: 'Agregar', cls: 'btn-primary', action: function () {
          var codeValue = document.getElementById('m-code').value;
          var descValue = document.getElementById('m-desc').value;
          var racIdValue = document.getElementById('m-rac').value;
          if (!codeValue || !descValue) return;
          STATE.raauEntries.push({ id: 'raau' + Date.now(), code: codeValue, description: descValue, racId: racIdValue });
          syncActivitiesWithRAAU();
          if (STATE.configLocked) renderManagedConfigSection();
          else renderRAAUList();
          save();
          closeModal();
        } }
      ]);
  }

  function deleteActivity(id) {
    STATE.activities = STATE.activities.filter(function (a) { return a.id !== id; });
    if (STATE.configLocked) renderManagedConfigSection();
    else renderActivitiesPanels();
    save();
  }

  function editActivity(actId) {
    var act = STATE.activities.find(function (a) { return a.id === actId; });
    if (!act) return;
    var comp = act.component;
    var raauOptions = STATE.raauEntries.map(function (r) {
      return '<option value="' + r.id + '"' + (r.id === act.raauId ? ' selected' : '') + '>' + r.code + ' — ' + r.description.slice(0, 50) + '…</option>';
    }).join('');
    var procOptions = (EVAL_PROCEDURES[comp] || []).map(function (p) {
      return '<option value="' + p.id + '"' + (p.id === act.procedureId ? ' selected' : '') + '>' + p.name + '</option>';
    }).join('');
    var racOptions = CAREER_RACS.filter(function (r) { return STATE.selectedRACIds.indexOf(r.id) !== -1; }).map(function (r) {
      return '<option value="' + r.id + '"' + (r.id === act.racId ? ' selected' : '') + '>' + r.code + '</option>';
    }).join('');
    var otherTotal = STATE.activities.filter(function (a) { return a.component === comp && a.id !== actId; }).reduce(function (sum, a) { return sum + a.maxScore; }, 0);
    var pesoMaximo = COMPONENT_WEIGHTS[comp];
    openModal('Editar Actividad — ' + act.name,
      '<div class="form-group"><label class="form-label">Nombre</label><input class="form-input" id="m-aname" value="' + act.name + '"></div>' +
      '<div class="form-group"><label class="form-label">Puntaje Máximo</label><input class="form-input" type="number" id="m-amax" step="0.5" min="0.1" max="' + pesoMaximo + '" value="' + act.maxScore + '"></div>' +
      '<div class="info-box" style="margin:8px 0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><p>Otras: ' + otherTotal.toFixed(1) + ' pts. Disponible: ' + (pesoMaximo - otherTotal).toFixed(1) + ' pts</p></div>' +
      '<div class="form-group"><label class="form-label">RAC asociado</label><select class="form-select" id="m-arac">' + racOptions + '</select></div>' +
      '<div class="form-group"><label class="form-label">RAAU asociado</label><select class="form-select" id="m-araau">' + raauOptions + '</select></div>' +
      '<div class="form-group"><label class="form-label">Procedimiento evaluativo</label><select class="form-select" id="m-aproc">' + procOptions + '</select></div>',
      [
        { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
        { label: 'Guardar Cambios', cls: 'btn-success', action: function () {
          var nameValue = document.getElementById('m-aname').value;
          var maxValue = parseFloat(document.getElementById('m-amax').value);
          if (!nameValue || isNaN(maxValue)) return;
          var newTotal = otherTotal + maxValue;
          if (newTotal > pesoMaximo) { showToast('Error: ' + comp + ' no puede exceder ' + pesoMaximo + ' pts.', 'error'); return; }
          var raauSelectedId = document.getElementById('m-araau').value;
          var raauEntry = STATE.raauEntries.find(function (r) { return r.id === raauSelectedId; });
          if (!raauEntry || STATE.selectedRACIds.indexOf(raauEntry.racId) === -1) {
            showToast('El RAAU seleccionado no corresponde a los RAC activos.', 'error');
            return;
          }
          act.name = nameValue;
          act.maxScore = maxValue;
          act.racId = raauEntry.racId;
          act.raauId = raauSelectedId;
          act.procedureId = document.getElementById('m-aproc').value;
          if (STATE.configLocked) renderManagedConfigSection();
          else renderActivitiesPanels();
          save();
          closeModal();
          showToast('Actividad "' + nameValue + '" actualizada', 'success');
        } }
      ]);
  }

  function addActivity(comp) {
    if (STATE.raauEntries.length === 0) { showToast('Debe tener al menos un RAAU antes de crear actividades', 'error'); return; }
    if (STATE.selectedRACIds.length === 0) { showToast('Debe seleccionar al menos un RAC antes de crear actividades', 'error'); return; }
    var raauOptions = STATE.raauEntries.map(function (r) {
      return '<option value="' + r.id + '">' + r.code + ' — ' + r.description.slice(0, 50) + '…</option>';
    }).join('');
    var procOptions = (EVAL_PROCEDURES[comp] || []).map(function (p) {
      return '<option value="' + p.id + '">' + p.name + '</option>';
    }).join('');
    var racOptions = CAREER_RACS.filter(function (r) { return STATE.selectedRACIds.indexOf(r.id) !== -1; }).map(function (r) {
      return '<option value="' + r.id + '">' + r.code + '</option>';
    }).join('');
    var currentTotal = STATE.activities.filter(function (a) { return a.component === comp; }).reduce(function (sum, a) { return sum + a.maxScore; }, 0);
    var pesoMaximo = COMPONENT_WEIGHTS[comp];

    openModal('Nueva Actividad — ' + comp,
      '<div class="form-group"><label class="form-label">Nombre</label><input class="form-input" id="m-aname" placeholder="Ej: Tareas en Equipo"></div>' +
      '<div class="form-group"><label class="form-label">Puntaje Máximo</label><input class="form-input" type="number" id="m-amax" step="0.5" min="0.1" max="' + pesoMaximo + '" value="1.0"></div>' +
      '<div class="info-box" style="margin:8px 0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><p>Asignados: ' + currentTotal.toFixed(1) + ' / ' + pesoMaximo + ' pts. Disponible: ' + (pesoMaximo - currentTotal).toFixed(1) + ' pts</p></div>' +
      '<div class="form-group"><label class="form-label">RAC asociado</label><select class="form-select" id="m-arac">' + racOptions + '</select></div>' +
      '<div class="form-group"><label class="form-label">RAAU asociado</label><select class="form-select" id="m-araau">' + raauOptions + '</select></div>' +
      '<div class="form-group"><label class="form-label">Procedimiento evaluativo</label><select class="form-select" id="m-aproc">' + procOptions + '</select></div>',
      [
        { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
        { label: 'Agregar', cls: 'btn-primary', action: function () {
          var nameValue = document.getElementById('m-aname').value;
          var maxValue = parseFloat(document.getElementById('m-amax').value);
          if (!nameValue || isNaN(maxValue)) return;
          var newCurrentTotal = currentTotal + maxValue;
          if (newCurrentTotal > pesoMaximo) { showToast('Error: ' + comp + ' no puede exceder ' + pesoMaximo + ' pts.', 'error'); return; }
          var raauChosenId = document.getElementById('m-araau').value;
          var raauChosen = STATE.raauEntries.find(function (r) { return r.id === raauChosenId; });
          if (!raauChosen || STATE.selectedRACIds.indexOf(raauChosen.racId) === -1) {
            showToast('El RAAU seleccionado no corresponde a los RAC activos.', 'error');
            return;
          }
          var newAct = {
            id: 'act' + Date.now(), name: nameValue, component: comp, maxScore: maxValue,
            racId: raauChosen.racId,
            raauId: raauChosenId,
            procedureId: document.getElementById('m-aproc').value
          };
          STATE.activities.push(newAct);
          addRecentActivity('Actividad "' + nameValue + '" agregada a ' + comp, 'config');
          if (STATE.configLocked) renderManagedConfigSection();
          else renderActivitiesPanels();
          save();
          closeModal();
        } }
      ]);
  }

  function getGrade(sid, aid) {
    return GradeService.getGrade(STATE.activeConfigId, sid, aid);
  }
  function setGrade(sid, aid, score) {
    GradeService.setGrade(STATE.activeConfigId, sid, aid, score);
    var found = false;
    for (var i = 0; i < STATE.grades.length; i++) {
      if (STATE.grades[i].studentId === sid && STATE.grades[i].activityId === aid) {
        STATE.grades[i].score = score;
        found = true;
        break;
      }
    }
    if (!found && score != null) STATE.grades.push({ studentId: sid, activityId: aid, score: score });
    persistActiveConfigData();
  }
  function studentTotal(sid) {
    return GradeService.calculateStudentTotal(STATE.activeConfigId, sid);
  }
  function fmt(n) { return GradeService.formatScore(n); }
  function pct(a, b) { return GradeService.calculatePercentage(a, b); }
  function addRecentActivity(text, type) {
    var now = new Date();
    var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    STATE.recentActivity.unshift({ text: text, type: type, time: timeStr, date: now.toLocaleDateString() });
    if (STATE.recentActivity.length > 20) STATE.recentActivity.pop();
  }

  var chartDistribution = null;
  var chartStudents = null;
  var chartPie = null;
  var chartCoordDocentes = null;
  var chartCoordConfigs = null;
  function getIconSVG(name, color) {
    var icons = {
      users: '<svg viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      'x-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      'trending-up': '<svg viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
    };
    return icons[name] || icons.users;
  }

  function renderDashboard() {
    if (!STATE.activeConfigId) {
      document.getElementById('dash-sub').textContent = 'Seleccione o configure un PAO para comenzar.';
      document.getElementById('dash-banner').innerHTML = '<div style="padding:30px;text-align:center;color:var(--gray-500);font-size:.9rem">Seleccione un PAO desde MIS PAOs para comenzar.</div>';
      document.getElementById('dash-stats').innerHTML = '';
      document.getElementById('dash-student-body').innerHTML = '';
      return;
    }
    var config = STATE.courseConfig;
    var students = STATE.students;
    var activities = STATE.activities;
    document.getElementById('dash-sub').textContent = (config.asignatura || 'Sin Asignatura') + ' — ' + config.periodoAcademico;
    document.getElementById('dash-banner').innerHTML = '<div class="course-banner-fields"><div class="banner-field"><div class="lbl">Carrera</div><div class="val">' + (config.carrera || '—') + '</div></div><div class="banner-field"><div class="lbl">PAO</div><div class="val">' + (config.pao || '—') + '</div></div><div class="banner-field"><div class="lbl">Aporte</div><div class="val">' + (config.aporte || '—') + '</div></div><div class="banner-field"><div class="lbl">Docente</div><div class="val">' + (config.docente || '—') + '</div></div></div>';
  
    const stats = GradeService.calculateClassStats(STATE.activeConfigId, students, activities);
    const allTotals = stats.allTotals;
    var approvedCount = stats.approvedCount;
    var failedCount = stats.failedCount;
    var noGradeCount = stats.noGradeCount;
    var classAverage = stats.classAverage;
    var maxTotal = stats.maxTotal;
    var statItems = [
      { title: 'Estudiantes', value: students.length, sub: 'Matriculados', color: 'var(--espoch-red)', icon: 'users' },
      { title: 'Aprobados', value: approvedCount, sub: 'Nota ≥ 7.0', color: 'var(--green)', icon: 'check-circle' },
      { title: 'Reprobados', value: failedCount, sub: 'Nota < 7.0', color: 'var(--red)', icon: 'x-circle' },
      { title: 'Promedio', value: classAverage.toFixed(2), sub: 'de ' + maxTotal.toFixed(1) + ' pts', color: 'var(--amber)', icon: 'trending-up' }
    ];
    document.getElementById('dash-stats').innerHTML = statItems.map(function (item) {
      return '<div class="stat-card animate-in"><div class="stat-row"><div><div class="stat-label">' + item.title + '</div><div class="stat-val" style="color:' + item.color + '">' + item.value + '</div><div class="stat-sub">' + item.sub + '</div></div><div class="stat-icon" style="background:' + item.color + '18">' + getIconSVG(item.icon, item.color) + '</div></div></div>';
    }).join('');


    renderDistributionChart(allTotals);
    renderStudentsChart(students, allTotals);
    renderPieChart(approvedCount, failedCount, noGradeCount);
    renderComponentProgress();
    renderRecentActivity();

    var raSummaryHtml = '<div style="display:flex;flex-direction:column;gap:8px">';
    [['RAC seleccionados', STATE.selectedRACIds.length, 'var(--blue)'], ['RAAU definidos', STATE.raauEntries.length, 'var(--green)'], ['Actividades', activities.length, 'var(--amber)']].forEach(function (pair) {
      raSummaryHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--gray-50);border-radius:var(--radius)"><span style="font-size:.78rem;color:var(--gray-600)">' + pair[0] + '</span><span style="font-size:1rem;font-weight:700;color:' + pair[2] + '">' + pair[1] + '</span></div>';
    });
    raSummaryHtml += '</div>';
    var raTarget = document.getElementById('dash-ra-summary');
    if (raTarget) raTarget.innerHTML = raSummaryHtml;

    var previewStudents = students.slice(0, 10);
    var tbodyHtml = previewStudents.map(function (student, idx) {
      var tot = studentTotal(student.id);
      var passed = tot >= 7;
      var studentPct = pct(tot, maxTotal);
      return '<tr><td style="color:var(--gray-400)">' + (idx + 1) + '</td><td><div style="font-weight:500;font-size:.83rem">' + student.apellidos + ' ' + student.nombres + '</div><div style="font-size:.72rem;color:var(--gray-400);font-family:var(--mono)">' + formatCedula(student.cedula) + '</div></td><td><div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="width:60px"><div class="progress-fill" style="width:' + Math.min(studentPct, 100) + '%;background:' + (passed ? 'var(--green)' : 'var(--red)') + '"></div></div><span style="font-weight:700;color:' + (passed ? 'var(--green)' : 'var(--red)') + ';font-size:.83rem">' + fmt(tot) + '</span></div></td><td><span class="badge ' + (passed ? 'badge-green' : 'badge-red') + '">' + (passed ? '✓ Aprobado' : '✗ Reprobado') + '</span></td></tr>';
    }).join('');
    var dashBody = document.getElementById('dash-student-body');
    if (dashBody) dashBody.innerHTML = tbodyHtml;
  }

  function renderDistributionChart(totals) {
    if (typeof window.Chart === 'undefined') return;
    var ctx = document.getElementById('dash-chart-distribution');
    if (!ctx) return;
    if (chartDistribution) chartDistribution.destroy();
    var ranges = ['0-4', '5-6', '7-8', '9-10'];
    var counts = [0, 0, 0, 0];
    totals.forEach(function (t) { if (t < 5) counts[0]++; else if (t < 7) counts[1]++; else if (t < 9) counts[2]++; else counts[3]++; });
    chartDistribution = new window.Chart(ctx, { type: 'bar', data: { labels: ranges, datasets: [{ data: counts, backgroundColor: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'], borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } });
  }

  function renderStudentsChart(students, totals) {
    if (typeof window.Chart === 'undefined') return;
    var ctx = document.getElementById('dash-chart-students');
    if (!ctx) return;
    if (chartStudents) chartStudents.destroy();
    var shortNames = students.map(function (s) { var parts = s.apellidos.split(' '); return parts[0] + ' ' + (parts[1] ? parts[1][0] + '.' : ''); });
    chartStudents = new window.Chart(ctx, { type: 'bar', data: { labels: shortNames, datasets: [{ data: totals, backgroundColor: totals.map(function (t) { return t >= 7 ? '#22c55e' : '#ef4444'; }), borderRadius: 4 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } });
  }

  function renderPieChart(approved, failed, noGrade) {
    if (typeof window.Chart === 'undefined') return;
    var ctx = document.getElementById('dash-chart-pie');
    if (!ctx) return;
    if (chartPie) chartPie.destroy();
    chartPie = new window.Chart(ctx, { type: 'doughnut', data: { labels: ['Aprobados', 'Reprobados', 'Sin nota'], datasets: [{ data: [approved, failed, noGrade], backgroundColor: ['#22c55e', '#ef4444', '#9ca3af'], borderWidth: 0 }] }, options: { responsive: false, cutout: '65%', plugins: { legend: { display: false } } } });
    var total = approved + failed + noGrade;
    document.getElementById('dash-pie-label').textContent = total + ' estudiantes evaluados';
  }

  function renderComponentProgress() {
    var activities = STATE.activities;
    var container = document.getElementById('dash-comp-progress');
    if (!container) return;
    container.innerHTML = COMPONENTS.map(function (comp) {
      var compActs = activities.filter(function (a) { return a.component === comp; });
      var maxPts = compActs.reduce(function (s, a) { return s + a.maxScore; }, 0);
      var color = COMPONENT_COLORS[comp];
      var weight = COMPONENT_WEIGHTS[comp];
      var pctVal = (maxPts / weight * 100).toFixed(0);
      return '<div class="comp-progress-item">' +
        '<div class="comp-progress-header"><span class="comp-progress-label" style="color:' + color + '">' + comp + '</span><span class="comp-progress-value">' + maxPts.toFixed(1) + ' / ' + weight + ' pts (' + pctVal + '%)</span></div>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.min(pctVal, 100) + '%;background:' + color + '"></div></div>' +
        '<div style="font-size:.7rem;color:var(--gray-400);margin-top:3px">' + compActs.length + ' actividad' + (compActs.length !== 1 ? 'es' : '') + '</div>' +
      '</div>';
    }).join('');
  }

  function renderRecentActivity() {
    var container = document.getElementById('dash-recent-activity');
    if (!container) return;
    var activities = STATE.recentActivity.slice(0, 8);
    if (activities.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--gray-400);font-size:.82rem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:32px;height:32px;margin:0 auto 8px;display:block;opacity:.3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Aún no hay actividad reciente</div>';
      return;
    }
    var typeIcons = {
      grade: { color: 'var(--green)', bg: '#f0fdf4', icon: 'check-circle' },
      config: { color: 'var(--blue)', bg: '#eff6ff', icon: 'users' },
      student: { color: 'var(--purple)', bg: '#f5f3ff', icon: 'users' }
    };
    container.innerHTML = activities.map(function (act) {
      var style = typeIcons[act.type] || typeIcons.config;
      return '<div class="activity-item animate-in"><div class="activity-icon" style="background:' + style.bg + ';color:' + style.color + '">' + getIconSVG(style.icon, style.color) + '</div><div class="activity-text">' + act.text + '</div><div class="activity-time">' + act.time + '</div></div>';
    }).join('');
  }

  function renderEstudiantes() {
    if (!STATE.activeConfigId) {
      document.getElementById('est-sub').textContent = 'Seleccione un PAO desde MIS PAOs para cargar estudiantes.';
      document.getElementById('est-stats').innerHTML = '';
      document.getElementById('est-body').innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray-500);padding:20px">Seleccione o configure un PAO desde MIS PAOs o Configuración.</td></tr>';
      document.getElementById('est-table-title').textContent = 'Nómina (0)';
      setImportStatus('', false);
      return;
    }
    var students = STATE.students;
    var hasActivities = STATE.activities && STATE.activities.length > 0;
    updateOasisButtonText();
    document.getElementById('est-sub').textContent = students.length > 0
      ? students.length + ' estudiantes matriculados' +
        (STATE.courseConfig.asignatura ? ' en ' + STATE.courseConfig.asignatura : '')
      : 'Sin estudiantes — presione "Actualizar" para cargar la nómina desde OASIS.';
    var allTotals = students.map(function (s) { return studentTotal(s.id); });
    var approvedCount = allTotals.filter(function (t) { return t >= 7; }).length;
    var classAverage = allTotals.length > 0 ? allTotals.reduce(function (a, b) { return a + b; }, 0) / allTotals.length : 0;
    document.getElementById('est-stats').innerHTML = [
      { label: 'Total', val: students.length, color: 'var(--gray-800)' },
      { label: 'Aprobados', val: hasActivities ? approvedCount : '—', color: hasActivities ? 'var(--green)' : 'var(--gray-400)' },
      { label: 'Promedio', val: hasActivities ? classAverage.toFixed(2) : '—', color: hasActivities ? 'var(--amber)' : 'var(--gray-400)' }
    ].map(function (s) {
      return '<div class="card" style="padding:14px 18px"><div style="font-size:.75rem;color:var(--gray-400)">' + s.label + '</div><div style="font-size:1.4rem;font-weight:700;color:' + s.color + ';margin-top:3px">' + s.val + '</div></div>';
    }).join('');
    renderStudentTable();
  }

  function renderStudentTable() {
    var query = (document.getElementById('est-search') ? document.getElementById('est-search').value : '').toLowerCase();
    var queryClean = query.replace(/-/g, '');
    var filtered = STATE.students.filter(function (s) {
      var cedClean = (s.cedula || '').replace(/-/g, '');
      var searchStr = (s.apellidos + ' ' + s.nombres + ' ' + s.cedula + ' ' + (s.codigo || '') + ' ' + cedClean).toLowerCase();
      return searchStr.indexOf(query) !== -1 || searchStr.indexOf(queryClean) !== -1;
    });
    document.getElementById('est-table-title').textContent = 'Nómina (' + filtered.length + ')';
    if (filtered.length === 0) {
      document.getElementById('est-body').innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray-400);padding:28px;font-size:.82rem">' +
        (STATE.students.length === 0
          ? 'No hay estudiantes registrados. Presione "Actualizar" para cargar la nómina desde OASIS.'
          : 'No se encontraron estudiantes que coincidan con "' + query + '".') +
        '</td></tr>';
      return;
    }
    document.getElementById('est-body').innerHTML = filtered.map(function (s, i) {
      var tot = studentTotal(s.id);
      var passed = tot >= 7;
      return '<tr><td style="color:var(--gray-400)">' + (i + 1) + '</td><td style="font-family:var(--mono);font-size:.78rem">' + (s.codigo || '—') + '</td><td style="font-family:var(--mono);font-size:.78rem">' + formatCedula(s.cedula) + '</td><td style="font-weight:500">' + s.apellidos + '</td><td>' + s.nombres + '</td><td style="text-align:center;font-weight:700;font-family:var(--mono);color:' + (passed ? 'var(--green)' : 'var(--red)') + '">' + fmt(tot) + '</td><td style="text-align:center"><span class="badge ' + (passed ? 'badge-green' : 'badge-red') + '">' + (passed ? 'Aprobado' : 'Reprobado') + '</span></td><td style="text-align:center"><div style="display:flex;gap:5px;justify-content:center"><button class="btn btn-ghost btn-sm" onclick="editStudent(\'' + s.id + '\')" title="Editar">Editar</button><button class="btn btn-danger btn-sm" onclick="confirmDelete(\'' + s.id + '\')" title="Eliminar">Eliminar</button></div></td></tr>';
    }).join('');
  }

  function exportStudentsPDF() {
    if (!STATE.activeConfigId) {
      showToast('Seleccione un PAO desde MIS PAOs.', 'error');
      return;
    }
    if (!STATE.students || STATE.students.length === 0) {
      showToast('No hay estudiantes registrados para exportar.', 'error');
      return;
    }
    var c = STATE.courseConfig || {};
    var rows = STATE.students.map(function (s) {
      var grades = STATE.grades.filter(function (g) { return g.studentId === s.id; });
      var total = grades.reduce(function (sum, g) { return sum + (Number(g.score) || 0); }, 0);
      var pct = STATE.activities.length ? ((total / STATE.activities.reduce(function (s2, a) { return s2 + (Number(a.maxScore) || 0); }, 0)) * 100).toFixed(1) : '—';
      return '<tr><td>' + escapeHtml(s.codigo || '') + '</td><td>' + escapeHtml(formatCedula(s.cedula)) + '</td><td>' + escapeHtml(s.apellidos) + '</td><td>' + escapeHtml(s.nombres) + '</td><td>' + total.toFixed(2) + '</td><td>' + pct + '%</td></tr>';
    }).join('');
    var w = window.open('', '_blank', 'width=1200,height=800');
    if (!w) { showToast('Permita ventanas emergentes para exportar.', 'error'); return; }
    w.document.write('<html><head><title>Nómina - ' + escapeHtml(c.asignatura || 'Estudiantes') + '</title>' +
      '<style>body{font-family:Inter,Arial,sans-serif;margin:14px;color:#111}h1{font-size:16px;margin:0 0 4px}.sub{font-size:12px;color:#666;margin-bottom:10px}table{width:100%;border-collapse:collapse;font-size:11px}th,td{border:1px solid #ddd;padding:5px 6px;text-align:left}th{background:#f5f5f5;font-weight:600}.right{text-align:right}</style></head><body>' +
      '<h1>Nómina de Estudiantes</h1>' +
      '<div class="sub">' + escapeHtml(c.carrera || '') + ' · ' + escapeHtml(c.asignatura || '') + ' · ' + escapeHtml(c.periodoAcademico || '') + ' · Total: ' + STATE.students.length + ' estudiantes</div>' +
      '<table><thead><tr><th>Código</th><th>Cédula</th><th>Apellidos</th><th>Nombres</th><th class="right">Total</th><th class="right">%</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '</body></html>');
    w.document.close();
    w.focus();
    w.print();
  }

  function exportGradesPDF() {
    if (!STATE.activeConfigId) {
      showToast('Seleccione un PAO desde MIS PAOs.', 'error');
      return;
    }
    if (!STATE.students || STATE.students.length === 0) {
      showToast('No hay estudiantes registrados.', 'error');
      return;
    }
    if (!STATE.activities || STATE.activities.length === 0) {
      showToast('No hay actividades configuradas.', 'error');
      return;
    }
    var c = STATE.courseConfig || {};
    var grouped = COMPONENTS.map(function (comp) {
      return { comp: comp, acts: STATE.activities.filter(function (a) { return a.component === comp; }) };
    });
    var headerRow = '<tr><th rowspan="2">No.</th><th rowspan="2">Codigo</th><th rowspan="2">Cedula</th><th rowspan="2">Apellidos</th><th rowspan="2">Nombres</th>';
    grouped.forEach(function (grp) {
      grp.acts.forEach(function () { headerRow += '<th rowspan="2" style="font-size:9px">' + grp.comp + '</th>'; });
    });
    headerRow += '<th rowspan="2">Nota</th></tr>';
    var totalMax = STATE.activities.reduce(function (s, a) { return s + (Number(a.maxScore) || 0); }, 0);
    var rows = STATE.students.map(function (s, idx) {
      var tot = studentTotal(s.id);
      var cols = '<td>' + (idx + 1) + '</td><td>' + escapeHtml(s.codigo || '') + '</td><td>' + escapeHtml(formatCedula(s.cedula)) + '</td><td>' + escapeHtml(s.apellidos) + '</td><td>' + escapeHtml(s.nombres) + '</td>';
      grouped.forEach(function (grp) {
        grp.acts.forEach(function (act) {
          var g = getGrade(s.id, act.id);
          cols += '<td style="text-align:center">' + (g != null ? g.toFixed(2) : '—') + '</td>';
        });
      });
      cols += '<td style="text-align:center;font-weight:700">' + tot.toFixed(2) + '</td>';
      return '<tr>' + cols + '</tr>';
    }).join('');
    var w = window.open('', '_blank', 'width=1400,height=800');
    if (!w) { showToast('Permita ventanas emergentes para exportar.', 'error'); return; }
    w.document.write('<html><head><title>Calificaciones - ' + escapeHtml(c.asignatura || '') + '</title>' +
      '<style>body{font-family:Inter,Arial,sans-serif;margin:14px;color:#111;font-size:11px}h1{font-size:16px;margin:0 0 4px}.sub{font-size:12px;color:#666;margin-bottom:10px}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #bbb;padding:4px 5px;text-align:left}th{background:#f0f0f0;font-weight:600}</style></head><body>' +
      '<h1>Registro de Calificaciones</h1>' +
      '<div class="sub">' + escapeHtml(c.carrera || '') + ' · ' + escapeHtml(c.asignatura || '') + ' · ' + escapeHtml(c.aporte || '') + ' · PAO ' + (c.pao || '') + ' · Total estudiantes: ' + STATE.students.length + '</div>' +
      '<table><thead>' + headerRow + '</thead><tbody>' + rows + '</tbody></table>' +
      '<p style="margin-top:12px;font-size:10px;color:#999">Total maximo: ' + totalMax.toFixed(1) + ' pts · Fecha: ' + new Date().toLocaleString() + '</p>' +
      '</body></html>');
    w.document.close();
    w.focus();
    w.print();
  }

  function showGradesQR() {
    if (!STATE.activeConfigId) {
      showToast('Seleccione un PAO desde MIS PAOs.', 'error');
      return;
    }
    if (!STATE.students || STATE.students.length === 0) {
      showToast('No hay estudiantes registrados.', 'error');
      return;
    }
    var c = STATE.courseConfig || {};
    var actNames = STATE.activities.map(function (a) { return a.name; });
    var totalMax = STATE.activities.reduce(function (s, a) { return s + (Number(a.maxScore) || 0); }, 0);
    var totalExpected = STATE.students.length * STATE.activities.length;
    var totalEntered = 0;
    var allTotals = STATE.students.map(function (s) {
      var tot = studentTotal(s.id);
      STATE.activities.forEach(function (act) { if (getGrade(s.id, act.id) != null) totalEntered++; });
      return tot;
    });
    var avg = allTotals.length > 0 ? (allTotals.reduce(function (a, b) { return a + b; }, 0) / allTotals.length).toFixed(2) : '—';
    var pct = totalExpected > 0 ? Math.round(totalEntered / totalExpected * 100) : 0;

    // Build a self-contained HTML page embedded in the QR as a data URI.
    // When scanned, the phone opens this HTML in the browser.
    var actCount = STATE.activities.length;
    var compHeaders = '';
    var compRowspan = 2;
    COMPONENTS.forEach(function (comp) {
      var acts = STATE.activities.filter(function (a) { return a.component === comp; });
      if (acts.length === 0) return;
      var colSpan = acts.length;
      compHeaders += '<th colspan="' + colSpan + '" style="background:#e8f5e9;font-size:10px">' + comp + '</th>';
    });
    var actHeaders = STATE.activities.map(function (a) { return '<th style="font-size:9px">' + escapeHtml(a.name) + '<br><span style="font-weight:400;color:#888">/' + a.maxScore + '</span></th>'; }).join('');

    var tbodyRows = STATE.students.map(function (s, idx) {
      var tot = studentTotal(s.id);
      var pass = tot >= 7;
      var grades = STATE.activities.map(function (act) {
        var g = getGrade(s.id, act.id);
        return '<td style="text-align:center;font-size:10px;padding:3px 4px;' + (g != null ? '' : 'color:#ccc') + '">' + (g != null ? g.toFixed(1) : '-') + '</td>';
      }).join('');
      return '<tr><td style="text-align:center;font-size:10px;padding:3px 4px">' + (idx + 1) + '</td>' +
        '<td style="font-size:10px;padding:3px 4px">' + escapeHtml(s.codigo || '') + '</td>' +
        '<td style="font-size:10px;padding:3px 4px">' + escapeHtml(s.apellidos + ' ' + s.nombres) + '</td>' +
        grades +
        '<td style="text-align:center;font-size:10px;font-weight:700;padding:3px 4px;color:' + (pass ? '#166534' : '#991b1b') + '">' + tot.toFixed(1) + '</td></tr>';
    }).join('\n');

    var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Calificaciones</title>' +
      '<style>body{font-family:Arial,Helvetica,sans-serif;margin:10px;color:#222}h2{margin:0 0 2px;font-size:15px}.sub{margin:0 0 10px;font-size:11px;color:#666}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #ccc;padding:4px 5px;text-align:left}th{background:#f5f5f5;font-weight:600}td{vertical-align:top}@media print{body{margin:6px}}' +
      '</style></head><body>' +
      '<h2>Registro de Calificaciones</h2>' +
      '<div class="sub">' + escapeHtml(c.asignatura || '') + ' · ' + escapeHtml(c.carrera || '') + ' · ' + escapeHtml(c.aporte || '') + ' · PAO ' + (c.pao || '') + ' · ' + escapeHtml(c.periodoAcademico || '') + '<br>Fecha: ' + new Date().toLocaleString() + ' · ' + STATE.students.length + ' estudiantes</div>' +
      '<table><thead><tr><th rowspan="2" style="min-width:28px">#</th><th rowspan="2">Cod</th><th rowspan="2" style="min-width:120px">Estudiante</th>' + compHeaders + '<th rowspan="2" style="min-width:40px">Nota</th></tr><tr>' + actHeaders + '</tr></thead><tbody>' + tbodyRows + '</tbody></table>' +
      '<p style="margin-top:8px;font-size:10px;color:#888;text-align:center">Promedio: ' + avg + '/' + totalMax.toFixed(1) + ' | Notas: ' + totalEntered + '/' + totalExpected + ' (' + pct + '%)</p>' +
      '</body></html>';

    var data = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

    var expandedLines = [];
    expandedLines.push('========================================');
    expandedLines.push('REGISTRO DE CALIFICACIONES');
    expandedLines.push('========================================');
    expandedLines.push('Asignatura: ' + (c.asignatura || 'N/A') + ' | Carrera: ' + (c.carrera || 'N/A'));
    expandedLines.push('Aporte: ' + (c.aporte || 'N/A') + ' | PAO: ' + (c.pao || 'N/A') + ' | Periodo: ' + (c.periodoAcademico || 'N/A'));
    expandedLines.push('Fecha: ' + new Date().toLocaleString());
    expandedLines.push('');
    var hdr = 'No. Codigo  Cedula       Apellidos          Nombres           ';
    STATE.activities.forEach(function (a) { hdr += ' ' + a.name.slice(0, 6).padEnd(6); });
    hdr += '  Total';
    expandedLines.push(hdr);
    expandedLines.push(new Array(hdr.length + 1).join('-'));
    STATE.students.forEach(function (s, idx) {
      var r = String(idx + 1).padEnd(3) + (s.codigo || '').padEnd(7) + formatCedula(s.cedula).padEnd(13) + s.apellidos.slice(0, 16).padEnd(17) + s.nombres.slice(0, 16).padEnd(15);
      STATE.activities.forEach(function (act) {
        var g = getGrade(s.id, act.id);
        r += (g != null ? g.toFixed(1) : '-').padStart(7);
      });
      r += studentTotal(s.id).toFixed(1).padStart(7);
      expandedLines.push(r);
    });
    expandedLines.push('');
    expandedLines.push('Promedio: ' + avg + '/' + totalMax.toFixed(1) + ' | Notas: ' + totalEntered + '/' + totalExpected + ' (' + pct + '%) | Estudiantes: ' + STATE.students.length);
    expandedLines.push('========================================');
    var expanded = expandedLines.join('\n');

    var modalBody =
      '<div style="text-align:center;padding:10px">' +
      '<div id="qr-code-container" style="display:inline-block;background:#fff;padding:10px;border-radius:8px;margin-bottom:10px;border:1px solid var(--gray-200)">' +
      '<div id="qr-spinner" style="padding:40px;color:var(--gray-400)">Generando QR...</div>' +
      '</div>' +
      '<p style="font-size:.78rem;color:var(--gray-500);margin:0">Escanee el QR para abrir pagina con calificaciones. Desde el navegador puede guardar/ imprimir PDF.</p>' +
      '<p style="font-size:.7rem;color:var(--gray-400);margin-top:6px">' + escapeHtml(c.asignatura || '') + ' · ' + escapeHtml(c.carrera || '') + ' · ' + new Date().toLocaleString() + '</p>' +
      '<div style="margin-top:8px;max-height:140px;overflow:auto;text-align:left;font-family:monospace;font-size:.6rem;background:var(--gray-100);padding:8px;border-radius:6px;white-space:pre;color:var(--gray-600)">' + escapeHtml(expanded) + '</div>' +
      '</div>';

    openModal('Codigo QR - ' + (c.asignatura || 'Calificaciones'), modalBody,
      [{ label: 'Cerrar', cls: 'btn-primary', action: 'close' }]
    );

    // Load QR library dynamically and generate QR in the modal
    if (window.QRCode) {
      generateQRInline(data);
    } else {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
      script.onload = function () { generateQRInline(data); };
      script.onerror = function () {
        document.getElementById('qr-spinner').innerHTML = 'Error al cargar libreria QR.';
        document.getElementById('qr-spinner').parentNode.innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(data) + '" alt="QR" style="max-width:250px;border-radius:8px" />';
      };
      document.head.appendChild(script);
    }

    function generateQRInline(text) {
      try {
        var container = document.getElementById('qr-spinner');
        if (!container) return;
        container.innerHTML = '';
        var canvas = document.createElement('canvas');
        canvas.style.width = '220px';
        canvas.style.height = '220px';
        container.parentNode.appendChild(canvas);
        container.remove();
        QRCode.toCanvas(canvas, text, { width: 220, margin: 1, color: { dark: '#1a1a2e', light: '#ffffff' } }, function (err) {
          if (err) {
            canvas.parentNode.innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(text) + '" alt="QR" style="max-width:250px;border-radius:8px" />';
          }
        });
      } catch (e) {
        var c2 = document.getElementById('qr-code-container');
        if (c2) c2.innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(text) + '" alt="QR" style="max-width:250px;border-radius:8px" />';
      }
    }
  }

  function setImportStatus(msg, isError) {
    var status = document.getElementById('est-import-status');
    if (!status) return;
    status.textContent = msg || '';
    status.style.color = isError ? 'var(--red)' : 'var(--gray-500)';
  }

  function formatCedula(ced) {
    var c = String(ced || '').replace(/[^0-9]/g, '');
    if (c.length === 10) return c.slice(0, 9) + '-' + c.slice(9);
    return ced || '';
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Agrega estudiantes evitando duplicados por cédula. Devuelve cuántos se agregaron.
  function mergeStudents(alumnos) {
    const nuevosCount = StudentService.mergeGlobalStudents(alumnos);
    if (nuevosCount > 0) {
      persistActiveConfigData();
      save();
      renderEstudiantes();
    }
    return nuevosCount;
  }

  // Sincronización con OASIS: agrega nuevos, actualiza datos existentes, conserva calificaciones.
  async function showOasisImport() {
    if (!STATE.activeConfigId) {
      showToast('Primero seleccione un PAO desde MIS PAOs.', 'error');
      return;
    }
    var c = STATE.courseConfig || {};
    if (!c.carrera || !c.asignatura) {
      showToast('La configuración activa no tiene carrera/asignatura.', 'error');
      return;
    }
    var importBtn = document.getElementById('est-oasis-btn');
    if (importBtn) { importBtn.disabled = true; importBtn.textContent = 'Sincronizando…'; }

    setImportStatus('Sincronizando nómina de "' + c.asignatura + '" con OASIS…', false);

    try {
      var alumnos, r;
      if (c.codCarrera && c.codMateria && c.codNivel && c.codParalelo) {
        var codPeriodo = c.codPeriodo || (STATE.oasisPeriodo && STATE.oasisPeriodo.codigo) || '';
        if (!codPeriodo) {
          setImportStatus('No hay código de período disponible. Intente importar manualmente.', true);
          showOasisImportManual();
          return;
        }
        alumnos = await oasis.getAlumnosMateria({
          codCarrera: c.codCarrera, codNivel: c.codNivel, codParalelo: c.codParalelo,
          codPeriodo: codPeriodo, codMateria: c.codMateria
        });
        r = { materia: c.asignatura, nivel: c.codNivel, paralelo: c.codParalelo, periodo: c.periodoAcademico || codPeriodo };
      } else {
        // Usar el servicio para resolver nómina y guardar automáticamente en Supabase
        const result = await StudentService.syncStudentsWithOasis(STATE.activeConfigId, c);
        alumnos = result.alumnos;
        r = result.resuelto;
        StudentService.updateConfigCodes(r);
        save();
      }
      if (!alumnos || alumnos.length === 0) {
        setImportStatus('OASIS no registra estudiantes matriculados en "' + c.asignatura + '" para el período actual.', true);
        showToast('Sin estudiantes matriculados en OASIS', 'error');
        return;
      }
      
      // Sincronizar el resto de estudiantes con Supabase si se obtuvieron vía getAlumnosMateria
      if (c.codCarrera && c.codMateria && c.codNivel && c.codParalelo) {
        await StudentService.syncStudentsWithOasis(STATE.activeConfigId, c);
      }

      // Actualizar estado local y notificar
      const syncResult = await StudentService.syncStudentsWithOasis(STATE.activeConfigId, c);
      var detalle = (r.materia || c.asignatura) + ' · Nivel ' + (r.nivel || r.codNivel || '?') + ' · Paralelo ' + (r.paralelo || '?') + ' · ' + (r.periodo || '');
      if (syncResult.toAddCount === 0 && syncResult.updateCount === 0) {
        setImportStatus('Nómina de OASIS sin cambios (' + alumnos.length + ' estudiantes). ' + detalle, false);
        showToast('Nómina actualizada — sin cambios', 'success');
      } else {
        var msgParts = [];
        if (syncResult.toAddCount > 0) msgParts.push(syncResult.toAddCount + ' agregados');
        if (syncResult.updateCount > 0) msgParts.push(syncResult.updateCount + ' actualizados');
        setImportStatus(msgParts.join(', ') + ' — ' + detalle, false);
        addRecentActivity('OASIS: ' + msgParts.join(', '), 'student');
        showToast(msgParts.join(', ') + ' desde OASIS', 'success');
      }
      renderEstudiantes();
    } catch (err) {
      var errorMsg = err && err.message ? err.message : 'Error desconocido al sincronizar.';
      if (err && err.offline) errorMsg = 'OASIS/BFF no disponible.';
      setImportStatus(errorMsg, true);
      showToast(errorMsg, 'error');
      var statusBar = document.getElementById('est-import-status');
      if (statusBar) {
        statusBar.innerHTML = '<span style="color:var(--red)">' + escapeHtml(errorMsg) + '</span>' +
          '<button class="btn btn-ghost btn-sm" style="margin-left:8px;vertical-align:middle" onclick="showOasisImportManual()">Ingreso manual</button>';
      }
    } finally {
      if (importBtn) { importBtn.disabled = false; updateOasisButtonText(); }
    }
  }

  function updateOasisButtonText() {
    var btn = document.getElementById('est-oasis-btn');
    if (!btn) return;
    btn.textContent = 'Actualizar';
  }

  // Respaldo manual (offline o cuando la resolución automática falla).
  function showOasisImportManual() {
    if (!STATE.configLocked || !STATE.activeConfigId) return;
    var c = STATE.courseConfig || {};
    var periodo = (STATE.oasisPeriodo && STATE.oasisPeriodo.codigo) || '';
    var prefillCarrera = c.codCarrera || '';
    var prefillPeriodo = c.codPeriodo || periodo || '';
    var prefillNivel = c.codNivel || '';
    var prefillParalelo = c.codParalelo || '';
    var prefillMateria = c.codMateria || '';
    var prefillInfo = '';
    if (prefillCarrera || prefillNivel || prefillParalelo || prefillMateria) {
      prefillInfo = '<div style="background:var(--gray-100);border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:.75rem;color:var(--gray-600)">' +
        '<strong>Datos conocidos del sistema:</strong><br>' +
        (prefillCarrera ? 'Carrera: ' + c.carrera + ' (' + prefillCarrera + ')<br>' : '') +
        (prefillPeriodo ? 'Período: ' + (c.periodoAcademico || '') + ' (' + prefillPeriodo + ')<br>' : '') +
        (prefillNivel ? 'Nivel: ' + prefillNivel + '<br>' : '') +
        (prefillParalelo ? 'Paralelo: ' + prefillParalelo + '<br>' : '') +
        (prefillMateria ? 'Código materia: ' + prefillMateria : '') +
        '</div>';
    }
    openModal('Importar nómina desde OASIS',
      '<p style="color:var(--gray-600);font-size:.8rem;margin-bottom:12px">Ingrese los códigos OASIS para importar la nómina de estudiantes.</p>' +
      prefillInfo +
      '<div class="form-grid"><div class="form-group"><label class="form-label">Código carrera</label><input class="form-input" id="oas-carrera" value="' + prefillCarrera + '" placeholder="Ej: ITIO"></div>' +
      '<div class="form-group"><label class="form-label">Código período</label><input class="form-input" id="oas-periodo" value="' + prefillPeriodo + '" placeholder="Ej: P0045"></div></div>' +
      '<div class="form-grid-3"><div class="form-group"><label class="form-label">Nivel</label><input class="form-input" id="oas-nivel" value="' + prefillNivel + '" placeholder="Ej: 1"></div>' +
      '<div class="form-group"><label class="form-label">Paralelo</label><input class="form-input" id="oas-paralelo" value="' + prefillParalelo + '" placeholder="Ej: 1"></div>' +
      '<div class="form-group"><label class="form-label">Código materia</label><input class="form-input" id="oas-materia" value="' + prefillMateria + '" placeholder="Ej: TEI1TB02"></div></div>' +
      '<div id="oas-import-msg" style="font-size:.78rem;color:var(--gray-500);min-height:18px;margin-top:8px"></div>',
      [
        { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
        { label: 'Importar', cls: 'btn-primary', action: doOasisImport }
      ]);
  }

  async function doOasisImport() {
    var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var params = {
      codCarrera: get('oas-carrera'),
      codNivel: get('oas-nivel'),
      codParalelo: get('oas-paralelo'),
      codPeriodo: get('oas-periodo'),
      codMateria: get('oas-materia')
    };
    var msg = document.getElementById('oas-import-msg');
    var setMsg = function (text, error) {
      if (msg) { msg.textContent = text; msg.style.color = error ? 'var(--red)' : 'var(--gray-500)'; }
    };
    var importBtn = document.querySelector('.modal-actions .btn-primary');
    if (importBtn) { importBtn.disabled = true; importBtn.textContent = 'Importando…'; }
    if (!params.codCarrera || !params.codPeriodo || !params.codMateria) {
      setMsg('Carrera, período y materia son obligatorios.', true);
      if (importBtn) { importBtn.disabled = false; importBtn.textContent = 'Importar'; }
      return;
    }
    if (!/^P\d{4}$/i.test(params.codPeriodo)) {
      setMsg('El código de período debe tener formato P seguido de 4 dígitos (ej: P0045).', true);
      if (importBtn) { importBtn.disabled = false; importBtn.textContent = 'Importar'; }
      return;
    }
    if (params.codNivel && !/^\d+$/.test(params.codNivel)) {
      setMsg('El nivel debe ser numérico.', true);
      if (importBtn) { importBtn.disabled = false; importBtn.textContent = 'Importar'; }
      return;
    }
    if (params.codParalelo && !/^\d+$/.test(params.codParalelo)) {
      setMsg('El paralelo debe ser numérico.', true);
      if (importBtn) { importBtn.disabled = false; importBtn.textContent = 'Importar'; }
      return;
    }
    setMsg('Consultando OASIS…', false);
    try {
      var alumnos = await oasis.getAlumnosMateria(params);
      if (!alumnos || alumnos.length === 0) {
        setMsg('No se encontraron estudiantes para esos parámetros.', true);
        return;
      }
      // Upsert: agregar nuevos, actualizar existentes, conservar calificaciones
      var paoKey = STATE.activeConfigId || '';
      var existingStudents = (STATE.studentsByConfig[paoKey] || []).slice();
      var normalizeCed = function (v) { return String(v || '').replace(/[^0-9]/g, ''); };
      var cedMap = {};
      existingStudents.forEach(function (s) { cedMap[normalizeCed(s.cedula)] = s; });
      var addCount = 0, updateCount = 0;
      alumnos.forEach(function (a) {
        var ced = normalizeCed(a.cedula);
        if (!ced) return;
        var match = cedMap[ced];
        if (match) {
          match.apellidos = (a.apellidos || '').toUpperCase();
          match.nombres = (a.nombres || '').toUpperCase();
          if (a.codigo) match.codigo = a.codigo;
          updateCount++;
        } else {
          existingStudents.push({
            id: 's' + Date.now() + Math.random().toString(36).slice(2, 6),
            codigo: a.codigo || '',
            cedula: a.cedula,
            apellidos: (a.apellidos || '').toUpperCase(),
            nombres: (a.nombres || '').toUpperCase()
          });
          addCount++;
        }
      });
      if (addCount > 0 || updateCount > 0) {
        STATE.studentsByConfig[paoKey] = existingStudents;
        STATE.students = JSON.parse(JSON.stringify(existingStudents));
        persistActiveConfigData();
        save();
        renderEstudiantes();
      }
      // Persistir códigos usados para próximas sincronizaciones automáticas
      var foundCfg = STATE.savedConfigs.find(function (cc) { return cc.id === paoKey; });
      if (foundCfg) {
        if (params.codCarrera) { STATE.courseConfig.codCarrera = params.codCarrera; foundCfg.courseConfig.codCarrera = params.codCarrera; }
        if (params.codMateria) { STATE.courseConfig.codMateria = params.codMateria; foundCfg.courseConfig.codMateria = params.codMateria; }
        if (params.codNivel)   { STATE.courseConfig.codNivel   = params.codNivel;   foundCfg.courseConfig.codNivel   = params.codNivel; }
        if (params.codParalelo) { STATE.courseConfig.codParalelo = params.codParalelo; foundCfg.courseConfig.codParalelo = params.codParalelo; }
        if (params.codPeriodo) { STATE.courseConfig.codPeriodo = params.codPeriodo; foundCfg.courseConfig.codPeriodo = params.codPeriodo; }
        save();
      }
      addRecentActivity('OASIS: ' + (addCount > 0 ? addCount + ' agregados' : '') + (addCount > 0 && updateCount > 0 ? ', ' : '') + (updateCount > 0 ? updateCount + ' actualizados' : ''), 'student');
      closeModal();
      showToast(addCount > 0 || updateCount > 0 ? (addCount + ' agregados, ' + updateCount + ' actualizados') : 'Sin cambios', 'success');
    } catch (err) {
      setMsg(err && err.offline ? 'Servicio OASIS/BFF no disponible.' : (err.message || 'Error al importar.'), true);
    } finally {
      if (importBtn) { importBtn.disabled = false; importBtn.textContent = 'Importar'; }
    }
  }

  async function syncStudentsFromOasis(paoId) {
    if (!paoId) return null;
    var found = STATE.savedConfigs.find(function (c) { return c.id === paoId; });
    if (!found) return null;
    var c = found.courseConfig || {};
    if (!c.carrera || !c.asignatura) return { added: 0, updated: 0, unchanged: 0, errors: 0 };
    var result = { added: 0, updated: 0, unchanged: 0, errors: 0 };
    try {
      var alumnos, r;
      if (c.codCarrera && c.codMateria && c.codNivel && c.codParalelo) {
        var codPeriodo = c.codPeriodo || (STATE.oasisPeriodo && STATE.oasisPeriodo.codigo) || '';
        if (!codPeriodo) return result;
        alumnos = await oasis.getAlumnosMateria({
          codCarrera: c.codCarrera, codNivel: c.codNivel, codParalelo: c.codParalelo,
          codPeriodo: codPeriodo, codMateria: c.codMateria
        });
      } else {
        var res = await oasis.importarNomina({ carrera: c.carrera, asignatura: c.asignatura, facultad: c.facultad, docente: c.docente, codCarrera: c.codCarrera || '' });
        alumnos = (res && res.estudiantes) || [];
        r = (res && res.resuelto) || {};
        if (r.codCarrera) { c.codCarrera = r.codCarrera; if (paoId === STATE.activeConfigId) STATE.courseConfig.codCarrera = r.codCarrera; }
        if (r.codMateria) { c.codMateria = r.codMateria; if (paoId === STATE.activeConfigId) STATE.courseConfig.codMateria = r.codMateria; }
        if (r.codNivel)   { c.codNivel   = r.codNivel;   if (paoId === STATE.activeConfigId) STATE.courseConfig.codNivel = r.codNivel; }
        if (r.paralelo)   { c.codParalelo = r.paralelo;   if (paoId === STATE.activeConfigId) STATE.courseConfig.codParalelo = r.paralelo; }
        if (r.codPeriodo) { c.codPeriodo = r.codPeriodo; if (paoId === STATE.activeConfigId) STATE.courseConfig.codPeriodo = r.codPeriodo; }
        save();
      }
      if (!alumnos || alumnos.length === 0) return result;
      var normalizeCed = function (v) { return String(v || '').replace(/[^0-9]/g, ''); };
      var existingStudents = STATE.studentsByConfig[paoId] || [];
      var existingGrades = STATE.gradesByConfig[paoId] || [];
      var cedToStudent = {};
      existingStudents.forEach(function (s) { cedToStudent[normalizeCed(s.cedula)] = s; });
      var toAdd = [];
      var updateCount = 0;
      alumnos.forEach(function (a) {
        var ced = normalizeCed(a.cedula);
        if (!ced) return;
        var match = cedToStudent[ced];
        if (match) {
          match.apellidos = (a.apellidos || '').toUpperCase();
          match.nombres = (a.nombres || '').toUpperCase();
          if (a.codigo) match.codigo = a.codigo;
          updateCount++;
        } else {
          toAdd.push({
            id: 's' + Date.now() + Math.random().toString(36).slice(2, 6),
            codigo: a.codigo || '',
            cedula: a.cedula,
            apellidos: (a.apellidos || '').toUpperCase(),
            nombres: (a.nombres || '').toUpperCase()
          });
        }
      });
      if (toAdd.length > 0) existingStudents = existingStudents.concat(toAdd);
      if (toAdd.length > 0 || updateCount > 0) {
        STATE.studentsByConfig[paoId] = existingStudents;
        if (paoId === STATE.activeConfigId) {
          STATE.students = JSON.parse(JSON.stringify(existingStudents));
        }
        save();
      }
      result = { added: toAdd.length, updated: updateCount, unchanged: existingStudents.length - toAdd.length, errors: 0 };
    } catch (err) {
      result.errors = 1;
      throw err;
    }
    return result;
  }





  function editStudent(id) {
    var student = STATE.students.find(function (x) { return x.id === id; });
    if (!student) return;
    openModal('Editar Estudiante',
      '<div class="form-group"><label class="form-label">Cédula</label><input class="form-input" id="m-ced" value="' + formatCedula(student.cedula) + '"></div>' +
      '<div class="form-group"><label class="form-label">Apellidos</label><input class="form-input" id="m-ape" value="' + student.apellidos + '"></div>' +
      '<div class="form-group"><label class="form-label">Nombres</label><input class="form-input" id="m-nom" value="' + student.nombres + '"></div>',
      [
        { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
        { label: 'Guardar', cls: 'btn-success', action: function () {
          student.cedula = document.getElementById('m-ced').value.replace(/[^0-9]/g, '');
          student.apellidos = document.getElementById('m-ape').value.toUpperCase();
          student.nombres = document.getElementById('m-nom').value.toUpperCase();
          persistActiveConfigData();
          save(); renderEstudiantes(); closeModal();
          showToast('Estudiante actualizado', 'success');
        } }
      ]);
  }

  function confirmDelete(id) {
    var student = STATE.students.find(function (x) { return x.id === id; });
    openModal('Eliminar Estudiante',
      '<p style="color:var(--gray-600);font-size:.85rem">¿Desea eliminar a <strong>' + student.apellidos + ' ' + student.nombres + '</strong>? Se eliminarán sus calificaciones.</p>',
      [
        { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
        { label: 'Eliminar', cls: 'btn-danger', action: function () {
          STATE.students = STATE.students.filter(function (x) { return x.id !== id; });
          STATE.grades = STATE.grades.filter(function (g) { return g.studentId !== id; });
          persistActiveConfigData();
          save(); renderEstudiantes(); closeModal();
          showToast('Estudiante eliminado', 'success');
        } }
      ]);
  }

  function renderCalificaciones() {
    if (!STATE.activeConfigId) {
      document.getElementById('cal-sub').textContent = 'Seleccione un PAO desde MIS PAOs para registrar calificaciones.';
      document.getElementById('cal-legend').innerHTML = '';
      updateReportAvailability();
      document.getElementById('cal-grid-body').innerHTML = '<div style="padding:24px;text-align:center;color:var(--gray-500);font-size:.85rem">Seleccione un PAO desde MIS PAOs para registrar calificaciones.</div>';
      document.getElementById('cal-progress-label').textContent = '0/0 notas';
      document.getElementById('cal-progress-fill').style.width = '0%';
      document.getElementById('cal-progress-pct').textContent = '0%';
      return;
    }
    if (STATE.students.length === 0) {
      document.getElementById('cal-sub').textContent = 'No hay estudiantes registrados para el PAO activo.';
      document.getElementById('cal-legend').innerHTML = '';
      updateReportAvailability();
      document.getElementById('cal-grid-body').innerHTML = '<div style="padding:24px;text-align:center;color:var(--gray-500);font-size:.85rem">No hay estudiantes registrados para este PAO. Vaya a Estudiantes y presione "Actualizar".</div>';
      document.getElementById('cal-progress-label').textContent = '0/0 notas';
      document.getElementById('cal-progress-fill').style.width = '0%';
      document.getElementById('cal-progress-pct').textContent = '0%';
      return;
    }
    var config = STATE.courseConfig;
    document.getElementById('cal-sub').textContent = (config.asignatura || 'Sin Asignatura') + ' — ' + config.aporte + ' — PAO ' + config.pao;
    document.getElementById('cal-legend').innerHTML = COMPONENTS.map(function (comp) {
      return '<div class="comp-legend"><div class="comp-dot" style="background:' + COMPONENT_COLORS[comp] + '"></div>' + comp + ' (' + COMPONENT_WEIGHTS[comp] + ' pts)</div>';
    }).join('') + '<div class="comp-legend" style="margin-left:12px"><div style="width:11px;height:11px;border-radius:3px;background:#f0fdf4;border:1px solid #bbf7d0"></div> Con nota</div><div class="comp-legend"><div style="width:11px;height:11px;border-radius:3px;background:var(--gray-100);border:1px solid var(--gray-200)"></div> Sin nota</div>';
    updateReportAvailability();
    renderGradeTable();
  }

  function isGradesComplete() {
    var totalExpected = STATE.students.length * STATE.activities.length;
    if (totalExpected === 0) return false;
    var totalEntered = 0;
    STATE.students.forEach(function (student) {
      STATE.activities.forEach(function (act) {
        var grade = getGrade(student.id, act.id);
        if (grade != null) totalEntered++;
      });
    });
    return totalEntered === totalExpected;
  }

  function updateReportAvailability() {
    var reportNav = document.querySelector('.nav-item[data-page="reporte"]');
    if (!reportNav) return;
    reportNav.style.opacity = '1';
    reportNav.style.pointerEvents = 'auto';
    reportNav.dataset.locked = '0';
  }

  function renderGradeTable() {
    syncActivitiesWithRAAU();
    var query = (document.getElementById('cal-search') ? document.getElementById('cal-search').value : '').toLowerCase();
    var queryClean = query.replace(/-/g, '');
    var filtered = STATE.students.filter(function (s) {
      var cedClean = (s.cedula || '').replace(/-/g, '');
      var searchStr = (s.apellidos + ' ' + s.nombres + ' ' + s.cedula + ' ' + (s.codigo || '') + ' ' + cedClean).toLowerCase();
      return searchStr.indexOf(query) !== -1 || searchStr.indexOf(queryClean) !== -1;
    });
    var activities = STATE.activities;
    if (activities.length === 0) {
      document.getElementById('cal-progress-label').textContent = '0/0 notas';
      document.getElementById('cal-progress-fill').style.width = '0%';
      document.getElementById('cal-progress-pct').textContent = '0%';
      document.getElementById('cal-grid-body').innerHTML =
        '<div style="padding:18px;color:var(--gray-600);font-size:.85rem">No hay actividades configuradas todavía. Vaya a Configuración y registre actividades por componente para habilitar la tabla completa de calificaciones.</div>';
      updateReportAvailability();
      return;
    }
    var totalExpected = STATE.students.length * activities.length;
    var totalEntered = 0;
    STATE.students.forEach(function (student) {
      activities.forEach(function (act) {
        var grade = getGrade(student.id, act.id);
        if (grade != null) totalEntered++;
      });
    });
    var progressPct = pct(totalEntered, totalExpected);
    document.getElementById('cal-progress-label').textContent = totalEntered + '/' + totalExpected + ' notas';
    document.getElementById('cal-progress-fill').style.width = Math.min(progressPct, 100) + '%';
    document.getElementById('cal-progress-fill').style.background = progressPct < 40 ? 'var(--red)' : (progressPct < 80 ? 'var(--amber)' : 'var(--green)');
    document.getElementById('cal-progress-pct').textContent = Math.min(progressPct, 100) + '%';

    var grouped = COMPONENTS.map(function (comp) {
      return { comp: comp, acts: activities.filter(function (a) { return a.component === comp; }) };
    });

    var html = '<table class="grade-table results-table"><thead>';
    html += '<tr><th colspan="5" style="text-align:left">Resultado de aprendizaje de la carrera alcanzado</th>';
    grouped.forEach(function (grp) {
      if (grp.acts.length === 0) html += '<th style="font-size:.62rem">—</th>';
      grp.acts.forEach(function (act) {
        var linkedRaau = STATE.raauEntries.find(function (r) { return r.id === act.raauId; });
        var rac = CAREER_RACS.find(function (r) { return r.id === (linkedRaau ? linkedRaau.racId : act.racId); });
        html += '<th style="font-size:.62rem">' + (rac ? rac.code : 'RAC') + '</th>';
      });
    });
    html += '<th rowspan="4">SUMA</th><th rowspan="4">NOTA<br>FINAL</th></tr>';

    html += '<tr><th colspan="5" style="text-align:left">Resultado de aprendizaje de la asignatura alcanzado</th>';
    grouped.forEach(function (grp) {
      if (grp.acts.length === 0) html += '<th style="font-size:.62rem">—</th>';
      grp.acts.forEach(function (act) {
        var raau = STATE.raauEntries.find(function (r) { return r.id === act.raauId; });
        html += '<th style="font-size:.62rem">' + (raau ? raau.code : 'RAAU') + '</th>';
      });
    });
    html += '</tr>';

    html += '<tr><th rowspan="2" style="min-width:35px">No.</th><th rowspan="2">Código</th><th rowspan="2">Cédula</th><th rowspan="2">Apellidos</th><th rowspan="2">Nombres</th>';
    grouped.forEach(function (grp) {
      var bg = grp.comp === 'ACD' ? '#8bc34a' : grp.comp === 'APEX' ? '#7cb342' : '#689f38';
      var colSpan = Math.max(grp.acts.length, 1);
      html += '<th colspan="' + colSpan + '" style="background:' + bg + ';color:#111">' + grp.comp + ' (' + COMPONENT_WEIGHTS[grp.comp] + ')</th>';
    });
    html += '</tr><tr>';
    grouped.forEach(function (grp) {
      if (grp.acts.length === 0) html += '<th style="font-size:.62rem;color:var(--gray-400)">Sin actividades</th>';
      else grp.acts.forEach(function (act) { html += '<th style="font-size:.62rem">' + act.name + '<br><span style="font-size:.6rem;color:var(--gray-400)">/' + act.maxScore + '</span></th>'; });
    });
    html += '</tr></thead><tbody>';

    filtered.forEach(function (student, idx) {
      var tot = studentTotal(student.id);
      var passed = tot >= 7;
      html += '<tr><td>' + (idx + 1) + '</td><td style="font-family:var(--mono);font-size:.7rem">' + (student.codigo || '') + '</td><td style="font-family:var(--mono)">' + formatCedula(student.cedula) + '</td><td class="cell-name">' + student.apellidos + '</td><td class="cell-name">' + student.nombres + '</td>';

      grouped.forEach(function (grp) {
        if (grp.acts.length === 0) { html += '<td style="text-align:center;color:var(--gray-400)">—</td>'; return; }
        grp.acts.forEach(function (act) {
          var gradeVal = getGrade(student.id, act.id);
          var hasValue = gradeVal != null;
          var isOver = hasValue && gradeVal > act.maxScore;
          html += '<td><input class="grade-input ' + (hasValue ? 'has-val' : '') + (isOver ? ' over' : '') + '" type="number" step="0.01" min="0" max="' + act.maxScore + '" data-sid="' + student.id + '" data-aid="' + act.id + '" data-max="' + act.maxScore + '" value="' + (hasValue ? gradeVal : '') + '" oninput="onGradeInput(this)" onchange="onGradeChange(this)" placeholder="—"></td>';
        });
      });

      html += '<td><input class="grade-readonly" type="text" readonly value="' + fmt(tot) + '" title="Suma total"></td>';
      html += '<td><input class="grade-total-input ' + (passed ? 'pass' : 'fail') + '" type="text" readonly value="' + fmt(tot) + '" title="Nota Final"></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    document.getElementById('cal-grid-body').innerHTML = html;
    updateReportAvailability();
  }

  function onGradeInput(el) {
    var maxVal = parseFloat(el.dataset.max);
    var currentVal = parseFloat(el.value);
    el.classList.remove('has-val', 'over');
    if (!isNaN(currentVal)) el.classList.add(currentVal > maxVal ? 'over' : 'has-val');
  }

  function onGradeChange(el) {
    var sid = el.dataset.sid;
    var aid = el.dataset.aid;
    var maxVal = parseFloat(el.dataset.max);
    var raw = parseFloat(el.value);
    var score = null;
    if (!isNaN(raw)) score = Math.round(Math.max(0, Math.min(maxVal, raw)) * 100) / 100;
    setGrade(sid, aid, score);
    if (score != null) el.value = score;
    if (score != null) {
      el.classList.remove('has-val', 'over');
      el.classList.add(score > maxVal ? 'over' : 'has-val');
    } else el.classList.remove('has-val', 'over');
    renderGradeTable();
  }

  function calSave() {
    persistActiveConfigData();
    save();
    addRecentActivity('Calificaciones guardadas manualmente', 'grade');
    var btn = document.getElementById('cal-save-btn');
    if (btn) {
      btn.style.background = 'var(--green)';
      btn.innerHTML = '✓ Guardado';
      setTimeout(function () { btn.style.background = ''; btn.innerHTML = 'Guardar'; }, 2000);
    }
    showToast('Calificaciones guardadas', 'success');
  }

  function renderReporte(confirmed) {
    if (!STATE.activeConfigId || STATE.students.length === 0 || STATE.activities.length === 0) {
      document.getElementById('rep-stats').innerHTML = '';
      document.getElementById('rep-dist').innerHTML = '';
      document.getElementById('rep-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--gray-500);font-size:.9rem">' +
        (!STATE.activeConfigId ? 'Seleccione un PAO desde MIS PAOs para generar el reporte.' :
        STATE.students.length === 0 ? 'No hay estudiantes registrados para este PAO.' :
        'No hay actividades configuradas.') +
        '</div>';
      return;
    }
    var gradesComplete = isGradesComplete();
    var totalExpected = STATE.students.length * STATE.activities.length;
    var totalEntered = 0;
    STATE.students.forEach(function (s) { STATE.activities.forEach(function (a) { if (getGrade(s.id, a.id) != null) totalEntered++; }); });
    if (!confirmed && !gradesComplete) {
      var pct = Math.round(totalEntered / totalExpected * 100);
      openModal('Calificaciones Incompletas',
        '<div style="font-size:.85rem;color:var(--gray-700)">' +
        '<p>Ha ingresado <strong>' + totalEntered + '/' + totalExpected + ' (' + pct + '%)</strong> de las calificaciones.</p>' +
        '<p>El reporte se generara con las notas actuales. Los estudiantes sin nota registrada apareceran con 0.</p>' +
        '<p style="font-weight:600;margin-top:12px">¿Esta de acuerdo con generar el reporte con las calificaciones actuales?</p>' +
        '</div>',
        [
          { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
          { label: 'Si, generar reporte', cls: 'btn-primary', action: function () { closeModal(); renderReporte(true); } }
        ]
      );
      return;
    }
    syncActivitiesWithRAAU();
    var config = STATE.courseConfig;
    var activities = STATE.activities;
    var students = STATE.students;
    var allTotals = students.map(function (s) { return studentTotal(s.id); });
    var classAverage = allTotals.length > 0 ? allTotals.reduce(function (a, b) { return a + b; }, 0) / allTotals.length : 0;
    var maxNote = allTotals.length > 0 ? Math.max.apply(null, allTotals) : 0;
    var minNote = allTotals.filter(function (t) { return t > 0; }).length > 0 ? Math.min.apply(null, allTotals.filter(function (t) { return t > 0; })) : 0;
    var approvedCount = allTotals.filter(function (t) { return t >= 7; }).length;
    document.getElementById('rep-stats').innerHTML = [
      { label: 'Promedio', val: classAverage.toFixed(2), color: 'var(--gray-800)' },
      { label: 'Aprobados', val: approvedCount + '/' + students.length, color: 'var(--green)' },
      { label: 'Nota Máx.', val: maxNote.toFixed(2), color: 'var(--purple)' },
      { label: 'Nota Mín.', val: minNote.toFixed(2), color: 'var(--amber)' }
    ].map(function (s) {
      return '<div class="stat-card"><div class="stat-row"><div><div class="stat-label">' + s.label + '</div><div class="stat-val" style="color:' + s.color + '">' + s.val + '</div></div></div></div>';
    }).join('');

    var distribution = [
      { label: '9-10', min: 9, max: 10.01, color: 'var(--green)' },
      { label: '8-9', min: 8, max: 9, color: 'var(--blue)' },
      { label: '7-8', min: 7, max: 8, color: 'var(--amber)' },
      { label: '6-7', min: 6, max: 7, color: '#f97316' },
      { label: '<6', min: 0, max: 6, color: 'var(--red)' }
    ].map(function (d) {
      return { label: d.label, min: d.min, max: d.max, color: d.color, count: allTotals.filter(function (t) { return t >= d.min && t < d.max; }).length };
    });
    var maxDist = Math.max.apply(null, distribution.map(function (d) { return d.count; }).concat([1]));
    document.getElementById('rep-dist').innerHTML = distribution.map(function (d) {
      return '<div class="dist-bar-wrap"><span class="dist-count" style="color:' + d.color + '">' + d.count + '</span><div class="dist-bar" style="height:' + (d.count / maxDist * 100) + '%;background:' + d.color + '"></div><span class="dist-label">' + d.label + '</span></div>';
    }).join('');

    var grouped = COMPONENTS.map(function (comp) {
      return { comp: comp, acts: activities.filter(function (a) { return a.component === comp; }) };
    });
    var reportHtml = '<div class="report-header"><div class="report-institution">ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO</div><div class="report-subtitle">Sede Orellana — Evaluación formativa y sumativa para alcanzar los resultados de aprendizaje</div></div>' +
      '<div class="report-info-grid">' +
      '<div class="report-info-cell"><span class="report-info-label">Período académico: </span><span class="report-info-val">' + config.periodoAcademico + '</span></div>' +
      '<div class="report-info-cell"><span class="report-info-label">Asignatura: </span><span class="report-info-val">' + config.asignatura + '</span></div>' +
      '<div class="report-info-cell"><span class="report-info-label">Facultad: </span><span class="report-info-val">' + config.facultad + '</span></div>' +
      '<div class="report-info-cell"><span class="report-info-label">PAO: </span><span class="report-info-val">' + (config.pao || '—') + '</span></div>' +
      '<div class="report-info-cell"><span class="report-info-label">Carrera: </span><span class="report-info-val">' + config.carrera + '</span></div>' +
      '<div class="report-info-cell"><span class="report-info-label">Aporte: </span><span class="report-info-val">' + config.aporte + '</span></div>' +
      '<div class="report-info-cell"><span class="report-info-label">Docente: </span><span class="report-info-val">' + (config.docente || '—') + '</span></div>' +
      '<div class="report-info-cell"><span class="report-info-label">Total estudiantes: </span><span class="report-info-val">' + students.length + '</span></div>' +
      '</div>';
    if (!gradesComplete) {
      reportHtml += '<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:8px 12px;margin-bottom:10px;font-size:.75rem;color:#92400e">' +
        'Reporte generado con calificaciones incompletas (' + totalEntered + '/' + totalExpected + ' notas ingresadas). Aceptado por el docente responsable.</div>';
    }
    reportHtml += '<div class="report-table-wrap"><table class="report-table results-table"><thead><tr>' +
      '<th colspan="4" style="text-align:left">Resultado de aprendizaje de la carrera alcanzado</th>';
    grouped.forEach(function (grp) {
      grp.acts.forEach(function (act) {
        var linkedRaau = STATE.raauEntries.find(function (r) { return r.id === act.raauId; });
        var rac = CAREER_RACS.find(function (r) { return r.id === (linkedRaau ? linkedRaau.racId : act.racId); });
        reportHtml += '<th style="font-size:.62rem">' + (rac ? rac.code : 'RAC') + '</th>';
      });
    });
    reportHtml += '<th rowspan="4">Sumatoria</th><th rowspan="4">Nota final</th></tr>';
    reportHtml += '<tr><th colspan="4" style="text-align:left">Resultado de aprendizaje de la asignatura alcanzado</th>';
    grouped.forEach(function (grp) {
      grp.acts.forEach(function (act) {
        var raauEntry = STATE.raauEntries.find(function (r) { return r.id === act.raauId; });
        reportHtml += '<th style="font-size:.62rem">' + (raauEntry ? raauEntry.code : 'RAAU') + '</th>';
      });
    });
    reportHtml += '</tr>';
    reportHtml += '<tr><th rowspan="2" style="min-width:35px">No.</th><th rowspan="2">Cédula</th><th rowspan="2">Apellidos</th><th rowspan="2">Nombres</th>';
    grouped.forEach(function (grp) {
      var bg = grp.comp === 'ACD' ? '#8bc34a' : grp.comp === 'APEX' ? '#7cb342' : '#689f38';
      reportHtml += '<th colspan="' + grp.acts.length + '" style="background:' + bg + ';color:#111">' + grp.comp + ' (' + COMPONENT_WEIGHTS[grp.comp] + ')</th>';
    });
    reportHtml += '</tr>';
    reportHtml += '<tr>';
    grouped.forEach(function (grp) {
      grp.acts.forEach(function (act) {
        reportHtml += '<th style="font-size:.62rem">' + act.name + '</th>';
      });
    });
    reportHtml += '</tr></thead><tbody>';
    students.forEach(function (s, idx) {
      var tot = studentTotal(s.id);
      reportHtml += '<tr><td>' + (idx + 1) + '</td><td style="font-family:var(--mono)">' + formatCedula(s.cedula) + '</td><td class="cell-name">' + s.apellidos + '</td><td class="cell-name">' + s.nombres + '</td>';
      grouped.forEach(function (grp) {
        grp.acts.forEach(function (act) {
          var grade = getGrade(s.id, act.id);
          reportHtml += '<td>' + (grade != null ? fmt(grade) : '—') + '</td>';
        });
      });
      reportHtml += '<td class="cell-grade">' + fmt(tot) + '</td><td class="cell-grade cell-nota ' + (tot >= 7 ? 'pass' : 'fail') + '">' + fmt(tot) + '</td></tr>';
    });
    reportHtml += '</tbody></table></div>';
    document.getElementById('rep-printable').innerHTML = reportHtml;
  }

  function renderCoordinacion(section) {
    var target = document.getElementById('coord-content');
    if (!target) return;
    var titleEl = document.querySelector('#page-coordinacion .page-title');
    var subEl = document.querySelector('#page-coordinacion .page-sub');
    var labels = {
      overview: ['Panel de Coordinación', 'Monitoreo de aplicación RAC/RAAU y mapeo curricular'],
      asignaturas: ['Asignaturas', 'Asignación docente y seguimiento por asignatura'],
      rac: ['RAC', 'Gestión de resultados de aprendizaje de carrera'],
      raau: ['RAAU', 'Gestión de resultados de aprendizaje de asignatura'],
      docentes: ['Docentes por Asignatura', 'Monitoreo y matriz docente/asignaturas']
    };
    var selected = labels[section || 'overview'] || labels.overview;
    if (titleEl) titleEl.textContent = selected[0];
    if (subEl) subEl.textContent = selected[1];
    var totalConfigs = STATE.savedConfigs.length;
    var totalStudents = Object.keys(STATE.studentsByConfig || {}).reduce(function (sum, key) { return sum + (STATE.studentsByConfig[key] || []).length; }, 0);
    var completion = STATE.savedConfigs.map(function (cfg) {
      var sid = cfg.id;
      var students = (STATE.studentsByConfig[sid] || []);
      var grades = (STATE.gradesByConfig[sid] || []);
      var acts = (cfg.activities || []);
      var expected = students.length * acts.length;
      var entered = grades.filter(function (g) { return g.score != null; }).length;
      return { cfg: cfg, pct: expected > 0 ? Math.round(entered / expected * 100) : 0 };
    });
    var avgCompletion = completion.length ? Math.round(completion.reduce(function (s, c) { return s + c.pct; }, 0) / completion.length) : 0;
    var docentes = {};
    completion.forEach(function (item) {
      var doc = (item.cfg.courseConfig && item.cfg.courseConfig.docente) || 'Sin docente';
      if (!docentes[doc]) docentes[doc] = { count: 0, total: 0 };
      docentes[doc].count++;
      docentes[doc].total += item.pct;
    });
    var docenteRows = Object.keys(docentes).map(function (doc) {
      var d = docentes[doc];
      return '<tr><td>' + doc + '</td><td>' + d.count + '</td><td>' + Math.round(d.total / d.count) + '%</td></tr>';
    }).join('');
    var cfgRows = completion.map(function (item) {
      var cfg = item.cfg.courseConfig || {};
      return '<tr><td>' + (cfg.asignatura || '—') + '</td><td>' + (cfg.docente || '—') + '</td><td>' + (cfg.pao || '—') + '</td><td>' + item.pct + '%</td><td><button class="btn btn-edit btn-sm" onclick="coordOpenConfig(\'' + item.cfg.id + '\')">Gestionar</button></td></tr>';
    }).join('');
    var careerOptions = Object.keys(DB_ESPOCH).map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
    // El coordinador también es docente: puede asignarse asignaturas a sí mismo.
    var assignablePeople = [COORDINADOR].concat(getDocentes());
    var docenteOptions = assignablePeople.map(function (u) {
      return '<option value="' + u.email + '">' + u.name + (u.role === 'coordinador' ? ' (coordinador)' : '') + '</option>';
    }).join('');
    section = section || 'overview';
    var showOverview = section === 'overview';
    var showAsignaturas = section === 'asignaturas';
    var showDocentes = section === 'docentes';
    var showRAC = section === 'rac';
    var showRAAU = section === 'raau';
    target.innerHTML =
      '<div class="coord-layout">' +
      '<div class="stat-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:0"><div class="stat-card"><div class="stat-label">Configuraciones activas</div><div class="stat-val" style="color:var(--gray-800)">' + totalConfigs + '</div><div class="stat-sub">Histórico guardado</div></div><div class="stat-card"><div class="stat-label">Estudiantes monitoreados</div><div class="stat-val" style="color:var(--green)">' + totalStudents + '</div><div class="stat-sub">Suma de todas las configuraciones</div></div><div class="stat-card"><div class="stat-label">Avance promedio</div><div class="stat-val" style="color:var(--amber)">' + avgCompletion + '%</div><div class="stat-sub">Carga global de notas</div></div></div>' +
      ((showOverview || showDocentes) ? '<div class="coord-chart-grid"><div class="card"><div class="card-header"><div class="card-title">Aporte por asignatura a cada RAC</div></div><div class="card-body"><canvas id="coord-chart-docentes" height="200"></canvas></div></div><div class="card"><div class="card-header"><div class="card-title">Top asignaturas que más aportan RAC</div></div><div class="card-body"><canvas id="coord-chart-configs" height="200"></canvas></div></div></div>' : '') +
      (showDocentes ? '<div class="card" style="margin-bottom:16px"><div class="card-header"><div class="card-title">Monitoreo docente</div></div><div class="card-body"><table class="data"><thead><tr><th>Docente</th><th>Asignaturas</th><th>Avance</th></tr></thead><tbody>' + (docenteRows || '<tr><td colspan="3">Sin datos</td></tr>') + '</tbody></table></div></div>' : '') +
      (showAsignaturas ? '<div class="card"><div class="card-header"><div class="card-title">Docentes y sus asignaturas</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-success btn-sm" onclick="coordImportDocentes()">⬇ Importar de OASIS</button><button class="btn btn-primary btn-sm" onclick="coordAddDocente()">+ Docente</button></div></div><div class="card-body"><p style="font-size:.78rem;color:var(--gray-500);margin-bottom:6px">Importa docentes con sus cargas (materia · nivel · paralelo) desde OASIS y asígnales una contraseña. Cada docente solo verá y calificará sus propias asignaturas.</p><div id="coord-docentes-list"></div></div></div>' : '') +
      (showAsignaturas ? '<div class="card"><div class="card-header"><div class="card-title">Asignar una asignatura manualmente</div></div><div class="card-body"><div class="form-grid"><div class="form-group"><label class="form-label">Docente</label><select class="form-select" id="coord-doc-email"><option value="">Seleccione docente</option>' + docenteOptions + '</select></div><div class="form-group"><label class="form-label">Carrera</label><select class="form-select" id="coord-career-assignment" onchange="coordLoadSubjectsAssignment()"><option value="">Seleccione carrera</option>' + careerOptions + '</select></div></div><div class="form-grid"><div class="form-group"><label class="form-label">PAO</label><select class="form-select" id="coord-pao-assignment"><option value="">Seleccione PAO</option></select></div><div class="form-group"><label class="form-label">Asignatura</label><select class="form-select" id="coord-subject-assignment"><option value="">Seleccione asignatura</option></select></div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="coordCreateAssignment()">Asignar asignatura</button><button class="btn btn-ghost btn-sm" onclick="coordAddAsignatura()">+ Crear asignatura en malla</button></div></div></div>' : '') +
      (showAsignaturas ? '<div class="card"><div class="card-header"><div class="card-title">Configuraciones guardadas (todas)</div><button class="btn btn-primary btn-sm" onclick="coordCreateConfig()">Nueva configuración</button></div><div class="card-body" style="overflow-x:auto"><table class="data"><thead><tr><th>Asignatura</th><th>Docente</th><th>PAO</th><th>Progreso</th><th></th></tr></thead><tbody>' + (cfgRows || '<tr><td colspan="5" style="text-align:center;color:var(--gray-500);padding:16px">Sin configuraciones guardadas</td></tr>') + '</tbody></table></div></div>' : '') +
      (showRAC ? '<div class="card"><div class="card-header"><div class="card-title">Gestión de RAC</div></div><div class="card-body"><div class="form-grid"><div class="form-group"><label class="form-label">Carrera</label><select class="form-select" id="coord-career-rac" onchange="coordRenderRACList()"><option value="">Seleccione carrera</option>' + careerOptions + '</select></div><div class="form-group" style="display:flex;align-items:flex-end"><button class="btn btn-edit btn-sm" onclick="coordManualRAC()">Agregar RAC manual</button></div></div><div id="coord-rac-list" style="margin-top:10px;font-size:.8rem;color:var(--gray-600)">Seleccione carrera para listar RAC.</div></div></div>' : '') +
      (showRAAU ? '<div class="card"><div class="card-header"><div class="card-title">Gestión global RAAU por asignatura</div></div><div class="card-body"><div class="form-grid"><div class="form-group"><label class="form-label">Carrera</label><select class="form-select" id="coord-career" onchange="coordLoadSubjects()"><option value="">Seleccione carrera</option>' + careerOptions + '</select></div><div class="form-group"><label class="form-label">Asignatura</label><select class="form-select" id="coord-subject" onchange="coordRenderRAAUList()"><option value="">Seleccione asignatura</option></select></div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-edit btn-sm" onclick="coordEditMapping()">Editar mapeo RAC/RAAU</button><button class="btn btn-edit btn-sm" onclick="coordManualRAAU()">Agregar RAAU manual</button><button class="btn btn-ghost btn-sm" onclick="coordTriggerExcel()">Importar Excel RAC/RAAU</button><input type="file" id="coord-excel-input" accept=".xlsx,.xls,.csv" style="display:none" onchange="coordImportExcel(this.files)"></div><div id="coord-raau-list" style="margin-top:10px"></div></div></div>' : '') +
      (showDocentes ? '<div class="card"><div class="card-header"><div class="card-title">Docentes por Asignatura (Matriz)</div></div><div class="card-body"><table class="data"><thead><tr><th>Docente</th><th>Asignaturas asignadas</th><th>Total</th></tr></thead><tbody>' + coordDocenteMatrixRows() + '</tbody></table></div></div>' : '') +
      '</div>';
    if (showOverview || showDocentes) renderCoordCharts(docentes, completion);
    if (showRAC) coordRenderRACList();
    if (showRAAU) coordRenderRAAUList();
    if (showAsignaturas) coordRenderDocentesList();
  }

  function coordDocenteMatrixRows() {
    var grouped = {};
    (STATE.teacherAssignments || []).forEach(function (a) {
      if (!grouped[a.docenteNombre]) grouped[a.docenteNombre] = [];
      grouped[a.docenteNombre].push(a.asignatura + ' (PAO ' + a.pao + ')');
    });
    var names = Object.keys(grouped);
    if (names.length === 0) return '<tr><td colspan="3">Sin asignaciones</td></tr>';
    return names.map(function (name) {
      return '<tr><td>' + name + '</td><td>' + grouped[name].join(', ') + '</td><td>' + grouped[name].length + '</td></tr>';
    }).join('');
  }

  function renderCoordCharts(docentesMap, completion) {
    if (typeof window.Chart === 'undefined') return;
    var racCodes = ['RAC1', 'RAC2', 'RAC3', 'RAC4', 'RAC5', 'RAC6', 'RAC7', 'RAC8'];
    var subjectRacCounter = {};
    var subjectCounter = {};
    completion.forEach(function (item) {
      var cfg = item.cfg || {};
      var subject = (cfg.courseConfig && cfg.courseConfig.asignatura) || 'Sin asignatura';
      (cfg.raauEntries || []).forEach(function (r) {
        var racObj = CAREER_RACS.find(function (rac) { return rac.id === r.racId || rac.code === r.racId; });
        var racCode = racObj ? racObj.code : (String(r.racId || '').toUpperCase());
        if (racCodes.indexOf(racCode) === -1) racCodes.push(racCode);
        if (!subjectRacCounter[subject]) subjectRacCounter[subject] = {};
        if (subjectRacCounter[subject][racCode] == null) subjectRacCounter[subject][racCode] = 0;
        subjectRacCounter[subject][racCode]++;
        if (!subjectCounter[subject]) subjectCounter[subject] = 0;
        subjectCounter[subject]++;
      });
    });
    var topSubjects = Object.keys(subjectCounter).sort(function (a, b) { return subjectCounter[b] - subjectCounter[a]; }).slice(0, 6);
    var palette = ['#1d4ed8', '#2563eb', '#0284c7', '#0891b2', '#0d9488', '#16a34a', '#f59e0b', '#f97316'];
    var racDatasets = racCodes.map(function (racCode, index) {
      return {
        label: racCode,
        data: topSubjects.map(function (subject) {
          return (subjectRacCounter[subject] && subjectRacCounter[subject][racCode]) || 0;
        }),
        backgroundColor: palette[index % palette.length],
        borderRadius: 4
      };
    }).filter(function (dataset) {
      return dataset.data.some(function (v) { return v > 0; });
    });
    var ctxDoc = document.getElementById('coord-chart-docentes');
    if (ctxDoc) {
      if (chartCoordDocentes) chartCoordDocentes.destroy();
      chartCoordDocentes = new window.Chart(ctxDoc, {
        type: 'bar',
        data: { labels: topSubjects.length ? topSubjects : ['Sin datos'], datasets: topSubjects.length ? racDatasets : [{ label: 'Sin datos', data: [0], backgroundColor: '#cbd5e1' }] },
        options: {
          plugins: { legend: { position: 'bottom' } },
          responsive: true,
          scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
        }
      });
    }
    var overallTopSubjects = Object.keys(subjectCounter).sort(function (a, b) { return subjectCounter[b] - subjectCounter[a]; }).slice(0, 7);
    var ctxCfg = document.getElementById('coord-chart-configs');
    if (ctxCfg) {
      if (chartCoordConfigs) chartCoordConfigs.destroy();
      chartCoordConfigs = new window.Chart(ctxCfg, {
        type: 'bar',
        data: {
          labels: overallTopSubjects.length ? overallTopSubjects : ['Sin datos'],
          datasets: [{
            label: 'Total de RAAU vinculados a RAC',
            data: overallTopSubjects.length ? overallTopSubjects.map(function (s) { return subjectCounter[s]; }) : [0],
            backgroundColor: '#22c55e',
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          responsive: true,
          scales: { x: { beginAtZero: true } }
        }
      });
    }
  }

  function printDetailedReport() {
    var printable = document.getElementById('rep-printable');
    if (!printable || !printable.innerHTML.trim()) {
      showToast('No hay contenido del reporte detallado para imprimir.', 'error');
      return;
    }
    var w = window.open('', '_blank', 'width=1200,height=800');
    if (!w) {
      showToast('Permita ventanas emergentes para imprimir el reporte.', 'error');
      return;
    }
    w.document.write('<html><head><title>Reporte Detallado</title><style>body{font-family:Inter,Arial,sans-serif;margin:14px;color:#111}table{width:100%;border-collapse:collapse;font-size:11px}th,td{border:1px solid #ddd;padding:6px;vertical-align:top}h1{font-size:16px;margin:0 0 10px} .report-info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px} .signatures-container{margin-top:20px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}</style></head><body><h1>Reporte Detallado</h1>' + printable.innerHTML + '</body></html>');
    w.document.close();
    setTimeout(function () { w.focus(); w.print(); }, 120);
  }

  function coordLoadSubjects() {
    var career = document.getElementById('coord-career').value;
    var subject = document.getElementById('coord-subject');
    if (!subject) return;
    subject.innerHTML = '<option value="">Seleccione asignatura</option>';
    if (!career || !DB_ESPOCH[career]) return;
    Object.keys(DB_ESPOCH[career].malla || {}).forEach(function (paoKey) {
      (DB_ESPOCH[career].malla[paoKey] || []).forEach(function (mat) {
        subject.innerHTML += '<option value="' + mat + '">' + paoKey + ' · ' + mat + '</option>';
      });
    });
  }

  function coordLoadSubjectsAssignment() {
    var career = document.getElementById('coord-career-assignment').value;
    var paoSelect = document.getElementById('coord-pao-assignment');
    var subject = document.getElementById('coord-subject-assignment');
    if (!paoSelect || !subject) return;
    paoSelect.innerHTML = '<option value="">Seleccione PAO</option>';
    subject.innerHTML = '<option value="">Seleccione asignatura</option>';
    if (!career || !DB_ESPOCH[career]) return;
    Object.keys(DB_ESPOCH[career].malla || {}).forEach(function (paoKey) {
      paoSelect.innerHTML += '<option value="' + paoKey + '">' + paoKey + '</option>';
    });
    paoSelect.onchange = function () {
      subject.innerHTML = '<option value="">Seleccione asignatura</option>';
      (DB_ESPOCH[career].malla[paoSelect.value] || []).forEach(function (mat) {
        subject.innerHTML += '<option value="' + mat + '">' + mat + '</option>';
      });
    };
  }

  function coordCreateAssignment() {
    var docEmail = document.getElementById('coord-doc-email').value;
    var career = document.getElementById('coord-career-assignment').value;
    var pao = document.getElementById('coord-pao-assignment').value;
    var subject = document.getElementById('coord-subject-assignment').value;
    if (!docEmail || !career || !pao || !subject) {
      showToast('Complete docente, carrera, PAO y asignatura.', 'error');
      return;
    }
    var docente = findUserByEmail(docEmail);
    var mapped = (DB_ESPOCH[career].asignaturas[subject] && DB_ESPOCH[career].asignaturas[subject].raau) || [];
    var racIds = [];
    mapped.forEach(function (m) { if (racIds.indexOf(m.racId) === -1) racIds.push(m.racId); });
    STATE.teacherAssignments.unshift({
      id: 'asg_' + Date.now(),
      docenteEmail: docEmail,
      docenteNombre: docente ? docente.name : docEmail,
      carrera: career,
      pao: pao,
      asignatura: subject,
      racs: racIds.slice(),
      raau: JSON.parse(JSON.stringify(mapped))
    });
    var snapshot = {
      id: 'cfg_' + Date.now(),
      savedAt: new Date().toLocaleString(),
      ownerEmail: docEmail,
      courseConfig: { periodoAcademico: '', facultad: 'SEDE ORELLANA', carrera: career, asignatura: subject, docente: docente ? docente.name : docEmail, pao: pao, aporte: 'FIN DE CICLO' },
      selectedRACIds: racIds.slice(),
      raauEntries: mapped.map(function (r, i) { return { id: 'raau_auto_' + i + '_' + Date.now(), code: r.code, description: r.description, racId: r.racId }; }),
      activities: []
    };
    STATE.savedConfigs.unshift(snapshot);
    save();
    renderCoordinacion();
    showToast('Docente asignado con configuración propia.', 'success');
  }

  function coordAddDocente() {
    openModal('Nuevo Docente', '<div class="form-grid"><div class="form-group"><label class="form-label">Nombre</label><input class="form-input" id="coord-new-doc-name" placeholder="Ej: Prof. Luis Ramos"></div><div class="form-group"><label class="form-label">Correo</label><input class="form-input" id="coord-new-doc-email" placeholder="lramos@espoch.edu.ec"></div></div><div class="form-group"><label class="form-label">Contraseña (la asigna el coordinador)</label><input class="form-input" id="coord-new-doc-pass" placeholder="Clave para el docente"></div>',
      [{ label: 'Cancelar', cls: 'btn-ghost', action: 'close' }, { label: 'Crear', cls: 'btn-success', action: function () {
        var name = document.getElementById('coord-new-doc-name').value.trim();
        var email = document.getElementById('coord-new-doc-email').value.trim().toLowerCase();
        var pass = document.getElementById('coord-new-doc-pass').value.trim();
        if (!name || !email || !pass) { showToast('Complete nombre, correo y contraseña.', 'error'); return; }
        if (findUserByEmail(email)) { showToast('Ya existe un usuario con ese correo.', 'error'); return; }
        STATE.docentes.push({ email: email, password: pass, role: 'docente', name: name, cedula: '' });
        save();
        closeModal();
        renderCoordinacion('asignaturas');
        showToast('Docente creado correctamente.', 'success');
      }}]);
  }

  function coordAddAsignatura() {
    var careerOptions = Object.keys(DB_ESPOCH).map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
    openModal('Nueva Asignatura', '<div class="form-grid"><div class="form-group"><label class="form-label">Carrera</label><select class="form-select" id="coord-new-sub-career"><option value="">Seleccione carrera</option>' + careerOptions + '</select></div><div class="form-group"><label class="form-label">PAO</label><input class="form-input" id="coord-new-sub-pao" placeholder="Ej: 5 o NIVELACIÓN"></div></div><div class="form-group"><label class="form-label">Nombre Asignatura</label><input class="form-input" id="coord-new-sub-name" placeholder="Ej: ARQUITECTURA DE SOFTWARE"></div>',
      [{ label: 'Cancelar', cls: 'btn-ghost', action: 'close' }, { label: 'Crear', cls: 'btn-success', action: function () {
        var career = document.getElementById('coord-new-sub-career').value;
        var pao = document.getElementById('coord-new-sub-pao').value.trim();
        var name = document.getElementById('coord-new-sub-name').value.trim();
        if (!career || !pao || !name) return;
        if (!DB_ESPOCH[career].malla[pao]) DB_ESPOCH[career].malla[pao] = [];
        if (DB_ESPOCH[career].malla[pao].indexOf(name) === -1) DB_ESPOCH[career].malla[pao].push(name);
        if (!DB_ESPOCH[career].asignaturas[name]) DB_ESPOCH[career].asignaturas[name] = { raau: [] };
        closeModal();
        renderCoordinacion('asignaturas');
        showToast('Asignatura creada en la malla.', 'success');
      }}]);
  }

  function coordImportDocentes() {
    var careerOptions = Object.keys(DB_ESPOCH).map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
    openModal('Importar docentes desde OASIS',
      '<p style="color:var(--gray-600);font-size:.8rem;margin-bottom:12px">Trae los docentes que dictan en la carrera con sus <strong>cargas horarias</strong> (materia · nivel · paralelo) desde OASIS y les crea un perfil de acceso.</p>' +
      '<p style="color:var(--gray-600);font-size:.8rem;margin-bottom:12px">Los docentes <strong>nuevos</strong> recibirán como contraseña su número de cédula. Los docentes ya existentes conservan su contraseña actual.</p>' +
      '<div class="form-group"><label class="form-label">Carrera</label><select class="form-select" id="coord-import-career"><option value="">Seleccione carrera</option>' + careerOptions + '</select></div>' +
      '<div id="coord-import-msg" style="font-size:.78rem;color:var(--gray-500);min-height:18px"></div>',
      [
        { label: 'Cancelar', cls: 'btn-ghost', action: 'close' },
        { label: 'Importar / Actualizar', cls: 'btn-success', action: doCoordImportDocentes }
      ]);
  }

  async function doCoordImportDocentes() {
    var sel = document.getElementById('coord-import-career');
    var career = sel ? sel.value : '';
    var msg = document.getElementById('coord-import-msg');
    var setMsg = function (t, e) { if (msg) { msg.textContent = t; msg.style.color = e ? 'var(--red)' : 'var(--gray-500)'; } };
    if (!career) { setMsg('Seleccione una carrera.', true); return; }
    setMsg('Consultando docentes y cargas horarias en OASIS… (puede tardar unos segundos)', false);
    try {
      var res = await oasis.getDocentesCarrera({ carrera: career, facultad: 'SEDE ORELLANA' });
      var docentes = (res && res.docentes) || [];
      var codCarrera = (res && res.codCarrera) || '';
      var codPeriodo = (STATE.oasisPeriodo && STATE.oasisPeriodo.codigo) || '';
      if (!docentes.length) { setMsg('OASIS no devolvió docentes para esta carrera.', true); return; }
      var nuevosDoc = 0, nuevasCargas = 0;
      // Clave única de carga para evitar duplicados (también dentro del mismo import).
      var seen = {};
      (STATE.teacherAssignments || []).forEach(function (a) {
        seen[[a.docenteEmail, a.carrera, a.asignatura, a.pao, a.paralelo].join('|')] = true;
      });
      docentes.forEach(function (d) {
        var nombre = ((d.nombres || '') + ' ' + (d.apellidos || '')).trim() || d.cedula;
        var cedNum = String(d.cedula || '').replace(/[^0-9kK]/g, '');
        var email = (d.email && /@/.test(d.email) && !/^null$/i.test(d.email)) ? d.email.toLowerCase() : (cedNum + '@espoch.edu.ec');
        var existente = findUserByEmail(email);
        if (!existente) {
          // Contraseña inicial = número de cédula (el docente puede cambiarla después).
          STATE.docentes.push({ email: email, password: cedNum, role: 'docente', name: nombre, cedula: d.cedula });
          nuevosDoc++;
        }
        (d.cargas || []).forEach(function (carga) {
          var key = [email, career, carga.materia, carga.codNivel, carga.paralelo].join('|');
          if (seen[key]) return;
          seen[key] = true;
          STATE.teacherAssignments.unshift({
            id: 'asg_' + Date.now() + Math.random().toString(36).slice(2, 6),
            docenteEmail: email,
            docenteNombre: nombre,
            cedula: d.cedula,
            carrera: career,
            pao: carga.codNivel,
            paralelo: carga.paralelo,
            asignatura: carga.materia,
            // Códigos OASIS para importar la nómina exacta sin re-resolver.
            codCarrera: codCarrera,
            codMateria: carga.codMateria,
            codNivel: carga.codNivel,
            codPeriodo: codPeriodo,
            racs: [],
            raau: [],
            source: 'oasis'
          });
          nuevasCargas++;
        });
      });
      save();
      closeModal();
      renderCoordinacion('asignaturas');
      showToast(nuevosDoc + ' docentes nuevos (' + docentes.length + ' en total) y ' + nuevasCargas + ' cargas importadas de OASIS', 'success');
    } catch (err) {
      setMsg((err && err.offline) ? 'OASIS/BFF no disponible.' : ((err && err.message) || 'Error al importar docentes.'), true);
    }
  }

  function coordRenderDocentesList() {
    var target = document.getElementById('coord-docentes-list');
    if (!target) return;
    // El coordinador también es docente: aparece en la lista (marcado).
    var docentes = [COORDINADOR].concat(getDocentes());
    target.innerHTML = '<div style="font-size:.78rem;font-weight:700;color:var(--gray-800);margin:8px 0">Docentes registrados (' + docentes.length + ')</div>' +
      (docentes.map(function (d) {
        var asigs = (STATE.teacherAssignments || []).filter(function (a) { return a.docenteEmail === d.email; });
        var asigHtml = asigs.length
          ? asigs.map(function (a) { return '<span class="tag-pao" style="background:var(--blue);margin:2px 4px 2px 0;display:inline-block">' + a.asignatura + ' · N' + a.pao + ' P' + a.paralelo + '</span>'; }).join('')
          : '<span style="font-size:.7rem;color:var(--gray-400)">Sin asignaturas</span>';
        var esCoord = d.role === 'coordinador' || d.rol === 'coordinador';
        var rolTag = esCoord ? '<span class="badge badge-blue">Coordinador</span> ' : '';
        var claveBadge = d.password
          ? '<span class="badge badge-green">Con clave</span>'
          : '<span class="badge badge-amber">Sin clave</span>';
        var claveBtnText = d.password ? 'Cambiar contraseña' : 'Asignar contraseña';
        return '<div class="item-row" style="align-items:flex-start;flex-wrap:wrap">' +
          '<div style="font-size:.8rem;flex:1;min-width:220px"><strong>' + d.name + '</strong> ' + rolTag + claveBadge +
          '<div style="font-size:.7rem;color:var(--gray-500)">' + d.email + (d.cedula ? ' · ' + d.cedula : '') + '</div>' +
          '<div style="margin-top:6px">' + asigHtml + '</div></div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
          '<button class="btn btn-ghost btn-sm" onclick="coordVerHorario(\'' + d.email + '\')">Ver horario</button>' +
          '<button class="btn btn-edit btn-sm" onclick="coordSetDocentePassword(\'' + d.email + '\')">' + claveBtnText + '</button>' +
          '</div></div>';
      }).join(''));
  }

  // ---- Horario de clases del docente ----
  function renderHorarioGrid(clases) {
    if (!clases || !clases.length) {
      return '<div style="font-size:.82rem;color:var(--gray-500)">Sin horario registrado en OASIS para este período.</div>';
    }
    var diasDef = [['LUN', 'Lunes'], ['MAR', 'Martes'], ['MIE', 'Miércoles'], ['JUE', 'Jueves'], ['VIE', 'Viernes'], ['SAB', 'Sábado'], ['DOM', 'Domingo']];
    var present = {};
    clases.forEach(function (c) { present[c.codDia] = true; });
    var cols = diasDef.filter(function (d) { return present[d[0]]; });
    if (!cols.length) cols = diasDef.slice(0, 5);
    var toMin = function (t) { var p = String(t || '').split(':'); return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0); };
    var slots = [];
    clases.forEach(function (c) { var k = c.inicio + ' - ' + c.fin; if (slots.indexOf(k) === -1) slots.push(k); });
    slots.sort(function (a, b) { return toMin(a.split(' - ')[0]) - toMin(b.split(' - ')[0]); });
    var byKey = {};
    clases.forEach(function (c) { byKey[(c.inicio + ' - ' + c.fin) + '|' + c.codDia] = c.materia; });
    var head = '<tr><th>Hora</th>' + cols.map(function (d) { return '<th>' + d[1] + '</th>'; }).join('') + '</tr>';
    var body = slots.map(function (s) {
      return '<tr><td style="font-family:var(--mono);white-space:nowrap;font-weight:600">' + s + '</td>' +
        cols.map(function (d) {
          var m = byKey[s + '|' + d[0]];
          return '<td style="text-align:center">' + (m ? '<span class="comp-pill" style="background:var(--blue-bg);color:#1d4ed8;white-space:normal">' + m + '</span>' : '') + '</td>';
        }).join('') + '</tr>';
    }).join('');
    return '<div style="overflow-x:auto"><table class="data" style="font-size:.74rem;min-width:520px"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
  }

  function showHorarioModal(nombre, clases) {
    openModal('Horario de clases — ' + nombre, renderHorarioGrid(clases), [{ label: 'Cerrar', cls: 'btn-ghost', action: 'close' }]);
    var m = document.querySelector('#modal-overlay .modal');
    if (m) m.style.maxWidth = '780px';
  }

  async function verHorario(nombre, cedula, asgList) {
    if (!cedula) { showToast('Este docente no tiene cédula registrada para consultar el horario.', 'error'); return; }
    var a0 = (asgList && asgList[0]) || {};
    if (!a0.codCarrera && !a0.carrera) { showToast('Sin asignaturas para determinar la carrera del horario.', 'error'); return; }
    showToast('Consultando horario en OASIS…', 'success');
    try {
      var res = await oasis.getHorarioDocente({
        codCarrera: a0.codCarrera || '', carrera: a0.carrera || '', facultad: 'SEDE ORELLANA',
        cedula: cedula, codPeriodo: (STATE.oasisPeriodo && STATE.oasisPeriodo.codigo) || a0.codPeriodo || ''
      });
      showHorarioModal(nombre, res.clases);
    } catch (err) {
      showToast((err && err.offline) ? 'OASIS/BFF no disponible.' : ((err && err.message) || 'No se pudo obtener el horario.'), 'error');
    }
  }

  function coordVerHorario(email) {
    var d = findUserByEmail(email);
    if (!d) return;
    var asg = (STATE.teacherAssignments || []).filter(function (a) { return a.docenteEmail === email; });
    verHorario(d.name, d.cedula || (asg[0] && asg[0].cedula) || '', asg);
  }

  function coordSetDocentePassword(email) {
    var d = findUserByEmail(email);
    if (!d) return;
    var titulo = d.password ? 'Cambiar contraseña — ' : 'Asignar contraseña — ';
    openModal(titulo + d.name,
      '<p style="color:var(--gray-600);font-size:.8rem;margin-bottom:10px">El docente ingresará con <strong>' + d.email + '</strong> y esta contraseña.</p>' +
      '<div class="form-group"><label class="form-label">Nueva contraseña</label><input class="form-input" id="coord-set-pass" type="text" placeholder="Contraseña para el docente"></div>',
      [{ label: 'Cancelar', cls: 'btn-ghost', action: 'close' }, { label: 'Guardar', cls: 'btn-success', action: function () {
        var pass = document.getElementById('coord-set-pass').value.trim();
        if (!pass) { showToast('Ingrese una contraseña.', 'error'); return; }
        var esCambio = !!d.password;
        d.password = pass;
        save();
        closeModal();
        renderCoordinacion('asignaturas');
        showToast('Contraseña ' + (esCambio ? 'cambiada' : 'asignada') + ' a ' + d.name, 'success');
      }}]);
  }

  function coordManualRAC() {
    var careerEl = document.getElementById('coord-career-assignment') || document.getElementById('coord-career-rac');
    var career = careerEl ? careerEl.value : '';
    if (!career) { showToast('Seleccione carrera.', 'error'); return; }
    openModal('Agregar RAC manual', '<div class="form-grid"><div class="form-group"><label class="form-label">Código</label><input class="form-input" id="coord-rac-code" placeholder="RAC6"></div><div class="form-group"><label class="form-label">Descripción</label><input class="form-input" id="coord-rac-desc" placeholder="Descripción del RAC"></div></div>',
      [{ label: 'Cancelar', cls: 'btn-ghost', action: 'close' }, { label: 'Agregar', cls: 'btn-success', action: function () {
        var code = document.getElementById('coord-rac-code').value.trim();
        var desc = document.getElementById('coord-rac-desc').value.trim();
        if (!code || !desc) return;
        DB_ESPOCH[career].racs.push({ id: 'rac_manual_' + Date.now(), code: code, description: desc });
        coordRenderRACList();
        closeModal(); showToast('RAC agregado.', 'success');
      }}]);
  }

  function coordRenderRACList() {
    var careerEl = document.getElementById('coord-career-rac');
    var target = document.getElementById('coord-rac-list');
    if (!careerEl || !target) return;
    var career = careerEl.value;
    if (!career || !DB_ESPOCH[career]) {
      target.innerHTML = 'Seleccione carrera para listar RAC.';
      return;
    }
    var racs = DB_ESPOCH[career].racs || [];
    if (racs.length === 0) {
      target.innerHTML = 'No existen RAC para esta carrera.';
      return;
    }
    target.innerHTML = racs.map(function (r) {
      return '<div class="item-row"><div style="min-width:70px;font-weight:700;color:var(--gray-800)">' + r.code + '</div><div style="font-size:.8rem;color:var(--gray-600);flex:1">' + r.description + '</div><button class="btn btn-sm btn-ghost" onclick="coordEditRAC(\'' + career + '\',\'' + r.id + '\')">Editar</button><button class="btn btn-sm btn-danger" onclick="coordDeleteRAC(\'' + career + '\',\'' + r.id + '\')">Eliminar</button></div>';
    }).join('');
  }

  function coordEditRAC(career, racId) {
    var rac = (DB_ESPOCH[career].racs || []).find(function (r) { return r.id === racId; });
    if (!rac) return;
    openModal('Editar RAC', '<div class="form-grid"><div class="form-group"><label class="form-label">Código</label><input class="form-input" id="coord-edit-rac-code" value="' + rac.code + '"></div><div class="form-group"><label class="form-label">Descripción</label><input class="form-input" id="coord-edit-rac-desc" value="' + rac.description + '"></div></div>',
      [{ label: 'Cancelar', cls: 'btn-ghost', action: 'close' }, { label: 'Guardar', cls: 'btn-success', action: function () {
        rac.code = document.getElementById('coord-edit-rac-code').value.trim();
        rac.description = document.getElementById('coord-edit-rac-desc').value.trim();
        coordRenderRACList(); closeModal();
      }}]);
  }

  function coordDeleteRAC(career, racId) {
    DB_ESPOCH[career].racs = (DB_ESPOCH[career].racs || []).filter(function (r) { return r.id !== racId; });
    Object.keys(DB_ESPOCH[career].asignaturas || {}).forEach(function (subject) {
      var arr = DB_ESPOCH[career].asignaturas[subject].raau || [];
      DB_ESPOCH[career].asignaturas[subject].raau = arr.filter(function (r) { return r.racId !== racId; });
    });
    coordRenderRACList();
  }

  function coordManualRAAU() {
    var careerEl = document.getElementById('coord-career-assignment') || document.getElementById('coord-career');
    var subjectEl = document.getElementById('coord-subject-assignment') || document.getElementById('coord-subject');
    var career = careerEl ? careerEl.value : '';
    var subject = subjectEl ? subjectEl.value : '';
    if (!career || !subject) { showToast('Seleccione carrera y asignatura.', 'error'); return; }
    var racOptions = (DB_ESPOCH[career].racs || []).map(function (r) { return '<option value="' + r.id + '">' + r.code + '</option>'; }).join('');
    openModal('Agregar RAAU manual', '<div class="form-grid"><div class="form-group"><label class="form-label">Código</label><input class="form-input" id="coord-raau-code" placeholder="RAAU1"></div><div class="form-group"><label class="form-label">RAC</label><select class="form-select" id="coord-raau-rac">' + racOptions + '</select></div></div><div class="form-group"><label class="form-label">Descripción</label><textarea class="form-input" id="coord-raau-desc"></textarea></div>',
      [{ label: 'Cancelar', cls: 'btn-ghost', action: 'close' }, { label: 'Agregar', cls: 'btn-success', action: function () {
        var code = document.getElementById('coord-raau-code').value.trim();
        var desc = document.getElementById('coord-raau-desc').value.trim();
        var racId = document.getElementById('coord-raau-rac').value;
        if (!code || !desc || !racId) return;
        if (!DB_ESPOCH[career].asignaturas[subject]) DB_ESPOCH[career].asignaturas[subject] = { raau: [] };
        DB_ESPOCH[career].asignaturas[subject].raau.push({ code: code, description: desc, racId: racId });
        coordRenderRAAUList();
        closeModal(); showToast('RAAU agregado.', 'success');
      }}]);
  }

  function coordRenderRAAUList() {
    var careerEl = document.getElementById('coord-career');
    var subjectEl = document.getElementById('coord-subject');
    var target = document.getElementById('coord-raau-list');
    if (!careerEl || !subjectEl || !target) return;
    var career = careerEl.value;
    var subject = subjectEl.value;
    if (!career || !subject || !DB_ESPOCH[career] || !DB_ESPOCH[career].asignaturas[subject]) {
      target.innerHTML = '<div style="font-size:.8rem;color:var(--gray-500)">Seleccione carrera y asignatura.</div>';
      return;
    }
    var raauArr = DB_ESPOCH[career].asignaturas[subject].raau || [];
    if (raauArr.length === 0) {
      target.innerHTML = '<div style="font-size:.8rem;color:var(--gray-500)">No hay RAAU cargados.</div>';
      return;
    }
    target.innerHTML = raauArr.map(function (r, idx) {
      var rac = (DB_ESPOCH[career].racs || []).find(function (x) { return x.id === r.racId; });
      return '<div class="item-row"><div style="min-width:70px;font-weight:700;color:var(--gray-800)">' + r.code + '</div><div style="flex:1"><div style="font-size:.8rem;color:var(--gray-700)">' + r.description + '</div><div style="font-size:.68rem;color:var(--gray-400)">' + (rac ? rac.code : r.racId) + '</div></div><button class="btn btn-sm btn-ghost" onclick="coordEditRAAUItem(\'' + career + '\',\'' + subject + '\',' + idx + ')">Editar</button><button class="btn btn-sm btn-danger" onclick="coordDeleteRAAUItem(\'' + career + '\',\'' + subject + '\',' + idx + ')">Eliminar</button></div>';
    }).join('');
  }

  function coordEditRAAUItem(career, subject, index) {
    var item = (DB_ESPOCH[career].asignaturas[subject].raau || [])[index];
    if (!item) return;
    var racOptions = (DB_ESPOCH[career].racs || []).map(function (r) { return '<option value="' + r.id + '"' + (r.id === item.racId ? ' selected' : '') + '>' + r.code + '</option>'; }).join('');
    openModal('Editar RAAU', '<div class="form-grid"><div class="form-group"><label class="form-label">Código</label><input class="form-input" id="coord-edit-raau-code" value="' + item.code + '"></div><div class="form-group"><label class="form-label">RAC</label><select class="form-select" id="coord-edit-raau-rac">' + racOptions + '</select></div></div><div class="form-group"><label class="form-label">Descripción</label><textarea class="form-input" id="coord-edit-raau-desc">' + item.description + '</textarea></div>',
      [{ label: 'Cancelar', cls: 'btn-ghost', action: 'close' }, { label: 'Guardar', cls: 'btn-success', action: function () {
        item.code = document.getElementById('coord-edit-raau-code').value.trim();
        item.description = document.getElementById('coord-edit-raau-desc').value.trim();
        item.racId = document.getElementById('coord-edit-raau-rac').value;
        coordRenderRAAUList();
        closeModal();
      }}]);
  }

  function coordDeleteRAAUItem(career, subject, index) {
    DB_ESPOCH[career].asignaturas[subject].raau.splice(index, 1);
    coordRenderRAAUList();
  }

  function coordTriggerExcel() {
    var input = document.getElementById('coord-excel-input');
    if (input) input.click();
  }

  async function coordImportExcel(files) {
    var file = files && files[0];
    var careerEl = document.getElementById('coord-career-assignment') || document.getElementById('coord-career');
    var subjectEl = document.getElementById('coord-subject-assignment') || document.getElementById('coord-subject');
    var career = careerEl ? careerEl.value : '';
    var subject = subjectEl ? subjectEl.value : '';
    if (!file || !career || !subject) { showToast('Seleccione carrera/asignatura y archivo.', 'error'); return; }
    try {
      var XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
      var data = await file.arrayBuffer();
      var workbook = XLSX.read(data, { type: 'array' });
      var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      var rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
      var racByCode = {};
      (DB_ESPOCH[career].racs || []).forEach(function (r) { racByCode[String(r.code).trim().toUpperCase()] = r; });
      var importedRaaus = [];
      rows.forEach(function (row) {
        var racCode = String(row.RAC_CODE || row.RAC || '').trim().toUpperCase();
        var racDesc = String(row.RAC_DESC || row.RAC_DESCRIPCION || '').trim();
        var raauCode = String(row.RAAU_CODE || row.RAAU || '').trim();
        var raauDesc = String(row.RAAU_DESC || row.RAAU_DESCRIPCION || '').trim();
        if (!racCode || !raauCode || !raauDesc) return;
        if (!racByCode[racCode]) {
          var newRac = { id: 'rac_excel_' + Date.now() + '_' + racCode, code: racCode, description: racDesc || ('RAC ' + racCode) };
          DB_ESPOCH[career].racs.push(newRac);
          racByCode[racCode] = newRac;
        }
        importedRaaus.push({ code: raauCode, description: raauDesc, racId: racByCode[racCode].id });
      });
      if (!DB_ESPOCH[career].asignaturas[subject]) DB_ESPOCH[career].asignaturas[subject] = { raau: [] };
      DB_ESPOCH[career].asignaturas[subject].raau = importedRaaus;
      save();
      coordRenderRAAUList();
      showToast('Importación Excel completada: ' + importedRaaus.length + ' RAAU.', 'success');
    } catch {
      showToast('No se pudo procesar el Excel.', 'error');
    }
  }

  function coordEditMapping() {
    var career = document.getElementById('coord-career').value;
    var subject = document.getElementById('coord-subject').value;
    if (!career || !subject) { showToast('Seleccione carrera y asignatura.', 'error'); return; }
    var racs = DB_ESPOCH[career].racs || [];
    var existing = (DB_ESPOCH[career].asignaturas[subject] && DB_ESPOCH[career].asignaturas[subject].raau) || [];
    var options = racs.map(function (r) { return '<option value="' + r.id + '">' + r.code + '</option>'; }).join('');
    var rows = existing.map(function (r) {
      return '<div class="item-row"><input class="form-input" value="' + (r.code || 'RAAU') + '" data-k="code"><input class="form-input" value="' + (r.description || '') + '" data-k="desc"><select class="form-select" data-k="rac">' + options.replace('value="' + r.racId + '"', 'value="' + r.racId + '" selected') + '</select></div>';
    }).join('');
    openModal('Editar mapeo de ' + subject, '<div id="coord-map-rows">' + (rows || '<div class="item-row"><input class="form-input" value="RAAU1" data-k="code"><input class="form-input" placeholder="Descripción" data-k="desc"><select class="form-select" data-k="rac">' + options + '</select></div>') + '</div><button class="btn btn-ghost btn-sm" onclick="coordAddMapRow()">+ Fila</button>',
      [{ label: 'Cancelar', cls: 'btn-ghost', action: 'close' }, { label: 'Guardar', cls: 'btn-success', action: function () { coordSaveMapping(career, subject); } }]);
  }

  function coordAddMapRow() {
    var holder = document.getElementById('coord-map-rows');
    if (!holder) return;
    var career = document.getElementById('coord-career').value;
    var options = ((DB_ESPOCH[career] && DB_ESPOCH[career].racs) || []).map(function (r) { return '<option value="' + r.id + '">' + r.code + '</option>'; }).join('');
    holder.innerHTML += '<div class="item-row"><input class="form-input" value="RAAU' + (holder.children.length + 1) + '" data-k="code"><input class="form-input" placeholder="Descripción" data-k="desc"><select class="form-select" data-k="rac">' + options + '</select></div>';
  }

  function coordSaveMapping(career, subject) {
    var rows = Array.prototype.slice.call(document.querySelectorAll('#coord-map-rows .item-row'));
    var mapped = rows.map(function (row) {
      return {
        code: row.querySelector('[data-k="code"]').value.trim(),
        description: row.querySelector('[data-k="desc"]').value.trim(),
        racId: row.querySelector('[data-k="rac"]').value
      };
    }).filter(function (x) { return x.code && x.description && x.racId; });
    if (!DB_ESPOCH[career].asignaturas[subject]) DB_ESPOCH[career].asignaturas[subject] = { raau: [] };
    DB_ESPOCH[career].asignaturas[subject].raau = mapped;
    closeModal();
    showToast('Mapeo RAC/RAAU actualizado para ' + subject, 'success');
  }

  function coordOpenConfig(configId) { setPaoActivo(configId); navigate('configuracion'); }
  function coordCreateConfig() { unlockNewConfig(); navigate('configuracion'); }
  function coordGoConfig() { navigate('configuracion'); }

  // ================================================================
  // MÓDULO: Sede Orellana — Explorador académico con acordeones
  // ================================================================
  var consultaSedeCache = {};

  function renderConsultaSede() {
    var target = document.getElementById('consulta-sede-content');
    if (!target) return;
    target.innerHTML =
      '<div class="card"><div class="card-header"><div class="card-title">Explorar estructura académica</div></div><div class="card-body">' +
      '<div class="form-grid" style="margin-bottom:16px">' +
      '<div class="form-group"><label class="form-label">Carrera</label><select class="form-select" id="csede-carrera" onchange="csedeLoadSubjects()">' +
      '<option value="">Seleccione carrera</option>' +
      Object.keys(DB_ESPOCH).map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="form-group" style="display:flex;align-items:flex-end"><button class="btn btn-primary" onclick="csedeRefresh()"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Consultar en OASIS</button></div>' +
      '</div>' +
      '<div id="csede-loading" style="display:none;font-size:.82rem;color:var(--gray-500);padding:12px">Consultando OASIS…</div>' +
      '<div id="csede-tree"></div>' +
      '</div></div>';
  }

  function csedeLoadSubjects() {
    var carrera = document.getElementById('csede-carrera').value;
    var tree = document.getElementById('csede-tree');
    if (!tree) return;
    if (!carrera) { tree.innerHTML = ''; return; }
    var malla = DB_ESPOCH[carrera] && DB_ESPOCH[carrera].malla;
    if (!malla) { tree.innerHTML = '<div style="color:var(--gray-500);padding:8px">Sin malla disponible para esta carrera.</div>'; return; }
    var paos = Object.keys(malla).sort(function (a, b) {
      if (a === 'NIVELACIÓN') return -1; if (b === 'NIVELACIÓN') return 1;
      return Number(a) - Number(b);
    });
    tree.innerHTML = paos.map(function (pao) {
      var materias = malla[pao] || [];
      return '<div class="csede-pao">' +
        '<div class="csede-pao-header" onclick="csedeTogglePao(this)">' +
        '<span class="csede-arrow">▶</span>' +
        '<span class="csede-pao-label">PAO ' + pao + '</span>' +
        '<span class="csede-pao-count">' + materias.length + ' materias</span>' +
        '</div>' +
        '<div class="csede-pao-body" style="display:none">' +
        (materias.length ? materias.map(function (mat) {
          return '<div class="csede-materia">' +
            '<div class="csede-mat-header" onclick="csedeLoadDictados(\'' + carrera + '\',\'' + pao + '\',\'' + mat.replace(/'/g, "\\'") + '\',this)">' +
            '<span class="csede-arrow">▶</span>' +
            '<span class="csede-mat-label">' + mat + '</span>' +
            '<span class="csede-mat-status">Cargar docentes</span>' +
            '</div>' +
            '<div class="csede-mat-body" style="display:none"></div>' +
            '</div>';
        }).join('') : '<div style="font-size:.78rem;color:var(--gray-400);padding:8px 12px">Sin materias</div>') +
        '</div></div>';
    }).join('');
  }

  function csedeTogglePao(header) {
    var arrow = header.querySelector('.csede-arrow');
    var body = header.nextElementSibling;
    if (!body) return;
    var isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    arrow.textContent = isOpen ? '▶' : '▼';
  }

  function csedeToggleMat(header) {
    var arrow = header.querySelector('.csede-arrow');
    var body = header.nextElementSibling;
    if (!body) return;
    var isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    arrow.textContent = isOpen ? '▶' : '▼';
  }

  async function csedeLoadDictados(carrera, pao, materia, headerEl) {
    var arrow = headerEl.querySelector('.csede-arrow');
    var body = headerEl.nextElementSibling;
    if (!body) return;
    var isOpen = body.style.display !== 'none';
    if (isOpen) {
      body.style.display = 'none';
      arrow.textContent = '▶';
      return;
    }
    if (body.hasAttribute('data-loaded')) {
      body.style.display = 'block';
      arrow.textContent = '▼';
      return;
    }
    var status = headerEl.querySelector('.csede-mat-status');
    if (status) status.textContent = 'Consultando…';
    try {
      var res = await oasis.getDocentesCarrera({ carrera: carrera, facultad: 'SEDE ORELLANA' });
      var codCarrera = (res && res.codCarrera) || '';
      var docs = (res && res.docentes) || [];
      var docentesDeMateria = [];
      docs.forEach(function (d) {
        (d.cargas || []).forEach(function (c) {
          if (c.materia === materia) {
            docentesDeMateria.push({ docente: d, carga: c });
          }
        });
      });
      if (docentesDeMateria.length === 0) {
        body.innerHTML = '<div style="font-size:.78rem;color:var(--gray-500);padding:8px 12px">Sin docentes asignados en OASIS para esta materia.</div>';
      } else {
        var rows = await Promise.all(docentesDeMateria.map(async function (dm) {
          var nombreDoc = ((dm.docente.nombres || '') + ' ' + (dm.docente.apellidos || '')).trim() || dm.docente.cedula;
          var estudiantesHtml = '';
          try {
            var periodo = await oasis.getPeriodoActual();
            var alumnos = await oasis.getAlumnosMateria({
              codCarrera: codCarrera,
              codNivel: dm.carga.codNivel,
              codParalelo: dm.carga.paralelo,
              codPeriodo: periodo.codigo,
              codMateria: dm.carga.codMateria
            });
            if (alumnos && alumnos.length) {
              estudiantesHtml = '<div class="csede-estudiantes">' +
                '<div style="font-size:.72rem;font-weight:600;color:var(--gray-600);margin-bottom:4px">Estudiantes (' + alumnos.length + '):</div>' +
                alumnos.map(function (e) {
                  return '<div class="csede-est-item">' + e.apellidos + ' ' + e.nombres + ' (' + e.cedula + ')</div>';
                }).join('') + '</div>';
            } else {
              estudiantesHtml = '<div style="font-size:.72rem;color:var(--gray-400);padding:4px 12px">Sin estudiantes registrados</div>';
            }
          } catch {
            estudiantesHtml = '<div style="font-size:.72rem;color:var(--red);padding:4px 12px">Error al consultar estudiantes</div>';
          }
          return '<div class="csede-docente">' +
            '<div class="csede-doc-header" onclick="csedeToggleMat(this)"><span class="csede-arrow">▶</span>' +
            '<span class="csede-doc-label">' + nombreDoc + '</span>' +
            '<span class="csede-doc-paralelo">Paralelo ' + (dm.carga.paralelo || '—') + ' · Nivel ' + (dm.carga.codNivel || '—') + '</span>' +
            '</div>' +
            '<div class="csede-mat-body" style="display:none">' + estudiantesHtml + '</div>' +
            '</div>';
        }));
        body.innerHTML = rows.join('');
      }
      body.setAttribute('data-loaded', 'true');
      body.style.display = 'block';
      arrow.textContent = '▼';
      if (status) status.textContent = '';
    } catch (err) {
      body.innerHTML = '<div style="font-size:.78rem;color:var(--red);padding:8px 12px">Error al consultar OASIS: ' + (err.message || '') + '</div>';
      body.style.display = 'block';
      arrow.textContent = '▼';
      if (status) status.textContent = 'Error';
    }
  }

  function csedeRefresh() {
    var tree = document.getElementById('csede-tree');
    if (tree) {
      tree.innerHTML = '';
      consultaSedeCache = {};
    }
    csedeLoadSubjects();
  }

  // ================================================================
  // MÓDULO: Información General
  // ================================================================
  function renderConsultaInformacion() {
    var target = document.getElementById('consulta-info-content');
    if (!target) return;
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">' +
      '<div class="card"><div class="card-header"><div class="card-title">Período Académico Actual</div></div><div class="card-body" id="cinfo-periodo"><div style="font-size:.82rem;color:var(--gray-500)">Cargando…</div></div></div>' +
      '<div class="card"><div class="card-header"><div class="card-title">Estado del Sistema</div></div><div class="card-body" id="cinfo-sistema"><div style="font-size:.82rem;color:var(--gray-500)">Cargando…</div></div></div>' +
      '</div>' +
      '<div class="card"><div class="card-header"><div class="card-title">Carreras Activas</div><div style="display:flex;gap:8px;align-items:center"><input class="form-input" id="cinfo-filtro" placeholder="Filtrar carreras…" oninput="cinfoFiltrar()" style="width:200px;padding:4px 8px;font-size:.78rem"><button class="btn btn-sm btn-edit" onclick="cinfoLoadCarreras()"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Recargar</button></div></div><div class="card-body" id="cinfo-carreras"><div style="font-size:.82rem;color:var(--gray-500)">Cargando…</div></div></div>';
    cinfoLoadPeriodo();
    cinfoLoadSistema();
    cinfoLoadCarreras();
  }

  async function cinfoLoadPeriodo() {
    var el = document.getElementById('cinfo-periodo');
    if (!el) return;
    try {
      var p = STATE.oasisPeriodo || await oasis.getPeriodoActual();
      if (!p || !p.descripcion) {
        el.innerHTML = '<div style="font-size:.82rem;color:var(--red)">No se pudo obtener el período actual.</div>';
        return;
      }
      el.innerHTML =
        '<div style="display:grid;gap:8px;font-size:.82rem">' +
        '<div><strong>Código:</strong> ' + (p.codigo || '—') + '</div>' +
        '<div><strong>Descripción:</strong> ' + (p.descripcion || '—') + '</div>' +
        '<div><strong>Inicio:</strong> ' + (p.fechaInicio || '—') + '</div>' +
        '<div><strong>Fin:</strong> ' + (p.fechaFin || '—') + '</div>' +
        '</div>';
    } catch {
      el.innerHTML = '<div style="font-size:.82rem;color:var(--red)">Error al consultar período.</div>';
    }
  }

  async function cinfoLoadSistema() {
    var el = document.getElementById('cinfo-sistema');
    if (!el) return;
    try {
      var health = await oasis.checkHealth();
      if (!health) {
        el.innerHTML = '<div style="font-size:.82rem;color:var(--red)">BFF no disponible</div>';
        return;
      }
      el.innerHTML =
        '<div style="display:grid;gap:8px;font-size:.82rem">' +
        '<div><strong>BFF:</strong> <span style="color:var(--green)">✓ Operativo</span></div>' +
        '<div><strong>OASIS:</strong> ' + (health.hasCredentials ? '<span style="color:var(--green)">✓ Configurado</span>' : '<span style="color:var(--amber)">Sin credenciales</span>') + '</div>' +
        '<div><strong>Base OASIS:</strong> <span style="font-size:.72rem">' + (health.base || '—') + '</span></div>' +
        '</div>';
    } catch {
      el.innerHTML = '<div style="font-size:.82rem;color:var(--red)">Error al consultar sistema.</div>';
    }
  }

  var _cinfoCarreras = [];

  function cinfoRenderCarreras(filtro) {
    var el = document.getElementById('cinfo-carreras');
    if (!el) return;
    var f = (filtro || '').toLowerCase();
    var list = f ? _cinfoCarreras.filter(function (c) { return c.nombre.toLowerCase().includes(f) || c.codigo.toLowerCase().includes(f); }) : _cinfoCarreras;
    if (!list.length) {
      el.innerHTML = '<div style="font-size:.82rem;color:var(--gray-500);padding:12px;text-align:center">' + (f ? 'No hay carreras que coincidan con "' + f + '".' : 'Sin carreras activas.') + '</div>';
      return;
    }
    el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px">' +
      list.map(function (c) {
        return '<div style="padding:10px 12px;border:1px solid var(--gray-200);border-radius:8px;font-size:.8rem">' +
          '<div style="font-weight:600;color:var(--gray-800)">' + c.nombre + '</div>' +
          '<div style="font-size:.7rem;color:var(--gray-400);margin-top:2px">Código: ' + c.codigo + '</div>' +
          '</div>';
      }).join('') + '<div style="font-size:.72rem;color:var(--gray-400);padding:4px;text-align:right">' + list.length + ' carreras</div></div>';
  }

  function cinfoFiltrar() {
    var input = document.getElementById('cinfo-filtro');
    cinfoRenderCarreras(input ? input.value : '');
  }

  async function cinfoLoadCarreras() {
    var el = document.getElementById('cinfo-carreras');
    if (!el) return;
    el.innerHTML = '<div style="font-size:.82rem;color:var(--gray-500)">Consultando OASIS…</div>';
    try {
      _cinfoCarreras = await oasis.getCarreras();
      if (!_cinfoCarreras || !_cinfoCarreras.length) {
        _cinfoCarreras = [];
        el.innerHTML = '<div style="font-size:.82rem;color:var(--gray-500)">Sin carreras activas.</div>';
        return;
      }
      cinfoFiltrar();
    } catch (err) {
      el.innerHTML = '<div style="font-size:.82rem;color:var(--red)">Error: ' + (err.message || '') + '</div>';
    }
  }

  // ================================================================
  // MÓDULO: Datos de Estudiante
  // ================================================================
  function renderConsultaEstudiante() {
    var target = document.getElementById('consulta-est-content');
    if (!target) return;
    target.innerHTML =
      '<div class="card" style="margin-bottom:16px"><div class="card-header"><div class="card-title">Buscar Estudiante</div></div><div class="card-body">' +
      '<div class="form-grid" style="grid-template-columns:1fr auto">' +
      '<div class="form-group"><label class="form-label">Cédula</label><input class="form-input" id="cest-cedula" placeholder="10 dígitos" maxlength="10" oninput="cestValidateCedula()"></div>' +
      '<div class="form-group" style="display:flex;align-items:flex-end"><button class="btn btn-primary" id="cest-search-btn" onclick="cestSearch()" disabled><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Consultar</button></div>' +
      '</div>' +
      '<div id="cest-validation" style="font-size:.75rem;min-height:20px"></div>' +
      '</div></div>' +
      '<div id="cest-results"></div>';
  }

  function cestValidateCedula() {
    var input = document.getElementById('cest-cedula');
    var btn = document.getElementById('cest-search-btn');
    var msg = document.getElementById('cest-validation');
    if (!input || !btn || !msg) return;
    var ced = input.value.replace(/\D/g, '');
    input.value = ced;
    if (!ced) { btn.disabled = true; msg.textContent = ''; return; }
    if (ced.length < 10) { btn.disabled = true; msg.textContent = 'Ingrese 10 dígitos'; msg.style.color = 'var(--gray-500)'; return; }
    if (ced.length > 10) { btn.disabled = true; msg.textContent = 'Máximo 10 dígitos'; msg.style.color = 'var(--red)'; return; }
    // Validación del dígito verificador (algoritmo módulo 10)
    var suma = 0;
    for (var i = 0; i < 9; i++) {
      var dig = parseInt(ced[i], 10);
      if (i % 2 === 0) { dig *= 2; if (dig > 9) dig -= 9; }
      suma += dig;
    }
    var digVer = (10 - (suma % 10)) % 10;
    if (digVer === parseInt(ced[9], 10)) {
      btn.disabled = false;
      msg.textContent = '✓ Cédula válida';
      msg.style.color = 'var(--green)';
    } else {
      btn.disabled = true;
      msg.textContent = '✗ Cédula inválida';
      msg.style.color = 'var(--red)';
    }
  }

  async function cestSearch() {
    var input = document.getElementById('cest-cedula');
    var btn = document.getElementById('cest-search-btn');
    var results = document.getElementById('cest-results');
    if (!input || !results) return;
    var cedula = input.value.trim();
    if (!cedula || cedula.length !== 10) { showToast('Ingrese una cédula válida de 10 dígitos.', 'error'); return; }
    btn.disabled = true;
    btn.textContent = 'Consultando…';
    results.innerHTML = '<div style="font-size:.82rem;color:var(--gray-500);padding:12px">Consultando información del estudiante…</div>';
    try {
      var data = await oasis.getEstudianteFull({ cedula: cedula });
      var estudiante = data.estudiante;
      // Si OASIS no devuelve codigo, buscar en STATE.students local
      if (estudiante && estudiante.codigo === "") {
        var localStudent = (STATE.students || []).find(function (s) { return s.cedula === cedula || s.cedula === estudiante.cedula; });
        if (localStudent && localStudent.codigo) estudiante.codigo = localStudent.codigo;
      }
      var materias = data.materias || [];
      var horario = data.horario || [];
      var carrera = data.carrera;
      var periodo = data.periodo;
      var htmlResultados = '';

      // Datos personales del estudiante
      if (estudiante && estudiante.nombres) {
        htmlResultados += '<div class="card" style="margin-bottom:16px"><div class="card-header"><div class="card-title"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ' + estudiante.apellidos + ', ' + estudiante.nombres + '</div></div><div class="card-body">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:.82rem">' +
          '<div><strong>Cédula:</strong> ' + (estudiante.cedula || '—') + '</div>' +
          '<div><strong>Código:</strong> ' + (estudiante.codigo || '—') + '</div>' +
          '<div><strong>Email:</strong> ' + (estudiante.email || '—') + '</div>' +
          '<div><strong>Teléfono:</strong> ' + (estudiante.telefono || '—') + '</div>' +
          '<div><strong>Dirección:</strong> ' + (estudiante.direccion || '—') + '</div>' +
          '<div><strong>Sexo:</strong> ' + (estudiante.sexo || '—') + '</div>' +
          '<div><strong>Fecha Nacimiento:</strong> ' + (estudiante.fechaNacimiento || '—') + '</div>' +
          (carrera ? '<div><strong>Carrera:</strong> ' + carrera.nombre + '</div>' : '') +
          (periodo ? '<div><strong>Periodo:</strong> ' + periodo.descripcion + '</div>' : '') +
          '</div></div></div>';
      } else {
        htmlResultados += '<div class="card" style="margin-bottom:16px"><div class="card-header"><div class="card-title">Datos del Estudiante</div></div><div class="card-body" style="font-size:.82rem;color:var(--gray-500)">Estudiante no encontrado en OASIS.</div></div>';
      }

      // Materias actuales
      if (materias.length > 0) {
        htmlResultados += '<div class="card" style="margin-bottom:12px"><div class="card-header"><div class="card-title"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Materias Actuales (' + periodo.descripcion + ')</div><div style="font-size:.78rem;color:var(--gray-500)">' + materias.length + ' materias</div></div><div class="card-body" style="padding:0;overflow-x:auto">' +
          '<table class="data" style="font-size:.78rem"><thead><tr><th>Materia</th><th>Código</th><th>Docente</th><th>Paralelo</th></tr></thead><tbody>' +
          materias.map(function (m) {
            var info = horario.find(function (h) { return h.codMateria === m.codMateria; });
            var docentesHtml = '—';
            var paralelosHtml = '—';
            if (info && info.dictados && info.dictados.length > 0) {
              docentesHtml = info.dictados.map(function (d) { return (d.docente.apellidos + ', ' + d.docente.nombres).trim(); }).join('<br>');
              paralelosHtml = info.dictados.map(function (d) { return d.paralelo; }).join(', ');
            }
            return '<tr><td>' + m.materia + '</td><td>' + m.codMateria + '</td><td style="font-size:.75rem">' + docentesHtml + '</td><td>' + paralelosHtml + '</td></tr>';
          }).join('') +
          '</tbody></table></div></div>';
      }

      if (!estudiante && materias.length === 0) {
        htmlResultados = '<div class="card"><div class="card-body" style="text-align:center;padding:24px">' +
          '<div style="font-size:.85rem;color:var(--gray-500)">No se encontraron datos para la cédula <strong>' + cedula + '</strong>.</div>' +
          '</div></div>';
      }
      results.innerHTML = htmlResultados;
    } catch (err) {
      results.innerHTML = '<div class="card"><div class="card-body" style="text-align:center;padding:24px">' +
        '<div style="font-size:.85rem;color:var(--red)">Error al consultar: ' + (err.message || 'Error de conexión') + '</div>' +
        '</div></div>';
    }
    btn.disabled = false;
    btn.textContent = 'Consultar';
  }




  // ---- Exponer funciones de consulta globalmente ----
  window.csedeLoadSubjects = csedeLoadSubjects;
  window.csedeTogglePao = csedeTogglePao;
  window.csedeToggleMat = csedeToggleMat;
  window.csedeLoadDictados = csedeLoadDictados;
  window.csedeRefresh = csedeRefresh;
  window.cestValidateCedula = cestValidateCedula;
  window.cestSearch = cestSearch;


  window.cinfoLoadCarreras = cinfoLoadCarreras;
  window.cinfoFiltrar = cinfoFiltrar;

  function renderPage(page) {
    if (page === 'dashboard') renderDashboard();
    else if (page === 'configuracion') renderConfig();
    else if (page === 'estudiantes') renderEstudiantes();
    else if (page === 'calificaciones') renderCalificaciones();
    else if (page === 'reporte') renderReporte();
    else if (page === 'coordinacion') renderCoordinacion();
    else if (page === 'coord-asignaturas') renderCoordinacion('asignaturas');
    else if (page === 'coord-rac') renderCoordinacion('rac');
    else if (page === 'coord-raau') renderCoordinacion('raau');
    else if (page === 'coord-docentes') renderCoordinacion('docentes');
    else if (page === 'consulta-sede') renderConsultaSede();
    else if (page === 'consulta-informacion') renderConsultaInformacion();
    else if (page === 'consulta-estudiante') renderConsultaEstudiante();


    updateReportAvailability();
  }

  function navigate(page) {
    if (typeof window.__closeSidebar === 'function') window.__closeSidebar();
    if (!roleCanAccess(page)) {
      showToast('No tiene permisos para esta sección.', 'error');
      return;
    }
    STATE.currentPage = page;
    // Al salir de configuración sin guardar, limpiar modo edición
    if (page !== 'configuracion' && STATE.editingConfigId) {
      STATE.editingConfigId = '';
      if (STATE.activeConfigId) cargarPaoActivo();
      else { var d = JSON.parse(JSON.stringify(DEFAULT_STATE.courseConfig)); STATE.courseConfig = d; STATE.selectedRACIds = []; STATE.raauEntries = []; STATE.activities = []; STATE.configLocked = false; }
      save();
    }
    // Si hay PAO activo y NO estamos editando, asegurar que sus datos estén cargados
    if (STATE.activeConfigId && !STATE.editingConfigId) {
      cargarPaoActivo();
    } else if (!STATE.activeConfigId && !STATE.editingConfigId) {
      STATE.courseConfig = JSON.parse(JSON.stringify(DEFAULT_STATE.courseConfig));
      STATE.selectedRACIds = [];
      STATE.raauEntries = [];
      STATE.activities = [];
      STATE.configLocked = false;
    }
    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
    var normalizedPage = page;
    if (page.indexOf('coord-') === 0) normalizedPage = 'coordinacion';
    var pageEl = document.getElementById('page-' + normalizedPage);
    if (pageEl) pageEl.classList.add('active');
    var navEl = document.querySelector('.nav-item[data-page="' + page + '"]');
    if (navEl) navEl.classList.add('active');
    renderPage(page);
  }

  // ---- Anomalías (asistente proactivo local) ----

  function triggerAnomalyDetection() {
    if (typeof window.__detectarAnomalias !== "function") return;
    if (!STATE.activeConfigId) return;
    const students = STATE.students || [];
    const grades = STATE.grades || [];
    const activities = STATE.activities || [];
    if (students.length === 0 || activities.length === 0) return;
    window.__detectarAnomalias(students, grades, activities);
  }

  window.__mostrarAnomalias = function (anomalias) {
    if (!anomalias || anomalias.length === 0) return;

    // Mostrar badge en el dashboard
    const badge = document.getElementById("dash-anomaly-badge");
    if (badge) {
      badge.textContent = anomalias.length + " alerta(s)";
      badge.style.display = "";
    }

    // Mostrar alertas en la página de calificaciones
    const alertsContainer = document.getElementById("cal-anomaly-alerts");
    if (!alertsContainer) return;

    function severityIcon(color) {
      return '<svg viewBox="0 0 10 10" width="10" height="10" style="vertical-align:middle"><circle cx="5" cy="5" r="5" fill="' + color + '"/></svg>';
    }
    const severityConfig = {
      alta: { bg: "#fef2f2", border: "#fca5a5", icon: severityIcon("#ef4444") },
      media: { bg: "#fffbeb", border: "#fcd34d", icon: severityIcon("#f59e0b") },
      baja: { bg: "#f0fdf4", border: "#86efac", icon: severityIcon("#22c55e") },
    };

    alertsContainer.style.display = "block";
    alertsContainer.innerHTML =
      '<div style="font-size:.78rem;font-weight:700;color:var(--gray-700);margin-bottom:8px"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--gray-600)" stroke-width="2" style="vertical-align:middle;margin-right:4px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Asistente de Anomalías</div>' +
      anomalias
        .map(function (a) {
          var cfg = severityConfig[a.severidad] || severityConfig.media;
          return (
            '<div style="display:flex;align-items:flex-start;gap:8px;padding:8px 12px;margin-bottom:6px;background:' +
            cfg.bg +
            ";border:1px solid " +
            cfg.border +
            ';border-radius:var(--radius);font-size:.78rem">' +
            '<span style="font-size:.9rem">' +
            cfg.icon +
            '</span>' +
            '<div><div style="font-weight:600;color:var(--gray-800)">' +
            a.tipo.replace("_", " ") +
            "</div>" +
            '<div style="color:var(--gray-600)">' +
            a.mensaje +
            "</div></div></div>"
          );
        })
        .join("") +
      '<button class="btn btn-ghost btn-sm" onclick="document.getElementById(\'cal-anomaly-alerts\').style.display=\'none\'" style="margin-top:4px">Descartar</button>';

    // Mostrar toast de resumen
    var altaCount = anomalias.filter(function (a) { return a.severidad === "alta"; }).length;
    if (altaCount > 0) {
      showToast(altaCount + " anomalía(s) crítica(s) detectada(s)", "error");
    }
  };

  // Llamar detección después de renderizar calificaciones
  var origRenderGradeTable = renderGradeTable;
  renderGradeTable = function () {
    origRenderGradeTable();
    setTimeout(triggerAnomalyDetection, 100);
  };

  var origCalSave = calSave;
  calSave = function () {
    origCalSave();
    setTimeout(triggerAnomalyDetection, 200);
  };

  window.closeModal = closeModal;
  window.closeSuccessModal = closeSuccessModal;
  window.onCarreraChange = onCarreraChange;
  window.onPaoChange = onPaoChange;
  window.onAsignaturaChange = onAsignaturaChange;
  window.cfgPrev = cfgPrev;
  window.cfgNext = cfgNext;
  window.cfgSave = cfgSave;
  window.toggleRAC = toggleRAC;
  window.toggleManagedRAC = toggleManagedRAC;
  window.addRAAU = addRAAU;
  window.deleteRAAU = deleteRAAU;
  window.editRAAU = editRAAU;
  window.addActivity = addActivity;
  window.deleteActivity = deleteActivity;
  window.editActivity = editActivity;
  window.renderStudentTable = renderStudentTable;
  window.renderGradeTable = renderGradeTable;
  window.exportStudentsPDF = exportStudentsPDF;
  window.exportGradesPDF = exportGradesPDF;
  window.showGradesQR = showGradesQR;
  window.editStudent = editStudent;
  window.confirmDelete = confirmDelete;
  window.onGradeInput = onGradeInput;
  window.onGradeChange = onGradeChange;
  window.calSave = calSave;
  window.applySavedConfig = applySavedConfig;
  window.editSavedConfigName = editSavedConfigName;
  window.deleteSavedConfig = deleteSavedConfig;
  window.onConfigConfirmContinue = onConfigConfirmContinue;
  window.unlockInitialConfig = unlockInitialConfig;
  window.unlockNewConfig = unlockNewConfig;
  window.cfgStartNew = cfgStartNew;
  window.saveManagedConfigEdits = saveManagedConfigEdits;
  window.openManagedRAAUEditor = openManagedRAAUEditor;
  window.openManagedActivities = openManagedActivities;
  window.showOasisImport = showOasisImport;
  window.syncStudentsFromOasis = syncStudentsFromOasis;
  window.togglePaoDropdown = togglePaoDropdown;
  window.selectPaoFromDropdown = selectPaoFromDropdown;
  window.doLogin = doLogin;
  window.doLogout = doLogout;
  window.fillDemoCredentials = fillDemoCredentials;
  window.openProfile = openProfile;
  window.coordSetDocentePassword = coordSetDocentePassword;
  window.coordLoadSubjects = coordLoadSubjects;
  window.coordEditMapping = coordEditMapping;
  window.coordAddMapRow = coordAddMapRow;
  window.coordSaveMapping = coordSaveMapping;
  window.coordOpenConfig = coordOpenConfig;
  window.coordCreateConfig = coordCreateConfig;
  window.coordGoConfig = coordGoConfig;
  window.coordLoadSubjectsAssignment = coordLoadSubjectsAssignment;
  window.coordCreateAssignment = coordCreateAssignment;
  window.coordAddDocente = coordAddDocente;
  window.coordImportDocentes = coordImportDocentes;
  window.coordVerHorario = coordVerHorario;
  window.coordAddAsignatura = coordAddAsignatura;
  window.coordManualRAC = coordManualRAC;
  window.coordRenderRACList = coordRenderRACList;
  window.coordEditRAC = coordEditRAC;
  window.coordDeleteRAC = coordDeleteRAC;
  window.coordManualRAAU = coordManualRAAU;
  window.coordRenderRAAUList = coordRenderRAAUList;
  window.coordEditRAAUItem = coordEditRAAUItem;
  window.coordDeleteRAAUItem = coordDeleteRAAUItem;
  window.coordTriggerExcel = coordTriggerExcel;
  window.coordImportExcel = coordImportExcel;
  window.printDetailedReport = printDetailedReport;

  var carrera = document.getElementById('cfg-carrera');
  var pao = document.getElementById('cfg-pao');
  var asig = document.getElementById('cfg-asignatura');
  if (carrera) carrera.addEventListener('change', onCarreraChange);
  if (pao) pao.addEventListener('change', onPaoChange);
  if (asig) asig.addEventListener('change', onAsignaturaChange);

  // Los botones del wizard ya están conectados desde React (App.jsx) para evitar doble ejecución.

  document.querySelectorAll('.nav-item').forEach(function (el) {
    el.addEventListener('click', function () { navigate(el.dataset.page); });
  });

  function activePageId() { var p = document.querySelector('.page.active'); return p ? p.id : ''; }

  // ENTER = confirmar: en Configuración avanza/guarda; en Calificaciones guarda.
  function confirmActivePage() {
    var id = activePageId();
    if (id === 'page-configuracion') {
      if (STATE.configLocked) return;
      if (cfgStep < 3) cfgNext(); else cfgSave();
    } else if (id === 'page-calificaciones') {
      calSave();
    }
  }

  // Mueve el foco entre celdas de notas. dir: 'up'|'down'|'left'|'right'|'next'|'prev'.
  function moveGradeFocus(target, dir) {
    var rows = [];
    document.querySelectorAll('#cal-grid-body tr').forEach(function (tr) {
      var ins = Array.prototype.slice.call(tr.querySelectorAll('.grade-input'));
      if (ins.length) rows.push(ins);
    });
    var rowI = -1, colI = -1;
    for (var ri = 0; ri < rows.length; ri++) { var ci = rows[ri].indexOf(target); if (ci !== -1) { rowI = ri; colI = ci; break; } }
    if (rowI === -1) return false;
    var dest = null;
    if (dir === 'up' && rows[rowI - 1]) dest = rows[rowI - 1][Math.min(colI, rows[rowI - 1].length - 1)];
    else if (dir === 'down' && rows[rowI + 1]) dest = rows[rowI + 1][Math.min(colI, rows[rowI + 1].length - 1)];
    else if (dir === 'left') dest = colI > 0 ? rows[rowI][colI - 1] : (rows[rowI - 1] ? rows[rowI - 1][rows[rowI - 1].length - 1] : null);
    else if (dir === 'right' || dir === 'next') dest = colI < rows[rowI].length - 1 ? rows[rowI][colI + 1] : (rows[rowI + 1] ? rows[rowI + 1][0] : null);
    else if (dir === 'prev') dest = colI > 0 ? rows[rowI][colI - 1] : (rows[rowI - 1] ? rows[rowI - 1][rows[rowI - 1].length - 1] : null);
    if (dest) { dest.focus(); if (dest.select) dest.select(); return true; }
    return false;
  }

  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', function (event) {
    if (!_paoDropdownOpen) return;
    var toggle = document.querySelector('.pao-dropdown-toggle');
    if (toggle && !toggle.contains(event.target)) closePaoDropdown();
  });

  document.addEventListener('keydown', function (event) {
    // Atajos globales Alt+1..6 para cambiar de sección.
    if (event.altKey && !event.shiftKey && !event.ctrlKey) {
      var hotMap = { '1': 'dashboard', '2': 'configuracion', '3': 'estudiantes', '4': 'calificaciones', '5': 'reporte', '6': 'coordinacion' };
      if (hotMap[event.key]) { event.preventDefault(); navigate(hotMap[event.key]); return; }
    }
    // Ctrl/Cmd+Enter siempre confirma la página activa.
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); confirmActivePage(); return; }

    var isGradeCell = event.target && event.target.classList && event.target.classList.contains('grade-input');

    if (isGradeCell) {
      // Flechas: celda a celda en cualquier dirección.
      if (event.key === 'ArrowUp') { if (moveGradeFocus(event.target, 'up')) event.preventDefault(); return; }
      if (event.key === 'ArrowDown') { if (moveGradeFocus(event.target, 'down')) event.preventDefault(); return; }
      if (event.key === 'ArrowLeft') { if (moveGradeFocus(event.target, 'left')) event.preventDefault(); return; }
      if (event.key === 'ArrowRight') { if (moveGradeFocus(event.target, 'right')) event.preventDefault(); return; }
      // Tab: avanza/retrocede entre celdas (secciones de notas).
      if (event.key === 'Tab') { event.preventDefault(); moveGradeFocus(event.target, event.shiftKey ? 'prev' : 'next'); return; }
      // Enter: confirma (guarda todas las calificaciones).
      if (event.key === 'Enter') { event.preventDefault(); calSave(); return; }
      return;
    }

    // Fuera de las celdas: Enter confirma/avanza (salvo en áreas de texto).
    if (event.key === 'Enter' && (event.target && event.target.tagName || '').toLowerCase() !== 'textarea') {
      var id = activePageId();
      if (id === 'page-configuracion' || id === 'page-calificaciones') { event.preventDefault(); confirmActivePage(); }
    }
  });

  ['auth-email', 'auth-pass'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') doLogin();
    });
  });

  applyRoleUI();
  updateSidebar();
  if (STATE.currentUser) { renderDashboard(); autoLoadPeriodo(); hydrateFromDb(); }
}
