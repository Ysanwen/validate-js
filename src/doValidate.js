import config from './config.js';
import validator from 'validator';
import showInfo from './showInfo.js';

let userDefine = {};

/* 
** parse params from validate-rule
 */
function parseParams (ruleParams) {
  let pattern = new RegExp('^\{.*\}$');
  if (pattern.test(ruleParams)) {
    let paramsList = ruleParams.replace(/\{|\}/g, '').split(',');
    let result = {};
    for(let item of paramsList) {
      if (item.indexOf(':') >0) {
        result[item.split(':')[0]] = item.split(':')[1]
      } else {
        throw new Error(ruleParams + ' error');
      }
    }
    return result
  } else {
    return ruleParams
  }
}

/*
** validate the input type with validate-group
 */
function validateGroup(eventTarget){
  let groupName = eventTarget.getAttribute('validate-group');
  let targetType = eventTarget.tagName;
  if(['radio', 'checkbox'].indexOf(eventTarget.type) <0 ) return;
  
  // toDo: add function
}

function doValidate(eventTarget) {
  if (eventTarget.getAttribute('validate-group')) return validateGroup(eventTarget);
  let validateRule = eventTarget.getAttribute('validate-rule');
  let validateFail = false;
  if (!validateRule) {
    // default use required rule
    let value = validator.trim(eventTarget.value);
    validateFail = validator.isEmpty(value);
    if (validateFail) {
      // validate fail
      console.error('need value');
    }
  } else {
    let value = eventTarget.value;
    let validateFunctions = validateRule.split('|');
    for (let item of validateFunctions) {
      let ruleName, ruleParams;
      let spliteIndex = item.indexOf(':');
      ruleName = spliteIndex > 0 ? item.substr(0, spliteIndex) : item;
      ruleParams = spliteIndex > 0 ? parseParams(item.substr(spliteIndex+1, item.length)) : false;

      let validateResult;
      if (ruleName in config.ruleNames) {
        // call the validator function
        validateResult = ruleParams ? 
                          validator[config.ruleNames[ruleName]].apply(this, [value,ruleParams]) :
                          validator[config.ruleNames[ruleName]].apply(this, [value]);
      } else if (ruleName in userDefine) {
        // call user define function
        validateResult = ruleParams ?  userDefine[ruleName].apply(this, [value,ruleParams]) :
                          userDefine[ruleName].apply(this, [value]);
      } else {
        // no this validate name
        console.error('no these validate rule: ' + ruleName)
      }

      let pattern = new RegExp('^do.*');
      if (pattern.test(ruleName)) {
        // after do some filter function, need to set new value
        value = validateResult
        eventTarget.value = value;
      } else {
        // validate fail
        if (!validateResult) {
          console.error('validate rule "' + ruleName +'" error');
          validateFail = true;
          break;
        } else {
          console.log('validate rule "' + ruleName +'" success');
        }
      }
    }
  }
  showInfo(eventTarget, !validateFail);
}

export default doValidate