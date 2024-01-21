class Player {
    public email: string;
    public invitationToken: string;
    public isVerified: string;

    public constructor(
      email: string,
      invitationToken: string,
      isVerified: string,

    ) {
        this.email = email;
        this.invitationToken = invitationToken;
        this.isVerified = isVerified;

    }
  }
  
  class PlayerResponse {
    public email: string;
    public isVerified: string;

    public constructor(
      email: string,
      isVerified: string,
      ) {
      this.email = email;
      this.isVerified = isVerified;
    }
  }
  
  class PlayerRequestBody {
    public email: string;
    public password: string;

    public constructor(
      email: string,
      password: string,

    ) {
      this.email = email;
      this.password = password;

    }
  }
  
  class PlayerInTeamResponse{
    public playerEmail: string;
    public teamId: string;
    public jesryId: string;
    public fullName: string;
    public isVerified: string;

    public constructor(
      playerEmail: string,
      teamId: string,
      jesryId: string,
      fullName: string,
      isVerified: string,


    ) {
      this.playerEmail = playerEmail;
      this.teamId = teamId;
      this.jesryId = jesryId;
      this.fullName = fullName;
      this.isVerified = isVerified;

    }
  }
  export { Player, PlayerResponse, PlayerRequestBody, PlayerInTeamResponse };
  