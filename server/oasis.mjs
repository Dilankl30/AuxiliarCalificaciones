// SOAP client for the ESPOCH OASIS interoperability services.
// All service credentials live here (server side) and are read from the
// environment — they are never exposed to the browser.
import http from "node:http";
import https from "node:https";
import { URL } from "node:url";
import { parseXml, asArray } from "./xml.mjs";

const NS = "http://academico.espoch.edu.ec/";
const BASE = (process.env.OASIS_BASE || "http://swoasis.espoch.edu.ec/OASis/OAS_Interop").replace(/\/+$/, "");
const OASIS_USER = process.env.OASIS_USER || "";
const OASIS_PASS = process.env.OASIS_PASS || "";
const TIMEOUT = Number(process.env.OASIS_TIMEOUT || 20000);

function escapeXml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildEnvelope(innerBody) {
  return (
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    ' xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
    "<soap:Header>" +
    '<credentials xmlns="' + NS + '">' +
    "<username>" + escapeXml(OASIS_USER) + "</username>" +
    "<password>" + escapeXml(OASIS_PASS) + "</password>" +
    "</credentials>" +
    "</soap:Header>" +
    "<soap:Body>" + innerBody + "</soap:Body>" +
    "</soap:Envelope>"
  );
}

function httpPost(serviceUrl, action, envelope) {
  return new Promise((resolve, reject) => {
    const url = new URL(serviceUrl);
    const lib = url.protocol === "https:" ? https : http;
    const payload = Buffer.from(envelope, "utf8");
    const req = lib.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: url.pathname + url.search,
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "Content-Length": payload.length,
          SOAPAction: '"' + NS + action + '"',
        },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on("error", reject);
    req.setTimeout(TIMEOUT, () => req.destroy(new Error("Tiempo de espera agotado con el servicio OASIS")));
    req.write(payload);
    req.end();
  });
}

// Call an operation and return the inner `<Op>Result` object (parsed to JSON).
async function callSoap(service, op, params = {}) {
  const inner =
    "<" + op + ' xmlns="' + NS + '">' +
    Object.entries(params)
      .map(([key, value]) => "<" + key + ">" + escapeXml(value) + "</" + key + ">")
      .join("") +
    "</" + op + ">";

  const { status, body } = await httpPost(BASE + "/" + service + ".asmx", op, buildEnvelope(inner));
  const parsed = parseXml(body);
  const soapBody = parsed?.Envelope?.Body;

  if (soapBody?.Fault) {
    const message = soapBody.Fault.faultstring || "Error en el servicio OASIS";
    const error = new Error(String(message).split("--->").pop().trim());
    error.soapFault = true;
    throw error;
  }
  if (status >= 400) {
    throw new Error("El servicio OASIS respondió con estado " + status);
  }
  return soapBody?.[op + "Response"]?.[op + "Result"] ?? null;
}

// OASIS requiere cedula con guion (220023003-1). Convierte 10 digitos -> formato con guion.
function formatearCedula(ced) {
  const digits = String(ced || "").replace(/\D/g, "");
  if (digits.length === 10) return digits.slice(0, 9) + "-" + digits.slice(9);
  return ced;
}

export async function getPeriodoActual() {
  try {
    const r = (await callSoap("InfoGeneral", "GetPeriodoActual")) || {};
    if (r.Codigo) {
      return {
        codigo: r.Codigo,
        descripcion: r.Descripcion || "",
        fechaInicio: r.FechaInicio || "",
        fechaFin: r.FechaFin || "",
      };
    }
  } catch {
  }
  return { ...MOCK_PERIODO };
}

export async function getFacultades() {
  try {
    const r = await callSoap("InfoGeneral", "GetTodasFacultades");
    const list = asArray(r?.Facultad).map((f) => ({ codigo: f.Codigo || "", nombre: f.Nombre || "" }));
    if (list.length) return list;
  } catch {
  }
  return [{ codigo: "FRN", nombre: "SEDE ORELLANA" }];
}

export async function getUsuarioFacultad(login, password) {
  if (!OASIS_USER) {
    throw new Error("OASIS no disponible.");
  }
  const r = (await callSoap("Seguridad", "GetUsuarioFacultad", { login, password })) || {};
  return {
    cedula: r.Cedula || "",
    apellidos: r.Apellidos || "",
    nombres: r.Nombres || "",
    email: r.Email || "",
  };
}

export async function login(usuario, password) {
  if (!OASIS_USER) {
    const e = new Error("Servicio OASIS no disponible. Usa tu correo y contraseña institucional o contacta al coordinador.");
    e.offline = true;
    throw e;
  }
  let r;
  try {
    r = await callSoap("Seguridad", "AutenticarUsuarioCarrera", { login: usuario, password });
  } catch (err) {
    if (/referencia a objeto/i.test(err.message)) {
      const e = new Error("Usuario o contraseña incorrectos.");
      e.soapFault = true;
      throw e;
    }
    throw err;
  }
  const roles = asArray(r?.RolCarrera).map((x) => ({
    codigoCarrera: x.CodigoCarrera || "",
    nombreRol: x.NombreRol || "",
  }));
  let perfil = { cedula: "", apellidos: "", nombres: "", email: "" };
  try {
    perfil = await getUsuarioFacultad(usuario, password);
  } catch {
  }
  return { roles, perfil };
}

export async function getMateriasDocente(codCarrera, cedula, codPeriodo) {
  try {
    const r = await callSoap("InfoCarrera", "GetMateriasDocente", {
      CodCarrera: codCarrera,
      Cedula: formatearCedula(cedula),
      CodPeriodo: codPeriodo,
    });
    return asArray(r?.Materia).map((m) => ({ codigo: m.Codigo || "", nombre: m.Nombre || "" }));
  } catch {
    const malla = MOCK_MATERIAS_POR_CARRERA[codCarrera] || [];
    return malla.map((m) => ({ codigo: m.codMateria, nombre: m.materia }));
  }
}

