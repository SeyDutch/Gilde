/*
** NOTE: This file is generated by Gulp and should not be edited directly!
** Any changes made directly to this file will be overwritten next time its asset group is processed by Gulp.
*/

/*!
 * jQuery UI Droppable @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Droppable
//>>group: Interactions
//>>description: Enables drop targets for draggable elements.
//>>docs: http://api.jqueryui.com/droppable/
//>>demos: http://jqueryui.com/droppable/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"./draggable",
			"./mouse",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

$.widget( "ui.droppable", {
	version: "@VERSION",
	widgetEventPrefix: "drop",
	options: {
		accept: "*",
		addClasses: true,
		greedy: false,
		scope: "default",
		tolerance: "intersect",

		// Callbacks
		activate: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	},
	_create: function() {

		var proportions,
			o = this.options,
			accept = o.accept;

		this.isover = false;
		this.isout = true;

		this.accept = $.isFunction( accept ) ? accept : function( d ) {
			return d.is( accept );
		};

		this.proportions = function( /* valueToWrite */ ) {
			if ( arguments.length ) {

				// Store the droppable's proportions
				proportions = arguments[ 0 ];
			} else {

				// Retrieve or derive the droppable's proportions
				return proportions ?
					proportions :
					proportions = {
						width: this.element[ 0 ].offsetWidth,
						height: this.element[ 0 ].offsetHeight
					};
			}
		};

		this._addToManager( o.scope );

		o.addClasses && this._addClass( "ui-droppable" );

	},

	_addToManager: function( scope ) {

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[ scope ] = $.ui.ddmanager.droppables[ scope ] || [];
		$.ui.ddmanager.droppables[ scope ].push( this );
	},

	_splice: function( drop ) {
		var i = 0;
		for ( ; i < drop.length; i++ ) {
			if ( drop[ i ] === this ) {
				drop.splice( i, 1 );
			}
		}
	},

	_destroy: function() {
		var drop = $.ui.ddmanager.droppables[ this.options.scope ];

		this._splice( drop );
	},

	_setOption: function( key, value ) {

		if ( key === "accept" ) {
			this.accept = $.isFunction( value ) ? value : function( d ) {
				return d.is( value );
			};
		} else if ( key === "scope" ) {
			var drop = $.ui.ddmanager.droppables[ this.options.scope ];

			this._splice( drop );
			this._addToManager( value );
		}

		this._super( key, value );
	},

	_activate: function( event ) {
		var draggable = $.ui.ddmanager.current;

		this._addActiveClass();
		if ( draggable ) {
			this._trigger( "activate", event, this.ui( draggable ) );
		}
	},

	_deactivate: function( event ) {
		var draggable = $.ui.ddmanager.current;

		this._removeActiveClass();
		if ( draggable ) {
			this._trigger( "deactivate", event, this.ui( draggable ) );
		}
	},

	_over: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			this._addHoverClass();
			this._trigger( "over", event, this.ui( draggable ) );
		}

	},

	_out: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			this._removeHoverClass();
			this._trigger( "out", event, this.ui( draggable ) );
		}

	},

	_drop: function( event, custom ) {

		var draggable = custom || $.ui.ddmanager.current,
			childrenIntersection = false;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return false;
		}

		this.element.find( ":data(ui-droppable)" ).not( ".ui-draggable-dragging" ).each( function() {
			var inst = $( this ).droppable( "instance" );
			if (
				inst.options.greedy &&
				!inst.options.disabled &&
				inst.options.scope === draggable.options.scope &&
				inst.accept.call( inst.element[ 0 ], ( draggable.currentItem || draggable.element ) ) &&
				intersect( draggable, $.extend( inst, { offset: inst.element.offset() } ), inst.options.tolerance, event )
			) { childrenIntersection = true; return false; }
		} );
		if ( childrenIntersection ) {
			return false;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			this._removeActiveClass();
			this._removeHoverClass();

			this._trigger( "drop", event, this.ui( draggable ) );
			return this.element;
		}

		return false;

	},

	ui: function( c ) {
		return {
			draggable: ( c.currentItem || c.element ),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	},

	// Extension points just to make backcompat sane and avoid duplicating logic
	// TODO: Remove in 1.13 along with call to it below
	_addHoverClass: function() {
		this._addClass( "ui-droppable-hover" );
	},

	_removeHoverClass: function() {
		this._removeClass( "ui-droppable-hover" );
	},

	_addActiveClass: function() {
		this._addClass( "ui-droppable-active" );
	},

	_removeActiveClass: function() {
		this._removeClass( "ui-droppable-active" );
	}
} );

