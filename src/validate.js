import attachEvent from './attachEvent.js';
import doValidate from './doValidate.js';
import validator from 'validator';

function validate () {
  for(let item of Object.keys(validator)) {
    this[item] = validator[item]
  }
  this.autoValidate = attachEvent;
  this.validateAll = function() {
    let findAllEl = document.getElementsByClassName('validate');
    if (findAllEl.length <=0) return
    for (let item of findAllEl) {
      doValidate(item)
    }
  };
  this.doValidate = doValidate;
}

export default new validate()
