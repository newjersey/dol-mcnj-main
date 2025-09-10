
export interface Keypair {
  key: string;
  //value: string | Keypair | Keypair[];
  [propName: string]: string | string[] | Keypair | Keypair[];

}

export interface Resource {
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

export interface Resources {
  data: Resource[];
  valid: boolean;
  status: string;
  extra?: Extra;
}
