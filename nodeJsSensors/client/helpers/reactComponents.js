'use strict';

window.ee = new EventEmitter();

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            _id: React.PropTypes.string.isRequired,
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function() {
        return {
            visible: false
        };
    },
    readmoreClick: function(e) {
        e.preventDefault();
        this.setState({visible: true});
    },
    render: function() {
        var author = this.props.data.author,
            text = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible;

        return (
            <div className='article'>
                <p className='news__author'>{author}:</p>
                <p className='news__text'>{text}</p>
                <a href="#"
                   onClick={this.readmoreClick}
                   className={'news__readmore ' + (visible ? 'none': '')}>
                    Show more
                </a>
                {/*<p className={'news__big-text ' + (visible ? '': 'none')}>{bigText}</p>*/}
            </div>
        )
    }
});

var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        return {
            counter: 0
        }
    },
    render: function() {
        var data = this.props.data;
        var newsTemplate;

        if (data.length > 0) {
            newsTemplate = data.map(function(item, index) {
                return (
                    <div key={index}>
                        <Article data={item} />
                    </div>
                )
            })
        } else {
            newsTemplate = <p>No messages</p>
        }

        return (
            <div className='news'>
                {newsTemplate}
                <strong
                    className={'news__count ' + (data.length > 0 ? '':'none') }>Total messages: {data.length}</strong>
            </div>
        );
    }
});

var Add = React.createClass({
    getInitialState: function() {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        };
    },
    componentDidMount: function() {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },
    onBtnClickHandler: function(e) {
        e.preventDefault();
        var textEl = ReactDOM.findDOMNode(this.refs.text);

        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = textEl.value;

        var item = [{
            author: author,
            text: text,
            bigText: '...'
        }];

        window.ee.emit('Messages.add', item);

        textEl.value = '';
        this.setState({textIsEmpty: true});
    },
    onCheckRuleClick: function(e) {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },
    onFieldChange: function(fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({[''+fieldName]:false})
        } else {
            this.setState({[''+fieldName]:true})
        }
    },
    render: function() {
        var agreeNotChecked = this.state.agreeNotChecked,
            authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty;
        return (
            <form className='add cf' style={{border: '2px solid black'}}>
                <input
                    type='text'
                    className='add__author'
                    onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                    placeholder='Your name'
                    ref='author'
                />
                <br/>
                <textarea
                    className='add__text'
                    onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                    placeholder='Message text'
                    ref='text'
                ></textarea>
                <br/>
                <label className='add__checkrule'>
                    <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>I agree with rules
                </label>
                <br/>
                <button
                    className='add__btn'
                    onClick={this.onBtnClickHandler}
                    ref='alert_button'
                    disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}
                >Publish new message
                </button>
            </form>
        );
    }
});

var App = React.createClass({
    getInitialState: function() {
        return { news: [] };
    },
    componentDidMount: function() {
        $.ajax({
            url:'/messages',
            dataType: 'json',
            cache: false,
            success: function (data) {
                //json array to js Array
                var result = [];
                for(var i in data.messages) {
                    result.push(data.messages[i]);
                }
                this.setState({ news: result }); //JSON.parse(data.messages) });
            }.bind(this),
            error: function (err) {
                console.log(err);
            }.bind(this)
        });
        var self = this;
        window.ee.addListener('Messages.add', function(item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },
    componentWillUnmount: function() {
        window.ee.removeListener('Messages.add');
    },
    render: function() {
        console.log('render');
        return (
            <div className='app'>
                <Add />
                <h3>Messages</h3>
                <News data={this.state.news} />
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);