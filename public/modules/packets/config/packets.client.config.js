'use strict';

// Configuring the Articles module
angular.module('packets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'packets', 'packets', 'dropdown', '/packets(/create)?');
		Menus.addSubMenuItem('topbar', 'packets', 'List packets', 'packets');
		Menus.addSubMenuItem('topbar', 'packets', 'New Packet', 'packets/create');
	}
]);