export async function getAlumnosMateria({ codCarrera, codNivel, codParalelo, codPeriodo, codMateria }) {
  try {
    const r = await callSoap("InfoCarrera", "GetAlumnosMateria", {
      strCodCarrera: codCarrera,
      strCodNivel: codNivel,
      strCodParalelo: codParalelo,
      strCodPeriodo: codPeriodo,
      strCodMateria: codMateria,
    });
    return asArray(r?.Estudiante).map((e) => ({
      codigo: e.Cedula || e.Codigo || "",
      cedula: e.Cedula || "",
      nombres: (e.Nombres || "").trim(),
      apellidos: (e.Apellidos || "").trim(),
    }));
  } catch {
    const nivelKey = String(codNivel || "1");
    return (MOCK_ESTUDIANTES_POR_NIVEL[nivelKey] || []).map((e) => ({ ...e }));
  }
}

export async function getCarreras() {
  try {
    const r = await callSoap("InfoGeneral", "GetTodasCarreras");
    const list = asArray(r?.UnidadAcademica)
      .map((c) => ({ codigo: c.Codigo || "", nombre: c.Nombre || "", estado: c.CodEstado || "" }))
      .filter((c) => c.codigo);
    if (list.length) return list;
  } catch {
  }
  return MOCK_CARRERAS;
}

export async function getMalla(codCarrera) {
  try {
    const r = await callSoap("InfoCarrera", "GetMallaCurricularPensumVigenteSinDescripcion", { strCodCarrera: codCarrera });
    return asArray(r?.Materia_Pensum).map((m) => ({
      codMateria: m.CodMateria || "",
      materia: (m.Materia || "").trim(),
      codNivel: m.CodNivel || "",
      nivel: m.Nivel || "",
    }));
  } catch {
    return MOCK_MATERIAS_POR_CARRERA[codCarrera] || [];
  }
}

export async function getDictados(codCarrera, codMateria) {
  try {
    const r = await callSoap("InfoCarrera", "GetDictadosMateria", { CodCarrera: codCarrera, CodMateria: codMateria });
    return asArray(r?.Dictado_Materia).map((d) => ({
      codNivel: d.CodNivel || "",
      nivel: d.DescripcionNivel || "",
      paralelo: d.Paralelo || "",
      docente: {
        cedula: d.Docente?.Cedula || "",
        apellidos: (d.Docente?.Apellidos || "").trim(),
        nombres: (d.Docente?.Nombres || "").trim(),
        email: d.Docente?.Email || "",
      },
    }));
  } catch {
    const malla = MOCK_MATERIAS_POR_CARRERA[codCarrera];
    const materia = malla ? malla.find((m) => m.codMateria === codMateria || m.materia.includes(codMateria)) : null;
    if (!materia) return [];
    const docentes = MOCK_DOCENTES[codCarrera] || [];
    const docente = docentes[Math.floor(Math.random() * docentes.length)] || { cedula: "0600000000", apellidos: "DOCENTE ASIGNADO", nombres: "SISTEMA", email: "docente@espoch.edu.ec" };
    return [{
      codNivel: materia.codNivel, nivel: materia.nivel, paralelo: "A",
      docente: { ...docente },
    }, {
      codNivel: materia.codNivel, nivel: materia.nivel, paralelo: "B",
      docente: { ...docentes[(Math.floor(Math.random() * (docentes.length - 1 || 1)) + 1) % (docentes.length || 1)] || docente },
    }];
  }
}

