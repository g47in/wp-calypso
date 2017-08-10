/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';

export default localize(class extends React.PureComponent {
    static displayName = 'StatsError';

	static propTypes = {
		message: PropTypes.string,
		className: PropTypes.string
	};

	render() {
		const message = this.props.message || this.props.translate( "Some stats didn't load in time. Please try again later." );

		return (
			<div className={ classNames( 'module-content-text', 'is-error', this.props.className ) }>
				<p>{ message }</p>
			</div>
		);
	}
});
