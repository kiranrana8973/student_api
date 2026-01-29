class StudentController {
  constructor(useCases) {
    this.registerStudent = useCases.registerStudent;
    this.loginStudent = useCases.loginStudent;
    this.googleOAuthLogin = useCases.googleOAuthLogin;
    this.appleOAuthLogin = useCases.appleOAuthLogin;
    this.getAllStudents = useCases.getAllStudents;
    this.getStudentById = useCases.getStudentById;
    this.getStudentsByBatch = useCases.getStudentsByBatch;
    this.getStudentsByCourse = useCases.getStudentsByCourse;
    this.updateStudent = useCases.updateStudent;
    this.deleteStudent = useCases.deleteStudent;
    this.getCurrentStudent = useCases.getCurrentStudent;
    this.uploadStudentImage = useCases.uploadStudentImage;
  }
  async register(req, res, next) {
    try {
      const student = await this.registerStudent.execute(req.body);
      const token = student.getSignedJwtToken
        ? student.getSignedJwtToken()
        : null;
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
      res.status(201).cookie("token", token, options).json({
        success: true,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.loginStudent.execute(email, password);
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
      res.status(200).cookie("token", result.token, options).json({
        success: true,
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }
  async getStudents(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 25;
      const result = await this.getAllStudents.execute(page, limit);
      res.status(200).json({
        success: true,
        count: result.count,
        total: result.total,
        page: result.page,
        pages: result.pages,
        data: result.students,
      });
    } catch (error) {
      next(error);
    }
  }
  async getStudent(req, res, next) {
    try {
      const student = await this.getStudentById.execute(req.params.id);
      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }
  async searchByBatch(req, res, next) {
    try {
      const students = await this.getStudentsByBatch.execute(
        req.params.batchId
      );
      res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }
  async searchByCourse(req, res, next) {
    try {
      const students = await this.getStudentsByCourse.execute(
        req.params.courseId
      );
      res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateStudentData(req, res, next) {
    try {
      const student = await this.updateStudent.execute(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteStudentData(req, res, next) {
    try {
      await this.deleteStudent.execute(req.params.id);
      res.status(200).json({
        success: true,
        message: "Student deleted successfully",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
  async getMe(req, res, next) {
    try {
      const student = await this.getCurrentStudent.execute(req.user.id);
      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }
  async uploadImage(req, res, next) {
    try {
      const filename = await this.uploadStudentImage.execute(req.file);
      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: filename,
      });
    } catch (error) {
      next(error);
    }
  }
  async googleLogin(req, res, next) {
    try {
      const { idToken, batchId } = req.body;
      if (!idToken) {
        return res.status(400).json({
          success: false,
          error: "Google ID token is required",
        });
      }
      const result = await this.googleOAuthLogin.execute(idToken, batchId);
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
      res
        .status(result.isNewUser ? 201 : 200)
        .cookie("token", result.token, options)
        .json({
          success: true,
          token: result.token,
          isNewUser: result.isNewUser,
          data: result.student,
        });
    } catch (error) {
      next(error);
    }
  }
  async appleLogin(req, res, next) {
    try {
      const { idToken, user, batchId } = req.body;
      if (!idToken) {
        return res.status(400).json({
          success: false,
          error: "Apple ID token is required",
        });
      }
      const userData = user ? { name: user.name } : null;
      const result = await this.appleOAuthLogin.execute(
        idToken,
        userData,
        batchId
      );
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
      res
        .status(result.isNewUser ? 201 : 200)
        .cookie("token", result.token, options)
        .json({
          success: true,
          token: result.token,
          isNewUser: result.isNewUser,
          data: result.student,
        });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = StudentController;
