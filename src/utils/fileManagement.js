const url = import.meta.env.VITE_SERVER_ORIGIN
export async function fetchFileList(chatId) {
    let id = chatIdCheck(chatId)
    try {
        const response = await fetch(`${url}/files/list/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Server Error:', error);
        throw error;
    }
}

export function fileDownload(e, chatId, fileName){
    e.preventDefault();
    let id = chatIdCheck(chatId)
    fetch(`${url}/files/download/${id}/${fileName}`,)
    .then(res => {
        return res.blob()
    })
    .then(blob => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.append(link);
        link.click();
    })
    .catch(err => console.error("Server Error", err))
    
}

export async function fileUpload(data, chatId){
    let id = chatIdCheck(chatId)
    //create formdata instance
    let formData = new FormData();
    // Append files to formData
    formData.append('file', data);
    
    // Make a fetch POST request
    await fetch(`${url}/files/upload/${id}`, {
      method: 'POST',
      body: formData
    })
    .catch((error) => console.error('Server Error:', error));
}

export async function fileDelete(e, chatId, fileName){
    let id = chatIdCheck(chatId)
    await fetch(`${url}/files/${id}/${fileName}`, {
        method: 'DELETE'
    })
    .then((res) => {
        const data = res.json()
        return data
    })
    .catch((error) => console.error('Server Error:', error));
}

export async function fileDuplicate(e, chatId, fileName){
    let id = chatIdCheck(chatId)
    await fetch(`${url}/files/${id}/${fileName}`, {
        method: 'POST'
    })
    .then((res) => {
        const data = res.json()
        return data
    })
    .catch((error) => console.error('Server Error:', error));
}

function chatIdCheck(id){
    return id === undefined ? 'communityFiles' : id
}