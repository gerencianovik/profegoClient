const { Sequelize } = require("sequelize");
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT, MYSQL_URI } = require("../keys");

let sequelize;

// Usar URI de conexión si está disponible
if (MYSQL_URI) {
    sequelize = new Sequelize(MYSQL_URI);
} else {
    // Configuración para parámetros individuales
    sequelize = new Sequelize(MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD, {
        host: MYSQLHOST,
        port: MYSQLPORT,
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000
        }
    });
}

// Autenticar y sincronizar
sequelize.authenticate()
    .then(() => {
        console.log("Conexión establecida con la base de datos");
    })
    .catch((err) => {
        console.error("No se pudo conectar a la base de datos:", err.message);
    });

sequelize.sync({ force: false })
    .then(() => {
        console.log("Tablas sincronizadas");
    })
    .catch((err) => {
        console.error("Error al sincronizar las tablas:", err.message);
    });

//extracionModelos
const askModel = require('../models/ask.model')
const askAswernModel = require('../models/askAswern.model')
const assessmentModel = require('../models/assessment.model')
const aswernModel = require('../models/aswern.model')
const attendanceModel = require('../models/attendance.model')
const billModel = require('../models/bill.model')
const bookingModel = require('../models/booking.model')
const classModel = require('../models/class.model')
const coursModel = require('../models/cours.model')
const coursClassTypeModel = require ('../models/coursClassType.model')
const curricularContentModel = require('../models/syllabusEducational.model')
const detailGroupsModel = require('../models/datailGroups.model')
const detailAttendanceModel = require('../models/detailAttendance.model')
const detailBookingModel = require('../models/detailBooking.model')
const detailCurricularContentModel = require('../models/detailCurricularContent.model')
const detailMaterialModel = require('../models/detailMaterial.model')
const detailRecoursModel = require('../models/detailRecours.model')
const detailStudentPageModel = require('../models/detailStudentPage.model')
const detailTeacherModel = require('../models/detailTeach.model')
const detailTeachPageModel = require('../models/detailTeachPage.model')
const diplomasModel = require('../models/diplomas.model')
const diplimasTypeModel = require('../models/diplomasType.model')
const groupsModel = require('../models/groups.model')
const materialModel = require('../models/material.model')
const membersModel = require('../models/members.model')
const multimediaClassModel = require('../models/multimediaClass.model')
const multimediaCoursModel = require('../models/multimediaCourse.model')
const multimediaTaskModel = require('../models/mutimediaTask.model')
const observationModel = require('../models/observation.model')
const pageModel = require('../models/page.model')
const payTypeModel = require('../models/payType.model')
const policyModel = require('../models/policy.model')
const recoursModel = require('../models/recours.model')
const resultModel = require('../models/result.model')
const specialtyTypeModel = require('../models/specialtyType.model')
const studentModel = require('../models/student.model')
const subjectsModel = require('../models/subjects.model')
const taskClassModel = require('../models/taskClass.model')
const teachCouchModel = require('../models/teachCouch.model')
const teacherDetailModel = require('../models/teacherDetail')
const teacherModel = require('../models/teacher')
const userModel = require('../models/user.model');
//zincronia tablas
const ask = askModel(sequelize, Sequelize)
const askAswern = askAswernModel(sequelize, Sequelize)
const assessment = assessmentModel(sequelize, Sequelize)
const aswern = aswernModel(sequelize, Sequelize)
const attendance = attendanceModel(sequelize, Sequelize)
const bill = billModel(sequelize, Sequelize)
const booking = bookingModel(sequelize, Sequelize)
const clases = classModel(sequelize, Sequelize)
const cours = coursModel(sequelize, Sequelize)
const coursClassType = coursClassTypeModel(sequelize, Sequelize)
const curricularContent = curricularContentModel(sequelize, Sequelize)
const detailGroups = detailGroupsModel(sequelize, Sequelize)
const detailAttendance = detailAttendanceModel(sequelize, Sequelize)
const detailBooking = detailBookingModel(sequelize, Sequelize)
const detailCurricularContent = detailCurricularContentModel(sequelize, Sequelize)
const detailMaterial = detailMaterialModel(sequelize, Sequelize)
const detailRecours = detailRecoursModel(sequelize, Sequelize)
const detailStudentPage = detailStudentPageModel(sequelize, Sequelize)
const detailTeach = detailTeacherModel(sequelize, Sequelize)
const detailTeachPage = detailTeachPageModel(sequelize, Sequelize)
const diplomas = diplomasModel(sequelize, Sequelize)
const diplomasType = diplimasTypeModel(sequelize, Sequelize)
const groups = groupsModel(sequelize, Sequelize)
const material = materialModel(sequelize, Sequelize)
const members = membersModel(sequelize, Sequelize)
const multimediaClass = multimediaClassModel(sequelize, Sequelize)
const multimediaCourse = multimediaCoursModel(sequelize, Sequelize)
const multimediaTask = multimediaTaskModel(sequelize, Sequelize)
const observation = observationModel(sequelize, Sequelize)
const page = pageModel(sequelize, Sequelize)
const payType = payTypeModel(sequelize, Sequelize)
const policy = policyModel(sequelize, Sequelize)
const recours = recoursModel(sequelize, Sequelize)
const result = resultModel(sequelize, Sequelize)
const specialtyType = specialtyTypeModel(sequelize, Sequelize)
const student = studentModel(sequelize, Sequelize)
const subjects = subjectsModel(sequelize, Sequelize)
const taskClass = taskClassModel(sequelize, Sequelize)
const  teachCouch = teachCouchModel(sequelize, Sequelize)
const teacherDetail = teacherDetailModel(sequelize, Sequelize)
const teacher = teacherModel(sequelize, Sequelize)
const user = userModel(sequelize, Sequelize)
//relaciones
user.hasMany(page);
page.belongsTo(user);