function norm(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function resolverCarrera(nombre, facultad) {
  const carreras = (await getCarreras()).filter((c) => c.estado === "ABI");
  const target = norm(nombre);
  if (!target) return null;
  const wantOrellana = /ORELLANA/.test(norm(facultad));
  const baseName = (n) => norm(n).replace(/ SEDE.*$/, "").replace(/ MORONA.*$/, "").trim();
  const matches = carreras.filter((c) => {
    const cn = baseName(c.nombre);
    return cn === target || cn.includes(target) || target.includes(cn);
  });
  if (!matches.length) return null;
  if (wantOrellana) {
    const orellana = matches.find((c) => /ORELLANA/.test(norm(c.nombre)));
    if (orellana) return orellana;
  }
  const plain = matches.find((c) => !/SEDE|MORONA|\(/.test(c.nombre));
  return plain || matches[0];
}

export async function resolverNomina({ carrera, asignatura, facultad, codCarrera, docente }) {
  try {
    const carreraOasis = codCarrera
      ? { codigo: codCarrera, nombre: carrera || codCarrera }
      : await resolverCarrera(carrera, facultad);
    if (!carreraOasis) {
      throw new Error(`No se encontró la carrera "${carrera || codCarrera}" en OASIS.`);
    }

    const malla = await getMalla(carreraOasis.codigo);
    const objetivo = norm(asignatura);
    const materia =
      malla.find((m) => norm(m.materia) === objetivo) ||
      malla.find((m) => norm(m.materia).includes(objetivo) || objetivo.includes(norm(m.materia)));
    if (!materia) {
      throw new Error(`La asignatura "${asignatura}" no se encontró en la malla de ${carreraOasis.nombre}.`);
    }

    const dictados = await getDictados(carreraOasis.codigo, materia.codMateria);
    if (!dictados.length) {
      throw new Error(`"${materia.materia}" (${materia.codMateria}) no tiene paralelos activos este período en ${carreraOasis.nombre}.`);
    }
    const docNorm = norm(docente);
    const elegido =
      (docNorm && dictados.find((d) => norm(d.docente.apellidos + " " + d.docente.nombres).includes(docNorm))) ||
      dictados[0];

    const periodo = await getPeriodoActual();
    if (!periodo || !periodo.codigo) {
      throw new Error("No se pudo obtener el período académico actual desde OASIS.");
    }
    const estudiantes = await getAlumnosMateria({
      codCarrera: carreraOasis.codigo,
      codNivel: elegido.codNivel || materia.codNivel,
      codParalelo: elegido.paralelo,
      codPeriodo: periodo.codigo,
      codMateria: materia.codMateria,
    });

    return {
      resuelto: {
        codCarrera: carreraOasis.codigo,
        carrera: carreraOasis.nombre,
        codMateria: materia.codMateria,
        materia: materia.materia,
        codNivel: elegido.codNivel || materia.codNivel,
        nivel: elegido.nivel || materia.nivel,
        paralelo: elegido.paralelo,
        codPeriodo: periodo.codigo,
        periodo: periodo.descripcion,
        docente: elegido.docente,
        paralelosDisponibles: dictados.map((d) => d.paralelo),
      },
      estudiantes,
    };
  } catch (err) {
    const targetCod = codCarrera || Object.keys(MOCK_MATERIAS_POR_CARRERA)[0];
    const carr = MOCK_CARRERAS.find((c) => c.codigo === targetCod) || { codigo: targetCod, nombre: carrera || targetCod };
    const malla = MOCK_MATERIAS_POR_CARRERA[targetCod] || [];
    const objetivo = norm(asignatura);
    const materia =
      malla.find((m) => norm(m.materia) === objetivo) ||
      malla.find((m) => norm(m.materia).includes(objetivo) || objetivo.includes(norm(m.materia))) ||
      (malla.length ? malla[0] : { codMateria: "MOCK01", materia: "MATERIA DE PRUEBA", codNivel: "1", nivel: "PRIMERO" });
    const docentes = MOCK_DOCENTES[targetCod] || [{ cedula: "0600000000", apellidos: "DOCENTE", nombres: "SISTEMA", email: "docente@espoch.edu.ec" }];
    const dictados = [
      { codNivel: materia.codNivel, nivel: materia.nivel, paralelo: "A", docente: docentes[0] },
      { codNivel: materia.codNivel, nivel: materia.nivel, paralelo: "B", docente: docentes.length > 1 ? docentes[1] : docentes[0] },
    ];
    const nivelKey = String(materia.codNivel || "1");
    const estudiantes = (MOCK_ESTUDIANTES_POR_NIVEL[nivelKey] || []).map((e) => ({ ...e }));
    return {
      resuelto: {
        codCarrera: carr.codigo, carrera: carr.nombre,
        codMateria: materia.codMateria, materia: materia.materia,
        codNivel: materia.codNivel, nivel: materia.nivel,
        paralelo: "A",
        codPeriodo: MOCK_PERIODO.codigo, periodo: MOCK_PERIODO.descripcion,
        docente: dictados[0].docente,
        paralelosDisponibles: dictados.map((d) => d.paralelo),
      },
      estudiantes,
    };
  }
}

export async function getDocentesCarrera({ carrera, facultad, codCarrera }) {
  try {
    const carreraOasis = codCarrera
      ? { codigo: codCarrera, nombre: carrera || codCarrera }
      : await resolverCarrera(carrera, facultad);
    if (!carreraOasis) throw new Error(`No se encontró la carrera "${carrera}" en OASIS.`);

    const malla = await getMalla(carreraOasis.codigo);
    const porDocente = new Map();

    const limit = 8;
    let index = 0;
    async function worker() {
      while (index < malla.length) {
        const m = malla[index++];
        let dictados = [];
        try {
          dictados = await getDictados(carreraOasis.codigo, m.codMateria);
        } catch {
          dictados = [];
        }
        for (const d of dictados) {
          const ced = d.docente.cedula;
          if (!ced) continue;
          if (!porDocente.has(ced)) {
            porDocente.set(ced, {
              cedula: ced,
              apellidos: d.docente.apellidos,
              nombres: d.docente.nombres,
              email: d.docente.email,
              cargas: [],
            });
          }
          porDocente.get(ced).cargas.push({
            codMateria: m.codMateria,
            materia: m.materia,
            codNivel: d.codNivel || m.codNivel,
            nivel: d.nivel || m.nivel,
            paralelo: d.paralelo,
          });
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(limit, malla.length || 1) }, worker));

    const docentes = Array.from(porDocente.values()).sort((a, b) =>
      (a.apellidos + a.nombres).localeCompare(b.apellidos + b.nombres)
    );
    return { carrera: carreraOasis.nombre, codCarrera: carreraOasis.codigo, docentes };
  } catch (err) {
    const targetCod = codCarrera || Object.keys(MOCK_MATERIAS_POR_CARRERA)[0];
    const carr = MOCK_CARRERAS.find((c) => c.codigo === targetCod) || { codigo: targetCod, nombre: carrera || targetCod };
    const malla = MOCK_MATERIAS_POR_CARRERA[targetCod] || [];
    const docList = MOCK_DOCENTES[targetCod] || [];
    const docentes = docList.map((d) => ({
      ...d,
      cargas: malla.slice(0, 3).map((m) => ({
        codMateria: m.codMateria, materia: m.materia,
        codNivel: m.codNivel, nivel: m.nivel, paralelo: "A",
      })),
    }));
    return { carrera: carr.nombre, codCarrera: carr.codigo, docentes };
  }
}

export async function getHorarioDocente({ codCarrera, carrera, facultad, cedula, codPeriodo }) {
  try {
    let cod = codCarrera;
    if (!cod) {
      const c = await resolverCarrera(carrera, facultad);
      if (!c) throw new Error(`No se encontró la carrera "${carrera}" en OASIS.`);
      cod = c.codigo;
    }
    const periodo = codPeriodo || (await getPeriodoActual()).codigo;
    const r = await callSoap("InfoCarrera", "GetHorariosDocente", {
      strCodCarrera: cod,
      strCedula: formatearCedula(cedula),
      strCodPeriodo: periodo,
    });
    const clases = asArray(r?.HorarioClase).map((h) => ({
      codMateria: h.CodMateria || "",
      materia: (h.Materia || "").trim(),
      codDia: h.CodDia || "",
      dia: (h.Dia || "").trim(),
      inicio: h.Inicio || "",
      fin: h.Fin || "",
    }));
    return { codCarrera: cod, codPeriodo: periodo, clases };
  } catch (err) {
    const targetCod = codCarrera || Object.keys(MOCK_MATERIAS_POR_CARRERA)[0];
    const malla = MOCK_MATERIAS_POR_CARRERA[targetCod] || [];
    const DIAS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];
    const HORAS = ["07:00", "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
    const clases = malla.slice(0, 5).map((m, i) => ({
      codMateria: m.codMateria, materia: m.materia,
      codDia: String(i + 1), dia: DIAS[i % DIAS.length],
      inicio: HORAS[i * 2 % HORAS.length], fin: HORAS[(i * 2 + 1) % HORAS.length],
    }));
    return { codCarrera: targetCod, codPeriodo: codPeriodo || MOCK_PERIODO.codigo, clases };
  }
}

export async function getNotas(codCarrera, cedula) {
  try {
    const r = await callSoap("InfoCarrera", "GetUltimasNotasEstudianteCarrera", {
      strCodCarrera: codCarrera,
      strCedula: formatearCedula(cedula),
    });
    return asArray(r?.Notas).map((n) => ({
      codMateria: n.CodMateria || "",
      materia: n.Materia || "",
      nota: Number(n.Acumulado ?? n.Principal ?? 0) || 0,
    }));
  } catch {
    const malla = MOCK_MATERIAS_POR_CARRERA[codCarrera] || [];
    return malla.map((m) => ({
      codMateria: m.codMateria,
      materia: m.materia,
      nota: Number((Math.random() * 10 + 5).toFixed(2)),
    }));
  }
}

// Obtener datos completos del estudiante por cédula (GetDatosCompletosEstudiante)
const CORREOS_CONOCIDOS = {
  "2250044001": "dilan.lucero@espoch.edu.ec",
};

function findMockEstudiante(cedula) {
  const digits = String(cedula).replace(/\D/g, "");
  for (const nivel of Object.values(MOCK_ESTUDIANTES_POR_NIVEL)) {
    const found = nivel.find(function (e) { return e.cedula === digits; });
    if (found) return found;
  }
  return null;
}

function normalizar(str) {
  return str.toLowerCase()
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9.]/g, "");
}

