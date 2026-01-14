export interface PredictionMaster {
  specialite: string;
  probabiliteAdmissionPublic: number;
  probabiliteAdmissionPrive: number;
  probabiliteReussite: number;
}

export interface Recommandation {
  specialiteL3: string;
  messageL3: string;
  statsMaster: PredictionMaster[];
  messageMaster: string;
  conseilTrajectoire: string;
}