import globals from "./globals";

const url = import.meta.env.VITE_SERVER_ORIGIN;

/**
 * Creates a new team request
 * @param {{targetEmail: string, teamName: string, teamUid: string}} param0
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function createTeamRequest({targetEmail, teamName, teamUid}) {
  try {
    const response = await fetch(`${url}/api/database/createTeamRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globals.authToken}`,
      },
      body: JSON.stringify({
        targetEmail,
        teamName,
        teamUID: teamUid
      })
    });

    const result = await response.json();

    if (!result.success) {
      return result;
    }
    
    return {
      success: result.success,
      message: "Team request created successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    };
  }
}

/**
 * Loads all incoming team requests
 * @returns {Promise<{success: boolean, message?: string, data?: {uid: string, timeCreated: Date, username: string, email: string, team: {uid: string, name: string}}[]}>}
 */
export async function loadTeamRequests() {
  try {
    const response = await fetch(`${url}/api/database/loadIncomingTeamRequest`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${globals.authToken}`,
      }
    });

    const result = await response.json();
    const data = result.data.map(item => {
      const team = JSON.parse(item.team)
      return {
        ...item,
        timeCreated: new Date(item.timeCreated),
        team: {
          uid: team.teamID,
          name: team.teamName,
        }
      }
    })
    return {
      success: result.success,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    };
  }
}

/**
 * Resolves a team request
 * @param {{accepted: boolean, requestUid: string}} param0
 * @returns {Promise<{success: boolean, message: string}>}
 * @example
 * await resolveTeamRequest({accepted: true, requestUid: "uid_of_team_request"})
 */
export async function resolveTeamRequest({accepted, requestUid}) {
  try {
    const response = await fetch(`${url}/api/database/resolveIncomingTeamRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globals.authToken}`,
      },
      body: JSON.stringify({
        accepted,
        requestUID: requestUid
      })
    });

    const result = await response.json();

    return {
      success: result.success,
      message: "Team request successfully " + (accepted ? "accepted" : "rejected")
    };

  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    };
  }
}

/**
 * Creates a new friend request
 * @param {{targetEmail: string}} param0
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function createFriendRequest({ targetEmail }) {
  try {
    const response = await fetch(`${url}/api/database/createFriendRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globals.authToken}`,
      },
      body: JSON.stringify({
        targetEmail
      })
    });

    const result = await response.json();

    if (!result.success) {
      return result;
    }
    
    return {
      success: result.success,
      message: "Team request created successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    };
  }
}

/**
 * Loads all incoming friend requests
 * @returns {Promise<{success: boolean, message?: string, data?: {uid: string, timeCreated: Date, username: string, email: string, profileURL: string}[]}>}
 */
export async function loadFriendRequests() {
  try {
    const response = await fetch(`${url}/api/database/loadIncomingFriendRequest`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${globals.authToken}`,
      }
    });

    const result = await response.json();
    const data = result.data.map(item => {
      return {
        ...item,
        timeCreated: new Date(item.timeCreated),
      }
    })
    return {
      success: result.success,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    };
  }
}

/**
 * Resolves a team request
 * @param {{accepted: boolean, requestUid: string}} param0
 * @returns {Promise<{success: boolean, message: string}>}
 * @example
 * await resolveFriendRequest({accepted: true, requestUid: "uid_of_team_request"})
 */
export async function resolveFriendRequest({accepted, requestUid}) {
  try {
    const response = await fetch(`${url}/api/database/resolveIncomingFriendRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globals.authToken}`,
      },
      body: JSON.stringify({
        accepted,
        requestUID: requestUid
      })
    });

    const result = await response.json();

    return {
      success: result.success,
      message: "Friend request successfully " + (accepted ? "accepted" : "rejected")
    };

  } catch (error) {
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    };
  }
}