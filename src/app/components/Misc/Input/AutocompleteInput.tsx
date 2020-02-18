import { IInputProps, Input } from './Input';
import * as React from 'react';
import * as cx from 'classnames';
import { IDestination } from '../../../models/search/IDestination';
import { ChangeEvent, KeyboardEvent } from 'react';
import { fromJS, Iterable } from 'immutable';
import { InlineLoader } from '../Loader/InlineLoader';
import { SearchActions } from '../../../redux/modules/search/actions';

export interface IAutocompleteInputProps extends IInputProps {
  value?: string;
  destination?: IDestination;
  dataName: string;
  onType: (targetInput: string, currentValue: string, currentDestination?: IDestination) => any;
  suggestions: any;
  hideCode?: boolean;
  nested?: boolean;
  focused: boolean;
  focusHandler: (name: string, focused: boolean) => void;
}
export interface IAutocompleteInputState {
  value: string;
  currentDestination: IDestination;
  pristine: boolean;
  highlightedSuggestion: number;
  isEmpty: boolean;
}

export class AutocompleteInput extends React.Component<IAutocompleteInputProps, IAutocompleteInputState> {
  constructor(props) {
    super(props);
    this.state = {
      pristine: true,
      value: '',
      currentDestination: null,
      highlightedSuggestion: 0,
      isEmpty: false,
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.selectDestination = this.selectDestination.bind(this);
  }

  private currentItem = 0;
  private itemMap = {};
  private renderSuggestion(suggestion) {
    this.itemMap[this.currentItem] = suggestion;
    this.currentItem++;
    return (
      <span className={cx({
        'drop-link w-inline-block': true,
        'drop-link-hover': this.currentItem - 1 === this.state.highlightedSuggestion,
        'childless': suggestion.get('children') && suggestion.get('children').size === 0,
      })}
         key={'' + suggestion.get('id') + this.currentItem + suggestion.get('code')}
         onMouseEnter={() => this.setHighlighted(this.currentItem)}>
        <div className="suggestion-body" onClick={() => this.selectDestination(suggestion)}>
          <div className="drop-link-text nowrap">
            {suggestion.get('title')}
              {suggestion.get('country')
              && <span>, <span className="grey-p">{suggestion.get('country')}</span></span>}
              {suggestion.get('countryShort')
              && <span>, <span className="grey-p">{suggestion.get('countryShort')}</span></span>}
          </div>
          {suggestion.get('type') === 'hotel' && (
            <div className="hotel-caption">
              Отель
            </div>
          )}
          {!this.props.hideCode && suggestion.get('code') && suggestion.get('code')
            ? (
              <div className="tech-uc absolute_tech-uc">{suggestion.get('code')}</div>
            ) : (
              <div className="tech-uc absolute_tech-uc">
                <img className="flag" src={`/public/images/flags/${suggestion.get('country').toLowerCase()}.svg`}/>
              </div>
            )}
        </div>
        {suggestion.get('children') && suggestion.get('children').size > 0 && (
          <div className="suggestion-children">
            {suggestion.get('children').splice(5).map((s) => {
              return this.renderSuggestion(s);
            })}
          </div>
        )}
      </span>
    );
  }

  private getSuggestions() {
    this.currentItem = 0;
    return this.props.suggestions.map((suggestion) => this.currentItem < 10 && this.renderSuggestion(suggestion));
  }

  private selectDestination(suggestion: IDestination) {
    this.props.onType(this.props.name, this.state.value, suggestion);
    this.props.focusHandler(this.props.dataName, false);
    return this.setState({currentDestination: suggestion, value: suggestion.get('title')});
  }

  private handlePress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      this.setHighlighted(this.state.highlightedSuggestion - 1);
    } else if (e.key === 'ArrowDown') {
      this.setHighlighted(this.state.highlightedSuggestion + 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.selectDestination(this.itemMap[this.state.highlightedSuggestion]);
    } else if (e.keyCode === 8) {
      // 'Backspace'
      this.selectDestination(fromJS({ title: e.currentTarget.value, code: ' ', country: '', id: 0 } as IDestination));
      this.setState({highlightedSuggestion: 0});
      this.props.focusHandler(this.props.dataName, true);
    } else if (e.keyCode === 9) {
      // Tab
      if (this.props.dataName === 'to_avia' || this.props.dataName === 'hotel_city') {
        this.props.focusHandler('date', true);
      }
    }
  }

