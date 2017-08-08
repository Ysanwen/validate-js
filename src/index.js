import attachEvent from './attachEvent.js';
import doValidate from './doValidate.js';
import validator from 'validator';
import config from './config.js';

function generateValidate () {
  for(let item of Object.keys(validator)) {
    this[item] = validator[item]
  }
  this.version = config.version;
  if ( typeof window !== 'undefined') {
    this.autoValidate = attachEvent;
    this.doValidate = doValidate;
    this.validateAll = function() {
      let findAllEl = document.getElementsByClassName('validate');
      if (findAllEl.length <=0) return
      for (let item of findAllEl) {
        doValidate(item)
      }
    };
    // user define rule
    this.addRule = config.addRule;
    return this;
  }
}

export default new generateValidate()
export var validate = new generateValidate()
