import globals from "./globals";

const url = import.meta.env.VITE_SERVER_ORIGIN;

export async function loadFriendsList() {
  try {
    const response = await fetch(`${url}/api/database/loadFriendsList`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${globals.authToken}`,
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    };
  }
}

export async function deleteFriend(targetEmail) {
  try {
    const response = await fetch(`${url}/api/database/removeFriend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globals.authToken}`,
      },
      body: JSON.stringify({ targetEmail })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    };
  }
}
