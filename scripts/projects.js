// - ProjectBox
// - - ProjectList
// - - - Project
// - - - - ProjectImages

var ProjectImages = React.createClass({
  render: function() {
    var settings = {
      dots: true
    }

    var images = this.props.images.map(function(image) {

      return (
        <div key={image.id}>
          <img src={image.url} key={image.id}/>
        </div>
      );
    });

    return (
      <div className='container'>
        <Slider {...settings}>
          {images}
        </Slider>
      </div>
    );
  }
});

var Project = React.createClass({
  getInitialState() {
    return { showModal: false };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },

  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: this.props.children.toString() };
  },

  render: function() {
    var thumbnailStyle = {
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.65) 100%), url(' + this.props.thumbnail + ')',
      backgroundSize: 'cover'
    }

    return (
      <div className="project">
        <div className="thing" style={thumbnailStyle} onClick={this.open}>  
        </div>
        <h5 className="project-name">
          {this.props.name}
        </h5>
        <Modal show={this.state.showModal} onHide={this.close}>

          <Modal.Header closeButton>
            <Modal.Title>{this.props.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <ProjectImages images={this.props.images} />
            <div className="model-excerpt">
              <p>{this.props.date}</p>
              <p>{this.props.technologies}</p>

              <div dangerouslySetInnerHTML={this.rawMarkup()} />
              <a href={this.props.url}>Visit</a>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button onClick={this.close}>Close</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

var ProjectList = React.createClass({
  render: function() {
    var projectNodes = this.props.data.map(function(project) {
      return (
        <Project name={project.name} 
                 date={project.date} 
                 technologies={project.technologies}
                 key={project.id}
                 images={project.images}
                 thumbnail={project.thumbnail}>
          {project.description}
        </Project>
      );
    });
    return (
      <div className="projectList flex-container">
        {projectNodes}
      </div>
    );
  }
});

var ProjectBox = React.createClass({
  loadProjectsFromServer: function() {
    var me = this;
    $.getJSON("projects.json", function(data) {
      me.setState({data: data});
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadProjectsFromServer();
  },
  render: function() {
    return (
      <div className="projectBox">
        <h1>Projects</h1>
        <ProjectList data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(
  <ProjectBox />,
  document.getElementById('content')
);
