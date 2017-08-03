import config from './config.js';
import doValidate from './doValidate.js';

function dispatchFunc(e) {
  if (e.target.className.indexOf('validate') < 0) {
    return
  } 
  else {
    let triggerEvent = e.target.getAttribute('validate-trigger');
    if (!triggerEvent) {
      // default trigger validate when 'onchange' event happend
      if(e.type === 'change') {
        doValidate(e.target)
      }
    }
    else {
      if (config.eventList.indexOf(triggerEvent) >=0 &&
          triggerEvent === e.type) {
        doValidate(e.target)
      }
    }
  }
}

function attachEvent() {
  if (document.addEventListener) {
    for (let item of config.eventList){
      document.addEventListener(item, dispatchFunc, true)
    }
  } else if (document.attachEvent) {
    for(let item of config.eventList) {
      document.attachEvent('on' + item, dispatchFunc)
    }
  }
}
export default attachEvent