  private setHighlighted(position: number) {
    if (position >= 0 && position < Math.max(this.currentItem, this.props.suggestions.length)) {
      this.setState({highlightedSuggestion: position, isEmpty: false});
    }
  }

  private timeoutId;

  private onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.props.onType(this.props.name, this.state.value).then((action) => {
        if (action.type === SearchActions.SEARCH_DESTINATION_HINTS_SUCCESS
            && action.payload.destinations.length > 0) {
          this.setState({isEmpty: false});
        } else {
          this.setState({isEmpty: true});
        }
      });
      this.props.focusHandler(this.props.dataName, true);
    }, 500);
    this.setState({
      value: e.target.value,
      pristine: false,
      highlightedSuggestion: 0,
    });
    this.props.focusHandler(this.props.dataName, true);
  }
  private noSuggestion() {
    return (Iterable.isIterable(this.props.suggestions) && this.props.suggestions.size === 0)
      || this.props.suggestions.length === 0;
  }

  private openPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.noSuggestion()) {
      this.props.onType(this.props.name, this.state.value);
    }
    if (window.innerWidth <= 767) {
      $('.nav-container').fadeOut('fast');
      $('html,body').animate({scrollTop: 0}, 'slow');
      setTimeout(() => {
        $(`.w--open.form-drop-toggle input`).trigger('blur');
        $(`#${this.props.dataName} input`).focus();
      }, 500);
    }
    this.props.focusHandler(this.props.dataName, true);
    return false;
  }
  private renderInput() {
    const currentValue = (this.state.pristine && this.props.destination)
      ? this.props.destination.get('title')
      : this.state.value;
    return (
      <Input type={this.props.type}
             autoComplete={this.props.autoComplete || 'false'} // Chrome fix
             className={this.props.className}
             maxLength={this.props.maxLength}
             name={this.props.name}
             value={currentValue}
             placeholder={this.props.placeholder}
             onKeyPress={this.handlePress}
             onChange={this.onInputChange}
             onFocus={this.openPopup}
             onBlur={() => {
               if (this.props.suggestions && this.props.suggestions.length > 0) {
                 if (
                   window.innerWidth > 767
                   && this.state.value.toLowerCase() === this.props.suggestions[0].get('title').toLowerCase()

                   || this.state.value === this.props.suggestions[0].get('code')) {
                   this.selectDestination(this.props.suggestions[0]);
                 }
               }
             }}
             data-name={this.props.dataName}
             disabled={this.props.disabled}
             id={this.props.id}
             required={this.props.required}/>
    );
  }
  public render() {
    const currentDestination = this.props.destination;
    return (
      <div data-delay="200" className={cx({
          'form-drop w-dropdown': true,
          'on-top': this.props.focused,
          'hotels_form-drop': this.props.dataName === 'hotel_city',
        })} key={this.props.name}>
        <div className={cx({'form-drop-toggle': true, 'w--open': this.props.focused})}>
          {this.renderInput()}
          {currentDestination && !this.props.hideCode && (
            currentDestination.get('code') ? (
              <div className="tech-uc absolute_tech-uc">{currentDestination.get('code')}</div>
            ) : (
              <div className="tech-uc absolute_tech-uc">
                <img className="flag"
                     src={`/public/images/flags/${currentDestination.get('country').toLowerCase()}.svg`}/>
              </div>
            )
          )}
        </div>
        <nav id={this.props.dataName} className={cx({
                'suggestions-drop-list w-dropdown-list route-form-drop-list': true,
                'open w--open': this.props.focused,
                // [c['route-form-drop-list--open']]: this.state.focused,
              })}>
          <div className="mobile_drop-list w-hidden-main w-hidden-medium">
            {this.renderInput()}
              <a href="#" className="close_drop-list w-inline-block"
                 onClick={() => {
                   this.props.focusHandler(this.props.dataName, false);
                 }}
                 data-ix="form-drop-list-close">
                <img src="/public/images/close-red.svg" />
              </a>
          </div>
          {this.getSuggestions()}
          {this.noSuggestion() && (this.state.isEmpty ? (
            <div className="not-found-suggestions" style={{display: 'block'}}>
              <img src="/public/images/404-img.svg"/>
              <h3 className="red-h3">Ничего не найдено</h3>
              <p className="p">Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <InlineLoader text="" dotUpdating={false}/>
          ))}
        </nav>
      </div>
    );
  }
}