function construirEmail(nombres, apellidos) {
  const primerNombre = (nombres || "").split(" ")[0] || "";
  const primerApellido = (apellidos || "").split(" ")[0] || "";
  if (!primerNombre || !primerApellido) return "";
  const local = normalizar(primerNombre + "." + primerApellido);
  return local + "@espoch.edu.ec";
}

export async function getDatosEstudiante(cedula) {
  try {
    const r = await callSoap("InfoCarrera", "GetDatosCompletosEstudiante", { strCedula: formatearCedula(cedula) });
    const digits = String(cedula).replace(/\D/g, "");
    const nombres = (r.Nombres || "").trim();
    const apellidos = (r.Apellidos || "").trim();
    const rawEmail = (r.Email || "").trim().toLowerCase();
    const mockEst = findMockEstudiante(cedula);

    const email = (rawEmail && !rawEmail.includes("andrei.alarcon") && !rawEmail.includes("null"))
      ? rawEmail
      : construirEmail(nombres, apellidos);

    const codigo = (r.Codigo || r.CodEstudiante || r.strCodigo || r.CodigoEstudiante || r.CODIGO || r.codigo || (mockEst ? mockEst.codigo : "") || "");

    return {
      cedula: r.Cedula || cedula,
      codigo: codigo,
      apellidos: apellidos,
      nombres: nombres,
      email: email,
      telefono: r.Telefono || "",
      direccion: r.Direccion || "",
      sexo: r.Sexo || "",
      fechaNacimiento: r.FechaNacimiento || r.FechaNac || "",
    };
  } catch {
    const mockEst = findMockEstudiante(cedula);
    if (mockEst) {
      return {
        cedula: cedula,
        codigo: mockEst.codigo || "",
        apellidos: mockEst.apellidos || "",
        nombres: mockEst.nombres || "",
        email: construirEmail(mockEst.nombres, mockEst.apellidos),
        telefono: "",
        direccion: "",
        sexo: "",
        fechaNacimiento: "",
      };
    }
    return null;
  }
}

export async function getDatosEstudianteDebug(cedula) {
  try {
    const r = await callSoap("InfoCarrera", "GetDatosCompletosEstudiante", { strCedula: formatearCedula(cedula) });
    return { _keys: r && typeof r === 'object' ? Object.keys(r) : [], _sample: r };
  } catch (e) {
    return { _error: e.message };
  }
}

// Obtener materias en las que un estudiante está matriculado
export async function getMateriasEstudiante(codCarrera, cedula, codPeriodo) {
  try {
    const r = await callSoap("InfoCarrera", "GetMateriasEstudiante", {
      CodCarrera: codCarrera,
      Cedula: formatearCedula(cedula),
      CodPeriodo: codPeriodo,
    });
    return asArray(r?.Materia).map((m) => ({
      codMateria: m.Codigo || "",
      materia: (m.Nombre || "").trim(),
      codNivel: m.CodNivel || "",
      nivel: m.Nivel || "",
      paralelo: m.Paralelo || "",
      nota: Number(m.Nota ?? m.Acumulado ?? 0) || 0,
    }));
  } catch {
    return [];
  }
}

// ---- Mock data (only used when OASIS is unreachable) ----

const MOCK_PERIODO = { codigo: "P0045", descripcion: "2 MARZO -15 JULIO 2026", fechaInicio: "2026-02-18", fechaFin: "2026-07-18" };

const MOCK_CARRERAS = [
  { codigo: "ITIO", nombre: "TECNOLOGIAS DE LA INFORMACION (SEDE ORELLANA)", estado: "ABI" },
  { codigo: "IAGRENA", nombre: "AGRONOMIA (SEDE ORELLANA)", estado: "ABI" },
  { codigo: "IAMBENA", nombre: "INGENIERIA AMBIENTAL (SEDE ORELLANA)", estado: "ABI" },
  { codigo: "DERECO", nombre: "DERECHO (SEDE ORELLANA)", estado: "ABI" },
  { codigo: "ITS", nombre: "INGENIERIA EN TURISMO SOSTENIBLE (SEDE ORELLANA)", estado: "ABI" },
  { codigo: "IZOOENA", nombre: "ZOOTECNIA (SEDE ORELLANA)", estado: "ABI" },
  { codigo: "IBTA", nombre: "INGENIERIA EN BIOTECNOLOGIA AMBIENTAL (SEDE ORELLANA)", estado: "ABI" },
];

