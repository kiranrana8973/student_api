const DomainException = require('./DomainException');
class ConflictException extends DomainException {
  constructor(message) {
    super(message, 409);
  }
}
module.exports = ConflictException;
