import attachEvent from './attachEvent.js';
import doValidate from './doValidate.js';
import validator from 'validator';
import config from './config.js';

const validateAll = () => {
  let findAllEl = document ? document.getElementsByClassName('validate') : [];
  if (findAllEl.length <=0) return
  const result = []
  for (let item of findAllEl) {
    result.push(doValidate(item))
  }
  return result
}

 const validate ={
  version: config.version,
  addRule: config.addRule,
  autoValidate: attachEvent,
  doValidate: doValidate,
  validateAll: validateAll,
}

// pick functions from validator
for (const key of Object.keys(config.ruleNames)) {
  const funcKey = config.ruleNames[key]
  if (funcKey && validator[funcKey] && Object.prototype.toString.call(validator[funcKey]) === '[object Function]') {
    validate[funcKey] = validator[funcKey]
  }
}

export default validate;

