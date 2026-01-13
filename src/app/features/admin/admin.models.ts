export interface Filiere {
  id?: number;
  code: string;
  libelle: string;
  specialites?: Specialite[];
}

export interface Specialite {
  id?: number;
  code: string;
  libelle: string;
  filiere?: Filiere;
  // Les maquettes (semestres) peuvent être incluses si le backend les renvoie
  maquettes?: MaquetteSemestre[];
}

export interface MaquetteSemestre {
  id: number;
  libelle: string;
  semestre: string; // 'L_S1', 'L_S2'...
}

export interface EC {
  id?: number;
  libelle: string;
  coefficient: number;
}

export interface UE {
  id?: number;
  code: string;
  libelle: string;
  credits: number;
  coefficient: number;
  domaine: string;
  ecs: EC[];
}

// DTO pour l'inscription
export interface InscriptionAdministrativeRequest {
  etudiantId: number;
  annee: number;
  semestre: string;
  specialiteId: number;
}

// DTO pour la notation
export interface SaisieNoteRequest {
  inscriptionId: number;
  codeUE: string;
  nomEC: string;
  note: number;
  session: 'NORMALE' | 'RATTRAPAGE';
}

export interface NoteResponse {
  nomEC: string;
  valeur: number;
  session: string;
}