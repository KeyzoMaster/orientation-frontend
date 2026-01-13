// Enum pour les sessions
export enum TypeSession {
  NORMALE = 'NORMALE',
  RATTRAPAGE = 'RATTRAPAGE',
  UNIQUE = 'UNIQUE'
}

// DTO pour la saisie de note
export interface SaisieNoteRequest {
  inscriptionId: number;
  codeUE: string;
  nomEC: string;
  note: number;
  session: TypeSession;
}

export interface NoteDto {
  nomEC: string;
  valeur: number;
  session: string;
}

export interface ResultatUEDto {
  codeUE: string;
  libelle: string;
  credits: number;
  moyenne: number;
  statut: string; // VALIDE, AJOURNE...
  isDette: boolean;
  notes: NoteDto[];
}

export interface AnneeAcademiqueDto {
  inscriptionId: number;
  annee: number;
  niveau: string;   // L_S1
  decision: string; // ADMIS, REDOUBLANT
  moyenneAnnuelle: number;
  ues: ResultatUEDto[];
}

export interface ParcoursDto {
  etudiantId: number;
  nomComplet: string;
  annees: AnneeAcademiqueDto[];
}