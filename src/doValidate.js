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
** validate the input type with validate-group: just for radio or checkbox
 */
function validateGroup(eventTarget){
  let groupName = eventTarget.getAttribute('validate-group');
  if(['radio', 'checkbox'].indexOf(eventTarget.type) <0 ) return;
  // find all the elements with the same validate-group
  let groupList = document.querySelectorAll('[validate-group=' + groupName +']');
  // find the one with validate-rule and just only one should has the rule
  let groupListLength = groupList.length;
  let value = [];
  let elementWithRule = [];
  let successInfo = [];
  let failInfo = [];
  for (let item of groupList) {
    item.checked && value.push(item.value);
    item.getAttribute('validate-rule') && elementWithRule.push(item);
    item.getAttribute('validate-success') && successInfo.push(item);
    item.getAttribute('validate-fail') && failInfo.push(item);
  }

  if (elementWithRule.length > 1 || successInfo.length > 1 || failInfo.length >1) {
    showInfo(groupList[groupListLength -1], false)
    return console.error('validate group ' + groupName + ' is error');
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

    if (ruleName in userDefine) {
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
      console.error('no these validate rule: ' + ruleName)
    }
  }
  if (validateResult) {
    successInfo.length === 1 && showInfo(successInfo[0], true);
    successInfo.length === 0 && showInfo(groupList[groupListLength -1], true);
  } else {
    failInfo.length === 1 && showInfo(failInfo[0], false);
    failInfo.length === 0 && showInfo(groupList[groupListLength -1], false);
  }
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
        showInfo(eventTarget, false);
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