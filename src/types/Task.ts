export type Attribute = {
  id: string;
  description: string;
};
export type Task = {
  id: string;
  title: string;
  description: string;
  schedule?: Date;
  completed?: boolean;
  attributes: Attribute[];
  tags: string[];
};
