export interface Keypair {
  key: string;
  value: string | Keypair | Keypair[];
}

export interface Certificate {
  [propName: string]: string | string[] | Keypair | Keypair[];
}

export interface Extra {
  Results?: number;
  RelatedItems?: number;
  RelatedItemsMap?: number;
  ResultsMetadata?: number;
  TotalResults: number;
  ElapsedMilliseconds: number;
  Errors: [];
  Debug?: number;
}

export interface Certificates {
  data: Certificate[];
  valid: boolean;
  status: string;
  extra?: Extra;
}
