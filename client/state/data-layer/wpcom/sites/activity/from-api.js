/** @format */
/**
 * External dependencies
 */
import { concat, has, overEvery, partialRight, reduce } from 'lodash';

export default function fromApi( { items = [] } ) {
	return reduce( items, processItems, [] );
}

export function processItems( validProcessedItems, item ) {
	if ( ! validateItem( item ) ) {
		return validProcessedItems;
	}

	return concat( validProcessedItems, processItem( item ) );
}

/**
 * Takes an Activity item in the API format returns true if it appears valid, otherwise false
 *
 * @param  {object}  item Activity item
 * @return {object}      True if the item appears to be valid, otherwise false.
 */
export function processItem( item ) {
	return item;
}

/**
 * Takes an Activity item in the API format returns true if it appears valid, otherwise false
 *
 * @param  {object}  item Activity item
 * @return {boolean}      True if the item appears to be valid, otherwise false.
 */
export const validateItem = overEvery( [
	partialRight( has, 'activity_id' ),
	partialRight( has, 'name' ),
	partialRight( has, 'published' ),
	partialRight( has, 'summary' ),
] );
