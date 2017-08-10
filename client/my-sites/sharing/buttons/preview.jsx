/**
 * External dependencies
 */
var React = require( 'react' ),
	some = require( 'lodash/some' ),
	filter = require( 'lodash/filter' );

/**
 * Internal dependencies
 */
var ButtonsLabelEditor = require( './label-editor' ),
	ButtonsPreviewButtons = require( './preview-buttons' ),
	ButtonsPreviewAction = require( './preview-action' ),
	ButtonsTray = require( './tray'),
	decodeEntities = require( 'lib/formatting' ).decodeEntities,
	analytics = require( 'lib/analytics' );

module.exports = localize(class extends React.Component {
    static displayName = 'SharingButtonsPreview';

	static propTypes = {
		isPrivateSite: React.PropTypes.bool,
		style: React.PropTypes.oneOf( [ 'icon-text', 'icon', 'text', 'official' ] ),
		label: React.PropTypes.string,
		buttons: React.PropTypes.array,
		showLike: React.PropTypes.bool,
		showReblog: React.PropTypes.bool,
		onLabelChange: React.PropTypes.func,
		onButtonsChange: React.PropTypes.func
	};

	static defaultProps = {
		style: 'icon',
		buttons: [],
		showLike: true,
		showReblog: true,
		onLabelChange: function() {},
		onButtonsChange: function() {}
	};

	state = {
		isEditingLabel: false,
		buttonsTrayVisibility: null
	};

	toggleEditLabel = () => {
		var isEditingLabel = ! this.state.isEditingLabel;
		this.setState( { isEditingLabel: isEditingLabel } );

		if ( isEditingLabel ) {
			this.hideButtonsTray();
			analytics.ga.recordEvent( 'Sharing', 'Clicked Edit Text Link' );
		} else {
			analytics.ga.recordEvent( 'Sharing', 'Clicked Edit Text Done Button' );
		}
	};

	showButtonsTray = visibility => {
		this.setState( {
			isEditingLabel: false,
			buttonsTrayVisibility: visibility
		} );

		analytics.ga.recordEvent( 'Sharing', 'Clicked Edit Buttons Links', visibility );
	};

	hideButtonsTray = () => {
		if ( ! this.state.buttonsTrayVisibility ) {
			return;
		}

		// Hide button tray by resetting state to default
		this.setState( { buttonsTrayVisibility: null } );

		analytics.ga.recordEvent( 'Sharing', 'Clicked Edit Buttons Done Button' );
	};

	getButtonsTrayToggleButtonLabel = (visibility, enabledButtonsExist) => {
		if ( 'visible' === visibility ) {
			if ( enabledButtonsExist ) {
				return this.props.translate( 'Edit sharing buttons', { context: 'Sharing: Buttons edit label' } );
			} else {
				return this.props.translate( 'Add sharing buttons', { context: 'Sharing: Buttons edit label' } );
			}
		} else if ( enabledButtonsExist ) {
			return this.props.translate( 'Edit “More” buttons', { context: 'Sharing: Buttons edit label' } );
		}

		return this.props.translate( 'Add “More” button', { context: 'Sharing: Buttons edit label' } );
	};

	getButtonsTrayToggleButtonElement = visibility => {
		var enabledButtonsExist = some( this.props.buttons, {
			'visibility': visibility,
			enabled: true
		} );

		return (
			<ButtonsPreviewAction
				active={ null === this.state.buttonsTrayVisibility }
				onClick={ this.showButtonsTray.bind( null, visibility ) }
				icon={ enabledButtonsExist ? 'pencil' : 'plus' }
				position="bottom-left">
					{ this.getButtonsTrayToggleButtonLabel( visibility, enabledButtonsExist ) }
			</ButtonsPreviewAction>
		);
	};

	getReblogButtonElement = () => {
		if ( this.props.showReblog ) {
			return (
			    <a className="sharing-buttons-preview-button is-enabled style-icon-text sharing-buttons-preview__reblog">
					<span className="noticon noticon-reblog" />{ this.props.translate( 'Reblog' ) }
				</a>
			);
		}
	};

	getLikeButtonElement = () => {
		if ( this.props.showLike ) {
			return (
			    <span>
					<a className="sharing-buttons-preview-button is-enabled style-icon-text sharing-buttons-preview__like">
						<span className="noticon noticon-like" />{ this.props.translate( 'Like' ) }
					</a>
					<div className="sharing-buttons-preview__fake-user">
						<img src="https://1.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60" />
					</div>
					<div className="sharing-buttons-preview__fake-like">{ this.props.translate( 'One blogger likes this.' ) }</div>
				</span>
			);
		}
	};

	getPreviewButtonsElement = () => {
		var enabledButtons = filter( this.props.buttons, { enabled: true } );

		if ( enabledButtons.length ) {
			return (
				<ButtonsPreviewButtons
					buttons={ enabledButtons }
					visibility="visible"
					style={ this.props.style }
					showMore={ 'hidden' === this.state.buttonsTrayVisibility || some( this.props.buttons, { visibility: 'hidden' } ) }
					forceMorePreviewVisible={ 'hidden' === this.state.buttonsTrayVisibility } />
			);
		}
	};

	render() {
		return (
		    <div className="sharing-buttons-preview">
				<ButtonsPreviewAction active={ ! this.state.isEditingLabel } onClick={ this.toggleEditLabel } icon="pencil" position="top-left">
					{ this.props.translate( 'Edit label text', { context: 'Sharing: Buttons edit label' } ) }
				</ButtonsPreviewAction>
				<ButtonsLabelEditor
					active={ this.state.isEditingLabel }
					value={ this.props.label }
					onChange={ this.props.onLabelChange }
					onClose={ this.toggleEditLabel }
					hasEnabledButtons={ some( this.props.buttons, { enabled: true } ) } />

				<h2 className="sharing-buttons-preview__heading">{ this.props.translate( 'Preview' ) }</h2>
				<div className="sharing-buttons-preview__display">
					<span className="sharing-buttons-preview__label">{ decodeEntities( this.props.label ) }</span>
					<div className="sharing-buttons-preview__buttons">
						{ this.getPreviewButtonsElement() }
					</div>

					<div className="sharing-buttons-preview__reblog-like">
						{ this.getReblogButtonElement() }
						{ this.getLikeButtonElement() }
					</div>
				</div>

				<div className="sharing-buttons-preview__button-tray-actions">
					{ this.getButtonsTrayToggleButtonElement( 'visible' ) }
					{ this.getButtonsTrayToggleButtonElement( 'hidden' ) }
				</div>

				<ButtonsTray
					buttons={ this.props.buttons }
					style={ 'official' === this.props.style ? 'text' : this.props.style }
					visibility={ this.state.buttonsTrayVisibility }
					onButtonsChange={ this.props.onButtonsChange }
					onClose={ this.hideButtonsTray }
					active={ null !== this.state.buttonsTrayVisibility }
					limited={ this.props.isPrivateSite } />
			</div>
		);
	}
});
