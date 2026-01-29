class ITokenService {
  generateToken(studentId) {
    throw new Error('Method generateToken() must be implemented');
  }
  verifyToken(token) {
    throw new Error('Method verifyToken() must be implemented');
  }
}
module.exports = ITokenService;
