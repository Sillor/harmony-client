import globals, { peer, socket } from "./globals";
const url = import.meta.env.VITE_SERVER_ORIGIN;

export function checkLoggedIn() {
  return localStorage.getItem("harmony_email");
}

/**
 * 
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function login(email, password) {
  try {
    const response = await fetch(url + "/api/users/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (result.success) {
      globals.email = email;
      globals.authToken = result.token;
      localStorage.setItem("harmony_email", email);
      localStorage.setItem("token", result.token);
      socket.connect()
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`,
    };
  }
}

/**
 * 
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function register(username, email, password) {

  try {
    const response = await fetch(url + "/api/users/registerUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const result = await response.json();

    if (result.success) {
      globals.email = email;
      globals.authToken = result.token;
      localStorage.setItem("harmony_email", email);
      localStorage.setItem("token", result.token);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`,
    };
  }
}

/**
 * 
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function logout() {
  try {
    let storedEmail = localStorage.getItem("harmony_email")
    let fetchInfo = await fetch(url + `/api/auth/google/token-info/${storedEmail}`,{
      credentials: "include"
    }) 
    let googleToken = await fetchInfo.json()
    if(googleToken.tokenInfo){
      const googleLogout = await fetch(url + `/api/auth/google/logout/${googleToken.tokenInfo.authToken}`,{
        credentials: "include"
      })
      const googleLogoutJSON = await googleLogout.json()
      globals.email = null;
      localStorage.removeItem("harmony_email");
      localStorage.removeItem("token");
      peer.authToken = null;
      return googleLogoutJSON
    }

    const response = await fetch(url + "/api/users/logoutUser", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${globals.authToken}`,
      },
    })

    const result = await response.json();

    if (result.success) {
      globals.email = null;
      globals.authToken = null;
      localStorage.removeItem("harmony_email");
      localStorage.removeItem("token");
      peer.authToken = null;
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`,
    };
  }
}

export const getUser = async () => {
  try {
    const response = await fetch(url + "/api/database/getUser", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${globals.authToken}`,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`,
    };
  }
};

export const updateUser = async (username, email) => {
  try {
    const response = await fetch(url + "/api/database/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globals.authToken}`,
      },
      body: JSON.stringify({ username, email }),
    });

    const result = await response.json();

    if (result.success) {
      globals.email = email;
      globals.authToken = result.token;
      localStorage.setItem("harmony_email", email);
      localStorage.setItem("token", result.token);
    }
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`,
    };
  }
};

export const uploadAvatar = async (image, avatarLink) => {
  try {
    const response = await fetch(url + "/api/database/uploadAvatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globals.authToken}`,
      },
      body: JSON.stringify({ image, avatarLink }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`,
    };
  }
};

export const deleteAvatar = async (avatarLink) => {
  try {
    const response = await fetch(url + "/api/database/deleteAvatar", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globals.authToken}`,
      },
      body: JSON.stringify({ avatarLink }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`,
    };
  }
}

export function addToTeam({ teamId, teamName, targetEmail }) {
  return fetch(url + "/api/database/addToTeam", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${globals.authToken}`,
    },
    body: JSON.stringify({
      targetEmail: targetEmail,
      teamID: teamId,
      teamName: teamName,
    }),
  }).then((data) => data.json());
}

export const handleGoogleAuth = async () => {
  const response = await fetch('http://localhost:5000/api/auth/google/consent-window')
  const consentWindow = await response.json()
  if (consentWindow.url) {
    // Redirect to the Google OAuth URL
    window.open(consentWindow.url, "_self");
  } else {
    alert('Failed to generate OAuth URL');
  }
}
