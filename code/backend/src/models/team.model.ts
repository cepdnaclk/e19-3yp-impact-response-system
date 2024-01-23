class TeamIdExistsResponse {
  public teamExists: boolean;

  public constructor(teamExists: boolean) {
    this.teamExists = teamExists;
  }
}

interface TeamManagerInterface {
  teamId: string;
  email: string;
}

class TeamIdEmailExistsResponse {
  public teamExists: boolean = false;
  public managerExists: boolean = false;

  public constructor(teamExists: boolean, managerExists: boolean) {
    this.teamExists = teamExists;
    this.managerExists = managerExists;
  }
}

class Team {
  public teamId: string;
  public teamName: string;
  public teamManager: string;

  public constructor(teamId: string, teamName: string, teamManager: string) {
    this.teamId = teamId;
    this.teamName = teamName;
    this.teamManager = teamManager;
  }
}

class TeamResponse {
  public teamId: string;
  public teamName: string;

  public constructor(team: Team) {
    this.teamId = team.teamId;
    this.teamName = team.teamName;
  }
}

class TeamResponseWithIsVerified {
  public teamId: string;
  public teamName: string;
  public isVerified: string;

  constructor(teamId: string, teamName: string, isVerified: string) {
    this.teamId = teamId;
    this.teamName = teamName;
    this.isVerified = isVerified;
  }
}

class TeamManagerResponse {
  private teamId: string;
  private email: string;

  public constructor(teamId: string, email: string) {
    this.teamId = teamId;
    this.email = email;
  }
}

export {
  TeamIdExistsResponse,
  TeamManagerInterface,
  TeamIdEmailExistsResponse,
  Team,
  TeamResponse,
  TeamManagerResponse,
  TeamResponseWithIsVerified
};
