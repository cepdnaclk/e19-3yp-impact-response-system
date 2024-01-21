import { create } from "zustand";
import {
  Buddies,
  activePage,
  Players,
  PlayerMap,
  Session,
  PlayersImpact,
  PlayerImpactHistory,
  PlayersActiveTime,
} from "../types";
import { players } from "../data/players";
import { deleteByValue } from "../utils/utils";
import MqttClient from "../services/mqttClient";

interface AppState {
  activePage: activePage;
  setActivePage: (page: activePage) => void;

  isMqttOnine: boolean;
  setMqttOnline: (status: boolean) => void;

  isInternetAvailable: boolean;
  setIsInternetAvailable: (isOnline: boolean) => void;

  buddiesStatus: Buddies;
  setBuddiesStatus: (buddiesState: Buddies) => void;

  // buddiesImpact: BuddiesImpact;
  // setBuddiesImpact: (buddiesImpact: BuddiesImpact) => void;

  playersImpact: PlayersImpact;
  setPlayersImpact: (playersImpact: PlayersImpact) => void;

  playersImpactHistory: PlayerImpactHistory;

  playerDetails: Players;

  playersActiveTime: PlayersActiveTime;

  playerMap: PlayerMap;
  setPlayerMap: (playerMap: PlayerMap) => void;
  updatePlayerMap: (buddy_id: number, player_id: number) => void;
  deleteFromPlayerMap: (buddy_id: number) => void;

  sessionDetails: Session;
  setSessionDetails: (session: Session) => void;
  updateSessionDetails: (sessionName: string) => void;
  endSession: () => void;

  monitoringBuddies: Set<number>;
  addToMonitoringBuddies: (buddy_id: number) => void;
  removeFromMonitoringBuddies: (buddy_id: number) => void;
}

export const useAppState = create<AppState>()((set) => ({
  //For the sidebar menu item selected, and render main content
  activePage: "profile",
  setActivePage: (page) => set({ activePage: page }),

  //For the mqtt connection status
  isMqttOnine: false,
  setMqttOnline: (status) => set({ isMqttOnine: status }),

  //For the internet connection status
  isInternetAvailable: false,
  setIsInternetAvailable: (isOnline) => set({ isInternetAvailable: isOnline }),

  //For the buddies status
  buddiesStatus: {} as Buddies,
  setBuddiesStatus: (buddiesState: Buddies) =>
    set({ buddiesStatus: buddiesState }),

  //For the buddies impact
  // buddiesImpact: {} as BuddiesImpact,
  // setBuddiesImpact: (buddiesImpact: BuddiesImpact) =>
  //   set({ buddiesImpact: buddiesImpact }),

  //For the players impact
  playersImpact: {} as PlayersImpact,
  setPlayersImpact: (playersImpact: PlayersImpact) =>
    set({ playersImpact: playersImpact }),

  //For the players impact history
  playersImpactHistory: {} as PlayerImpactHistory,

  //TODO: Clashing of players with other dashbaords
  playerDetails: players,

  //For the player map
  playerMap: {} as PlayerMap,
  setPlayerMap: (playerMap: PlayerMap) => {
    set({ playerMap: playerMap });
  },

  updatePlayerMap: (buddy_id: number, player_id: number) => {
    set((prevState) => {
      const playerMap = { ...prevState.playerMap };
      //check if player_id is already in playerMap and delete it
      deleteByValue(playerMap, player_id);

      playerMap[buddy_id] = player_id;

      //publish new playerMap to mqtt
      MqttClient.getInstance().publishPlayerMap(playerMap);
      return { playerMap };
    });
  },
  deleteFromPlayerMap: (buddy_id: number) => {
    set((prevState) => {
      const playerMap = { ...prevState.playerMap };
      delete playerMap[buddy_id];

      //update monitoringBuddies accordingly, if not in playerMap it should not be in monitoringBuddies
      const monitoringBuddies = new Set(prevState.monitoringBuddies);
      monitoringBuddies.delete(buddy_id);

      //publish new playerMap to mqtt
      MqttClient.getInstance().publishPlayerMap(playerMap);
      return { playerMap, monitoringBuddies };
    });
  },

  //For player active time map
  playersActiveTime: {} as PlayersActiveTime,

  //For the session details
  sessionDetails: {} as Session,
  setSessionDetails: (session: Session) => {
    set({ sessionDetails: session });
    MqttClient.getInstance().publishSession(session);
  },
  updateSessionDetails: (sessionName: string) => {
    set((prevState) => {
      if (prevState.sessionDetails.active === false) {
        return prevState;
      }

      const sessionDetails = { ...prevState.sessionDetails };
      sessionDetails.session_name = sessionName;
      sessionDetails.updatedAt = Date.now();


      // publish session to mqtt
      MqttClient.getInstance().publishSession(sessionDetails);
      return { ...prevState, sessionDetails };
    });
  },
  endSession: () => {
    set((prevState) => {
      const sessionDetails = { ...prevState.sessionDetails };
      sessionDetails.active = false;
      sessionDetails.updatedAt = Date.now();
// TODO: store session details and player impact history and upload when internet available
      const playerImpactHistory = { ...prevState.playersImpactHistory };
      
      localStorage.setItem("sessionDetails", JSON.stringify(sessionDetails));
      localStorage.setItem("playerImpactHistory", JSON.stringify(playerImpactHistory));




      // publish session to mqtt
      MqttClient.getInstance().publishSession(sessionDetails);
      return { ...prevState, sessionDetails };
    });
  },

  //for live dashboard monitoring and active buddie
  monitoringBuddies: new Set<number>(),
  addToMonitoringBuddies: (buddy_id: number) => {
    set((prevState) => {
      const monitoringBuddies = new Set(prevState.monitoringBuddies);
      monitoringBuddies.add(buddy_id);
      return { monitoringBuddies };
    });
  },
  removeFromMonitoringBuddies: (buddy_id: number) => {
    set((prevState) => {
      const monitoringBuddies = new Set(prevState.monitoringBuddies);
      monitoringBuddies.delete(buddy_id);
      return { monitoringBuddies };
    });
  },
}));
