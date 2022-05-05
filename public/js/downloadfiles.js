// @desc  Downloads the files, according to the type
function download_file(type){
    fetch('/export'+type+'')
    .then(resp => resp.blob())
    .then(blob => {
        //Gets the URL & creates the object to download the file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        //File's name
        a.download = 'TimeTacUsers.'+type.toLowerCase()+'';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(() => alert('There was a problem while downloading the file.'));    
}