import config from './config.js';
import validator from 'validator';
import showInfo from './showInfo.js';

let userDefine = config.userDefine

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
        let paramsKey = item.split(':')[0].trim();
        let paramsValue = item.split(':')[1].trim();
        if ((paramsKey === 'min' || paramsKey === 'max') && validator.isInt(paramsValue)) {
          result[paramsKey] = parseInt(paramsValue);
        } else {
          result[paramsKey] = paramsValue
        }
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
** validate the input type with validate-group: just for radio or checkbox
 */
function validateGroup(eventTarget){
  let groupName = eventTarget.getAttribute('validate-group');
  if(['radio', 'checkbox'].indexOf(eventTarget.type) <0 ) {
    throw new Error('validate-group only support for radio or checkbox');
  };
  // find all the elements with the same validate-group
  let groupList = document.querySelectorAll('[validate-group=' + groupName +']');
  // find the one with validate-rule and just only one should has the rule
  let groupListLength = groupList.length;
  let value = [];
  let elementWithRule = [];
  let successInfo = [];
  let failInfo = [];
  for (let item=0; item < groupList.length; item++) {
    groupList[item].checked && value.push(groupList[item].value);
    groupList[item].getAttribute('validate-rule') && elementWithRule.push(groupList[item]);
    groupList[item].getAttribute('validate-success') && successInfo.push(groupList[item]);
    groupList[item].getAttribute('validate-fail') && failInfo.push(groupList[item]);
  }
  if (elementWithRule.length > 1 || successInfo.length > 1 || failInfo.length >1) {
    throw new Error(`validate-group: ${groupName} only with one success or fail info`);
  }
  // no rule defined, use default required rule
  let validateResult;
  if(elementWithRule.length === 0) {
    validateResult = value.length === 0 ? false : true;
  } else {
    let rule = elementWithRule[0].getAttribute('validate-rule');
    let ruleName, ruleParams;
    let spliteIndex = rule.indexOf(':');
    ruleName = spliteIndex > 0 ? rule.substr(0, spliteIndex) : rule;
    ruleParams = spliteIndex > 0 ? parseParams(rule.substr(spliteIndex+1, rule.length)) : false;

    if (value.length <= 0) {
      validateResult = false;
    } else if (ruleName in userDefine) {
      // call user define function
      value = value.join(',');
      validateResult = ruleParams ? userDefine[ruleName].apply(this, [value, ruleParams]) : 
                          userDefine[ruleName].apply(this, [value]);
    } else if (ruleName in config.ruleNames){
      value = value.join(',');
      validateResult = ruleParams ? validator[config.ruleNames[ruleName]].apply(this, [value,ruleParams]) :
                          validator[config.ruleNames[ruleName]].apply(this, [value]);
    } else {
      // no this validate name
      validateResult = false;
      throw new Error('no these validate rule: ' + ruleName)
    }
  }
  if (validateResult) {
    successInfo.length === 1 && showInfo(successInfo[0], true);
    successInfo.length === 0 && showInfo(groupList[groupListLength -1], true);
  } else {
    failInfo.length === 1 && showInfo(failInfo[0], false);
    failInfo.length === 0 && showInfo(groupList[groupListLength -1], false);
  }
  return validateResult;
}

function getValue(eventTarget) {
  if (eventTarget.type === 'radio' || eventTarget.type === 'checkbox') {
    if (eventTarget.checked) return eventTarget.value;
  } else if (eventTarget.type === 'file') {
    return eventTarget.files;
  } else {
    return eventTarget.value
  }
}

function doValidate(eventTarget) {
  if (eventTarget.getAttribute('validate-group')) return validateGroup(eventTarget);
  let validateRule = eventTarget.getAttribute('validate-rule');
  let validateResult = true;
  let value = getValue(eventTarget);
  if (!validateRule) {
    // default use required rule
    if (Object.prototype.toString.call(value).indexOf('FileList') > 0) {
      validateResult = value.length > 0
    } else {
      value = validator.trim(value);
      validateResult = !validator.isEmpty(value);
    }
  } else {
    let validateFunctions = validateRule.split('|');
    for (let item of validateFunctions) {
      let ruleName, ruleParams;
      let spliteIndex = item.indexOf(':');
      ruleName = spliteIndex > 0 ? item.substr(0, spliteIndex) : item;
      ruleParams = spliteIndex > 0 ? parseParams(item.substr(spliteIndex+1, item.length)) : false;
      if (ruleName in config.ruleNames) {
        // call the validator function
        validateResult = ruleParams ? 
                          validator[config.ruleNames[ruleName]].apply(this, [value,ruleParams]) :
                          validator[config.ruleNames[ruleName]].apply(this, [value]);
        let pattern = new RegExp('^do.*');
        if (pattern.test(ruleName)) {
          // after do some filter function, need to set new value
          value = validateResult
          eventTarget.value = value;
        }
      } else if (ruleName in userDefine) {
        // call user define function
        validateResult = ruleParams ?  userDefine[ruleName].apply(this, [value,ruleParams]) :
                          userDefine[ruleName].apply(this, [value]);
      } else {
        // no this validate name
        validateResult = false;
        console.error('no these validate rule: ' + ruleName);
        break;
      }
      if (!validateResult) {
        break;
      }
    }
  }
  showInfo(eventTarget, validateResult);
  return validateResult;
}

export default doValidate