const DomainException = require('./DomainException');
class UnauthorizedException extends DomainException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}
module.exports = UnauthorizedException;
