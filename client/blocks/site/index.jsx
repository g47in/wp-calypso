/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { noop } from 'lodash';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import SiteIcon from 'blocks/site-icon';
import SiteIndicator from 'my-sites/site-indicator';
import { getSite } from 'state/sites/selectors';

class Site extends React.Component {
    static defaultProps = {
		// onSelect callback
		onSelect: noop,
		// mouse event callbacks
		onMouseEnter: noop,
		onMouseLeave: noop,

		// Set a href attribute to the anchor
		href: null,

		// Choose to show the SiteIndicator
		indicator: true,

		// Mark as selected or not
		isSelected: false,

		homeLink: false,
		// if homeLink is enabled
		showHomeIcon: true,
		compact: false
	};

	static propTypes = {
		href: React.PropTypes.string,
		externalLink: React.PropTypes.bool,
		indicator: React.PropTypes.bool,
		onSelect: React.PropTypes.func,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func,
		isSelected: React.PropTypes.bool,
		isHighlighted: React.PropTypes.bool,
		site: React.PropTypes.object,
		siteId: React.PropTypes.number,
		homeLink: React.PropTypes.bool,
		showHomeIcon: React.PropTypes.bool,
		compact: React.PropTypes.bool
	};

	onSelect = event => {
		this.props.onSelect( event, this.props.site.ID );
	};

	onMouseEnter = event => {
		this.props.onMouseEnter( event, this.props.site.ID );
	};

	onMouseLeave = event => {
		this.props.onMouseLeave( event, this.props.site.ID );
	};

	render() {
		const site = this.props.site;

		if ( ! site ) {
			// we could move the placeholder state here
			return null;
		}

		const siteClass = classnames( {
			site: true,
			'is-jetpack': site.jetpack,
			'is-primary': site.primary,
			'is-private': site.is_private,
			'is-redirect': site.options && site.options.is_redirect,
			'is-selected': this.props.isSelected,
			'is-highlighted': this.props.isHighlighted,
			'is-compact': this.props.compact,
		} );

		return (
		    <div className={ siteClass }>
				<a className="site__content"
					href={ this.props.homeLink ? site.URL : this.props.href }
					data-tip-target={ this.props.tipTarget }
					target={ this.props.externalLink && '_blank' }
					title={ this.props.homeLink
						? this.props.translate( 'View this site' )
						: this.props.translate( 'Select this site' )
					}
					onClick={ this.onSelect }
					onMouseEnter={ this.onMouseEnter }
					onMouseLeave={ this.onMouseLeave }
					aria-label={ this.props.homeLink && site.is_previewable
						? this.props.translate( 'Open site %(domain)s in a preview', {
							args: { domain: site.domain }
						} )
						: this.props.translate( 'Open site %(domain)s in new tab', {
							args: { domain: site.domain }
						} )
					}
				>
					<SiteIcon site={ site } size={ this.props.compact ? 24 : 32 } />
					<div className="site__info">
						<div className="site__title">
							{ /* eslint-disable wpcalypso/jsx-gridicon-size */ }
							{ this.props.site.is_private &&
								<span className="site__badge">
									<Gridicon icon="lock" size={ 14 } />
								</span>
							}
							{ site.options && site.options.is_redirect &&
								<span className="site__badge">
									<Gridicon icon="block" size={ 14 } />
								</span>
							}
							{ site.options && site.options.is_domain_only &&
								<span className="site__badge">
									<Gridicon icon="domains" size={ 14 } />
								</span>
							}
							{ /* eslint-enable wpcalypso/jsx-gridicon-size */ }
							{ site.title }
						</div>
						<div className="site__domain">{ site.domain }</div>
					</div>
					{ this.props.homeLink && this.props.showHomeIcon &&
						<span className="site__home">
							<Gridicon icon="house" size={ 18 } />
						</span>
					}
				</a>
				{ this.props.indicator
					? <SiteIndicator site={ site } />
					: null
				}
			</div>
		);
	}
}

export default connect( ( state, { siteId, site } ) => ( {
	site: siteId ? getSite( state, siteId ) : site
} ) )( localize(Site) );
