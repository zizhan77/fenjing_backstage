import {
  Message,
  Notification,
  MessageBox
} from 'element-ui';

// 正常显示
function info(content) {
  Message({
    showClose: true,
    message: content,
    type: 'info'
  });
};
// 成功提示
function success(content) {
  Message({
    showClose: true,
    message: content,
    type: 'success'
  });
};
// 警告提示，可配置持续时间，返回Message对象，可调用close方法手动关闭
function warning(content, duration = 3000) {
  return Message({
    showClose: true,
    message: content,
    duration,
    type: 'warning'
  });
};
// 错误提示
function error(content) {
  Message({
    showClose: true,
    message: content,
    type: 'error'
  });
};
// 正常通知
function infoNotify(title, content) {
  Notification({
    title: title,
    message: content
  });
}
// 成功通知
function successNotify(title, content) {
  Notification({
    title: title,
    message: content,
    type: 'success'
  });
}
// 错误通知
function errorNotify(title, content) {
  Notification({
    title: title,
    message: content,
    type: 'error'
  });
}
// 警告通知
function warningNotify(title, content) {
  Notification({
    title: title,
    message: content,
    type: 'warning'
  });
}
// 操作确认
function confirm(titel, content, callbackfun) {
  MessageBox.confirm(content, titel, {
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    callbackfun && callbackfun();
  }).catch(() => {
    Message({
      type: 'info',
      message: '已取消'
    });
  });
}
// 弹窗图片
function imgBox(file) {
  MessageBox({
    showClose: true,
    customClass: 'dialog_video',
    showConfirmButton: false,
    showCancelButton: true,
    dangerouslyUseHTMLString: true,
    message: `
      <img width="100%" src="${file.url}" alt="${file.name || ''}"/>
    `
  }).catch(() => { });
}
// 弹窗视频
function videoBox(file) {
  MessageBox({
    showClose: true,
    customClass: 'dialog_video',
    showConfirmButton: false,
    showCancelButton: true,
    dangerouslyUseHTMLString: true,
    message: `
      <video controls>
      <source src="${file.url}">
      </video>
      <p class="video_tip">${file.name || ''}</p>
    `
  }).catch(() => { });
}

// alert提醒
function alert(titel, content, callbackfun) {
  MessageBox.alert(content, titel, {
    confirmButtonText: '确定',
    callback: action => {
      callbackfun && callbackfun();
    }
  });
}
export default {
  success,
  warning,
  error,
  info,
  successNotify,
  errorNotify,
  warningNotify,
  infoNotify,
  confirm,
  videoBox,
  imgBox,
  alert
};