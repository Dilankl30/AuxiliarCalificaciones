// Rutas del BFF — separadas del bootstrap del servidor (FASE 8)
export function createRouter(oasis, db, envWarnings) {
  class HttpError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = "HttpError";
      this.statusCode = statusCode;
    }
  }

  const routes = {
    "GET /api/health": async () => ({ ok: true, base: oasis.config.base, hasCredentials: oasis.config.hasCredentials, mock: oasis.config.mock, warnings: envWarnings }),

    "GET /api/periodo-actual": () => oasis.getPeriodoActual(),

    "GET /api/facultades": () => oasis.getFacultades(),

    "GET /api/carreras": async () => (await oasis.getCarreras()).filter((c) => c.estado === "ABI"),

    "POST /api/nomina": (body) => oasis.resolverNomina(body),

    "POST /api/docentes-carrera": (body) => oasis.getDocentesCarrera(body),

    "POST /api/horario-docente": (body) => oasis.getHorarioDocente(body),

    "POST /api/login": async (body) => {
      if (!body.login || !body.password) throw new HttpError("Debe ingresar usuario y contraseña.", 400);
      return oasis.login(body.login, body.password);
    },

    "POST /api/materias-docente": (body) =>
      oasis.getMateriasDocente(body.codCarrera, body.cedula, body.codPeriodo),

    "POST /api/alumnos-materia": (body) => oasis.getAlumnosMateria(body),

    "POST /api/notas": (body) => oasis.getNotas(body.codCarrera, body.cedula),

    "POST /api/estudiante": (body) => oasis.getDatosEstudiante(body.cedula),

    "POST /api/materias-estudiante": (body) => oasis.getMateriasEstudiante(body.codCarrera, body.cedula, body.codPeriodo),

    "POST /api/estudiante-full": async (body) => {
      const cedula = body.cedula;
      const [estudiante, periodo, carreras] = await Promise.all([
        oasis.getDatosEstudiante(cedula),
        oasis.getPeriodoActual(),
        oasis.getCarreras(),
      ]);
      const codPeriodo = periodo?.codigo || "";
      if (!codPeriodo || !estudiante) return { estudiante, materias: [], horario: [] };

      const orellana = carreras.filter((c) => c.nombre.toUpperCase().includes("ORELLANA"));
      const otras = carreras.filter((c) => !c.nombre.toUpperCase().includes("ORELLANA"));
      const priorizadas = [...orellana, ...otras].slice(0, 30);

      const results = await Promise.allSettled(priorizadas.map((c) =>
        oasis.getMateriasEstudiante(c.codigo, cedula, codPeriodo).then((ms) => ({ carrera: c, materias: ms }))
      ));
      let carreraEst = null;
      let materias = [];
      for (const r of results) {
        if (r.status === "fulfilled" && r.value.materias?.length > 0) {
          carreraEst = r.value.carrera;
          materias = r.value.materias;
          break;
        }
      }

      let dictadosArr = (materias.length > 0)
        ? await Promise.all(materias.map((m) =>
            oasis.getDictados(carreraEst.codigo, m.codMateria).then((d) => ({ codMateria: m.codMateria, materia: m.materia, dictados: d }))
          ))
        : [];

      if (!estudiante.codigo && materias.length > 0 && carreraEst) {
        const cedulaDigits = cedula.replace(/\D/g, "");
        for (const da of dictadosArr) {
          if (estudiante.codigo) break;
          for (const d of da.dictados) {
            try {
              const alumnos = await oasis.getAlumnosMateria({
                codCarrera: carreraEst.codigo,
                codNivel: d.codNivel,
                codParalelo: d.paralelo,
                codPeriodo: codPeriodo,
                codMateria: da.codMateria,
              });
              if (alumnos?.length) {
                const found = alumnos.find((a) => a.cedula?.replace(/\D/g, "") === cedulaDigits);
                if (found?.codigo) {
                  estudiante.codigo = found.codigo;
                  break;
                }
              }
            } catch {}
          }
        }
      }

      if (!carreraEst && estudiante?.codigo) {
        const mockCarrera = carreras.find((c) => c.codigo === "ITIO") || carreras[0];
        if (mockCarrera) {
          carreraEst = mockCarrera;
          materias = oasis.getMockMaterias(mockCarrera.codigo);
          dictadosArr = (materias.length > 0)
            ? await Promise.all(materias.map((m) =>
                oasis.getDictados(mockCarrera.codigo, m.codMateria).then((d) => ({ codMateria: m.codMateria, materia: m.materia, dictados: d }))
              ))
            : [];
        }
      }

      return { estudiante, periodo, carrera: carreraEst, materias, horario: dictadosArr };
    },

    "GET /api/db/health": () => db.health(),

    "GET /api/store": (arg) => (db.enabled ? db.getStore({ email: arg.email, role: arg.role }) : { disabled: true }),

    "PUT /api/store": (body) => (db.enabled ? db.putStore(body) : { disabled: true }),

    "POST /api/db-login": async (body) => {
      if (!db.enabled) return { disabled: true };
      if (!body.login || !body.password) throw new HttpError("Debe ingresar usuario y contraseña.", 400);
      const u = await db.login(body.login, body.password);
      if (!u) throw new HttpError("Usuario o contraseña incorrectos.", 401);
      return u;
    },
  };

  function compileParamRoute(method, pattern) {
    const paramNames = [];
    const regexStr = pattern.replace(/:([a-zA-Z_]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
    return { method, regex: new RegExp("^" + regexStr + "$"), paramNames };
  }

  const paramRoutes = [
    { route: compileParamRoute("GET", "/api/configuraciones/:id"), handler: async (arg, params) => {
      if (!db.enabled) return { disabled: true };
      return db.getConfig(params.id, arg.email);
    }},
    { route: compileParamRoute("PUT", "/api/configuraciones/:id"), handler: async (body, params) => {
      if (!db.enabled) return { disabled: true };
      return db.updateConfig(params.id, body);
    }},
    { route: compileParamRoute("GET", "/api/configuraciones/:id/resultados"), handler: async (arg, params) => {
      if (!db.enabled) return { disabled: true };
      return db.getResultados(params.id);
    }},
    { route: compileParamRoute("PUT", "/api/configuraciones/:id/resultados"), handler: async (body, params) => {
      if (!db.enabled) return { disabled: true };
      return db.putResultados(params.id, body);
    }},
    { route: compileParamRoute("GET", "/api/configuraciones/:id/actividades"), handler: async (arg, params) => {
      if (!db.enabled) return { disabled: true };
      return db.getActividades(params.id);
    }},
    { route: compileParamRoute("PUT", "/api/configuraciones/:id/actividades"), handler: async (body, params) => {
      if (!db.enabled) return { disabled: true };
      return db.putActividades(params.id, body);
    }},
    { route: compileParamRoute("GET", "/api/configuraciones/:id/estudiantes"), handler: async (arg, params) => {
      if (!db.enabled) return { disabled: true };
      return db.getEstudiantes(params.id);
    }},
    { route: compileParamRoute("PUT", "/api/configuraciones/:id/estudiantes"), handler: async (body, params) => {
      if (!db.enabled) return { disabled: true };
      return db.putEstudiantes(params.id, body);
    }},
    { route: compileParamRoute("POST", "/api/configuraciones/:id/estudiantes/nomina"), handler: async (body, params) => {
      if (!db.enabled) return { disabled: true, imported: false };
      const res = await oasis.resolverNomina(body);
      const estudiantes = (res && res.estudiantes) || [];
      if (estudiantes.length > 0) await db.putEstudiantes(params.id, { estudiantes });
      return { imported: true, estudiantes, resuelto: res?.resuelto || null };
    }},
    { route: compileParamRoute("GET", "/api/configuraciones/:id/notas"), handler: async (arg, params) => {
      if (!db.enabled) return { disabled: true };
      return db.getNotas(params.id);
    }},
    { route: compileParamRoute("PUT", "/api/configuraciones/:id/notas"), handler: async (body, params) => {
      if (!db.enabled) return { disabled: true };
      return db.putNotas(params.id, body);
    }},
    { route: compileParamRoute("GET", "/api/configuraciones/:id/resumen"), handler: async (arg, params) => {
      if (!db.enabled) return { disabled: true };
      return db.getResumen(params.id);
    }},
    { route: compileParamRoute("GET", "/api/configuraciones/:id/reporte"), handler: async (arg, params) => {
      if (!db.enabled) return { disabled: true };
      return db.getReporte(params.id);
    }},
  ];

  return { routes, paramRoutes };
}