page.hasMany(detailTeachPage);
detailTeachPage.belongsTo(page);

page.hasMany(detailStudentPage);
detailStudentPage.belongsTo(page);

teacher.hasMany(detailTeachPage);
detailTeachPage.belongsTo(teacher);

student.hasMany(detailStudentPage);
detailStudentPage.belongsTo(student);

page.hasMany(coursClassType);
coursClassType.belongsTo(page);

teacher.hasMany(teacherDetail);
teacherDetail.belongsTo(teacher);

page.hasMany(clases);
clases.belongsTo(page);

page.hasMany(cours);
cours.belongsTo(page);

clases.hasMany(recours);
recours.belongsTo(clases);

cours.hasMany(recours);
recours.belongsTo(cours);

multimediaClass.hasMany(detailRecours);
detailRecours.belongsTo(multimediaClass);

multimediaCourse.hasMany(detailRecours);
detailRecours.belongsTo(multimediaCourse);

clases.hasMany(material);
material.belongsTo(clases);

cours.hasMany(material);
material.belongsTo(cours);

diplomasType.hasMany(diplomas);
diplomas.belongsTo(diplomasType);

cours.hasMany(diplomas);
diplomas.belongsTo(cours);

detailTeachPage.hasMany(clases);
clases.belongsTo(detailTeachPage);

detailTeachPage.hasMany(cours);
cours.belongsTo(detailTeachPage);

clases.hasMany(members);
members.belongsTo(clases);

cours.hasMany(members);
members.belongsTo(cours);

members.hasMany(detailGroups);
detailGroups.belongsTo(members);

groups.hasMany(detailGroups);
detailGroups.belongsTo(groups);

groups.hasMany(taskClass);
taskClass.belongsTo(groups);

taskClass.hasMany(observation);
observation.belongsTo(taskClass);

multimediaTask.hasMany(taskClass);
taskClass.belongsTo(multimediaTask);

groups.hasMany(attendance);
attendance.belongsTo(groups);

attendance.hasMany(detailAttendance);
detailAttendance.belongsTo(attendance);

page.hasMany(material);
material.belongsTo(page);

page.hasMany(policy);
policy.belongsTo(page);

specialtyType.hasMany(detailTeach);
detailTeach.belongsTo(specialtyType);

teacher.hasMany(detailTeach);
detailTeach.belongsTo(teacher);

teachCouch.hasMany(detailTeach);
detailTeach.belongsTo(teachCouch);

student.hasMany(bill);
bill.belongsTo(student);

payType.hasMany(bill);
bill.belongsTo(payType);

student.hasMany(detailBooking);
detailBooking.belongsTo(student);

booking.hasMany(detailBooking);
detailBooking.belongsTo(booking);

curricularContent.hasMany(detailCurricularContent);
detailCurricularContent.belongsTo(curricularContent);

cours.hasMany(curricularContent);
curricularContent.belongsTo(cours);

assessment.hasMany(ask, {
    foreignKey: 'assessmentIdAssessment',
    sourceKey: 'idAssessment'
});
ask.belongsTo(assessment, {
    foreignKey: 'assessmentIdAssessment',
    targetKey: 'idAssessment',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});
ask.hasMany(askAswern);
askAswern.belongsTo(ask);

aswern.hasMany(askAswern);
askAswern.belongsTo(aswern);

result.hasMany(askAswern);
askAswern.belongsTo(result);

detailAttendance.hasMany(askAswern);
askAswern.belongsTo(detailAttendance);

page.hasMany(subjects);
subjects.belongsTo(page);

subjects.hasMany(clases);
clases.belongsTo(subjects);

clases.hasMany(assessment);
assessment.belongsTo(clases);

cours.hasMany(assessment);
assessment.belongsTo(cours);

page.hasMany(specialtyType);
specialtyType.belongsTo(page);

page.hasMany(diplomasType);
diplomasType.belongsTo(page);

clases.hasMany(multimediaClass);
multimediaClass.belongsTo(clases);

cours.hasMany(multimediaCourse);
multimediaCourse.belongsTo(cours);

material.hasMany(detailMaterial);
detailMaterial.belongsTo(material);

recours.hasMany(detailRecours);
detailRecours.belongsTo(recours);

taskClass.hasMany(multimediaTask);
multimediaTask.belongsTo(taskClass);

page.hasMany(recours);
recours.belongsTo(page);

specialtyType.hasMany(teacherDetail)
teacherDetail.belongsTo(specialtyType)

teacher.hasMany(teachCouch)
teachCouch.belongsTo(teacher)

coursClassType.hasMany(cours)
cours.belongsTo(coursClassType)

coursClassType.hasMany(clases)
clases.belongsTo(coursClassType)

sequelize.sync({ alter: true }) // alter will update the database schema to match the model
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Error synchronizing the database:', error);
    });

// Exportar el objeto sequelize
module.exports = {
    ask,
    askAswern,
    assessment,
    aswern,
    attendance,
    bill,
    booking,
    clases,
    cours,
    coursClassType,
    curricularContent,
    detailGroups,
    detailAttendance,
    detailBooking,
    detailCurricularContent,
    detailMaterial,
    detailRecours,
    detailStudentPage,
    detailTeach,
    detailTeachPage,
    diplomas,
    diplomasType,
    groups,
    material,
    members,
    multimediaClass,
    multimediaCourse,
    multimediaTask,
    observation,
    page,
    payType,
    policy,
    recours,
    result,
    specialtyType,
    student,
    subjects,
    taskClass,
    teachCouch,
    teacherDetail,
    teacher,
    user
};