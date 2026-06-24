/**
 * Servicio especializado en la gestión de calificaciones, cálculos de totales y sincronización de notas.
 */
export const GradeService = {
  /**
   * Obtiene la nota de un estudiante en una actividad específica.
   * @param {string} configId - ID de la configuración activa.
   * @param {string} studentId - ID o Cédula del estudiante.
   * @param {string} activityId - ID de la actividad.
   * @returns {number|null} El puntaje o null si no existe.
   */
  getGrade: (configId, studentId, activityId) => {
    if (!window.STATE) return null;
    const grades = window.STATE.gradesByConfig[configId] || [];
    const g = grades.find(x => x.studentId === studentId && x.activityId === activityId);
    return g ? g.score : null;
  },

  /**
   * Establece la nota de un estudiante en memoria.
   * @param {string} configId - ID de la configuración activa.
   * @param {string} studentId - ID o Cédula del estudiante.
   * @param {string} activityId - ID de la actividad.
   * @param {number|null} score - Puntaje a asignar.
   */
  setGrade(configId, studentId, activityId, score) {
    if (!window.STATE) return;

    if (!window.STATE.gradesByConfig) window.STATE.gradesByConfig = {};
    if (!window.STATE.gradesByConfig[configId]) window.STATE.gradesByConfig[configId] = [];
    
    const grades = window.STATE.gradesByConfig[configId];
    const idx = grades.findIndex(x => x.studentId === studentId && x.activityId === activityId);
    
    if (idx >= 0) {
      grades[idx].score = score;
    } else {
      grades.push({ studentId, activityId, score });
    }
  },

  /**
   * Calcula el total de puntos de un estudiante sumando todas las actividades.
   * @param {string} configId - ID de la configuración activa.
   * @param {string} studentId - ID o Cédula del estudiante.
   * @returns {number} Suma total de puntajes.
   */
  calculateStudentTotal: (configId, studentId) => {
    if (!window.STATE) return 0;
    const activities = window.STATE.activities || [];
    return activities.reduce((sum, act) => {
      const g = GradeService.getGrade(configId, studentId, act.id);
      return sum + (g != null ? g : 0);
    }, 0);
  },

  /**
   * Calcula estadísticas globales de la clase (aprobados, reprobados, promedio).
   * @param {string} configId - ID de la configuración activa.
   * @param {Array} students - Lista de estudiantes de la configuración.
   * @param {Array} activities - Lista de actividades de la configuración.
   * @returns {Object} Estadísticas calculadas.
   */
  calculateClassStats: (configId, students = [], activities = []) => {
    const allTotals = students.map(s => GradeService.calculateStudentTotal(configId, s.id));
    const maxTotal = activities.reduce((s, a) => s + (a.maxScore || 0), 0);
    
    const approvedCount = allTotals.filter(t => t >= 7).length;
    const failedCount = allTotals.filter(t => t > 0 && t < 7).length;
    const noGradeCount = allTotals.filter(t => t === 0).length;
    const classAverage = allTotals.length > 0 
      ? allTotals.reduce((a, b) => a + b, 0) / allTotals.length 
      : 0;

    return {
      approvedCount,
      failedCount,
      noGradeCount,
      classAverage,
      maxTotal,
      allTotals
    };
  },

  /**
   * Formatea un número a dos decimales.
   */
  formatScore: (n) => Number(n || 0).toFixed(2),

  /**
   * Calcula el porcentaje de avance/logro.
   */
  calculatePercentage: (a, b) => (b > 0 ? Math.round(a / b * 100) : 0)
};
