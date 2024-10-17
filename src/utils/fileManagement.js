import globals from "./globals";

const url = import.meta.env.VITE_SERVER_ORIGIN

export async function fetchFileList(chatId) {
    let id = chatIdCheck(chatId)
    try {
        const response = await fetch(`${url}/files/list/${id}`, {
          headers: {
            "Authorization": `Bearer ${globals.authToken}`,
          }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Server Error:', error);
        throw error;
    }
}

export async function fileListSortedByLatest(chatId){
    let id = chatIdCheck(chatId)
    try {
        const response = await fetch(`${url}/files/list/${id}`, {
          headers: {
            "Authorization": `Bearer ${globals.authToken}`,
          }
        });
        const data = await response.json();
        console.log("check files", data.files)
    } catch (error) {
        console.error('Server Error:', error);
        throw error;
    }
}

export function fileDownload(e, chatId, fileId){
    e.preventDefault();
    let id = chatIdCheck(chatId)
    fetch(`${url}/files/getFileInfo/${id}/${fileId}`,{
        headers: {
            "Authorization": `Bearer ${globals.authToken}`,
          }
      })
      .then(res => res.json())
      .then(json => {
        
        fetch(`${url}/files/download/${id}/${fileId}`,{
            headers: {
                "Authorization": `Bearer ${globals.authToken}`,
              }
          })
          .then(res => {
              return res.blob()
          })
          .then(blob => {
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.href = url;
              link.setAttribute("download", json.fileName);
              document.body.append(link);
              link.click();
          })
          .catch(err => console.error("Server Error", err))
      })
} 

export async function fileUpload(data, chatId){
    let id = chatIdCheck(chatId)
    //create formdata instance
    let formData = new FormData();
    // Append files to formData
    formData.append('file', data);

    //formData.append('file-uid', )
    //i need to grab the id here and send it to the html 5/20/24
    // Make a fetch POST request
     return await fetch(`${url}/files/upload/${id}`, {
      method: 'POST',
      body: formData,
      headers: {
        "Authorization": `Bearer ${globals.authToken}`,
      }
    })
    .then(res => res.json())
    .then(data => data)
    .catch((error) => console.error('Server Error:', error));
}

export async function fileDelete(e, chatId, fileName, fileId, fileType){
    let id = chatIdCheck(chatId)
    await fetch(`${url}/files/delete/${id}/${fileName}/${fileId}/${fileType}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${globals.authToken}`,
        }
    })
    .then((res) => {
        const data = res.json()
        return data
    })
    .catch((error) => console.error('Server Error:', error));
}



export async function fileDuplicate(e, chatId, fileName, fileId, fileType){
    let id = chatIdCheck(chatId)
    await fetch(`${url}/files/duplicate/${id}/${fileName}/${fileId}/${fileType}`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${globals.authToken}`,
        }
    })
    .then((res) => {
        const data = res.json()
        return data
    })
    .catch((error) => console.error('Server Error:', error));
}

export async function fileRename(e, chatId, fileName, fileId, fileType){
    let id = chatIdCheck(chatId)
    const newFileName = prompt("Enter new file name", fileName);
    if (newFileName === null || newFileName === ""){
        return
    }
    await fetch(`${url}/files/rename/${id}/${fileName}/${fileId}/${fileType}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  "Authorization": `Bearer ${globals.authToken}`,
                },
                body: JSON.stringify({
                    newFileName
                })
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