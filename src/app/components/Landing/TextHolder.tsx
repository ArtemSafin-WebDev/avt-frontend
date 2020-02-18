import * as React from 'react';
import { IBlock } from '../../redux/modules/pages/IBlock';

export interface ITextHolderProps {
  id: number;
  children: IBlock[];
  pageName: string;
}
export class TextHolder extends React.Component<ITextHolderProps> {
  private getClassFromType(blockName: string) {
    switch (blockName) {
      case 'big_text_block':
        return 'p-bigger margin-3-p-big';
      default:
      case 'mid_text_block':
        return 'p-big margin-3-p-big';
    }
  }

  private renderSideInfo(block: IBlock) {
    switch (block.type) {
      case 'image':
        return (
          <div className={'column w-col ' + block.size} key={block.description}>
            <div className="sideinfo">
              <img src={block.image_url} className="photo"/>
              <div className="p grey-p">{block.description}</div>
            </div>
          </div>
        );
      default:
      case 'bold_text_block':
        return (
          <div className={'column w-col ' + block.size} key={block.description}>
            <div className="sideinfo">
              <div className="p-bigger margin-3-p-big"><strong>{block.description}</strong></div>
            </div>
          </div>
        );
      case 'red_text_block':
        return (
          <div className={'column w-col ' + block.size} key={block.description}>
            <div className="sideinfo red-sideinfo">
              <div className="h1 margin-3-h1"><strong>{block.title}</strong></div>
              <div className="p-big margin-2-p-big">{block.description}</div>
            </div>
          </div>
        );
    }
  }

  private renderTexts(texts: IBlock[]) {
    const result = [];
    for (let i = 0; i < texts.length; i += 1) {
      const block = texts[i];
      block.size = block.size || 'w-col-7';
      const sided = (i < texts.length - 1 && block.size
        && Number(block.size.split('w-col-')[1])
        + Number(texts[i + 1].size.split('w-col-')[1]) <= 12);
      result.push((
        <div className="row w-row" key={block.description}>
          <div className={'column w-col ' + block.size}>
            {block.title && (<div className="h3">{block.title}</div>)}
            <div className={this.getClassFromType(block.type)} style={{whiteSpace: 'pre-wrap'}}>
              {block.description}
            </div>
          </div>
          {sided && this.renderSideInfo(texts[i + 1])}
        </div>
      ));
      if (sided) { i++; }
    }
    return result;
  }
  public render() {
    const id = this.props.id;
    return (
      <section className="section content-section">
        <div className="container">
          {id === 1 && (<div id={this.props.pageName} className="anchor"/>)}
          {this.renderTexts(this.props.children)}
        </div>
      </section>
    );
  }
}
