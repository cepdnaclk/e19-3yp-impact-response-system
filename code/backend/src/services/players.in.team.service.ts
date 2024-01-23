import PlayerModel from "../db/player.schema";
import PlayerTeamModel from "../db/players.in.team.schema";
import { PlayerInTeamResponse, PlayerTeamRequest } from "../models/player.model";

class PlayerInTeamService {
  // create team player instance
  async addPlayerToTeam(
    playerEmail: string,
    teamId: string,
    jersyId: string,
    fullName: string,
    invitationToken: string

  ): Promise<PlayerInTeamResponse> {
    try {
      // check entry exists in player in teams
      const playerTeam = await PlayerTeamModel.findOne({
        playerEmail: playerEmail,
        teamId: teamId,
      });

      if (playerTeam) {
        throw new Error("player already exists in the team");
      }

      const playerTeamInstance = new PlayerTeamModel({
        playerEmail: playerEmail,
        teamId: teamId,
        jesryId: jersyId,
        fullName: fullName,
        invitationToken: invitationToken,
        isVerified: "Pending",
      });


      // Save the manager to the database
      const savedManager = await playerTeamInstance.save();
      const playerInTeamResponse = new PlayerInTeamResponse(
        playerEmail,
        teamId,
        jersyId,
        fullName,
        "Pending",
      );

      return playerInTeamResponse;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async addPlayer(
  //   jersyId: string,
  //   firstName: string,
  //   lastName: string,
  //   playerEmail: string,
  //   teamId: string
  // ): Promise<boolean> {
  //   try {
  //     // check entry exists
  //     const playerTeam = await PlayerTeamModel.findOne({
  //       playerEmail: playerEmail,
  //       teamId: teamId,
  //     });

  //     if (playerTeam) {
  //       throw new Error("player already exists in the team");
  //     }

  //     const playerTeamInstance = new PlayerTeamModel({
  //       playerEmail: playerEmail,
  //       teamId: teamId,
  //     });


  //     // Save the manager to the database
  //     const savedManager = await playerTeamInstance.save();

  //     return true;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  //   return false;
  // }

  async checkPlayerExistsInTeam(
    jersyId: string,
    teamId: string
  ): Promise<boolean> {
    try {
      // check entry exists
      const playerTeam = await PlayerTeamModel.findOne({
        jesryId: jersyId,
        teamId: teamId,
      });

      if (playerTeam) {
        return true;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
    return false;
  }
  async updatePlayerInTeam(
    playerTeamRequest : PlayerTeamRequest
    ): Promise<PlayerInTeamResponse>{
      const existingPlayer = await PlayerTeamModel.findOne({ 
        jesryId: playerTeamRequest.jesryId});

      if (existingPlayer) {
        // Update properties based on your requirements
        // existingPlayer.playerEmail = playerTeamRequest.playerEmail;
        existingPlayer.jesryId = playerTeamRequest.jesryId;
        existingPlayer.fullName = playerTeamRequest.fullName; 
        
    
        await existingPlayer.save();

        const playerInTeamResponse = new PlayerInTeamResponse(
          existingPlayer.playerEmail,
          existingPlayer.teamId,
          existingPlayer.jesryId,
          existingPlayer.fullName,
          existingPlayer.isVerified,
        );
        return playerInTeamResponse;

      } else {
        // Handle case where player is not found
        throw new Error("Player not found");

      }
  }

  async removePlayerInTeam(
    jersyId: string,
    teamId: string
  ): Promise<boolean>{
    try{

      const playerInTeam = await PlayerTeamModel.findOne({
        teamId: teamId,
        jesryId: jersyId
      })

      if (playerInTeam != null){
        await playerInTeam.deleteOne();
        return true;
      }else{
        return false
      }

    }catch (error) {
        console.error(error);
        throw error;
      }
      return false;
  }
}
export default new PlayerInTeamService();