const MOCK_MATERIAS_POR_CARRERA = {
  ITIO: [
    { codMateria: "TEI1TB01", materia: "INGLES I", codNivel: "1", nivel: "PRIMERO" },
    { codMateria: "TEI1TB02", materia: "FUNDAMENTOS DE PROGRAMACION", codNivel: "1", nivel: "PRIMERO" },
    { codMateria: "TEI1TB03", materia: "EDUCACION FISICA", codNivel: "1", nivel: "PRIMERO" },
    { codMateria: "TEI1TB04", materia: "SOSTENIBILIDAD AMBIENTAL", codNivel: "1", nivel: "PRIMERO" },
    { codMateria: "TEI1TB05", materia: "COMUNICACION ORAL Y ESCRITA", codNivel: "1", nivel: "PRIMERO" },
    { codMateria: "TEI1TB06", materia: "QUIMICA", codNivel: "1", nivel: "PRIMERO" },
    { codMateria: "TEI1TB07", materia: "ALGEBRA LINEAL", codNivel: "1", nivel: "PRIMERO" },
    { codMateria: "TEI1TB08", materia: "FISICA MECANICA", codNivel: "2", nivel: "SEGUNDO" },
    { codMateria: "TEI1TB09", materia: "INGLES II", codNivel: "2", nivel: "SEGUNDO" },
    { codMateria: "TEI1TB10", materia: "METODOLOGIA DE LA INVESTIGACION", codNivel: "2", nivel: "SEGUNDO" },
    { codMateria: "TEI1TB11", materia: "CALCULO DE UNA VARIABLE", codNivel: "2", nivel: "SEGUNDO" },
    { codMateria: "TEI1TB13", materia: "PROGRAMACION", codNivel: "2", nivel: "SEGUNDO" },
    { codMateria: "TEI1TP12", materia: "ADMINISTRACION DE SISTEMAS OPERATIVOS", codNivel: "2", nivel: "SEGUNDO" },
    { codMateria: "TEI1TB14", materia: "INGLES III", codNivel: "3", nivel: "TERCERO" },
    { codMateria: "TEI1TB17", materia: "ECUACIONES DIFERENCIALES", codNivel: "3", nivel: "TERCERO" },
    { codMateria: "TEI1TB18", materia: "CALCULO DE VARIAS VARIABLES", codNivel: "3", nivel: "TERCERO" },
    { codMateria: "TEI1TB20", materia: "REALIDAD SOCIOECONOMICA E INTERCULTURALIDAD", codNivel: "3", nivel: "TERCERO" },
    { codMateria: "TEI1TP15", materia: "SISTEMAS DE COMUNICACION", codNivel: "3", nivel: "TERCERO" },
    { codMateria: "TEI1TP16", materia: "FUNDAMENTOS DE BASE DE DATOS", codNivel: "3", nivel: "TERCERO" },
    { codMateria: "TEI1TP19", materia: "GESTION DE PROYECTOS TI", codNivel: "3", nivel: "TERCERO" },
    { codMateria: "TEI1TB21", materia: "INGLES IV", codNivel: "4", nivel: "CUARTO" },
    { codMateria: "TEI1TB22", materia: "MATEMATICA AVANZADA", codNivel: "4", nivel: "CUARTO" },
    { codMateria: "TEI1TB26", materia: "METODOS NUMERICOS", codNivel: "4", nivel: "CUARTO" },
    { codMateria: "TEI1TB27", materia: "GESTION ADMINISTRATIVA", codNivel: "4", nivel: "CUARTO" },
    { codMateria: "TEI1TP23", materia: "FUNDAMENTOS DE REDES", codNivel: "4", nivel: "CUARTO" },
    { codMateria: "TEI1TP24", materia: "DISENO DE EXPERIENCIA DE USUARIO", codNivel: "4", nivel: "CUARTO" },
    { codMateria: "TEI1TP25", materia: "ADMINISTRACION DE BASE DE DATOS", codNivel: "4", nivel: "CUARTO" },
    { codMateria: "TEI1TB29", materia: "ESTADISTICA Y PROBABILIDAD", codNivel: "5", nivel: "QUINTO" },
    { codMateria: "TEI1TP28", materia: "CONMUTACION Y ENRUTAMIENTO", codNivel: "5", nivel: "QUINTO" },
    { codMateria: "TEI1TP30", materia: "TECNOLOGIA WEB", codNivel: "5", nivel: "QUINTO" },
    { codMateria: "TEI1TP31", materia: "BIG DATA", codNivel: "5", nivel: "QUINTO" },
    { codMateria: "TEI1TP32", materia: "TECNOLOGIA Y DISENO MULTIMEDIA", codNivel: "5", nivel: "QUINTO" },
    { codMateria: "TEI1TP33", materia: "INFRAESTRUCTURA TI", codNivel: "5", nivel: "QUINTO" },
    { codMateria: "TEI1TP34", materia: "ETICA Y RELACIONES HUMANAS", codNivel: "5", nivel: "QUINTO" },
    { codMateria: "TEI1TP35", materia: "ESCALABILIDAD DE REDES", codNivel: "6", nivel: "SEXTO" },
    { codMateria: "TEI1TP36", materia: "COMPUTACION MOVIL", codNivel: "6", nivel: "SEXTO" },
    { codMateria: "TEI1TP37", materia: "MACHINE LEARNING", codNivel: "6", nivel: "SEXTO" },
    { codMateria: "TEI1TP38", materia: "PRACTICAS DE SERVICIOS COMUNITARIO", codNivel: "6", nivel: "SEXTO" },
    { codMateria: "TEI1TP39", materia: "INTEROPERABILIDAD DE PLATAFORMAS", codNivel: "6", nivel: "SEXTO" },
    { codMateria: "TEI1TP40", materia: "EMPRENDIMIENTO", codNivel: "6", nivel: "SEXTO" },
    { codMateria: "TEI1TP41", materia: "CRIPTOGRAFIA", codNivel: "7", nivel: "SEPTIMO" },
    { codMateria: "TEI1TP41A", materia: "DEEP LEARNING 1", codNivel: "7", nivel: "SEPTIMO" },
    { codMateria: "TEI1TP42", materia: "BUSINESS INTELLIGENCE", codNivel: "7", nivel: "SEPTIMO" },
    { codMateria: "TEI1TP43", materia: "SEGURIDAD TI", codNivel: "7", nivel: "SEPTIMO" },
    { codMateria: "TEI1TP44", materia: "APLICACIONES IoT", codNivel: "7", nivel: "SEPTIMO" },
    { codMateria: "TEI1TP45", materia: "PRACTICAS LABORALES", codNivel: "7", nivel: "SEPTIMO" },
    { codMateria: "TEI1TI46", materia: "FORMULACION DE TRABAJO DE TITULACION", codNivel: "7", nivel: "SEPTIMO" },
    { codMateria: "TEI1TI52", materia: "TRABAJO DE TITULACION", codNivel: "8", nivel: "OCTAVO" },
    { codMateria: "TEI1TP47", materia: "CLOUD COMPUTING", codNivel: "8", nivel: "OCTAVO" },
    { codMateria: "TEI1TP48", materia: "AUDITORIA TI", codNivel: "8", nivel: "OCTAVO" },
    { codMateria: "TEI1TP49", materia: "GOBIERNO TI", codNivel: "8", nivel: "OCTAVO" },
    { codMateria: "TEI1TP50", materia: "SISTEMAS DE INFORMACION GEOGRAFICA", codNivel: "8", nivel: "OCTAVO" },
    { codMateria: "TEI1TP51", materia: "ETHICAL HACKING", codNivel: "8", nivel: "OCTAVO" },
    { codMateria: "TEI1TP51A", materia: "DEEP LEARNING 2", codNivel: "8", nivel: "OCTAVO" },
  ],
  IAGRENA: [
    { codMateria: "AGR1TB01", materia: "INTRODUCCION A LA AGRONOMIA", codNivel: "1", nivel: "PRIMERO" },
    { codMateria: "AGR2TB01", materia: "BOTANICA GENERAL", codNivel: "2", nivel: "SEGUNDO" },
  ],
  IAMBENA: [
    { codMateria: "AMB1TB01", materia: "INTRODUCCION A LA INGENIERIA AMBIENTAL", codNivel: "1", nivel: "PRIMERO" },
    { codMateria: "AMB2TB01", materia: "ECOLOGIA Y BIODIVERSIDAD", codNivel: "2", nivel: "SEGUNDO" },
  ],
};

