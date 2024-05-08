import html2canvas from 'html2canvas';
const num200 = 200;

// Client specific url jumping
export function jumpBy2804(url) {
  if (!url || typeof url !== 'string') {
    return;
  }
  if (window.getAppVersion() && url.indexOf('client.html') === -1) {
    !url.startsWith('http') && (url = location.protocol + url);
    location.href = `client://client.html?action=ymtz^webid=2804^mode=new^url=${url}`;
  } else {
    location.href = url;
  }
}

export function downloadBase64File(base64Data, fileName) {
  const linkSource = base64Data;
  const downloadLink = document.createElement('a');
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function() {
      console.log('Async: Copying to clipboard was successful!');
    },
    function(err) {
      console.error('Async: Could not copy text: ', err);
    }
  );
}

export async function getBase64FromCanvas({ selector, downloadTrigger, isSmallScreen = false }) {
  //document.querySelector('.bill-redpacket').scrollIntoView();
  const target = document.querySelector(selector);
  console.log('logging type of target');
  console.log(typeof target);
  const STANDARD_WINDOW_RATIO = 375 / 812;
  if (typeof target !== 'object') {
    return;
  }
  console.log(target);
  const clientRects = target.getClientRects()[0];
  const contentClientRects = document.querySelector('.bill-redpacket-container').getClientRects()[0];

  const { width: scrollWidth, height: scrollHeight } = clientRects;
  const { width: contentWidth, height: contentHeight } = contentClientRects;
  console.log('window ratio for this window');
  console.log(scrollWidth / scrollHeight);
  const CURRENT_WINDOW_RATIO = scrollWidth / scrollHeight;
  let windowWidth,
    windowHeight,
    shiftingHeight = 0;
  if (CURRENT_WINDOW_RATIO >= STANDARD_WINDOW_RATIO) {
    console.log('wider');
    windowWidth = scrollWidth;
    windowHeight = scrollHeight;
  } else {
    console.log('higher');
    shiftingHeight = scrollHeight - scrollWidth / STANDARD_WINDOW_RATIO;
    windowWidth = scrollWidth;
    windowHeight = scrollHeight - shiftingHeight;
  }
  console.log('size');
  console.log(windowWidth, windowHeight);
  const canvasConfig = {
    allowTaint: true,
    useCORS: true,
    width: windowWidth,
    height: !isSmallScreen ? contentHeight : scrollHeight,
    scrollX: 0,
    y: !isSmallScreen ? -parseFloat(((contentHeight - scrollHeight) / 2).toFixed(2)) : 0
  };
  console.log('canvasConfig');
  console.log(canvasConfig);
  const canvas = await html2canvas(target, canvasConfig);
  const binaryStr = canvas.toDataURL('image/png');
  //copyTextToClipboard(binaryStr);

  if (downloadTrigger) {
    downloadBase64File(binaryStr, 'share.jpg');
  }
  return binaryStr;
}

function removeProtocol(url) {
  const protocol = /^https?:\/\//i;
  return url.replace(protocol, '//');
}
export function downloadImage(url, fileName) {
  return new Promise(resolve => {
    const generalUrl = removeProtocol(url);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', generalUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === num200) {
        const objectURL = URL.createObjectURL(xhr.response);
        const link = document.createElement('a');
        link.href = objectURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      }
    };
    xhr.send();
  });
}

// calling the image download service of the client App
export function saveImg(imgSrc) {
  // Distinguish between ios and android device
  if (window.getPlatform() === 'iphone') {
    callNativeHandler('notifyWebHandleEvent', {
      method: 'saveImageToAlbum',
      params: {
        source: 'url', //base64和图片url支持 data对应base64格式数据 url对应图片链接地址
        image: imgSrc, //base64数据需要去掉data:image/png;base64,前缀； url需要有协议头
        succeedToast: '图片保存成功！', //成功文案
        failedToast: '图片保存失败！' //失败文案
      }
    });
  } else {
    callNativeHandler(
      'saveImageToAlbum',
      {
        source: 'url', //
        image: imgSrc, //data为base64数据
        succeedToast: '图片保存成功！',
        failedToast: '图片保存失败！'
      },
      () => {}
    );
  }
}

// callng the sharing serice of the client App
export function thsShareImg(imgBase64) {
  const shareParams = {
    title: location.href,
    content: location.href,
    url: location.href,
    bmpRes: '1',
    bmpUrl: imgBase64,
    type: '4',
    showPreview: 1,
    shareInfo: {
      needDefaultQR: false,
      mainImageUrl: imgBase64
    }
  };
  callNativeHandler('hexinShare', JSON.stringify(shareParams), data => {});
}

// access an random element of an array
export function accessRandomElement(arr) {
  // Generate a random index within the array's bounds
  const randomIndex = Math.floor(Math.random() * arr.length);
  // Access the element at the random index
  const randomElement = arr[randomIndex];
  return randomElement;
}
