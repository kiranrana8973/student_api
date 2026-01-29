const DomainException = require('./DomainException');
class ValidationException extends DomainException {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}
module.exports = ValidationException;
