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
  filiere?: Filiere; // Pour l'envoi, on enverra souvent juste { id: ... }
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
  domaine: string; // 'dev', 'math', 'reseau'...
  ecs: EC[];
}