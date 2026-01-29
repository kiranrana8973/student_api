const UnauthorizedException = require('../../../domain/exceptions/UnauthorizedException');
class AuthMiddleware {
  constructor(tokenService, studentRepository) {
    this.tokenService = tokenService;
    this.studentRepository = studentRepository;
  }
  protect() {
    return async (req, res, next) => {
      try {
        let token;
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer')
        ) {
          token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
          throw new UnauthorizedException('Not authorized to access this route');
        }
        try {
          const decoded = this.tokenService.verifyToken(token);
          const student = await this.studentRepository.findById(decoded.id);
          if (!student) {
            throw new UnauthorizedException(
              'Not authorized to access this route'
            );
          }
          req.user = { id: student.id };
          next();
        } catch (err) {
          throw new UnauthorizedException('Not authorized to access this route');
        }
      } catch (error) {
        next(error);
      }
    };
  }
}
module.exports = AuthMiddleware;
