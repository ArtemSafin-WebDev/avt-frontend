import * as React from 'react';
import { connect } from 'react-redux';
import { getPage } from '../../redux/modules/pages/service';
import { IPage } from '../../redux/modules/pages/IPage';
import { IBlock } from '../../redux/modules/pages/IBlock';
import { MainHeader } from '../../components/Landing/Headers/MainHeader';
import { Hero } from '../../components/Landing/Headers/Hero';
import { CardHolder } from '../../components/Landing/Card/CardHolder';
import { Footer } from '../../components/Footer/Footer';
import { VisaApplicationForm } from '../../components/Landing/Forms/VisaApplicationForm';
import { BlueHeader } from '../../components/Landing/Headers/BlueHeader';
import { TextHolder } from '../../components/Landing/TextHolder';
import { App } from '../App';
import { IStore } from '../../redux/IStore';

export interface IPageProps {
  name?: string;
  data?: any;
  params?: any; // GET query params
  getPageData?: any;
  isAuthenticated?: boolean;
}
export interface IPageState {
  name: string;
  data: IPage;
}
@(connect(
  (state: IStore) => ({
    isAuthenticated: state.get('user').get('isAuthenticated'),
  }),
  (dispatch) => ({
    getPageData: (name) => dispatch(getPage(name)),
  }),
) as any)
export class Page extends React.Component<IPageProps, IPageState> {
  public readonly state: IPageState = {
    name: '',
    data: null,
  };

  constructor(props) {
    super(props);
    if (props.name) {
      this.state = {
        name: this.props.name,
        data: this.props.data,
      };
    } else {
      props.getPageData(props.params.name).then((res) => {
        this.setState({
          name: props.params.name,
          data: res,
        });
      });
    }
  }
  public componentWillUpdate() {
    App.resetWebflow();
  }

  public componentWillReceiveProps(nextProps: IPageProps) {
    if (this.state && nextProps.params && this.state.name !== nextProps.params.name) {
      this.props.getPageData(nextProps.params.name).then((data) => {
        this.setState({
          name: nextProps.params.name,
          data,
        });
      });
    }
    if (this.state && nextProps.data && nextProps.data !== this.state.data) {
      this.setState({
        data: nextProps.data,
      });
    }
  }

  private renderBlock(block: IBlock, id: number) {
    const { title, description, size, image_url } = block;
    const name = this.props.name || this.props.params.name;
    /*tslint:disable switch-default*/
    switch (block.type) {
      case 'blue_header':
        return <BlueHeader key={title} title={title} description={description}/>;
      case 'main_header':
      case 'main_header_iframe':
        return (
          <MainHeader key={title} title={title} isAuthenticated={this.props.isAuthenticated}
                      pageName={name} imageURL={image_url} />
        );
      case 'hero':
        return (
          <Hero key={Math.random()} title={title} description={description} name={this.state.name}
                backgroundImageURL={image_url}
                actionButtonText={block.action_text} actionButtonURL={block.action_icon_url}/>);
      case 'card_holder':
        return (
          <CardHolder id={id} key={Math.random()} pageName={this.state.name}
                      title={title} description={description} size={size} cards={block.children}/>);
      case 'text_holder':
        return (<TextHolder id={id} key={Math.random()} pageName={this.state.name} children={block.children}/>);
      case 'visa_form_holder':
        return (
          <VisaApplicationForm key={Math.random()} title="Заявка на оформление визы" cards={block.children}/>);
    }
  }

  public render() {
    let blocks = [];
    if (this.state.data && this.state.data.nodes) {
      blocks = this.state.data.nodes;
    }
    const name = this.props.name || this.props.params.name;
    return (
      (this.state.data) && (
        <div>
          <div className="overflow-hidden">
            {blocks.map((block, i) => this.renderBlock(block, i))}
          </div>
          <Footer isOnePort={name === 'oneport'}/>
        </div>
        )/* : (
          <Loader hasOverLay={true}/>
        )*/
    );
  }
}
