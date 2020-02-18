import * as React from 'react';
import {defaultPage, getPage} from '../../redux/modules/pages/service';
import {CardHolder} from '../../components/Landing/Card/CardHolder';
import {Footer} from '../../components/Footer/Footer';
import {Header} from '../../components/Header';
import {App} from '../App';
import {IBlock} from '../../redux/modules/pages/IBlock';
import {connect} from 'react-redux';
import {InlineLoader} from '../../components/Misc/Loader/InlineLoader';

export interface IContactsProps {
  getPageNodes?: () => Promise<any>;
}

export interface IContactsState {
  nodes: IBlock[];
}

@(connect(
  () => ({}),
  (dispatch) => ({
    getPageNodes: () =>
      dispatch(getPage('contacts')),
  }),
) as any)
export class Contacts extends React.Component<IContactsProps, IContactsState> {
  public readonly state: IContactsState = {
    nodes: [],
  };

  public componentWillUpdate() {
    App.resetWebflow();
  }

  public componentDidMount() {
    this.props.getPageNodes().then((data) => {
      console.log(data);
      this.setState({nodes: data.nodes || []});
    });
  }

  // tslint:disable

  public render() {
    const services = defaultPage.nodes[1];
    const nodes = this.state.nodes;
    return (
      <div>
        <main className="header" data-ix="fixed-nav">
          <Header/>
        </main>
        {nodes.length > 2 ? (
          <div className="section content-section overflow-hidden">
            <div className="container cart-container">
              <div className="row row-mb30 w-row">
                <div className="column w-col w-col-6">
                  <div className="h1">{nodes[0].title}</div>
                  <div className="p-big margin-p-big">
                    {nodes[0].children[0].description}
                    <br/>
                    <a href={'tel:' + nodes[0].children[1].description} className="link-contacts">
                      {nodes[0].children[1].description}
                    </a>
                    <br/>
                    {nodes[0].children[2] && (
                      <a href={'mailto:' + nodes[0].children[2].description} className="link-contacts">
                        {nodes[0].children[2].description}
                      </a>
                    )}
                  </div>
                </div>
                <div className="column w-col w-col-6">
                  <div className="html-embed w-embed w-iframe"
                       dangerouslySetInnerHTML={{__html: nodes[1].children[0].description}}/>
                </div>
              </div>
              <div className="row w-row">
                {nodes.slice(2, 5).map((node) => (
                  <div className="column w-col w-col-4" key={node.id} data-id={node.id}>
                    <div className="h3">{node.children[0].title || ''}</div>
                    <div className="p-big margin-p-big">
                      {node.children[0].description}
                      <br/>
                      {node.children[1] && (
                        <a href={'tel:' + node.children[1].description} className="link-contacts">
                          {node.children[1].description}
                        </a>
                      )}
                      <br/>
                      {node.children[2] && (
                        <a href={'mailto:' + node.children[2].description} className="link-contacts">
                          {node.children[2].description}
                        </a>
                      )}
                      {node.children[3] && (
                        <div>
                          <br/>
                          <br/>
                        </div>
                      )}
                      {node.children[4] && (
                        <div>
                          {node.children[4].description}
                        </div>
                      )}
                      {node.children[5] && (
                        <div>
                          {node.children[5].description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {nodes[5] && (
                <div>
                  <div className="h3">{nodes[5].title}</div>
                  <div className="row row-mb30 w-row">
                    <div className="column w-col w-col-6" style={{whiteSpace: 'pre-line'}}>
                      <div className="p-big margin-p-big">
                        {nodes[5].children[0].children[0].description}
                      </div>
                    </div>
                    <div className="column w-col w-col-6">
                      <div className="p-big margin-p-big" style={{whiteSpace: 'pre-line'}}>
                        {nodes[5].children[0].children[1].description}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <CardHolder id="contacts_cards" key={Math.random()} pageName="contacts" title={services.title}
                          description="Мы предоставляем услуги для всех категорий пассажиров и применяем индивидуальных подход к каждому клиенту."
                          cards={services.children}/>
            </div>
          </div>

        ) : (
          <InlineLoader customBlockStyle={{margin: '200px auto'}} text="" dotUpdating={false}/>
        )}
        <Footer/>
      </div>
    );
  }
}
