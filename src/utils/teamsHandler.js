import globals from "./globals";

const url = import.meta.env.VITE_SERVER_ORIGIN;

/**
 * Used to create a new team
 * @param {{teamName: string}} param0 
 * @returns {Promise<{success: boolean; message?: string}>}
 */
export function createTeam({ teamName }) {
  if (!teamName) throw new Error("Missing Property")
  return fetch(url + "/api/database/createTeam", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${globals.authToken}`,
    },
    body: JSON.stringify({
      teamName,
    }),
  })
    .then((res) => res.json())
    .catch((error) => {
      return { success: false, message: error };
    });
}

/**
 * Used to add a user to a team, does not send a invite
 * @deprecated use `createTeamRequest` instead
 * @param {{teamUid: string, teamName: string, targetEmail: string}} param0 
 * @returns {Promise<{success: boolean; message?: string}>}
 */
export function addToTeam({ teamUid, teamName, targetEmail }) {
  if (!teamName || !teamUid || !targetEmail) throw new Error("Missing Property")
  return fetch(url + "/api/database/addToTeam", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${globals.authToken}`,
    },
    body: JSON.stringify({
      targetEmail: targetEmail,
      teamUID: teamUid,
      teamName: teamName,
    }),
  })
    .then((data) => data.json())
    .catch((error) => {
      return { success: false, message: error };
    });
}

/**
 * Loads all the teams a user is a member or owner of
 * @returns {Promise<{success: boolean; message?: string}>}
 */
export function loadTeams() {
  return fetch(url + "/api/database/loadJoinedTeams", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${globals.authToken}`,
    }
  })
    .then((res) => res.json())
    .catch((error) => {
      return { success: false, message: error };
    });
}

export function removeTeamLink({ teamUid, teamName, targetEmail }) {
  if (!teamName || !teamUid) throw new Error("Missing Property")
  return fetch(url + "/api/database/removeTeamLink", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${globals.authToken}`,
    },
    body: JSON.stringify({
      teamUID: teamUid,
      teamName,
      targetEmail
    }),
  })
    .then((res) => res.json())
    .catch((error) => {
      return { success: false, message: error };
    });
}

export function leaveTeam({ teamUid, teamName }) {
  if (!teamName || !teamUid) throw new Error("Missing Property")
  return fetch(url + "/api/database/leaveTeam", {
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

export function updateTeamName({ teamUid, teamNameOld, teamNameNew }) {
  if (!teamUid || !teamNameOld || !teamNameNew ) throw new Error("Missing Property")
  return fetch(url + "/api/database/updateTeamName", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${globals.authToken}`,
    },
    body: JSON.stringify({
      teamUID: teamUid,
      teamNameOld,
      teamNameNew,
    }),
  })
    .then((res) => res.json())
    .catch((error) => {
      return { success: false, message: error };
    });
}

export function deleteTeam({ teamUid, teamName }) {
  if (!teamName || !teamUid) throw new Error("Missing Property")
  return fetch(url + "/api/database/deleteTeam", {
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

export function loadMembers({ teamUid, teamName }) {
  if (!teamName || !teamUid) throw new Error("Missing Property")
  return fetch(url + "/api/database/loadTeamMemberList", {
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