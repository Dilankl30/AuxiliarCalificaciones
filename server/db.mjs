// Capa de datos Supabase (nuevo esquema de 8 tablas)
import { createClient } from "@supabase/supabase-js";
import { scryptSync, randomBytes, timingSafeEqual, createHash } from "node:crypto";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function ensureUuid(str) {
  if (!str) return randomBytes(16).toString("hex").replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  if (UUID_RE.test(str)) return str;
  const hash = createHash("md5").update(String(str)).digest("hex");
  return hash.slice(0, 8) + "-" + hash.slice(8, 12) + "-" + hash.slice(12, 16) + "-" + hash.slice(16, 20) + "-" + hash.slice(20, 32);
}

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "";
export const enabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

let supabase = null;
if (enabled) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
}

function sb() {
  if (!supabase) throw new Error("Supabase no configurado.");
  return supabase;
}

// ---- Contraseñas ----
export function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(String(plain), salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}
export function verifyPassword(plain, stored) {
  if (!stored || typeof stored !== "string") return false;
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, hash] = parts;
  const calc = scryptSync(String(plain), salt, 64).toString("hex");
  const a = Buffer.from(calc, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

const COORDINADOR = {
  email: "ppaguay@espoch.edu.ec",
  nombres: "PAUL PAGUAY",
  cedula: "",
  rol: "coordinador",
  password: "paguay2026",
};

export async function ensureSchema() {
  if (!supabase) return;
  const { error } = await supabase.from("docentes_sistema").select("id", { count: "exact", head: true }).limit(1);
  if (error && error.code === "42P01") {
    console.warn("[BFF] Tablas nuevas no existen. Ejecute la migración SQL.");
    return;
  }
  // Sembrar/actualizar coordinador (siempre resetear hash para desarrollo)
  const pwHash = hashPassword(COORDINADOR.password);
  const { data: existing } = await supabase.from("docentes_sistema").select("email").eq("email", COORDINADOR.email).limit(1);
  if (!existing || existing.length === 0) {
    await supabase.from("docentes_sistema").insert({
      email: COORDINADOR.email,
      nombres: COORDINADOR.nombres,
      cedula: COORDINADOR.cedula,
      rol: COORDINADOR.rol,
      password_hash: pwHash,
      data: {},
    });
  } else {
    await supabase.from("docentes_sistema").update({ password_hash: pwHash }).eq("email", COORDINADOR.email);
  }
  console.log("[BFF] Supabase esquema verificado.");
}

// ---- LECTURA ----
export async function getStore({ email, role } = {}) {
  const result = {
    docentes: [],
    teacherAssignments: [],
    savedConfigs: [],
    studentsByConfig: {},
    gradesByConfig: {},
  };

  // 1. Docentes
  const { data: docentes } = await supabase.from("docentes_sistema").select("*").order("nombres");
  if (docentes) {
    result.docentes = docentes
      .filter((d) => d.rol !== "coordinador")
      .map((d) => ({
        email: d.email,
        nombre: d.nombres || "",
        cedula: d.cedula || "",
        rol: d.rol || "docente",
        password_set: !!(d.password_hash),
      }));
  }

  // 2. Asignaciones
  const { data: asignaciones } = await supabase.from("asignaciones").select("*").order("asignatura");
  if (asignaciones) {
    result.teacherAssignments = asignaciones.map((a) => a.data || a);
  }

  // 3. Configuraciones
  let configsQuery = supabase.from("configuraciones_pao").select("*").order("created_at", { ascending: false });
  if (role !== "coordinador") configsQuery = configsQuery.eq("owner_email", email || "");
  const { data: configs } = await configsQuery;

  if (!configs || configs.length === 0) return result;

  const configIds = configs.map((c) => c.id);

  // 4. Cargar resultados_aprendizaje (RACs + RAAUs)
  const { data: resultados } = await supabase
    .from("resultados_aprendizaje")
    .select("*")
    .in("config_id", configIds)
    .order("orden");

  const racsByName = {};    // configId → { descripcion → codigo }
  const raauByRac = {};     // configId → [{ racId, codigo, descripcion }]
  for (const r of resultados || []) {
    if (!racsByName[r.config_id]) racsByName[r.config_id] = {};
    if (!raauByRac[r.config_id]) raauByRac[r.config_id] = [];
    if (r.tipo === "RAC") {
      racsByName[r.config_id][r.descripcion] = r.codigo;
    } else if (r.tipo === "RAAU") {
      raauByRac[r.config_id].push({
        id: r.id,
        racId: r.rac_id_relacionado || r.codigo?.charAt(0) === "U" ? `RA${r.codigo?.replace(/\D/g, "")?.charAt(0) || ""}` : "",
        codigo: r.codigo || "",
        descripcion: r.descripcion || "",
      });
    }
  }

  // 5. Cargar actividades_evaluacion completas
  const { data: actividades } = await supabase
    .from("actividades_evaluacion")
    .select("id, config_id, componente, nombre, descripcion, puntaje_maximo, procedimiento, rac_id, raau_id, orden")
    .in("config_id", configIds)
    .order("orden");

  // Mapa: configId → actividad por nombre
  const actByName = {};
  for (const a of actividades || []) {
    if (!actByName[a.config_id]) actByName[a.config_id] = {};
    actByName[a.config_id][a.nombre] = a;
  }

  result.savedConfigs = configs.map((c) => {
    let data = c.data || {};

    if (!data.courseConfig) {
      data.courseConfig = {
        periodoAcademico: "",
        facultad: "SEDE ORELLANA",
        carrera: c.carrera || "",
        asignatura: c.asignatura || "",
        docente: c.owner_email || "",
        pao: c.pao || "",
        aporte: c.aporte || "FIN DE CICLO",
      };
    }

    // Reconstruir selectedRACIds desde resultados si está vacío
    let selectedRACIds = data.selectedRACIds || [];
    if (selectedRACIds.length === 0 && racsByName[c.id]) {
      selectedRACIds = Object.values(racsByName[c.id]).filter(Boolean);
    }

    // Reconstruir raauEntries desde resultados si está vacío
    let raauEntries = data.raauEntries || [];
    if (raauEntries.length === 0 && raauByRac[c.id]) {
      raauEntries = raauByRac[c.id].map((r) => ({
        id: r.id,
        racId: r.racId,
        codigo: r.codigo,
        descripcion: r.descripcion,
      }));
    }

    // Reconstruir activities desde actividades_evaluacion si está vacío
    let activities = data.activities || [];
    if (activities.length === 0 && actByName[c.id]) {
      const acts = Object.values(actByName[c.id]);
      activities = acts.map((a) => ({
        id: a.id,
        component: a.componente || "ACD",
        name: a.nombre || "",
        desc: a.descripcion || "",
        maxScore: a.puntaje_maximo != null ? Number(a.puntaje_maximo) : 0,
        procedure: a.procedimiento || "",
        racId: a.rac_id || "",
        raauId: a.raau_id || "",
      }));
    } else if (activities.length > 0 && actByName[c.id]) {
      // Reemplazar IDs con UUIDs
      const map = actByName[c.id];
      activities = activities.map((act) => {
        const match = map[act.name];
        if (match) return { ...act, id: match.id, racId: match.rac_id || act.racId, raauId: match.raau_id || act.raauId };
        return act;
      });
    }

    return {
      id: c.id,
      savedAt: data.savedAt || (c.created_at ? new Date(c.created_at).toLocaleString() : ""),
      ownerEmail: data.ownerEmail || c.owner_email || "",
      courseConfig: data.courseConfig,
      selectedRACIds,
      raauEntries,
      activities,
    };
  });

  // 6. Estudiantes por configuración
  const { data: estudiantes } = await supabase
    .from("estudiantes_configuracion")
    .select("*")
    .in("config_id", configIds);

  if (estudiantes) {
    for (const cfgId of configIds) {
      const ests = estudiantes.filter((e) => e.config_id === cfgId);
      result.studentsByConfig[cfgId] = ests.map((e) => ({
        id: e.data_minima?.id || e.id,
        cedula: e.cedula || "",
        codigo: e.codigo_estudiante || "",
        nombres: splitNombres(e.nombres || "").nombres,
        apellidos: splitNombres(e.nombres || "").apellidos,
        email: e.email || "",
      }));
    }
  }

  // 7. Notas por configuración → Array de {studentId, activityId, score}
  const { data: notas } = await supabase
    .from("notas_estudiantes")
    .select("*")
    .in("config_id", configIds);

  if (notas) {
    for (const cfgId of configIds) {
      const notasCfg = notas.filter((n) => n.config_id === cfgId);
      const arr = notasCfg.map((n) => ({
        studentId: n.estudiante_id || n.estudiante_cedula,
        activityId: n.actividad_id,
        score: n.nota != null ? Number(n.nota) : null,
      })).filter((n) => n.score != null);
      if (arr.length > 0) result.gradesByConfig[cfgId] = arr;
    }
  }

  return result;
}

function splitNombres(full) {
  if (!full) return { nombres: "", apellidos: "" };
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 2) return { nombres: parts[0] || "", apellidos: parts.slice(1).join(" ") };
  const mid = Math.floor(parts.length / 2);
  return {
    nombres: parts.slice(0, mid).join(" "),
    apellidos: parts.slice(mid).join(" "),
  };
}

