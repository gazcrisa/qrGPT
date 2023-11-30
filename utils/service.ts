export interface MedicationRequest {
  /**
   * URL that the QR code will point to.
   */
  medication: string;
}

export type Concept = {
  description: string;
  code: string;
  score: number;
  whodrug_id: string;
  atc_code: string;
};

export interface MedicationResponse {
  concepts: Concept[];
}

