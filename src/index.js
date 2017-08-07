import attachEvent from './attachEvent.js';
import doValidate from './doValidate.js';
import validator from 'validator';

function validate () {
  for(let item of Object.keys(validator)) {
    this[item] = validator[item]
  }

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
    window.validate = this;
  }
}

export default new validate()