var intersect = ( function() {
	function isOverAxis( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	}

	return function( draggable, droppable, toleranceMode, event ) {

		if ( !droppable.offset ) {
			return false;
		}

		var x1 = ( draggable.positionAbs || draggable.position.absolute ).left + draggable.margins.left,
			y1 = ( draggable.positionAbs || draggable.position.absolute ).top + draggable.margins.top,
			x2 = x1 + draggable.helperProportions.width,
			y2 = y1 + draggable.helperProportions.height,
			l = droppable.offset.left,
			t = droppable.offset.top,
			r = l + droppable.proportions().width,
			b = t + droppable.proportions().height;

		switch ( toleranceMode ) {
		case "fit":
			return ( l <= x1 && x2 <= r && t <= y1 && y2 <= b );
		case "intersect":
			return ( l < x1 + ( draggable.helperProportions.width / 2 ) && // Right Half
				x2 - ( draggable.helperProportions.width / 2 ) < r && // Left Half
				t < y1 + ( draggable.helperProportions.height / 2 ) && // Bottom Half
				y2 - ( draggable.helperProportions.height / 2 ) < b ); // Top Half
		case "pointer":
			return isOverAxis( event.pageY, t, droppable.proportions().height ) && isOverAxis( event.pageX, l, droppable.proportions().width );
		case "touch":
			return (
				( y1 >= t && y1 <= b ) || // Top edge touching
				( y2 >= t && y2 <= b ) || // Bottom edge touching
				( y1 < t && y2 > b ) // Surrounded vertically
			) && (
				( x1 >= l && x1 <= r ) || // Left edge touching
				( x2 >= l && x2 <= r ) || // Right edge touching
				( x1 < l && x2 > r ) // Surrounded horizontally
			);
		default:
			return false;
		}
	};
} )();

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { "default": [] },
	prepareOffsets: function( t, event ) {

		var i, j,
			m = $.ui.ddmanager.droppables[ t.options.scope ] || [],
			type = event ? event.type : null, // workaround for #2317
			list = ( t.currentItem || t.element ).find( ":data(ui-droppable)" ).addBack();

		droppablesLoop: for ( i = 0; i < m.length; i++ ) {

			// No disabled and non-accepted
			if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ], ( t.currentItem || t.element ) ) ) ) {
				continue;
			}

			// Filter out elements in the current dragged item
			for ( j = 0; j < list.length; j++ ) {
				if ( list[ j ] === m[ i ].element[ 0 ] ) {
					m[ i ].proportions().height = 0;
					continue droppablesLoop;
				}
			}

			m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
			if ( !m[ i ].visible ) {
				continue;
			}

			// Activate the droppable if used directly from draggables
			if ( type === "mousedown" ) {
				m[ i ]._activate.call( m[ i ], event );
			}

			m[ i ].offset = m[ i ].element.offset();
			m[ i ].proportions( { width: m[ i ].element[ 0 ].offsetWidth, height: m[ i ].element[ 0 ].offsetHeight } );

		}

	},
	drop: function( draggable, event ) {

		var dropped = false;

		// Create a copy of the droppables in case the list changes during the drop (#9116)
		$.each( ( $.ui.ddmanager.droppables[ draggable.options.scope ] || [] ).slice(), function() {

			if ( !this.options ) {
				return;
			}
			if ( !this.options.disabled && this.visible && intersect( draggable, this, this.options.tolerance, event ) ) {
				dropped = this._drop.call( this, event ) || dropped;
			}

			if ( !this.options.disabled && this.visible && this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call( this, event );
			}

		} );
		return dropped;

	},
	dragStart: function( draggable, event ) {

		// Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).on( "scroll.droppable", function() {
			if ( !draggable.options.refreshPositions ) {
				$.ui.ddmanager.prepareOffsets( draggable, event );
			}
		} );
	},
	drag: function( draggable, event ) {

		// If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if ( draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}

		// Run through all droppables and check their positions based on specific tolerance options
		$.each( $.ui.ddmanager.droppables[ draggable.options.scope ] || [], function() {

			if ( this.options.disabled || this.greedyChild || !this.visible ) {
				return;
			}

			var parentInstance, scope, parent,
				intersects = intersect( draggable, this, this.options.tolerance, event ),
				c = !intersects && this.isover ? "isout" : ( intersects && !this.isover ? "isover" : null );
			if ( !c ) {
				return;
			}

			if ( this.options.greedy ) {

				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents( ":data(ui-droppable)" ).filter( function() {
					return $( this ).droppable( "instance" ).options.scope === scope;
				} );

				if ( parent.length ) {
					parentInstance = $( parent[ 0 ] ).droppable( "instance" );
					parentInstance.greedyChild = ( c === "isover" );
				}
			}

			// We just moved into a greedy child
			if ( parentInstance && c === "isover" ) {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call( parentInstance, event );
			}

			this[ c ] = true;
			this[ c === "isout" ? "isover" : "isout" ] = false;
			this[ c === "isover" ? "_over" : "_out" ].call( this, event );

			// We just moved out of a greedy child
			if ( parentInstance && c === "isout" ) {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call( parentInstance, event );
			}
		} );

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).off( "scroll.droppable" );

		// Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if ( !draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}
	}
};

// DEPRECATED
// TODO: switch return back to widget declaration at top of file when this is removed
if ( $.uiBackCompat !== false ) {

	// Backcompat for activeClass and hoverClass options
	$.widget( "ui.droppable", $.ui.droppable, {
		options: {
			hoverClass: false,
			activeClass: false
		},
		_addActiveClass: function() {
			this._super();
			if ( this.options.activeClass ) {
				this.element.addClass( this.options.activeClass );
			}
		},
		_removeActiveClass: function() {
			this._super();
			if ( this.options.activeClass ) {
				this.element.removeClass( this.options.activeClass );
			}
		},
		_addHoverClass: function() {
			this._super();
			if ( this.options.hoverClass ) {
				this.element.addClass( this.options.hoverClass );
			}
		},
		_removeHoverClass: function() {
			this._super();
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
		}
	} );
}

