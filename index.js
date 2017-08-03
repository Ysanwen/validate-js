'use strict';
/* global window, document  */

// import attachEvent from './src/attachEvent.js';
import validate from './src/validate.js';

window.onload = function() {

  document.getElementById('addButton').addEventListener('click', function() {
    let rule = document.getElementById('rule').value;
    let trigger = document.getElementById('trigger').value || 'change';
    let successInfo = document.getElementById('success').value;
    let failInfo = document.getElementById('fail').value;

    let newInput = document.createElement("input");
    newInput.className = 'validate';
    rule && newInput.setAttribute('validate-rule', rule);
    newInput.setAttribute('placeholder', rule || '不能为空')
    newInput.setAttribute('validate-trigger', trigger);
    successInfo && newInput.setAttribute('validate-success', successInfo);
    failInfo && newInput.setAttribute('validate-fail', failInfo);
    document.getElementById('app').insertBefore(newInput,document.getElementById('add-new'));
  });

  document.getElementById('validate-all').addEventListener('click', function(){
    validate.validateAll()
  })
  // attachEvent();
  validate.autoValidate();
}
