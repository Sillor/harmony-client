import globals, { peer } from "./globals";

/**
 * Sends provided file to server
 * @param {File} file file to send to server
 */
export function uploadFile(file) {
  if (!file) throw new Error("No file was provided");
  const formData = new FormData();
  formData.append("file", file);

  fetch(serverUrl("/uploadFile"), {
    method: "POST",
    body: formData,
    credentials: "include",
  });
}

export function login({ email, password }) {
  return fetch(authUrl("/loginUser"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        globals.email = email;
        localStorage.setItem("harmony_email", email);
        getPeerAuthToken().then((token) => {
          peer.authToken = token;
        });
      }
      return data;
    })
    .catch((err) => {
      return {
        success: false,
        message: "An error occurred: " + err,
      };
    });
}

export function register({ email, password }) {
  fetch(authUrl("registerUser"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        globals.email = email;
        localStorage.setItem("harmony_email", email);
        getPeerAuthToken().then((token) => {
          peer.authToken = token;
        });
      }
      return data;
    })
    .catch((err) => {
      return {
        success: false,
        message: "An error occurred: " + err,
      };
    });
}

export function logout() {
  fetch(authUrl("/logoutUser"), {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log({ data });
      if (data.success) {
        globals.email = null;
        localStorage.removeItem("harmony_email");
        peer.authToken = null;
      }
      return data;
    })
    .catch((err) => {
      return {
        success: false,
        message: "An error occurred: " + err,
      };
    });
}

export function getPeerAuthToken(callback) {
  return fetch(authUrl("/peer/authenticate"), {
    credentials: "include",
  })
    .then((res) => {
      if (res.status !== 200) throw res.statusText;
      res.json().then((data) => {
        if (!data.success) return data.data;
        localStorage.setItem("harmony_peer_token", data.data);
        if (typeof callback === "function") callback(data.data);
      });
    })
    .catch((err) => {
      return {
        success: false,
        message: "An error occurred: " + err,
      };
    });
}

export function addToTeam({ teamId, teamName, targetEmail }) {
  return fetch(teamUrl("/addToTeam"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetEmail: targetEmail,
      teamID: teamId,
      teamName: teamName,
    }),
  }).then((data) => data.json());
}

function serverUrl(path) {
  return new URL(path, import.meta.env.VITE_SERVER_ORIGIN).href;
}

function authUrl(path) {
  return new URL(path, import.meta.env.VITE_USER_AUTH_ORIGIN).href;
}

function teamUrl(path) {
  return new URL(path, import.meta.env.VITE_TEAM_SERVER_ORIGIN).href;
}
