import globals, { peer } from "./globals";

export function checkLoggedIn() {
  return localStorage.getItem("harmony_email");
}

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

export function register({ username, email, password }) {
  return fetch(authUrl("/registerUser"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username,
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

export async function logout() {
  try {
    const response = await fetch(authUrl("/logoutUser"), {
      method: "POST",
      credentials: "include",
    })

    const result = await response.json();

    if (result.success) {
      globals.email = null;
      localStorage.removeItem("harmony_email");
      peer.authToken = null
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    };
  }
}

export const getUser = async () => {
  try {
    const response = await fetch(authUrl("/getUser"), {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    }
  }
}

export const updateUser = async (username, email) => {
  try {
    const response = await fetch(authUrl("/updateUser"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ username, email })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    }
  }
}

export const uploadAvatar = async (image, avatarLink) => {
  try {
    const response = await fetch(authUrl("/uploadAvatar"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ image, avatarLink }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    }
  }
}

export const deleteAvatar = async (avatarLink) => {
  try {
    const response = await fetch("http://localhost:5002/deleteAvatar", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ avatarLink })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    }
  }
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
