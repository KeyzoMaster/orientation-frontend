// Enum pour les sessions
export enum TypeSession {
  NORMALE = 'NORMALE',
  RATTRAPAGE = 'RATTRAPAGE',
  UNIQUE = 'UNIQUE'
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

// NOUVEAU : DTO Semestre
export interface SemestreDto {
  id: number;
  codeSemestre: string; // L_S1
  moyenne: number;
  credits: number;
  valide: boolean;
  ues: ResultatUEDto[];
}

// MISE A JOUR : L'année contient une liste de semestres
export interface AnneeAcademiqueDto {
  inscriptionId: number;
  annee: number;
  cycle: string;      // LICENCE, MASTER
  decision: string;   // ADMIS, REDOUBLANT
  moyenneAnnuelle: number;
  semestres: SemestreDto[]; // Remplacement de ues[] par semestres[]
}

export interface ParcoursDto {
  etudiantId: number;
  nomComplet: string;
  annees: AnneeAcademiqueDto[];
}