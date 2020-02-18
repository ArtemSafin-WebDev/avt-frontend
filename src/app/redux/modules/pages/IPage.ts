import { IBlock } from './IBlock';

export interface IPage {
  title: string;
  name: string;
  nodes: IBlock[];
}
