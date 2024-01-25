class SessionRequest {
  public teamId: string;
  public sessionId: string;
  public sessionName: string;
  public createdAt: number;
  public updatedAt: number;
  public impactHistory: ImpactPlayer[];

  constructor(
    teamId: string,
    sessionId: string,
    sessionName: string,
    createdAt: number,
    updatedAt: number,
    impactHistory: ImpactPlayer[],
  ) {
    this.teamId = teamId;
    this.sessionId = sessionId;
    this.sessionName = sessionName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.impactHistory = impactHistory;
  }
}

class Impact {
  public magnitude: number;
  public direction: string;
  public timestamp: number;
  public isConcussion: boolean;

  constructor(
    magnitude: number,
    direction: string,
    timestamp: number,
    isConcussion: boolean
  ) {
    this.magnitude = magnitude;
    this.direction = direction;
    this.timestamp = timestamp;
    this.isConcussion = isConcussion;
  }
}

class ImpactPlayer {
  public jerseyId: number;
  public impact: Impact[];

  constructor(jerseyId: number, impact: Impact[]) {
    this.jerseyId = jerseyId;
    this.impact = impact;
  }
}

class SessionResponse {
  public teamId: string;
  public sessionId: string;
  public sessionName: string;
  public createdAt: number;
  public updatedAt: number;
  public impactHistory: ImpactPlayer[];

  constructor(
    teamId: string,
    sessionId: string,
    sessionName: string,
    createdAt: number,
    updatedAt: number,
    impactHistory: ImpactPlayer[],
  ) {
    this.teamId = teamId;
    this.sessionId = sessionId;
    this.sessionName = sessionName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.impactHistory = impactHistory;
  }
}

export { SessionRequest, Impact, ImpactPlayer, SessionResponse };
