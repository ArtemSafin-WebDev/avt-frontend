export interface IBlock {
  id?: number;
  type: string;
  title?: string;
  size?: string;
  description?: string;
  image_url?: string;
  action_url?: string;
  action_text?: string;
  action_icon_url?: string;
  children?: IBlock[];
}
