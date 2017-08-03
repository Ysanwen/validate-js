import Tooltip from 'tooltip.js';

let tips = {};

function createTip(el, tipId) {
  let template = '<div id="arrow-' + tipId + '"></div><div id="inner-' +tipId + '"></div>';
  tips[tipId] = new Tooltip(el, {
    placement: 'bottom-start',
    title: template,
    html: true,
    trigger: 'manual',
  })
}

function showValidateResult(el, validateResult) {
  let tipId = el.getAttribute('validate-tip');
  if (!tipId) {
    tipId = new Date().toISOString().replace(/[-:\.]/g, '');
    el.setAttribute('validate-tip',tipId);
  }
  let successInfo = el.getAttribute('validate-success');
  let failInfo = el.getAttribute('validate-fail') || '输入非法内容';
  if (validateResult) {
    // validate success need show success info or hide fail info
    if (successInfo) {
      showTip(el, tipId, successInfo, validateResult)
    } else {
      hideTip(tipId)
    }
  } else {
    // validate fail need show fail info
    showTip(el, tipId, failInfo, validateResult)
  }
}

function showTip(el, tipId, info, successOrFail) {
  if (!tips[tipId]) {
    createTip(el,tipId)
  }
  tips[tipId].show();
  // set style
  let innerEl = document.getElementById('inner-' + tipId);
  innerEl.innerHTML = info;
  innerEl.style.fontSize = '12px';
  innerEl.style.color = successOrFail ? 'green' : 'red';
}
function hideTip(tipId) {
  if (tips[tipId]) return tips[tipId].dispose();
}
export default showValidateResult