return $.ui.droppable;

} ) );

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3BwYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUFMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImRyb3BwYWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxyXG4gKiBqUXVlcnkgVUkgRHJvcHBhYmxlIEBWRVJTSU9OXHJcbiAqIGh0dHA6Ly9qcXVlcnl1aS5jb21cclxuICpcclxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXHJcbiAqL1xyXG5cclxuLy8+PmxhYmVsOiBEcm9wcGFibGVcclxuLy8+Pmdyb3VwOiBJbnRlcmFjdGlvbnNcclxuLy8+PmRlc2NyaXB0aW9uOiBFbmFibGVzIGRyb3AgdGFyZ2V0cyBmb3IgZHJhZ2dhYmxlIGVsZW1lbnRzLlxyXG4vLz4+ZG9jczogaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vZHJvcHBhYmxlL1xyXG4vLz4+ZGVtb3M6IGh0dHA6Ly9qcXVlcnl1aS5jb20vZHJvcHBhYmxlL1xyXG5cclxuKCBmdW5jdGlvbiggZmFjdG9yeSApIHtcclxuXHRpZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xyXG5cclxuXHRcdC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuXHRcdGRlZmluZSggW1xyXG5cdFx0XHRcImpxdWVyeVwiLFxyXG5cdFx0XHRcIi4vZHJhZ2dhYmxlXCIsXHJcblx0XHRcdFwiLi9tb3VzZVwiLFxyXG5cdFx0XHRcIi4uL3ZlcnNpb25cIixcclxuXHRcdFx0XCIuLi93aWRnZXRcIlxyXG5cdFx0XSwgZmFjdG9yeSApO1xyXG5cdH0gZWxzZSB7XHJcblxyXG5cdFx0Ly8gQnJvd3NlciBnbG9iYWxzXHJcblx0XHRmYWN0b3J5KCBqUXVlcnkgKTtcclxuXHR9XHJcbn0oIGZ1bmN0aW9uKCAkICkge1xyXG5cclxuJC53aWRnZXQoIFwidWkuZHJvcHBhYmxlXCIsIHtcclxuXHR2ZXJzaW9uOiBcIkBWRVJTSU9OXCIsXHJcblx0d2lkZ2V0RXZlbnRQcmVmaXg6IFwiZHJvcFwiLFxyXG5cdG9wdGlvbnM6IHtcclxuXHRcdGFjY2VwdDogXCIqXCIsXHJcblx0XHRhZGRDbGFzc2VzOiB0cnVlLFxyXG5cdFx0Z3JlZWR5OiBmYWxzZSxcclxuXHRcdHNjb3BlOiBcImRlZmF1bHRcIixcclxuXHRcdHRvbGVyYW5jZTogXCJpbnRlcnNlY3RcIixcclxuXHJcblx0XHQvLyBDYWxsYmFja3NcclxuXHRcdGFjdGl2YXRlOiBudWxsLFxyXG5cdFx0ZGVhY3RpdmF0ZTogbnVsbCxcclxuXHRcdGRyb3A6IG51bGwsXHJcblx0XHRvdXQ6IG51bGwsXHJcblx0XHRvdmVyOiBudWxsXHJcblx0fSxcclxuXHRfY3JlYXRlOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgcHJvcG9ydGlvbnMsXHJcblx0XHRcdG8gPSB0aGlzLm9wdGlvbnMsXHJcblx0XHRcdGFjY2VwdCA9IG8uYWNjZXB0O1xyXG5cclxuXHRcdHRoaXMuaXNvdmVyID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzb3V0ID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLmFjY2VwdCA9ICQuaXNGdW5jdGlvbiggYWNjZXB0ICkgPyBhY2NlcHQgOiBmdW5jdGlvbiggZCApIHtcclxuXHRcdFx0cmV0dXJuIGQuaXMoIGFjY2VwdCApO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnByb3BvcnRpb25zID0gZnVuY3Rpb24oIC8qIHZhbHVlVG9Xcml0ZSAqLyApIHtcclxuXHRcdFx0aWYgKCBhcmd1bWVudHMubGVuZ3RoICkge1xyXG5cclxuXHRcdFx0XHQvLyBTdG9yZSB0aGUgZHJvcHBhYmxlJ3MgcHJvcG9ydGlvbnNcclxuXHRcdFx0XHRwcm9wb3J0aW9ucyA9IGFyZ3VtZW50c1sgMCBdO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHQvLyBSZXRyaWV2ZSBvciBkZXJpdmUgdGhlIGRyb3BwYWJsZSdzIHByb3BvcnRpb25zXHJcblx0XHRcdFx0cmV0dXJuIHByb3BvcnRpb25zID9cclxuXHRcdFx0XHRcdHByb3BvcnRpb25zIDpcclxuXHRcdFx0XHRcdHByb3BvcnRpb25zID0ge1xyXG5cdFx0XHRcdFx0XHR3aWR0aDogdGhpcy5lbGVtZW50WyAwIF0ub2Zmc2V0V2lkdGgsXHJcblx0XHRcdFx0XHRcdGhlaWdodDogdGhpcy5lbGVtZW50WyAwIF0ub2Zmc2V0SGVpZ2h0XHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuX2FkZFRvTWFuYWdlciggby5zY29wZSApO1xyXG5cclxuXHRcdG8uYWRkQ2xhc3NlcyAmJiB0aGlzLl9hZGRDbGFzcyggXCJ1aS1kcm9wcGFibGVcIiApO1xyXG5cclxuXHR9LFxyXG5cclxuXHRfYWRkVG9NYW5hZ2VyOiBmdW5jdGlvbiggc2NvcGUgKSB7XHJcblxyXG5cdFx0Ly8gQWRkIHRoZSByZWZlcmVuY2UgYW5kIHBvc2l0aW9ucyB0byB0aGUgbWFuYWdlclxyXG5cdFx0JC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgc2NvcGUgXSA9ICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIHNjb3BlIF0gfHwgW107XHJcblx0XHQkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyBzY29wZSBdLnB1c2goIHRoaXMgKTtcclxuXHR9LFxyXG5cclxuXHRfc3BsaWNlOiBmdW5jdGlvbiggZHJvcCApIHtcclxuXHRcdHZhciBpID0gMDtcclxuXHRcdGZvciAoIDsgaSA8IGRyb3AubGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdGlmICggZHJvcFsgaSBdID09PSB0aGlzICkge1xyXG5cdFx0XHRcdGRyb3Auc3BsaWNlKCBpLCAxICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfZGVzdHJveTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZHJvcCA9ICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIHRoaXMub3B0aW9ucy5zY29wZSBdO1xyXG5cclxuXHRcdHRoaXMuX3NwbGljZSggZHJvcCApO1xyXG5cdH0sXHJcblxyXG5cdF9zZXRPcHRpb246IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xyXG5cclxuXHRcdGlmICgga2V5ID09PSBcImFjY2VwdFwiICkge1xyXG5cdFx0XHR0aGlzLmFjY2VwdCA9ICQuaXNGdW5jdGlvbiggdmFsdWUgKSA/IHZhbHVlIDogZnVuY3Rpb24oIGQgKSB7XHJcblx0XHRcdFx0cmV0dXJuIGQuaXMoIHZhbHVlICk7XHJcblx0XHRcdH07XHJcblx0XHR9IGVsc2UgaWYgKCBrZXkgPT09IFwic2NvcGVcIiApIHtcclxuXHRcdFx0dmFyIGRyb3AgPSAkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyB0aGlzLm9wdGlvbnMuc2NvcGUgXTtcclxuXHJcblx0XHRcdHRoaXMuX3NwbGljZSggZHJvcCApO1xyXG5cdFx0XHR0aGlzLl9hZGRUb01hbmFnZXIoIHZhbHVlICk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fc3VwZXIoIGtleSwgdmFsdWUgKTtcclxuXHR9LFxyXG5cclxuXHRfYWN0aXZhdGU6IGZ1bmN0aW9uKCBldmVudCApIHtcclxuXHRcdHZhciBkcmFnZ2FibGUgPSAkLnVpLmRkbWFuYWdlci5jdXJyZW50O1xyXG5cclxuXHRcdHRoaXMuX2FkZEFjdGl2ZUNsYXNzKCk7XHJcblx0XHRpZiAoIGRyYWdnYWJsZSApIHtcclxuXHRcdFx0dGhpcy5fdHJpZ2dlciggXCJhY3RpdmF0ZVwiLCBldmVudCwgdGhpcy51aSggZHJhZ2dhYmxlICkgKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHRfZGVhY3RpdmF0ZTogZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cdFx0dmFyIGRyYWdnYWJsZSA9ICQudWkuZGRtYW5hZ2VyLmN1cnJlbnQ7XHJcblxyXG5cdFx0dGhpcy5fcmVtb3ZlQWN0aXZlQ2xhc3MoKTtcclxuXHRcdGlmICggZHJhZ2dhYmxlICkge1xyXG5cdFx0XHR0aGlzLl90cmlnZ2VyKCBcImRlYWN0aXZhdGVcIiwgZXZlbnQsIHRoaXMudWkoIGRyYWdnYWJsZSApICk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X292ZXI6IGZ1bmN0aW9uKCBldmVudCApIHtcclxuXHJcblx0XHR2YXIgZHJhZ2dhYmxlID0gJC51aS5kZG1hbmFnZXIuY3VycmVudDtcclxuXHJcblx0XHQvLyBCYWlsIGlmIGRyYWdnYWJsZSBhbmQgZHJvcHBhYmxlIGFyZSBzYW1lIGVsZW1lbnRcclxuXHRcdGlmICggIWRyYWdnYWJsZSB8fCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApWyAwIF0gPT09IHRoaXMuZWxlbWVudFsgMCBdICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0aGlzLmFjY2VwdC5jYWxsKCB0aGlzLmVsZW1lbnRbIDAgXSwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKSApICkge1xyXG5cdFx0XHR0aGlzLl9hZGRIb3ZlckNsYXNzKCk7XHJcblx0XHRcdHRoaXMuX3RyaWdnZXIoIFwib3ZlclwiLCBldmVudCwgdGhpcy51aSggZHJhZ2dhYmxlICkgKTtcclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHJcblx0X291dDogZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cclxuXHRcdHZhciBkcmFnZ2FibGUgPSAkLnVpLmRkbWFuYWdlci5jdXJyZW50O1xyXG5cclxuXHRcdC8vIEJhaWwgaWYgZHJhZ2dhYmxlIGFuZCBkcm9wcGFibGUgYXJlIHNhbWUgZWxlbWVudFxyXG5cdFx0aWYgKCAhZHJhZ2dhYmxlIHx8ICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50IClbIDAgXSA9PT0gdGhpcy5lbGVtZW50WyAwIF0gKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHRoaXMuYWNjZXB0LmNhbGwoIHRoaXMuZWxlbWVudFsgMCBdLCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApICkgKSB7XHJcblx0XHRcdHRoaXMuX3JlbW92ZUhvdmVyQ2xhc3MoKTtcclxuXHRcdFx0dGhpcy5fdHJpZ2dlciggXCJvdXRcIiwgZXZlbnQsIHRoaXMudWkoIGRyYWdnYWJsZSApICk7XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblxyXG5cdF9kcm9wOiBmdW5jdGlvbiggZXZlbnQsIGN1c3RvbSApIHtcclxuXHJcblx0XHR2YXIgZHJhZ2dhYmxlID0gY3VzdG9tIHx8ICQudWkuZGRtYW5hZ2VyLmN1cnJlbnQsXHJcblx0XHRcdGNoaWxkcmVuSW50ZXJzZWN0aW9uID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gQmFpbCBpZiBkcmFnZ2FibGUgYW5kIGRyb3BwYWJsZSBhcmUgc2FtZSBlbGVtZW50XHJcblx0XHRpZiAoICFkcmFnZ2FibGUgfHwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKVsgMCBdID09PSB0aGlzLmVsZW1lbnRbIDAgXSApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZWxlbWVudC5maW5kKCBcIjpkYXRhKHVpLWRyb3BwYWJsZSlcIiApLm5vdCggXCIudWktZHJhZ2dhYmxlLWRyYWdnaW5nXCIgKS5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGluc3QgPSAkKCB0aGlzICkuZHJvcHBhYmxlKCBcImluc3RhbmNlXCIgKTtcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdGluc3Qub3B0aW9ucy5ncmVlZHkgJiZcclxuXHRcdFx0XHQhaW5zdC5vcHRpb25zLmRpc2FibGVkICYmXHJcblx0XHRcdFx0aW5zdC5vcHRpb25zLnNjb3BlID09PSBkcmFnZ2FibGUub3B0aW9ucy5zY29wZSAmJlxyXG5cdFx0XHRcdGluc3QuYWNjZXB0LmNhbGwoIGluc3QuZWxlbWVudFsgMCBdLCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApICkgJiZcclxuXHRcdFx0XHRpbnRlcnNlY3QoIGRyYWdnYWJsZSwgJC5leHRlbmQoIGluc3QsIHsgb2Zmc2V0OiBpbnN0LmVsZW1lbnQub2Zmc2V0KCkgfSApLCBpbnN0Lm9wdGlvbnMudG9sZXJhbmNlLCBldmVudCApXHJcblx0XHRcdCkgeyBjaGlsZHJlbkludGVyc2VjdGlvbiA9IHRydWU7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0fSApO1xyXG5cdFx0aWYgKCBjaGlsZHJlbkludGVyc2VjdGlvbiApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdGhpcy5hY2NlcHQuY2FsbCggdGhpcy5lbGVtZW50WyAwIF0sICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50ICkgKSApIHtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlQWN0aXZlQ2xhc3MoKTtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlSG92ZXJDbGFzcygpO1xyXG5cclxuXHRcdFx0dGhpcy5fdHJpZ2dlciggXCJkcm9wXCIsIGV2ZW50LCB0aGlzLnVpKCBkcmFnZ2FibGUgKSApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0fSxcclxuXHJcblx0dWk6IGZ1bmN0aW9uKCBjICkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZHJhZ2dhYmxlOiAoIGMuY3VycmVudEl0ZW0gfHwgYy5lbGVtZW50ICksXHJcblx0XHRcdGhlbHBlcjogYy5oZWxwZXIsXHJcblx0XHRcdHBvc2l0aW9uOiBjLnBvc2l0aW9uLFxyXG5cdFx0XHRvZmZzZXQ6IGMucG9zaXRpb25BYnNcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0Ly8gRXh0ZW5zaW9uIHBvaW50cyBqdXN0IHRvIG1ha2UgYmFja2NvbXBhdCBzYW5lIGFuZCBhdm9pZCBkdXBsaWNhdGluZyBsb2dpY1xyXG5cdC8vIFRPRE86IFJlbW92ZSBpbiAxLjEzIGFsb25nIHdpdGggY2FsbCB0byBpdCBiZWxvd1xyXG5cdF9hZGRIb3ZlckNsYXNzOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuX2FkZENsYXNzKCBcInVpLWRyb3BwYWJsZS1ob3ZlclwiICk7XHJcblx0fSxcclxuXHJcblx0X3JlbW92ZUhvdmVyQ2xhc3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5fcmVtb3ZlQ2xhc3MoIFwidWktZHJvcHBhYmxlLWhvdmVyXCIgKTtcclxuXHR9LFxyXG5cclxuXHRfYWRkQWN0aXZlQ2xhc3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5fYWRkQ2xhc3MoIFwidWktZHJvcHBhYmxlLWFjdGl2ZVwiICk7XHJcblx0fSxcclxuXHJcblx0X3JlbW92ZUFjdGl2ZUNsYXNzOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuX3JlbW92ZUNsYXNzKCBcInVpLWRyb3BwYWJsZS1hY3RpdmVcIiApO1xyXG5cdH1cclxufSApO1xyXG5cclxudmFyIGludGVyc2VjdCA9ICggZnVuY3Rpb24oKSB7XHJcblx0ZnVuY3Rpb24gaXNPdmVyQXhpcyggeCwgcmVmZXJlbmNlLCBzaXplICkge1xyXG5cdFx0cmV0dXJuICggeCA+PSByZWZlcmVuY2UgKSAmJiAoIHggPCAoIHJlZmVyZW5jZSArIHNpemUgKSApO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKCBkcmFnZ2FibGUsIGRyb3BwYWJsZSwgdG9sZXJhbmNlTW9kZSwgZXZlbnQgKSB7XHJcblxyXG5cdFx0aWYgKCAhZHJvcHBhYmxlLm9mZnNldCApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB4MSA9ICggZHJhZ2dhYmxlLnBvc2l0aW9uQWJzIHx8IGRyYWdnYWJsZS5wb3NpdGlvbi5hYnNvbHV0ZSApLmxlZnQgKyBkcmFnZ2FibGUubWFyZ2lucy5sZWZ0LFxyXG5cdFx0XHR5MSA9ICggZHJhZ2dhYmxlLnBvc2l0aW9uQWJzIHx8IGRyYWdnYWJsZS5wb3NpdGlvbi5hYnNvbHV0ZSApLnRvcCArIGRyYWdnYWJsZS5tYXJnaW5zLnRvcCxcclxuXHRcdFx0eDIgPSB4MSArIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCxcclxuXHRcdFx0eTIgPSB5MSArIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQsXHJcblx0XHRcdGwgPSBkcm9wcGFibGUub2Zmc2V0LmxlZnQsXHJcblx0XHRcdHQgPSBkcm9wcGFibGUub2Zmc2V0LnRvcCxcclxuXHRcdFx0ciA9IGwgKyBkcm9wcGFibGUucHJvcG9ydGlvbnMoKS53aWR0aCxcclxuXHRcdFx0YiA9IHQgKyBkcm9wcGFibGUucHJvcG9ydGlvbnMoKS5oZWlnaHQ7XHJcblxyXG5cdFx0c3dpdGNoICggdG9sZXJhbmNlTW9kZSApIHtcclxuXHRcdGNhc2UgXCJmaXRcIjpcclxuXHRcdFx0cmV0dXJuICggbCA8PSB4MSAmJiB4MiA8PSByICYmIHQgPD0geTEgJiYgeTIgPD0gYiApO1xyXG5cdFx0Y2FzZSBcImludGVyc2VjdFwiOlxyXG5cdFx0XHRyZXR1cm4gKCBsIDwgeDEgKyAoIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCAvIDIgKSAmJiAvLyBSaWdodCBIYWxmXHJcblx0XHRcdFx0eDIgLSAoIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCAvIDIgKSA8IHIgJiYgLy8gTGVmdCBIYWxmXHJcblx0XHRcdFx0dCA8IHkxICsgKCBkcmFnZ2FibGUuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0IC8gMiApICYmIC8vIEJvdHRvbSBIYWxmXHJcblx0XHRcdFx0eTIgLSAoIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQgLyAyICkgPCBiICk7IC8vIFRvcCBIYWxmXHJcblx0XHRjYXNlIFwicG9pbnRlclwiOlxyXG5cdFx0XHRyZXR1cm4gaXNPdmVyQXhpcyggZXZlbnQucGFnZVksIHQsIGRyb3BwYWJsZS5wcm9wb3J0aW9ucygpLmhlaWdodCApICYmIGlzT3ZlckF4aXMoIGV2ZW50LnBhZ2VYLCBsLCBkcm9wcGFibGUucHJvcG9ydGlvbnMoKS53aWR0aCApO1xyXG5cdFx0Y2FzZSBcInRvdWNoXCI6XHJcblx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0KCB5MSA+PSB0ICYmIHkxIDw9IGIgKSB8fCAvLyBUb3AgZWRnZSB0b3VjaGluZ1xyXG5cdFx0XHRcdCggeTIgPj0gdCAmJiB5MiA8PSBiICkgfHwgLy8gQm90dG9tIGVkZ2UgdG91Y2hpbmdcclxuXHRcdFx0XHQoIHkxIDwgdCAmJiB5MiA+IGIgKSAvLyBTdXJyb3VuZGVkIHZlcnRpY2FsbHlcclxuXHRcdFx0KSAmJiAoXHJcblx0XHRcdFx0KCB4MSA+PSBsICYmIHgxIDw9IHIgKSB8fCAvLyBMZWZ0IGVkZ2UgdG91Y2hpbmdcclxuXHRcdFx0XHQoIHgyID49IGwgJiYgeDIgPD0gciApIHx8IC8vIFJpZ2h0IGVkZ2UgdG91Y2hpbmdcclxuXHRcdFx0XHQoIHgxIDwgbCAmJiB4MiA+IHIgKSAvLyBTdXJyb3VuZGVkIGhvcml6b250YWxseVxyXG5cdFx0XHQpO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH07XHJcbn0gKSgpO1xyXG5cclxuLypcclxuXHRUaGlzIG1hbmFnZXIgdHJhY2tzIG9mZnNldHMgb2YgZHJhZ2dhYmxlcyBhbmQgZHJvcHBhYmxlc1xyXG4qL1xyXG4kLnVpLmRkbWFuYWdlciA9IHtcclxuXHRjdXJyZW50OiBudWxsLFxyXG5cdGRyb3BwYWJsZXM6IHsgXCJkZWZhdWx0XCI6IFtdIH0sXHJcblx0cHJlcGFyZU9mZnNldHM6IGZ1bmN0aW9uKCB0LCBldmVudCApIHtcclxuXHJcblx0XHR2YXIgaSwgaixcclxuXHRcdFx0bSA9ICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIHQub3B0aW9ucy5zY29wZSBdIHx8IFtdLFxyXG5cdFx0XHR0eXBlID0gZXZlbnQgPyBldmVudC50eXBlIDogbnVsbCwgLy8gd29ya2Fyb3VuZCBmb3IgIzIzMTdcclxuXHRcdFx0bGlzdCA9ICggdC5jdXJyZW50SXRlbSB8fCB0LmVsZW1lbnQgKS5maW5kKCBcIjpkYXRhKHVpLWRyb3BwYWJsZSlcIiApLmFkZEJhY2soKTtcclxuXHJcblx0XHRkcm9wcGFibGVzTG9vcDogZm9yICggaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrICkge1xyXG5cclxuXHRcdFx0Ly8gTm8gZGlzYWJsZWQgYW5kIG5vbi1hY2NlcHRlZFxyXG5cdFx0XHRpZiAoIG1bIGkgXS5vcHRpb25zLmRpc2FibGVkIHx8ICggdCAmJiAhbVsgaSBdLmFjY2VwdC5jYWxsKCBtWyBpIF0uZWxlbWVudFsgMCBdLCAoIHQuY3VycmVudEl0ZW0gfHwgdC5lbGVtZW50ICkgKSApICkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBGaWx0ZXIgb3V0IGVsZW1lbnRzIGluIHRoZSBjdXJyZW50IGRyYWdnZWQgaXRlbVxyXG5cdFx0XHRmb3IgKCBqID0gMDsgaiA8IGxpc3QubGVuZ3RoOyBqKysgKSB7XHJcblx0XHRcdFx0aWYgKCBsaXN0WyBqIF0gPT09IG1bIGkgXS5lbGVtZW50WyAwIF0gKSB7XHJcblx0XHRcdFx0XHRtWyBpIF0ucHJvcG9ydGlvbnMoKS5oZWlnaHQgPSAwO1xyXG5cdFx0XHRcdFx0Y29udGludWUgZHJvcHBhYmxlc0xvb3A7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtWyBpIF0udmlzaWJsZSA9IG1bIGkgXS5lbGVtZW50LmNzcyggXCJkaXNwbGF5XCIgKSAhPT0gXCJub25lXCI7XHJcblx0XHRcdGlmICggIW1bIGkgXS52aXNpYmxlICkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBBY3RpdmF0ZSB0aGUgZHJvcHBhYmxlIGlmIHVzZWQgZGlyZWN0bHkgZnJvbSBkcmFnZ2FibGVzXHJcblx0XHRcdGlmICggdHlwZSA9PT0gXCJtb3VzZWRvd25cIiApIHtcclxuXHRcdFx0XHRtWyBpIF0uX2FjdGl2YXRlLmNhbGwoIG1bIGkgXSwgZXZlbnQgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bVsgaSBdLm9mZnNldCA9IG1bIGkgXS5lbGVtZW50Lm9mZnNldCgpO1xyXG5cdFx0XHRtWyBpIF0ucHJvcG9ydGlvbnMoIHsgd2lkdGg6IG1bIGkgXS5lbGVtZW50WyAwIF0ub2Zmc2V0V2lkdGgsIGhlaWdodDogbVsgaSBdLmVsZW1lbnRbIDAgXS5vZmZzZXRIZWlnaHQgfSApO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHRkcm9wOiBmdW5jdGlvbiggZHJhZ2dhYmxlLCBldmVudCApIHtcclxuXHJcblx0XHR2YXIgZHJvcHBlZCA9IGZhbHNlO1xyXG5cclxuXHRcdC8vIENyZWF0ZSBhIGNvcHkgb2YgdGhlIGRyb3BwYWJsZXMgaW4gY2FzZSB0aGUgbGlzdCBjaGFuZ2VzIGR1cmluZyB0aGUgZHJvcCAoIzkxMTYpXHJcblx0XHQkLmVhY2goICggJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgZHJhZ2dhYmxlLm9wdGlvbnMuc2NvcGUgXSB8fCBbXSApLnNsaWNlKCksIGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0aWYgKCAhdGhpcy5vcHRpb25zICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoICF0aGlzLm9wdGlvbnMuZGlzYWJsZWQgJiYgdGhpcy52aXNpYmxlICYmIGludGVyc2VjdCggZHJhZ2dhYmxlLCB0aGlzLCB0aGlzLm9wdGlvbnMudG9sZXJhbmNlLCBldmVudCApICkge1xyXG5cdFx0XHRcdGRyb3BwZWQgPSB0aGlzLl9kcm9wLmNhbGwoIHRoaXMsIGV2ZW50ICkgfHwgZHJvcHBlZDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCAhdGhpcy5vcHRpb25zLmRpc2FibGVkICYmIHRoaXMudmlzaWJsZSAmJiB0aGlzLmFjY2VwdC5jYWxsKCB0aGlzLmVsZW1lbnRbIDAgXSwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKSApICkge1xyXG5cdFx0XHRcdHRoaXMuaXNvdXQgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuaXNvdmVyID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5fZGVhY3RpdmF0ZS5jYWxsKCB0aGlzLCBldmVudCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSApO1xyXG5cdFx0cmV0dXJuIGRyb3BwZWQ7XHJcblxyXG5cdH0sXHJcblx0ZHJhZ1N0YXJ0OiBmdW5jdGlvbiggZHJhZ2dhYmxlLCBldmVudCApIHtcclxuXHJcblx0XHQvLyBMaXN0ZW4gZm9yIHNjcm9sbGluZyBzbyB0aGF0IGlmIHRoZSBkcmFnZ2luZyBjYXVzZXMgc2Nyb2xsaW5nIHRoZSBwb3NpdGlvbiBvZiB0aGUgZHJvcHBhYmxlcyBjYW4gYmUgcmVjYWxjdWxhdGVkIChzZWUgIzUwMDMpXHJcblx0XHRkcmFnZ2FibGUuZWxlbWVudC5wYXJlbnRzVW50aWwoIFwiYm9keVwiICkub24oIFwic2Nyb2xsLmRyb3BwYWJsZVwiLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKCAhZHJhZ2dhYmxlLm9wdGlvbnMucmVmcmVzaFBvc2l0aW9ucyApIHtcclxuXHRcdFx0XHQkLnVpLmRkbWFuYWdlci5wcmVwYXJlT2Zmc2V0cyggZHJhZ2dhYmxlLCBldmVudCApO1xyXG5cdFx0XHR9XHJcblx0XHR9ICk7XHJcblx0fSxcclxuXHRkcmFnOiBmdW5jdGlvbiggZHJhZ2dhYmxlLCBldmVudCApIHtcclxuXHJcblx0XHQvLyBJZiB5b3UgaGF2ZSBhIGhpZ2hseSBkeW5hbWljIHBhZ2UsIHlvdSBtaWdodCB0cnkgdGhpcyBvcHRpb24uIEl0IHJlbmRlcnMgcG9zaXRpb25zIGV2ZXJ5IHRpbWUgeW91IG1vdmUgdGhlIG1vdXNlLlxyXG5cdFx0aWYgKCBkcmFnZ2FibGUub3B0aW9ucy5yZWZyZXNoUG9zaXRpb25zICkge1xyXG5cdFx0XHQkLnVpLmRkbWFuYWdlci5wcmVwYXJlT2Zmc2V0cyggZHJhZ2dhYmxlLCBldmVudCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJ1biB0aHJvdWdoIGFsbCBkcm9wcGFibGVzIGFuZCBjaGVjayB0aGVpciBwb3NpdGlvbnMgYmFzZWQgb24gc3BlY2lmaWMgdG9sZXJhbmNlIG9wdGlvbnNcclxuXHRcdCQuZWFjaCggJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgZHJhZ2dhYmxlLm9wdGlvbnMuc2NvcGUgXSB8fCBbXSwgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5kaXNhYmxlZCB8fCB0aGlzLmdyZWVkeUNoaWxkIHx8ICF0aGlzLnZpc2libGUgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgcGFyZW50SW5zdGFuY2UsIHNjb3BlLCBwYXJlbnQsXHJcblx0XHRcdFx0aW50ZXJzZWN0cyA9IGludGVyc2VjdCggZHJhZ2dhYmxlLCB0aGlzLCB0aGlzLm9wdGlvbnMudG9sZXJhbmNlLCBldmVudCApLFxyXG5cdFx0XHRcdGMgPSAhaW50ZXJzZWN0cyAmJiB0aGlzLmlzb3ZlciA/IFwiaXNvdXRcIiA6ICggaW50ZXJzZWN0cyAmJiAhdGhpcy5pc292ZXIgPyBcImlzb3ZlclwiIDogbnVsbCApO1xyXG5cdFx0XHRpZiAoICFjICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCB0aGlzLm9wdGlvbnMuZ3JlZWR5ICkge1xyXG5cclxuXHRcdFx0XHQvLyBmaW5kIGRyb3BwYWJsZSBwYXJlbnRzIHdpdGggc2FtZSBzY29wZVxyXG5cdFx0XHRcdHNjb3BlID0gdGhpcy5vcHRpb25zLnNjb3BlO1xyXG5cdFx0XHRcdHBhcmVudCA9IHRoaXMuZWxlbWVudC5wYXJlbnRzKCBcIjpkYXRhKHVpLWRyb3BwYWJsZSlcIiApLmZpbHRlciggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJCggdGhpcyApLmRyb3BwYWJsZSggXCJpbnN0YW5jZVwiICkub3B0aW9ucy5zY29wZSA9PT0gc2NvcGU7XHJcblx0XHRcdFx0fSApO1xyXG5cclxuXHRcdFx0XHRpZiAoIHBhcmVudC5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHRwYXJlbnRJbnN0YW5jZSA9ICQoIHBhcmVudFsgMCBdICkuZHJvcHBhYmxlKCBcImluc3RhbmNlXCIgKTtcclxuXHRcdFx0XHRcdHBhcmVudEluc3RhbmNlLmdyZWVkeUNoaWxkID0gKCBjID09PSBcImlzb3ZlclwiICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBXZSBqdXN0IG1vdmVkIGludG8gYSBncmVlZHkgY2hpbGRcclxuXHRcdFx0aWYgKCBwYXJlbnRJbnN0YW5jZSAmJiBjID09PSBcImlzb3ZlclwiICkge1xyXG5cdFx0XHRcdHBhcmVudEluc3RhbmNlLmlzb3ZlciA9IGZhbHNlO1xyXG5cdFx0XHRcdHBhcmVudEluc3RhbmNlLmlzb3V0ID0gdHJ1ZTtcclxuXHRcdFx0XHRwYXJlbnRJbnN0YW5jZS5fb3V0LmNhbGwoIHBhcmVudEluc3RhbmNlLCBldmVudCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzWyBjIF0gPSB0cnVlO1xyXG5cdFx0XHR0aGlzWyBjID09PSBcImlzb3V0XCIgPyBcImlzb3ZlclwiIDogXCJpc291dFwiIF0gPSBmYWxzZTtcclxuXHRcdFx0dGhpc1sgYyA9PT0gXCJpc292ZXJcIiA/IFwiX292ZXJcIiA6IFwiX291dFwiIF0uY2FsbCggdGhpcywgZXZlbnQgKTtcclxuXHJcblx0XHRcdC8vIFdlIGp1c3QgbW92ZWQgb3V0IG9mIGEgZ3JlZWR5IGNoaWxkXHJcblx0XHRcdGlmICggcGFyZW50SW5zdGFuY2UgJiYgYyA9PT0gXCJpc291dFwiICkge1xyXG5cdFx0XHRcdHBhcmVudEluc3RhbmNlLmlzb3V0ID0gZmFsc2U7XHJcblx0XHRcdFx0cGFyZW50SW5zdGFuY2UuaXNvdmVyID0gdHJ1ZTtcclxuXHRcdFx0XHRwYXJlbnRJbnN0YW5jZS5fb3Zlci5jYWxsKCBwYXJlbnRJbnN0YW5jZSwgZXZlbnQgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSApO1xyXG5cclxuXHR9LFxyXG5cdGRyYWdTdG9wOiBmdW5jdGlvbiggZHJhZ2dhYmxlLCBldmVudCApIHtcclxuXHRcdGRyYWdnYWJsZS5lbGVtZW50LnBhcmVudHNVbnRpbCggXCJib2R5XCIgKS5vZmYoIFwic2Nyb2xsLmRyb3BwYWJsZVwiICk7XHJcblxyXG5cdFx0Ly8gQ2FsbCBwcmVwYXJlT2Zmc2V0cyBvbmUgZmluYWwgdGltZSBzaW5jZSBJRSBkb2VzIG5vdCBmaXJlIHJldHVybiBzY3JvbGwgZXZlbnRzIHdoZW4gb3ZlcmZsb3cgd2FzIGNhdXNlZCBieSBkcmFnIChzZWUgIzUwMDMpXHJcblx0XHRpZiAoICFkcmFnZ2FibGUub3B0aW9ucy5yZWZyZXNoUG9zaXRpb25zICkge1xyXG5cdFx0XHQkLnVpLmRkbWFuYWdlci5wcmVwYXJlT2Zmc2V0cyggZHJhZ2dhYmxlLCBldmVudCApO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8vIERFUFJFQ0FURURcclxuLy8gVE9ETzogc3dpdGNoIHJldHVybiBiYWNrIHRvIHdpZGdldCBkZWNsYXJhdGlvbiBhdCB0b3Agb2YgZmlsZSB3aGVuIHRoaXMgaXMgcmVtb3ZlZFxyXG5pZiAoICQudWlCYWNrQ29tcGF0ICE9PSBmYWxzZSApIHtcclxuXHJcblx0Ly8gQmFja2NvbXBhdCBmb3IgYWN0aXZlQ2xhc3MgYW5kIGhvdmVyQ2xhc3Mgb3B0aW9uc1xyXG5cdCQud2lkZ2V0KCBcInVpLmRyb3BwYWJsZVwiLCAkLnVpLmRyb3BwYWJsZSwge1xyXG5cdFx0b3B0aW9uczoge1xyXG5cdFx0XHRob3ZlckNsYXNzOiBmYWxzZSxcclxuXHRcdFx0YWN0aXZlQ2xhc3M6IGZhbHNlXHJcblx0XHR9LFxyXG5cdFx0X2FkZEFjdGl2ZUNsYXNzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5fc3VwZXIoKTtcclxuXHRcdFx0aWYgKCB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MgKSB7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmFkZENsYXNzKCB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdF9yZW1vdmVBY3RpdmVDbGFzczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuX3N1cGVyKCk7XHJcblx0XHRcdGlmICggdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzICkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyggdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRfYWRkSG92ZXJDbGFzczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuX3N1cGVyKCk7XHJcblx0XHRcdGlmICggdGhpcy5vcHRpb25zLmhvdmVyQ2xhc3MgKSB7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmFkZENsYXNzKCB0aGlzLm9wdGlvbnMuaG92ZXJDbGFzcyApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0X3JlbW92ZUhvdmVyQ2xhc3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLl9zdXBlcigpO1xyXG5cdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5ob3ZlckNsYXNzICkge1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyggdGhpcy5vcHRpb25zLmhvdmVyQ2xhc3MgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0gKTtcclxufVxyXG5cclxucmV0dXJuICQudWkuZHJvcHBhYmxlO1xyXG5cclxufSApICk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
