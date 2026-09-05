const { clipboard } = require("electron");

// 实现剪切板功能
const copyBtn = document.getElementById("copyBtn");
const copyText = document.getElementById("copyText");
copyBtn.addEventListener("click", function () {
  // 往剪切板里面写入要复制的内容
  clipboard.writeText(copyText.textContent);
  window.alert("激活码复制成功！");
});


// 发送系统通知
const notifyBtn = document.getElementById("notifyBtn");
notifyBtn.addEventListener("click", function () {
  const option = {
    title: "您有一条新的消息，请及时查看",
    body: "这是一条测试消息，技术支持来源于 HTML5 的 notificationAPI",
  };
  const myNotify = new Notification(option.title, option);
  myNotify.onclick = function () {
    console.log("用户点击了通知");
  };
});


