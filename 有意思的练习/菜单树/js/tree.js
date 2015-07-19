var tree = {
	nodeName: '',
	subNodes: [
		{
			nodeName: 'Core',
			subNodes: [
				{
					nodeName: '$(...)The jQuery Function',
					subNodes: [
						{
							nodeName: 'jQuery(html)',
							nodeLink: '#link-jQuery-html'
						},
						{
							nodeName: 'jQuery(elements)',
							nodeLink: '#link-jQuery-elements'
						},
						{
							nodeName: 'jQuery(callback)',
							nodeLink: '#link-jQuery-callback'
						},
						{
							nodeName: 'jQuery(expression, content)',
							nodeLink: '#link-jQuery-expressioncontext'
						}
					]
				},
				{
					nodeName: 'jQuery Object Accessors',
					subNodes: [
						{
							nodeName: 'each(callback)',
							nodeLink: '#link-each-callback'
						},
						{
							nodeName: 'eq(position)',
							nodeLink: '#link-eq-position'
						},
						{
							nodeName: 'get()',
							nodeLink: '#link-get-'
						},
						{
							nodeName: 'get(index)',
							nodeLink: '#link-get-index'
						},
						{
							nodeName: 'index(subject)',
							nodeLink: '#link-index-subject'
						},
						{
							nodeName: 'length',
							nodeLink: '#link-length-'
						},
						{
							nodeName: 'size()',
							nodeLink: '#link-size-'
						}
					]
				},
				{
					nodeName: 'Plugins',
					subNodes: [
						{
							nodeName: 'jQuery.extend(object)',
							nodeLink: '#link-jQueryextend-object'
						},
						{
							nodeName: 'jQuery.fn.extend(object)',
							nodeLink: '#link-jQueryfnextend-object'
						}
					]
				},
				{
					nodeName: 'interoperability',
					subNodes: [
						{
							nodeName: 'jQuery.noConflict()',
							nodeLink: '#link-jQuerynoConflict-'
						},
						{
							nodeName: 'jQuery.noConflict(extreme)',
							nodeLink: '#link-jQuerynoConflict-extreme'
						}
					]
				}
			]
		},
		{
			nodeName: 'Selectors',
			subNodes: [
				{
					nodeName: 'Basics',
					subNodes: [
						{
							nodeName: '*',
							nodeLink: '#link-all-'
						},
						{
							nodeName: '.class',
							nodeLink: '#link-class-class'
						},
						{
							nodeName: 'element',
							nodeLink: '#link-element-element'
						},
						{
							nodeName: '#id',
							nodeLink: '#link-id-id'
						},
						{
							nodeName: 'selector1, selector2, selectorN',
							nodeLink: '#link-multiple-selector1selector2selectorN'
						}
					]
				},
				{
					nodeName: 'Hierarchy',
					subNodes: [
						{
							nodeName: 'parent > child',
							nodeLink: '#link-child-parentchild'
						},
						{
							nodeName: 'ancestor descendant',
							nodeLink: '#link-descendant-ancestordescendant'
						},
						{
							nodeName: 'prev + next',
							nodeLink: '#link-next-prevnext'
						},
						{
							nodeName: 'prev ~ siblings',
							nodeLink: '#link-siblings-prevsiblings'
						}
					]
				},
				{
					nodeName: 'Basic Filters',
					subNodes: [
						{
							nodeName: ':animated',
							nodeLink: '#link-animated-'
						},
						{
							nodeName: ':eq',
							nodeLink: '#link-eq-index'
						},
						{
							nodeName: ':even',
							nodeLink: '#link-even-'
						},
						{
							nodeName: ':first',
							nodeLink: '#link-first-'
						},
						{
							nodeName: ':gt(index)',
							nodeLink: '#link-gt-index'
						},
						{
							nodeName: ':header',
							nodeLink: '#link-header-'
						},
						{
							nodeName: ':last',
							nodeLink: '#link-last-'
						},
						{
							nodeName: 'lt(index)',
							nodeLink: '#link-lt-index'
						},
						{
							nodeName: 'not(selector)',
							nodeLink: '#link-not-selector'
						},
						{
							nodeName: 'odd',
							nodeLink: '#link-odd-'
						}
					]
				}
			]
		},
		{
			nodeName: 'CSS',
			subNodes: [
				{
					nodeName: 'CSS',
					subNodes: [
						{
							nodeName: 'css(name)',
							nodeLink: '#link-css-name'
						},
						{
							nodeName: 'css(properties)',
							nodeLink: '#link-css-properties'
						},
						{
							nodeName: 'css(name, value)',
							nodeLink: '#link-css-namevalue'
						}
					]
				},
				{
					nodeName: 'Positioning',
					subNodes: [
						{
							nodeName: 'offset',
							nodeLink: '#link-offset-'
						}
					]
				},
				{
					nodeName: 'Height and Width',
					subNodes: [
						{
							nodeName: 'height()',
							nodeLink: '#link-height-'
						},
						{
							nodeName: 'height(val)',
							nodeLink: '#link-height-val'
						},
						{
							nodeName: 'width()',
							nodeLink: '#link-width-'
						},
						{
							nodeName: 'width(val)',
							nodeLink: '#link-width-val'
						}
					]
				}
			]
		}
	]
};