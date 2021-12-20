//const qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
const btnVer = document.getElementById("btn-ver");

const change = document.getElementById("change");
const heading = document.getElementById("heading");
const chngtext = document.getElementById("chngtext");
const html5QrCode = document.getElementById("reader");


let scanning = false;
let count = 1;
let subcount = 0;

let cnt = count - subcount;
let clicked = true;
if (clicked){
  heading.innerHTML = "Guest sign in"
  chngtext.innerHTML = "Toggle sign out"

} else {
  heading.innerHTML = "Guest sign out"
  chngtext.innerHTML = "Toggle sign in"

}



qrcode.callback = res => {
  if (res) {
    outputData.innerText = res;
    scanning = true;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    }); count = count
    subcount = subcount + 1

    // video.srcObject = stream;
    // video.play();
    qrResult.hidden = true;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
};


// window.onload=function(){
btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
      //count = count + 1
      console.log(count)
     console.log('New scan commence')
    });
};
// }



// html5QrCode.start(
//    cameraId, // retreived in the previous step.
//    {
//       fps: 10,    // sets the framerate to 10 frame per second 
//       qrbox: 250  // sets only 250 X 250 region of viewfinder to
//                   // scannable, rest shaded.
//  },
//  qrCodeMessage => {
//      // do something when code is read. For example:
//      console.log(`QR Code detected: ${qrCodeMessage}`);
//  },
//  errorMessage => {
//      // parse error, ideally ignore it. For example:
//      console.log(`QR Code no longer in front of camera.`);
//  })
//  .catch(err => {
//      // Start failed, handle it. For example, 
//      console.log(`Unable to start scanning, error: ${err}`);
//  });

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

const get_current_status = async (id) => {
  let status = await db.collection('qrCodes').doc(id).get().then(doc => {
    if (!doc.exists) {
      console.log('No such guest!');
      throw new Error('No such guest!'); //
    } else {
      console.log('Document data:', doc.data());
      console.log('Document data:', doc.data().status);
      return doc.data().status;
    }
  })
  return status
}

const finResult = document.getElementById("finResult");


change.onclick = () => {
  var img = document.getElementById('baseImg');
  if (clicked) {
    heading.innerHTML = "Guest sign out"
    chngtext.innerHTML = "Toggle sign in"

  
    clicked = false;
    console.log(clicked)
  } else {
    heading.innerHTML = "Guest sign in"
    chngtext.innerHTML = "Toggle sign out"


    clicked = true;
    console.log(clicked)
  }
}

const toggle_status = async (id) => {
  get_current_status(id).then(val => {
    let nu_val = ""
if (clicked) {
    if (val === 'out') {
      nu_val = 'in'
      console.log("Access Granted")
      finResult.innerHTML = "Access granted"
    } else {
      nu_val = 'in'
      console.log("Guest is already in")
      finResult.innerHTML = "Guest is already in";
    }
    clicked = true;
  }else{
    if (val === 'in') {
      nu_val = 'out'
      console.log("Guest succesfully signed out")
      finResult.innerHTML = "Guest succesfully signed out"
    } else {
      nu_val = 'out'
      console.log("Guest is already out")
      finResult.innerHTML = "Guest is already out";
    }
    
    clicked = false;
    console.log(clicked)

  }
  db.collection('qrCodes').doc(id).update({status: nu_val})
} )

}

function scan() {
  try {
    qrcode.decode();
    let id = outputData.innerText
    toggle_status(id).then(btnScanQR.click())
  } catch (e) {
    setTimeout(scan, 300);
  }
}

//window.onload = scan();

// function renderCafe(doc){
//   let li = document.createElement('li');
//   let name = document.createElement('span');
//   let city = document.createElement('span');
//   let status = document.createElement('span');

//   li.setAttribute('data-id', doc.id);
//   name.textContent = doc.data().name;
//   city.textContent = doc.data().city;
//   status.textContent = doc.data().status; 

//   li.appendChild(status);
//   li.appendChild(city);

//   cafeList.appendChild(li);
// }


// // updating records (console demo)
// function send() {
//  db.collection('qrCodes').doc(id).update({
//      status: 'out'
//  });
// }

// // getting data
// db.collection('qrCodes').get().then(snapshot => {
//   snapshot.docs.forEach(doc => {
//       renderCafe(doc);
//   });
// });

// saving data
// form.addEventListener('submit', (e) => {
//   e.preventDefault();
//   db.collection('qrCodes').add({
//       name: form.name.value,
//       city: form.city.value
//   });
//   form.name.value = '';
//   form.city.value = '';
// });