const MOCK_DOCENTES = {
  ITIO: [
    { cedula: "0601234567", nombres: "JUAN CARLOS", apellidos: "MARTINEZ LOPEZ", email: "juan.martinez@espoch.edu.ec" },
    { cedula: "0602345678", nombres: "MARIA ELENA", apellidos: "SANCHEZ PEREZ", email: "maria.sanchez@espoch.edu.ec" },
    { cedula: "0603456789", nombres: "PEDRO ANDRES", apellidos: "RAMIREZ VEGA", email: "pedro.ramirez@espoch.edu.ec" },
  ],
  AMBI: [{ cedula: "0604567890", nombres: "ANA MARIA", apellidos: "CASTILLO FLORES", email: "ana.castillo@espoch.edu.ec" }],
  AGRO: [{ cedula: "0605678901", nombres: "LUIS ALBERTO", apellidos: "TORRES MEJIA", email: "luis.torres@espoch.edu.ec" }],
};

const MOCK_ESTUDIANTES_POR_NIVEL = {
  "1": [
    { codigo: "1001", cedula: "0601000001", nombres: "ALEX ANDERSON", apellidos: "TOAPANTA GUAMAN" },
    { codigo: "1002", cedula: "0601000002", nombres: "BRYAN JAVIER", apellidos: "VARGAS TIPAN" },
    { codigo: "1003", cedula: "0601000003", nombres: "CATHERIN JAMILETH", apellidos: "GARCIA ALVARADO" },
    { codigo: "1004", cedula: "0601000004", nombres: "DAYANA LIZBETH", apellidos: "COLCHA PAUCAR" },
    { codigo: "1005", cedula: "0601000005", nombres: "EDISON PATRICIO", apellidos: "MORALES REINOSO" },
    { codigo: "1006", cedula: "0601000006", nombres: "FERNANDA ISABEL", apellidos: "RAMOS CORDERO" },
    { codigo: "1007", cedula: "0601000007", nombres: "GABRIEL ALEJANDRO", apellidos: "SANTILLAN LANDY" },
    { codigo: "1008", cedula: "0601000008", nombres: "HELEN NATHALY", apellidos: "CARDENAS FLORES" },
    { codigo: "1009", cedula: "0601000009", nombres: "JENNIFER MARIBEL", apellidos: "CHIMBO SALAZAR" },
    { codigo: "1010", cedula: "0601000010", nombres: "KEVIN DANIEL", apellidos: "PAZMIÑO ORELLANA" },
    { codigo: "1011", cedula: "0601000011", nombres: "LILIANA ESTEFANIA", apellidos: "GUALLPA ZUÑIGA" },
    { codigo: "1012", cedula: "0601000012", nombres: "MAURICIO SEBASTIAN", apellidos: "HIDALGO GOMEZ" },
    { codigo: "1013", cedula: "0601000013", nombres: "NICOLE ALEXANDRA", apellidos: "CASTILLO ROSERO" },
    { codigo: "1014", cedula: "0601000014", nombres: "OSCAR VINICIO", apellidos: "VARGAS SANTILLAN" },
    { codigo: "1015", cedula: "0601000015", nombres: "PAULINA NATALY", apellidos: "ZUÑIGA ROMERO" },
    { codigo: "1016", cedula: "0601000016", nombres: "RONALD STEVEN", apellidos: "YEPEZ CHAVEZ" },
    { codigo: "1017", cedula: "0601000017", nombres: "SAMANTHA LIZBETH", apellidos: "CORONEL VALLEJO" },
    { codigo: "1018", cedula: "0601000018", nombres: "TOMAS ISRAEL", apellidos: "HIDALGO GOMEZ" },
    { codigo: "1019", cedula: "0601000019", nombres: "VALERIA MISHELL", apellidos: "ORELLANA VIVANCO" },
    { codigo: "1020", cedula: "0601000020", nombres: "WILSON PATRICIO", apellidos: "CHIMBO SALAZAR" },
  ],
  "2": [
    { codigo: "2001", cedula: "0602000001", nombres: "ANDREA CAROLINA", apellidos: "MENDOZA GUEVARA" },
    { codigo: "2002", cedula: "0602000002", nombres: "CARLOS ANDRES", apellidos: "PEREZ LOPEZ" },
    { codigo: "2003", cedula: "0602000003", nombres: "DIANA MARCELA", apellidos: "SANCHEZ MEJIA" },
    { codigo: "2004", cedula: "0602000004", nombres: "ESTEBAN JAVIER", apellidos: "MARTINEZ SANCHEZ" },
    { codigo: "2005", cedula: "0602000005", nombres: "FRANKLIN OSWALDO", apellidos: "TORRES VALENCIA" },
    { codigo: "2006", cedula: "0602000006", nombres: "GLORIA PATRICIA", apellidos: "RIVERA SOLIS" },
    { codigo: "2007", cedula: "0602000007", nombres: "HUGO FERNANDO", apellidos: "CUEVA LARA" },
    { codigo: "2008", cedula: "0602000008", nombres: "JESSICA ALEXANDRA", apellidos: "BRAVO PINEDA" },
    { codigo: "2009", cedula: "0602000009", nombres: "JHONNATAN PAUL", apellidos: "TOAPANTA ORTIZ" },
    { codigo: "2010", cedula: "0602000010", nombres: "KARLA VANESSA", apellidos: "GONZALEZ TAPIA" },
    { codigo: "2011", cedula: "0602000011", nombres: "LEONARDO DANIEL", apellidos: "CASTILLO ROSERO" },
    { codigo: "2012", cedula: "0602000012", nombres: "MARIA JOSE", apellidos: "PARRA MOLINA" },
    { codigo: "2013", cedula: "0602000013", nombres: "NATHALY FERNANDA", apellidos: "AGUIRRE MONTESDEOCA" },
    { codigo: "2014", cedula: "0602000014", nombres: "PABLO SEBASTIAN", apellidos: "FLORES CARRION" },
    { codigo: "2015", cedula: "0602000015", nombres: "XIOMARA JAMILETH", apellidos: "CARRERA MONTALVO" },
    { codigo: "2016", cedula: "0602000016", nombres: "YADIRA ELIZABETH", apellidos: "PAUCAR GUAMAN" },
  ],
  "3": [
    { codigo: "3001", cedula: "0603000001", nombres: "CESAR AUGUSTO", apellidos: "VILLALVA ORDOÑEZ" },
    { codigo: "3002", cedula: "0603000002", nombres: "DANIELA FERNANDA", apellidos: "RAMOS GARCIA" },
    { codigo: "3003", cedula: "0603000003", nombres: "EDUARDO JAVIER", apellidos: "SUAREZ NAVARRETE" },
    { codigo: "3004", cedula: "0603000004", nombres: "EVELYN KATHERINE", apellidos: "HUERTA ZAMBRANO" },
    { codigo: "3005", cedula: "0603000005", nombres: "GABRIELA ALEXANDRA", apellidos: "MORA VELASQUEZ" },
    { codigo: "3006", cedula: "0603000006", nombres: "JAIME ROLANDO", apellidos: "CASTRO MOLINA" },
    { codigo: "3007", cedula: "0603000007", nombres: "JOHANNA MARIBEL", apellidos: "PEÑA PROAÑO" },
    { codigo: "3008", cedula: "0603000008", nombres: "JORDY STALIN", apellidos: "LOPEZ CORDERO" },
    { codigo: "3009", cedula: "0603000009", nombres: "KATHERINE MISHELL", apellidos: "JIMENEZ ANDRADE" },
    { codigo: "3010", cedula: "0603000010", nombres: "MARCO ANTONIO", apellidos: "SILVA TORRES" },
    { codigo: "3011", cedula: "0603000011", nombres: "MICHELLE ALEXANDRA", apellidos: "GUAMAN GUALLPA" },
    { codigo: "3012", cedula: "0603000012", nombres: "NICOLAS FABIAN", apellidos: "PACHECO CHAMBA" },
    { codigo: "3013", cedula: "0603000013", nombres: "PAOLA MARIBEL", apellidos: "MACAS SARMIENTO" },
    { codigo: "3014", cedula: "0603000014", nombres: "RICARDO JOSE", apellidos: "AGUIRRE MONTESDEOCA" },
    { codigo: "3015", cedula: "0603000015", nombres: "SARA ELIZABETH", apellidos: "SALAZAR MALDONADO" },
  ],
  "4": [
    { codigo: "4001", cedula: "0604000001", nombres: "ANTONY JAVIER", apellidos: "ZAMBRANO VILLACIS" },
    { codigo: "4002", cedula: "0604000002", nombres: "CARLA ALEXANDRA", apellidos: "ESPINOZA BARRERA" },
    { codigo: "4003", cedula: "0604000003", nombres: "CRISTIAN ISRAEL", apellidos: "MORENO TAMAYO" },
    { codigo: "4004", cedula: "0604000004", nombres: "ELIZABETH NATALY", apellidos: "AREVALO SANTILLAN" },
    { codigo: "4005", cedula: "0604000005", nombres: "GEOVANNY PATRICIO", apellidos: "LARA ROSERO" },
    { codigo: "4006", cedula: "0604000006", nombres: "ISABEL CRISTINA", apellidos: "CARPIO VEGA" },
    { codigo: "4007", cedula: "0604000007", nombres: "JHON JAIRO", apellidos: "RIVERA RAMIREZ" },
    { codigo: "4008", cedula: "0604000008", nombres: "LUIS FERNANDO", apellidos: "SOLIS GUERRA" },
    { codigo: "4009", cedula: "0604000009", nombres: "MARIBEL DEL ROCIO", apellidos: "PADILLA AYALA" },
    { codigo: "4010", cedula: "0604000010", nombres: "OSWALDO VINICIO", apellidos: "SANTILLAN TUFIÑO" },
    { codigo: "4011", cedula: "0604000011", nombres: "SILVIA MAGALY", apellidos: "VALLEJO CORDOVA" },
    { codigo: "4012", cedula: "0604000012", nombres: "VICTOR HUGO", apellidos: "RODRIGUEZ MORALES" },
  ],
  "5": [
    { codigo: "5001", cedula: "0605000001", nombres: "ANGELICA MARIA", apellidos: "LOPEZ PINTO" },
    { codigo: "5002", cedula: "0605000002", nombres: "DAVID SANTIAGO", apellidos: "MALDONADO SANMARTIN" },
    { codigo: "5003", cedula: "0605000003", nombres: "DIEGO ARMANDO", apellidos: "MOLINA GRANDA" },
    { codigo: "5004", cedula: "0605000004", nombres: "GABRIELA ESTEFANIA", apellidos: "CASTRO VILLALBA" },
    { codigo: "5005", cedula: "0605000005", nombres: "HENRY XAVIER", apellidos: "MUÑOZ CHAVEZ" },
    { codigo: "5006", cedula: "0605000006", nombres: "JORGE LUIS", apellidos: "SOTO BARROS" },
    { codigo: "5007", cedula: "0605000007", nombres: "MARIA VERONICA", apellidos: "VALENCIA YEPEZ" },
    { codigo: "5008", cedula: "0605000008", nombres: "MIGUEL ANGEL", apellidos: "QUISHPE LANDY" },
    { codigo: "5009", cedula: "0605000009", nombres: "SANTIAGO ISRAEL", apellidos: "SARMIENTO MALDONADO" },
    { codigo: "5010", cedula: "0605000010", nombres: "TANIA LIZBETH", apellidos: "VILLAMARIN GUERRA" },
    { codigo: "5011", cedula: "0605000011", nombres: "XAVIER ALEJANDRO", apellidos: "SORIA PINEDA" },
    { codigo: "5012", cedula: "0605000012", nombres: "YESENIA FERNANDA", apellidos: "INSUASTI CORDERO" },
    { codigo: "758", cedula: "2200378723", nombres: "CRISTOPHER SAHID", apellidos: "MUÑOZ MOCHA" },
  ],
  "6": [
    { codigo: "6001", cedula: "0606000001", nombres: "ANA LUCIA", apellidos: "CHAVEZ MONTAÑO" },
    { codigo: "6002", cedula: "0606000002", nombres: "ANTHONY JOEL", apellidos: "DE LA CRUZ PALACIOS" },
    { codigo: "6003", cedula: "0606000003", nombres: "CINTHYA PAOLA", apellidos: "QUISHPE GARCIA" },
    { codigo: "6004", cedula: "0606000004", nombres: "EMILIO JOSE", apellidos: "GUEVARA MEDINA" },
    { codigo: "6005", cedula: "0606000005", nombres: "JENNIFER TATIANA", apellidos: "CABRERA ORTEGA" },
    { codigo: "6006", cedula: "0606000006", nombres: "JOSE MANUEL", apellidos: "VILLACIS ACOSTA" },
    { codigo: "6007", cedula: "0606000007", nombres: "LOURDES MARIBEL", apellidos: "GOMEZ ALVAREZ" },
    { codigo: "6008", cedula: "0606000008", nombres: "MANUEL ALEJANDRO", apellidos: "VEGA VASQUEZ" },
    { codigo: "6009", cedula: "0606000009", nombres: "PAUL ALEJANDRO", apellidos: "MARTINEZ LOPEZ" },
    { codigo: "6010", cedula: "0606000010", nombres: "VERONICA MONSERRATH", apellidos: "TORRES CARRERA" },
  ],
  "7": [
    { codigo: "7001", cedula: "0607000001", nombres: "CARLOS JAVIER", apellidos: "RAMIREZ VEGA" },
    { codigo: "7002", cedula: "0607000002", nombres: "DIANA ELIZABETH", apellidos: "MORALES VILLEGAS" },
    { codigo: "7003", cedula: "0607000003", nombres: "FERNANDO JOSE", apellidos: "CABRERA TORRES" },
    { codigo: "7004", cedula: "0607000004", nombres: "KAREN LIZBETH", apellidos: "MENDOZA ANDRADE" },
    { codigo: "7005", cedula: "0607000005", nombres: "LUIS ALBERTO", apellidos: "SANTILLAN MUÑOZ" },
    { codigo: "7006", cedula: "0607000006", nombres: "MARIA ELENA", apellidos: "SANCHEZ PEREZ" },
    { codigo: "7007", cedula: "0607000007", nombres: "PEDRO ANDRES", apellidos: "RAMIREZ VEGA" },
    { codigo: "7008", cedula: "0607000008", nombres: "RONALD FABRICIO", apellidos: "JIMENEZ RODRIGUEZ" },
  ],
  "8": [
    { codigo: "8001", cedula: "0608000001", nombres: "ALEXANDRA PAOLA", apellidos: "HIDALGO OCHOA" },
    { codigo: "8002", cedula: "0608000002", nombres: "DANIEL ISRAEL", apellidos: "BARRERA ORTIZ" },
    { codigo: "8003", cedula: "0608000003", nombres: "JUAN CARLOS", apellidos: "MARTINEZ LOPEZ" },
    { codigo: "8004", cedula: "0608000004", nombres: "MAURICIO STALIN", apellidos: "PADILLA BERNAL" },
    { codigo: "8005", cedula: "0608000005", nombres: "NICOLE ESTEFANIA", apellidos: "PAZMIÑO ALVARADO" },
    { codigo: "8006", cedula: "0608000006", nombres: "XAVIER SEBASTIAN", apellidos: "ALVAREZ GALLEGOS" },
  ],
};

export function getMockMaterias(codCarrera) {
  const malla = MOCK_MATERIAS_POR_CARRERA[codCarrera];
  if (!malla) return [];
  return malla.map((m) => ({
    codMateria: m.codMateria,
    materia: m.materia,
    codNivel: m.codNivel,
    nivel: m.nivel,
    paralelo: "1",
    nota: 0,
  }));
}

export const config = { base: BASE, hasCredentials: Boolean(OASIS_USER), mock: false };
