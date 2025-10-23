const path = require("path");

const MongoStudentRepository = require("./infrastructure/database/repositories/MongoStudentRepository");
const MongoCourseRepository = require("./infrastructure/database/repositories/MongoCourseRepository");
const MongoBatchRepository = require("./infrastructure/database/repositories/MongoBatchRepository");

const BcryptPasswordHasher = require("./infrastructure/services/BcryptPasswordHasher");
const JwtTokenService = require("./infrastructure/services/JwtTokenService");
const LocalFileStorage = require("./infrastructure/services/LocalFileStorage");
const GoogleOAuthService = require("./infrastructure/services/GoogleOAuthService");
const AppleOAuthService = require("./infrastructure/services/AppleOAuthService");

// Student Use Cases
const RegisterStudent = require("./application/use-cases/student/RegisterStudent");
const LoginStudent = require("./application/use-cases/student/LoginStudent");
const GetAllStudents = require("./application/use-cases/student/GetAllStudents");
const GetStudentById = require("./application/use-cases/student/GetStudentById");
const GetStudentsByBatch = require("./application/use-cases/student/GetStudentsByBatch");
const GetStudentsByCourse = require("./application/use-cases/student/GetStudentsByCourse");
const UpdateStudent = require("./application/use-cases/student/UpdateStudent");
const DeleteStudent = require("./application/use-cases/student/DeleteStudent");
const GetCurrentStudent = require("./application/use-cases/student/GetCurrentStudent");
const UploadStudentImage = require("./application/use-cases/student/UploadStudentImage");
const GoogleOAuthLogin = require("./application/use-cases/student/GoogleOAuthLogin");
const AppleOAuthLogin = require("./application/use-cases/student/AppleOAuthLogin");

// Course Use Cases
const CreateCourse = require("./application/use-cases/course/CreateCourse");
const GetAllCourses = require("./application/use-cases/course/GetAllCourses");
const GetCourseById = require("./application/use-cases/course/GetCourseById");
const UpdateCourse = require("./application/use-cases/course/UpdateCourse");
const DeleteCourse = require("./application/use-cases/course/DeleteCourse");

// Batch Use Cases
const CreateBatch = require("./application/use-cases/batch/CreateBatch");
const GetAllBatches = require("./application/use-cases/batch/GetAllBatches");
const GetBatchById = require("./application/use-cases/batch/GetBatchById");
const UpdateBatch = require("./application/use-cases/batch/UpdateBatch");
const DeleteBatch = require("./application/use-cases/batch/DeleteBatch");

// Controllers
const StudentController = require("./presentation/http/controllers/StudentController");
const CourseController = require("./presentation/http/controllers/CourseController");
const BatchController = require("./presentation/http/controllers/BatchController");

// Middlewares
const AuthMiddleware = require("./presentation/http/middlewares/authMiddleware");

class Container {
  constructor() {
    this._setupRepositories();
    this._setupServices();
    this._setupUseCases();
    this._setupControllers();
    this._setupMiddlewares();
  }

  _setupRepositories() {
    this.studentRepository = new MongoStudentRepository();
    this.courseRepository = new MongoCourseRepository();
    this.batchRepository = new MongoBatchRepository();
  }

  _setupServices() {
    this.passwordHasher = new BcryptPasswordHasher();
    this.tokenService = new JwtTokenService(
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRE
    );
    this.fileStorage = new LocalFileStorage(
      path.join(__dirname, "..", "public", "uploads")
    );
    this.googleOAuthService = new GoogleOAuthService();
    this.appleOAuthService = new AppleOAuthService();
  }

  _setupUseCases() {
    // Student use cases
    this.registerStudent = new RegisterStudent(
      this.studentRepository,
      this.batchRepository,
      this.passwordHasher
    );
    this.loginStudent = new LoginStudent(
      this.studentRepository,
      this.passwordHasher,
      this.tokenService
    );
    this.getAllStudents = new GetAllStudents(this.studentRepository);
    this.getStudentById = new GetStudentById(this.studentRepository);
    this.getStudentsByBatch = new GetStudentsByBatch(
      this.studentRepository,
      this.batchRepository
    );
    this.getStudentsByCourse = new GetStudentsByCourse(this.studentRepository);
    this.updateStudent = new UpdateStudent(
      this.studentRepository,
      this.batchRepository
    );
    this.deleteStudent = new DeleteStudent(
      this.studentRepository,
      this.fileStorage
    );
    this.getCurrentStudent = new GetCurrentStudent(this.studentRepository);
    this.uploadStudentImage = new UploadStudentImage(this.fileStorage);
    this.googleOAuthLogin = new GoogleOAuthLogin(
      this.studentRepository,
      this.googleOAuthService,
      this.tokenService,
      this.batchRepository
    );
    this.appleOAuthLogin = new AppleOAuthLogin(
      this.studentRepository,
      this.appleOAuthService,
      this.tokenService,
      this.batchRepository
    );

    // Course use cases
    this.createCourse = new CreateCourse(this.courseRepository);
    this.getAllCourses = new GetAllCourses(this.courseRepository);
    this.getCourseById = new GetCourseById(this.courseRepository);
    this.updateCourse = new UpdateCourse(this.courseRepository);
    this.deleteCourse = new DeleteCourse(this.courseRepository);

    // Batch use cases
    this.createBatch = new CreateBatch(this.batchRepository);
    this.getAllBatches = new GetAllBatches(this.batchRepository);
    this.getBatchById = new GetBatchById(this.batchRepository);
    this.updateBatch = new UpdateBatch(this.batchRepository);
    this.deleteBatch = new DeleteBatch(this.batchRepository);
  }

  _setupControllers() {
    this.studentController = new StudentController({
      registerStudent: this.registerStudent,
      loginStudent: this.loginStudent,
      googleOAuthLogin: this.googleOAuthLogin,
      appleOAuthLogin: this.appleOAuthLogin,
      getAllStudents: this.getAllStudents,
      getStudentById: this.getStudentById,
      getStudentsByBatch: this.getStudentsByBatch,
      getStudentsByCourse: this.getStudentsByCourse,
      updateStudent: this.updateStudent,
      deleteStudent: this.deleteStudent,
      getCurrentStudent: this.getCurrentStudent,
      uploadStudentImage: this.uploadStudentImage,
    });

    this.courseController = new CourseController({
      createCourse: this.createCourse,
      getAllCourses: this.getAllCourses,
      getCourseById: this.getCourseById,
      updateCourse: this.updateCourse,
      deleteCourse: this.deleteCourse,
    });

    this.batchController = new BatchController({
      createBatch: this.createBatch,
      getAllBatches: this.getAllBatches,
      getBatchById: this.getBatchById,
      updateBatch: this.updateBatch,
      deleteBatch: this.deleteBatch,
    });
  }

  _setupMiddlewares() {
    this.authMiddleware = new AuthMiddleware(
      this.tokenService,
      this.studentRepository
    );
  }

  // Getters for controllers
  getStudentController() {
    return this.studentController;
  }

  getCourseController() {
    return this.courseController;
  }

  getBatchController() {
    return this.batchController;
  }

  getAuthMiddleware() {
    return this.authMiddleware;
  }
}

module.exports = Container;
