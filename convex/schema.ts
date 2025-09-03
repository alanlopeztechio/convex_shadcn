import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTable = defineSchema({
  //Usuarios
  user: defineTable({
    name: v.string(),
    lastName: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    birthDate: v.optional(v.number()),
    admissionDate: v.optional(v.number()),
    imgUrl: v.optional(v.string()),
    clerkId: v.string(),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"]),
  userSchool: defineTable({
    userId: v.id("user"),
    schoolId: v.id("school"),
    role: v.array(
      v.union(
        v.literal("superadmin"),
        v.literal("admin"),
        v.literal("auditor"),
        v.literal("teacher"),
        v.literal("tutor")
      )
    ),
    status: v.union(v.literal("active"), v.literal("inactive")),
    department: v.optional(
      v.union(
        v.literal("secretary"),
        v.literal("direction"),
        v.literal("schoolControl"),
        v.literal("technology")
      )
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_schoolId", ["schoolId"])
    .index("by_role", ["role"])
    .index("by_status", ["status"])
    .index("by_department", ["department"]),

  //Escuelas
  school: defineTable({
    name: v.string(),
    subdomain: v.string(),
    shortName: v.string(),
    cctCode: v.string(),
    address: v.string(),
    description: v.string(),
    imgUrl: v.string(),
    phone: v.string(),
    email: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_subdomain", ["subdomain"])
    .index("by_name", ["name"])
    .index("by_cctCode", ["cctCode"])
    .index("by_shortName", ["shortName"])
    .index("by_phone", ["phone"])
    .index("by_email", ["email"])
    .index("by_status", ["status"]),
  //estudiantes
  student: defineTable({
    schoolId: v.id("school"),
    groupId: v.id("group"),
    tutorId: v.id("user"),
    enrollment: v.string(),
    name: v.string(),
    lastName: v.optional(v.string()),
    birthDate: v.optional(v.number()),
    admissionDate: v.optional(v.number()),
    imgUrl: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_groupId", ["groupId"])
    .index("by_schoolId", ["schoolId"])
    .index("by_schoolId_and_enrollment", ["schoolId", "enrollment"]),

  //Ciclos escolares
  schoolCycle: defineTable({
    schoolId: v.id("school"),
    name: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("archived"),
      v.literal("inactive")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_school", ["schoolId"])
    .index("by_status", ["status"])
    .index("by_school_and_name", ["schoolId", "name"]), // Índice único compuesto

  //Materias
  subject: defineTable({
    schoolId: v.id("school"),
    name: v.string(),
    description: v.optional(v.string()),
    credits: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    updatedAt: v.optional(v.number()),
    updatedBy: v.optional(v.id("user")),
  })
    .index("by_school", ["schoolId"])
    .index("by_status", ["status"])
    .index("by_name", ["name"]),

  //Aulas
  classroom: defineTable({
    schoolId: v.id("school"),
    name: v.string(),
    capacity: v.number(),
    location: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_school", ["schoolId"])
    .index("by_status", ["status"]),

  //Grupos
  group: defineTable({
    schoolId: v.id("school"),
    name: v.string(),
    grade: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    updatedAt: v.optional(v.number()),
    updatedBy: v.optional(v.id("user")),
  })
    .index("by_school", ["schoolId"])
    .index("by_status", ["status"])
    .index("by_school_name_grade", ["schoolId", "name", "grade"]),

  //Horarios
  schedule: defineTable({
    schoolId: v.id("school"),
    name: v.string(), //El nombre viene desde el nombre (name) de classCatalog
    day: v.union(
      v.literal("lun."),
      v.literal("mar."),
      v.literal("mié."),
      v.literal("jue."),
      v.literal("vie.")
    ),
    startTime: v.string(),
    endTime: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    updatedAt: v.number(),
  })
    .index("by_school_day", ["schoolId", "day"])
    .index("by_status", ["status"]),

  //Periodos
  term: defineTable({
    schoolCycleId: v.id("schoolCycle"),
    name: v.string(),
    key: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("closed")
    ),
    updatedAt: v.optional(v.number()),
  })
    .index("by_schoolCycleId", ["schoolCycleId"])
    .index("by_status", ["status"]),

  //Rúbrica de Calificación
  gradeRubric: defineTable({
    classCatalogId: v.id("classCatalog"),
    termId: v.id("term"),
    name: v.string(), // Ej: "Tareas", "Examen Final"
    weight: v.number(), // Peso en la calificación de la unidad (ej: 0.4)
    maxScore: v.number(), // Puntuación máxima (ej: 100)
    createdBy: v.id("user"),
    updatedAt: v.optional(v.number()),
    status: v.boolean(),
  })
    .index("by_status", ["status"])
    .index("by_class_term", ["classCatalogId", "termId"]),

  // Tareas, exámenes o proyectos individuales
  assignment: defineTable({
    classCatalogId: v.id("classCatalog"),
    termId: v.id("term"),
    gradeRubricId: v.id("gradeRubric"),
    name: v.string(),
    description: v.optional(v.string()),
    dueDate: v.number(),
    maxScore: v.number(),
    createdBy: v.id("user"),
    updatedAt: v.optional(v.number()),
  })
    .index("by_classCatalogId", ["classCatalogId"])
    .index("by_term", ["termId"]) // ✨ Para el tutor y el admin
    .index("by_createdBy", ["createdBy"]) // ✨ Para el maestro
    .index("by_rubric", ["gradeRubricId"]),

  //Calificaciones Individuales
  grade: defineTable({
    studentClassId: v.id("studentClass"),
    gradeRubricId: v.id("gradeRubric"), // Referencia al criterio de evaluación
    score: v.number(), // Calificación obtenida por el estudiante
    comments: v.optional(v.string()),
    registeredById: v.id("user"),
    // registrationDate: v.number(), //no tiene caso se puede usar _creationTime de convex
    createdBy: v.id("user"),
    updatedBy: v.optional(v.id("user")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_student_class", ["studentClassId"])
    .index("by_registered_by", ["registeredById"])
    .index("by_rubric", ["gradeRubricId"]),
  //Promedios Calculados
  termAverage: defineTable({
    studentClassId: v.id("studentClass"),
    termId: v.id("term"),
    averageScore: v.number(), // El promedio final del periodo
    comments: v.optional(v.string()),
    createdBy: v.id("user"),
    updatedBy: v.optional(v.id("user")),
    updatedAt: v.optional(v.number()),
  }).index("by_student_term", ["studentClassId", "termId"]),
  //Fk

  //Clases
  classCatalog: defineTable({
    termId: v.id("term"),
    schoolId: v.id("school"),
    schoolCycleId: v.id("schoolCycle"),
    subjectId: v.id("subject"),
    classroomId: v.id("classroom"),
    teacherId: v.id("user"),
    groupId: v.optional(v.id("group")),
    // scheduleId: v.id("schedule"),
    name: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdBy: v.optional(v.id("user")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_term", ["termId"])
    .index("by_school", ["schoolId"])
    .index("by_cycle", ["schoolCycleId"])
    .index("by_subject", ["subjectId"])
    .index("by_classroom", ["classroomId"])
    .index("by_teacher", ["teacherId"]),

  //Relación entre clases y horarios
  classSchedule: defineTable({
    classCatalogId: v.id("classCatalog"),
    scheduleId: v.id("schedule"),
    weekDay: v.number(),
    status: v.union(v.literal("active"), v.literal("inactive")),
  })
    .index("by_class_catalog", ["classCatalogId"])
    .index("by_schedule", ["scheduleId"]),

  //Relación entre estudiantes y clases
  studentClass: defineTable({
    classCatalogId: v.id("classCatalog"),
    studentId: v.id("student"),
    enrollmentDate: v.number(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    // Nuevos campos para el promedio acumulado del ciclo escolar
    averageScore: v.optional(v.number()), // Promedio acumulado de la materia
    lastCalculatedTermId: v.optional(v.id("term")), // Referencia al último periodo calculado
  })
    .index("by_class_catalog", ["classCatalogId"])
    .index("by_student", ["studentId"]),

  //Asistencia
  attendance: defineTable({
    studentClassId: v.id("studentClass"),
    date: v.number(),
    present: v.boolean(),
    justified: v.optional(v.boolean()),
    comments: v.optional(v.string()),
    registrationDate: v.number(),
    createdBy: v.id("user"),
    updatedBy: v.id("user"),
    updatedAt: v.number(),
  })
    .index("by_student_class", ["studentClassId"])
    .index("by_date", ["date"])
    .index("by_student_class_and_date", ["studentClassId", "date"]),

  //Eventos del calendario escolar
  calendar: defineTable({
    schoolCycleId: v.id("schoolCycle"),
    schoolId: v.id("school"),
    date: v.number(),
    eventTypeId: v.id("eventType"),
    description: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_school", ["schoolId"])
    .index("by_cycle", ["schoolCycleId"])
    .index("by_date", ["date"]),

  //Tipos de eventos del calendario escolar
  eventType: defineTable({
    schoolId: v.id("school"),
    name: v.string(),
    key: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_school", ["schoolId"]),

  //Suscriptions
  schoolSubscription: defineTable({
    schoolId: v.id("school"),
    userId: v.id("user"),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    currency: v.string(),
    plan: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("trialing"),
      v.literal("inactive")
    ),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_schoolId", ["schoolId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"])
    .index("by_status", ["status"]),
});

export default applicationTable;
