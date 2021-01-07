export interface Person {
  name: string;
  notes: string;
  connections: Connection[];
}

export interface Connection {
  name: string;
  relations: Relation[];
}

export interface Relation {
  type: string;
  notes: string;
}
