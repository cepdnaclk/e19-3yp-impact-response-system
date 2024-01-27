import { updatePlayersDetails } from "../states/updateAppStates";
import { Players, SessionToBeUploaded } from "../types";
import { BASE_URL } from "../config/config";
import { renewAccessToken } from "./authService";
import { useLoginState } from "../states/profileState";

export const uploadSession = async () => {
  if (localStorage.getItem("sessionDetails") === null) return;
  else {
    // Retrieve the array of objects from local storage
    const sessionsToBeUploaded: SessionToBeUploaded[] = JSON.parse(
      localStorage.getItem("sessionDetails") as string
    );

    if (sessionsToBeUploaded.length === 0) return;

    // Iterate through each object in the array
    for (let i = 0; i < sessionsToBeUploaded.length; i++) {
      // Send the object to the server
      const response = await sendToServer(sessionsToBeUploaded[i]);

      if (response.ok) {
        // Remove the object from the array in local storage
        sessionsToBeUploaded.splice(i, 1);
      }
    }

    // Update the modified array in local storage
    localStorage.setItem(
      "sessionDetails",
      JSON.stringify(sessionsToBeUploaded)
    );
  }
};

const sendToServer = async (object: SessionToBeUploaded) => {
  // renew access Token
  renewAccessToken();

  const token = localStorage.getItem("accessToken");
  const request = {
    sessionId: object.session.session_id,
    sessionName: object.session.session_name,
    createdAt: object.session.createdAt,
    updatedAt: object.session.updatedAt,
    teamId: useLoginState.getState().loginInfo.teamId,
    impactHistory: object.playerImpactHistory,
  };

  const response = await fetch(`${BASE_URL}/session`, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  console.log(responseData);
  return response;
};

export const getPlayers = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const playersResponse = await fetch(`${BASE_URL}/manager/getTeamPlayers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const playersData: Players = await playersResponse.json();
    updatePlayersDetails(playersData);
  } catch (error) {
    console.log(error);
  }
};
