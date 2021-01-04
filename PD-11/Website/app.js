function upload() {
    const reader = new FileReader();
    reader.onloadend = function() {
      const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });
      const buf = buffer.Buffer(reader.result); 
      ipfs.add(buf, (err, result) => { 
        if(err) {
          console.error(err)
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        document.getElementById("hash").innerHTML = `Hashed image: ${result[0].hash}`
        document.getElementById("url").innerHTML = `IPFS Url: ${url}`
        document.getElementById("url").innerHTML = document.getElementById("url").innerHTML.replace(`${url}`, `<a href=${url}>${url}</a>`);
        document.getElementById("output").src = url
      })
    }
    const photo = document.getElementById("photo");
    reader.readAsArrayBuffer(photo.files[0]); 
}