import * as React from 'react';
import * as Dropzone from 'react-dropzone/dist/index';

export interface IDropdownFileUploaderProps {
  onUpload: any;
  onRemove: any;
  accept: string;
}
export interface IDropdownFileUploaderState {
  files: any[];
  dropzoneActive: boolean;
}
export class DropdownFileUploader extends React.Component<IDropdownFileUploaderProps, IDropdownFileUploaderState> {
  public readonly state: IDropdownFileUploaderState = {
    files: [],
    dropzoneActive: false,
  };

  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
  }

  private onDragEnter() {
    this.setState({
      dropzoneActive: true,
    });
  }

  private onDragLeave() {
    this.setState({
      dropzoneActive: false,
    });
  }

  private onDrop(files) {
    this.setState({
      files,
      dropzoneActive: false,
    });
    this.props.onUpload(files);
  }

  public render() {
    let dropzoneRef;
    const { files, dropzoneActive } = this.state;
    const overlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff',
    };
    return (
      <div className="row flex-row margin-bottom-row w-clearfix">
        <div className="column-100">
          <Dropzone
            disableClick={true}
            style={{position: 'relative'}}
            accept={this.props.accept}
            className="drop-zone"
            activeClassName="drop-zone-active"
            rejectClassName="drop-zone-reject"
            onDrop={this.onDrop}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
            ref={(node) => { dropzoneRef = node; }}>
            <p>Drop files here.</p>
          </Dropzone>
          {dropzoneActive && <div style={{overlayStyle}}>Drop files...</div>}
          <div className="upload-button w-clearfix">
            <a className="link-block upload-link w-inline-block w-clearfix"
               onClick={() => { dropzoneRef.open(); }}>
              <img src="/public/images/upload-red.svg" className="image-upload" />
              <div className="text-block w-hidden-tiny">Прикрепить файлы</div>
            </a>
          </div>
          <div className="files-attached">
            {files.map((f) => (
              <div className="filename w-clearfix">
                <div className="tech-text red-tech-text left-tech-text">{f.name}</div>
                <img onClick={() => {
                  const files = this.state.files.filter((cur) => cur.name !== f.name);
                  this.setState({files});
                  this.props.onRemove(files);
                }}
                     src="/public/images/trash-red.svg"
                     className="delete-icon" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
