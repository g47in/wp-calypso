/** @format */
/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';
import { expect } from 'chai';
import { omit } from 'lodash';

/**
 * Internal dependencies
 */
import fromApi, { processItem, processItems, validateItem } from '../from-api';

const VALID_ITEM = deepFreeze( {
	'@context': 'https://www.w3.org/ns/activitystreams',
	summary: 'Jane Doe updated post I wrote a new post!',
	name: 'post__updated',
	actor: {
		type: 'Person',
		name: 'Jane Doe',
		role: 'administrator',
		external_user_id: 1,
		wpcom_user_id: 12345,
		icon: {
			type: 'Image',
			url: 'https://secure.gravatar.com/avatar/0?s=96&d=mm&r=g',
			width: 96,
			height: 96,
		},
	},
	type: 'Updated',
	object: {
		type: 'Article',
		name: 'I wrote a new post!',
		object_id: 100,
		object_type: 'post',
		object_status: 'publish',
	},
	published: '2014-09-14T00:30:00+02:00',
	generator: {
		jetpack_version: 5.3,
		blog_id: 123456,
	},
	gridicon: 'posts',
	activity_id: 'foobarbaz',
} );

describe( 'fromApi', () => {
	context( 'validateItem', () => {
		const requiredProps = [ 'activity_id', 'name', 'published', 'summary' ];

		requiredProps.forEach( property => {
			it( `should return false if ${ property } is not present`, () => {
				expect( validateItem( omit( property, VALID_ITEM ) ) ).to.be.false;
			} );
		} );

		it( 'should return true if all required properties are present', () => {
			expect( validateItem( VALID_ITEM ) ).to.be.true;
		} );
	} );
} );
