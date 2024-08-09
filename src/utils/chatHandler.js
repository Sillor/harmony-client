import globals from "./globals";

const url = import.meta.env.VITE_SERVER_ORIGIN;

export function loadChat({ teamUid, teamName }) {
  if (!teamUid || !teamName) throw new Error("Missing Property")
  return fetch(url + "/api/chat/load", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${globals.authToken}`,
    },
    body: JSON.stringify({
      teamUID: teamUid,
      teamName,
    }),
  })
    .then((res) => res.json())
    .catch((error) => {
      return { success: false, message: error };
    });
}

export function sendChat({ teamUid, teamName, message, fileName, fileUID}) {
  if (!teamUid || !teamName || !message) throw new Error("Missing Property")
  return fetch(url + "/api/chat/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${globals.authToken}`,
    },
    body: JSON.stringify({
      teamUID: teamUid,
      teamName,
      message,
      fileName,
      fileUID
    }),
  })
    .then((res) => res.json())
    .catch((error) => {
      return { success: false, message: error };
    });
}

export function editChat({ chatUid, teamUid, teamName, message }) {
  if (!teamUid || !teamName || !chatUid || !message) throw new Error("Missing Property")
  return fetch(url + "/api/chat/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${globals.authToken}`,
    },
    body: JSON.stringify({
      teamUID: teamUid,
      teamName,
      chatUID: chatUid,
      message,
    }),
  })
    .then((res) => res.json())
    .catch((error) => {
      return { success: false, message: error };
    });
}

export function deleteChat({ chatUid, teamUid, teamName }) {
  if (!teamUid || !teamName || !chatUid) throw new Error("Missing Property")
  return fetch(url + "/api/chat/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${globals.authToken}`,
    },
    body: JSON.stringify({
      teamUID: teamUid,
      teamName,
      chatUID: chatUid,
    }),
  })
    .then((res) => res.json())
    .catch((error) => {
      return { success: false, message: error };
    });
}
