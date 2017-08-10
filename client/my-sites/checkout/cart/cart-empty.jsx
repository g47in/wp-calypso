/**
 * External dependencies
 */
var React = require( 'react' ),
	page = require( 'page' ),
	startsWith = require( 'lodash/startsWith' );

class CartEmpty extends React.Component {
    render() {
		return (
		    <div>
				<div className="cart-empty">
					{ this.props.translate( 'There are no items in your cart.' ) }
				</div>
				<div className="cart-buttons">
					<button className="cart-checkout-button button is-primary"
							onClick={ this.handleClick }>
							{ this.shouldShowPlanButton() ? this.props.translate( 'Add a Plan' ) : this.props.translate( 'Add a Domain' ) }
					</button>
				</div>
			</div>
		);
	}

	shouldShowPlanButton = () => {
		if ( this.props.selectedSite.jetpack ) {
			return true; // always show the plan button for jetpack sites (not the domain button)
		}
		return startsWith( this.props.path, '/domains' );
	};

	handleClick = event => {
		event.preventDefault();

		page( ( this.shouldShowPlanButton() ? '/plans/' : '/domains/add/' ) + this.props.selectedSite.slug );
	};
}

module.exports = localize(CartEmpty);