// ---- ESCRITURA ----
export async function putStore(payload = {}) {
  if (!supabase) throw new Error("Supabase no configurado.");
  const email = payload.email || "";
  const role = payload.role || "";
  const errors = [];

  // Construir mapa de IDs originales → UUIDs para asignaciones y configs
  const asgIdMap = new Map();
  for (const a of payload.teacherAssignments || []) {
    asgIdMap.set(a.id, ensureUuid(a.id));
  }
  const cfgIdMap = new Map();
  for (const c of payload.savedConfigs || []) {
    cfgIdMap.set(c.id, ensureUuid(c.id));
  }

  // 1. Docentes (solo coordinador)
  if (role === "coordinador" && Array.isArray(payload.docentes)) {
    for (const d of payload.docentes) {
      const record = {
        email: (d.email || "").toLowerCase(),
        cedula: d.cedula || "",
        nombres: d.nombre || d.name || "",
        rol: d.rol || d.role || "docente",
      };
      if (d.password && d.password !== 'saved') record.password_hash = hashPassword(d.password);
      const { error } = await supabase.from("docentes_sistema").upsert(record, { onConflict: "email" });
      if (error) errors.push(`docente ${record.email}: ${error.message}`);
    }
  }

  // 2. Asignaciones (solo coordinador)
  if (role === "coordinador" && Array.isArray(payload.teacherAssignments)) {
    const { data: existing } = await supabase.from("asignaciones").select("id");
    const existingIds = new Set((existing || []).map((a) => a.id));
    const keepIds = new Set();
    for (const a of payload.teacherAssignments) {
      const id = asgIdMap.get(a.id) || ensureUuid(a.id);
      keepIds.add(id);
      const { error } = await supabase.from("asignaciones").upsert({
        id,
        docente_email: a.docenteEmail || a.docente_email || "",
        carrera: a.carrera || "",
        asignatura: a.asignatura || "",
        pao: String(a.pao || ""),
        paralelo: String(a.paralelo || ""),
        data: { ...a, id },
      }, { onConflict: "id" });
      if (error) errors.push(`asignacion ${id}: ${error.message}`);
    }
    for (const oldId of existingIds) {
      if (!keepIds.has(oldId)) await supabase.from("asignaciones").delete().eq("id", oldId);
    }
  }

  // 3. Configuraciones + estudiantes + notas
  if (Array.isArray(payload.savedConfigs)) {
    const { data: existingCfgs } = await supabase.from("configuraciones_pao").select("id").eq("owner_email", email);
    const existingCfgIds = new Set((existingCfgs || []).map((c) => c.id));
    const keepCfgIds = new Set();

    for (const c of payload.savedConfigs) {
      const id = cfgIdMap.get(c.id) || ensureUuid(c.id);
      keepCfgIds.add(id);
      const cc = c.courseConfig || {};
      // Convertir IDs de actividades dentro de la config a UUIDs
      // Convertir IDs internos (actividades, raau entries) a UUIDs
      // NOTA: selectedRACIds, racId, raauId son codigos tipo R1, RA1, U1 — NO convertir
      const activities = (c.activities || []).map((act) => ({
        ...act,
        id: ensureUuid(act.id),
      }));
      const raauEntries = (c.raauEntries || []).map((r) => ({
        ...r,
        id: ensureUuid(r.id),
      }));
      const { error } = await supabase.from("configuraciones_pao").upsert({
        id,
        owner_email: c.ownerEmail || email,
        carrera: cc.carrera || "",
        asignatura: cc.asignatura || "",
        pao: String(cc.pao || ""),
        aporte: cc.aporte || "FIN DE CICLO",
        data: {
          savedAt: c.savedAt || new Date().toISOString(),
          ownerEmail: c.ownerEmail || email,
          courseConfig: cc,
          selectedRACIds: c.selectedRACIds || [],
          raauEntries,
          activities,
        },
      }, { onConflict: "id" });
      if (error) errors.push(`config ${id}: ${error.message}`);
    }

    // 4. Estudiantes
    if (payload.studentsByConfig && typeof payload.studentsByConfig === "object") {
      // Construir mapa de IDs original → UUID para estudiantes tambien
      const origToUuid = {};
      for (const [origCfgId] of Object.entries(payload.studentsByConfig)) {
        origToUuid[origCfgId] = ensureUuid(origCfgId);
      }
      for (const [origCfgId, arr] of Object.entries(payload.studentsByConfig)) {
        const cfgUuid = origToUuid[origCfgId];
        if (!keepCfgIds.has(cfgUuid)) continue;
        await supabase.from("estudiantes_configuracion").delete().eq("config_id", cfgUuid);
        if (Array.isArray(arr) && arr.length > 0) {
          const rows = arr.map((s) => ({
            config_id: cfgUuid,
            cedula: s.cedula || "",
            codigo_estudiante: s.codigo || "",
            nombres: [s.nombres || "", s.apellidos || ""].filter(Boolean).join(" "),
            email: s.email || "",
            data_minima: s,
          }));
          const { error } = await supabase.from("estudiantes_configuracion").insert(rows);
          if (error) errors.push(`estudiantes ${cfgUuid}: ${error.message}`);
        }
      }
    }

    // 4.5. Actividades — guardar en actividades_evaluacion para FK de notas
    for (const c of payload.savedConfigs) {
      const cfgUuid = cfgIdMap.get(c.id) || ensureUuid(c.id);
      if (!keepCfgIds.has(cfgUuid)) continue;
      const acts = (c.activities || []);
      if (acts.length === 0) continue;
      await supabase.from("actividades_evaluacion").delete().eq("config_id", cfgUuid);
      const rows = acts.map((a, i) => ({
        id: ensureUuid(a.id),
        config_id: cfgUuid,
        componente: a.component || a.componente || "ACD",
        nombre: a.name || a.nombre || "",
        descripcion: a.desc || a.descripcion || "",
        puntaje_maximo: a.maxScore != null ? Number(a.maxScore) : 0,
        rac_id: a.racId ? ensureUuid(a.racId) : (a.rac_id ? ensureUuid(a.rac_id) : null),
        raau_id: a.raauId ? ensureUuid(a.raauId) : (a.raau_id ? ensureUuid(a.raau_id) : null),
        procedimiento: a.procedure || a.procedimiento || "",
        orden: i,
      }));
      const { error } = await supabase.from("actividades_evaluacion").insert(rows);
      if (error) errors.push(`actividades ${cfgUuid}: ${error.message}`);
    }

    // 5. Notas (array de {studentId, activityId, score})
    if (payload.gradesByConfig && typeof payload.gradesByConfig === "object") {
      for (const [origCfgId, arr] of Object.entries(payload.gradesByConfig)) {
        const cfgUuid = ensureUuid(origCfgId);
        if (!keepCfgIds.has(cfgUuid)) continue;
        if (!Array.isArray(arr) || arr.length === 0) continue;
        await supabase.from("notas_estudiantes").delete().eq("config_id", cfgUuid);
        const { data: ests } = await supabase.from("estudiantes_configuracion").select("id,cedula").eq("config_id", cfgUuid);
        const estByCedula = {};
        const estById = {};
        if (ests) {
          ests.forEach((e) => {
            if (e.cedula) estByCedula[e.cedula] = e.id;
            estById[e.id] = e.id;
          });
        }
        const rows = arr.map((g) => ({
          config_id: cfgUuid,
          estudiante_id: estById[g.studentId] || estByCedula[g.studentId] || null,
          estudiante_cedula: g.studentId,
          actividad_id: ensureUuid(g.activityId),
          nota: g.score != null ? Number(g.score) : null,
        })).filter((r) => r.nota != null);
        if (rows.length > 0) {
          const { error } = await supabase.from("notas_estudiantes").insert(rows);
          if (error) errors.push(`notas ${cfgUuid}: ${error.message}`);
        }
      }
    }

    // Eliminar configs que ya no están (con limpieza en cascada)
    for (const oldId of existingCfgIds) {
      if (!keepCfgIds.has(oldId)) {
        await supabase.from("notas_estudiantes").delete().eq("config_id", oldId);
        await supabase.from("estudiantes_configuracion").delete().eq("config_id", oldId);
        await supabase.from("actividades_evaluacion").delete().eq("config_id", oldId);
        await supabase.from("resultados_aprendizaje").delete().eq("config_id", oldId);
        await supabase.from("configuraciones_pao").delete().eq("id", oldId);
      }
    }
  }

  return { ok: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
}

// ---- Login ----
export async function login(loginEmail, password) {
  const email = String(loginEmail || "").toLowerCase();
  const { data } = await supabase
    .from("docentes_sistema")
    .select("*")
    .eq("email", email)
    .limit(1)
    .single();
  if (!data) return null;
  if (!data.password_hash || !verifyPassword(password, data.password_hash)) return null;
  return {
    email: data.email,
    name: data.nombres || "",
    cedula: data.cedula || "",
    role: data.rol || "docente",
    source: "db",
  };
}

export async function health() {
  if (!supabase) return { enabled: false };
  const { error } = await supabase.from("docentes_sistema").select("id", { count: "exact", head: true }).limit(1);
  return { enabled: true, error: error?.message || null };
}

// ============================================================
// APIs GRANULARES (FASE 4) — sin romper /api/store
// ============================================================

export async function getConfig(configId, email) {
  const uid = ensureUuid(configId);
  const { data } = await supabase.from("configuraciones_pao").select("*").eq("id", uid).limit(1).single();
  if (!data) return null;
  return {
    id: data.id,
    ownerEmail: data.owner_email,
    carrera: data.carrera,
    asignatura: data.asignatura,
    pao: data.pao,
    paralelo: data.paralelo,
    aporte: data.aporte,
    estado: data.estado,
    ...(data.data || {}),
  };
}

export async function updateConfig(configId, body) {
  const uid = ensureUuid(configId);
  const data = body.data || {};
  const cc = data.courseConfig || {};
  const { error } = await supabase.from("configuraciones_pao").upsert({
    id: uid,
    owner_email: body.ownerEmail || cc.docente || "",
    carrera: cc.carrera || body.carrera || "",
    asignatura: cc.asignatura || body.asignatura || "",
    pao: String(cc.pao || body.pao || ""),
    paralelo: body.paralelo || cc.paralelo || "",
    aporte: cc.aporte || body.aporte || "FIN DE CICLO",
    estado: body.estado || "borrador",
    data,
  }, { onConflict: "id" });
  return { ok: !error, error: error?.message };
}

export async function getResultados(configId) {
  const uid = ensureUuid(configId);
  const { data } = await supabase.from("resultados_aprendizaje").select("*").eq("config_id", uid).order("orden");
  return data || [];
}

export async function putResultados(configId, body) {
  const uid = ensureUuid(configId);
  const resultados = body.resultados || [];
  if (resultados.length === 0) return { ok: true };
  const rows = resultados.map((r, i) => ({
    id: ensureUuid(r.codigo || `res_${i}`),
    config_id: uid,
    tipo: r.tipo || "RAC",
    codigo: r.codigo || "",
    descripcion: r.descripcion || "",
    rac_id_relacionado: r.racIdRelacionado ? ensureUuid(r.racIdRelacionado) : (r.rac_id_relacionado ? ensureUuid(r.rac_id_relacionado) : null),
    orden: r.orden || i,
  }));
  await supabase.from("resultados_aprendizaje").delete().eq("config_id", uid);
  if (rows.length > 0) {
    const { error } = await supabase.from("resultados_aprendizaje").insert(rows);
    return { ok: !error, error: error?.message };
  }
  return { ok: true };
}

export async function getActividades(configId) {
  const uid = ensureUuid(configId);
  const { data } = await supabase.from("actividades_evaluacion").select("*").eq("config_id", uid).order("orden");
  return (data || []).map((a) => ({
    id: a.id,
    component: a.componente,
    name: a.nombre,
    desc: a.descripcion || "",
    maxScore: Number(a.puntaje_maximo),
    racId: a.rac_id || "",
    raauId: a.raau_id || "",
    procedure: a.procedimiento || "",
  }));
}

export async function putActividades(configId, body) {
  const uid = ensureUuid(configId);
  const activities = body.activities || [];
  if (activities.length === 0) return { ok: true };
  await supabase.from("actividades_evaluacion").delete().eq("config_id", uid);
    const rows = activities.map((a, i) => ({
      config_id: uid,
      componente: a.component || a.componente || "ACD",
      nombre: a.name || a.nombre || "",
      descripcion: a.desc || a.descripcion || "",
      puntaje_maximo: a.maxScore != null ? Number(a.maxScore) : 0,
      rac_id: a.racId ? ensureUuid(a.racId) : (a.rac_id ? ensureUuid(a.rac_id) : null),
      raau_id: a.raauId ? ensureUuid(a.raauId) : (a.raau_id ? ensureUuid(a.raau_id) : null),
      procedimiento: a.procedure || a.procedimiento || "",
      orden: i,
    }));
  const { error } = await supabase.from("actividades_evaluacion").insert(rows);
  return { ok: !error, error: error?.message };
}

export async function getEstudiantes(configId) {
  const uid = ensureUuid(configId);
  const { data } = await supabase.from("estudiantes_configuracion").select("*").eq("config_id", uid);
  return (data || []).map((e) => {
    const parts = (e.nombres || "").split(" ");
    const apellidos = parts.slice(0, 2).join(" ");
    const nombres = parts.slice(2).join(" ");
    return {
      id: e.id,
      cedula: e.cedula || "",
      codigo: e.codigo_estudiante || "",
      apellidos,
      nombres,
      email: e.email || "",
    };
  });
}

export async function putEstudiantes(configId, body) {
  const uid = ensureUuid(configId);
  const estudiantes = body.estudiantes || [];
  if (estudiantes.length === 0) return { ok: true, count: 0 };
  let inserted = 0;
  for (const e of estudiantes) {
    const ced = (e.cedula || "").replace(/[^0-9]/g, "");
    if (!ced) continue;
    const nombres = [e.apellidos || "", e.nombres || ""].filter(Boolean).join(" ") || e.nombres || "";
    const { error } = await supabase.from("estudiantes_configuracion").upsert({
      config_id: uid,
      cedula: ced,
      codigo_estudiante: e.codigo || e.codigo_estudiante || "",
      nombres: nombres.toUpperCase().trim(),
      email: e.email || "",
    }, { onConflict: "config_id,cedula", ignoreDuplicates: false });
    if (!error) inserted++;
  }
  return { ok: true, count: inserted };
}

export async function getNotas(configId) {
  const uid = ensureUuid(configId);
  const { data } = await supabase.from("notas_estudiantes").select("*").eq("config_id", uid);
  return (data || []).map((n) => ({
    studentId: n.estudiante_id || n.estudiante_cedula,
    activityId: n.actividad_id,
    score: n.nota != null ? Number(n.nota) : null,
  })).filter((n) => n.score != null);
}

export async function putNotas(configId, body) {
  const uid = ensureUuid(configId);
  const notas = body.notas || [];
  if (notas.length === 0) return { ok: true };
  const { data: ests } = await supabase.from("estudiantes_configuracion").select("id,cedula").eq("config_id", uid);
  const estMap = {};
  if (ests) ests.forEach((e) => { if (e.cedula) estMap[e.cedula] = e.id; });
  await supabase.from("notas_estudiantes").delete().eq("config_id", uid);
  const rows = notas.map((n) => ({
    config_id: uid,
    estudiante_id: estMap[n.studentId] || null,
    estudiante_cedula: n.studentId,
    actividad_id: ensureUuid(n.activityId),
    nota: n.score != null ? Number(n.score) : null,
  })).filter((r) => r.nota != null);
  if (rows.length === 0) return { ok: true };
  const { error } = await supabase.from("notas_estudiantes").insert(rows);
  return { ok: !error, error: error?.message };
}

export async function getResumen(configId) {
  const uid = ensureUuid(configId);
  const { data } = await supabase.from("resumen_calificaciones").select("*").eq("config_id", uid);
  return (data || []).map((r) => ({
    estudianteId: r.estudiante_id || r.estudiante_cedula,
    total: r.total != null ? Number(r.total) : null,
    promedio: r.promedio != null ? Number(r.promedio) : null,
    estado: r.estado || "",
  }));
}

export async function getReporte(configId) {
  const uid = ensureUuid(configId);
  const [config, estudiantes, actividades, notas, resumen] = await Promise.all([
    getConfig(uid, ""),
    getEstudiantes(uid),
    getActividades(uid),
    getNotas(uid),
    getResumen(uid),
  ]);
  return { config, estudiantes, actividades, notas, resumen };
}
